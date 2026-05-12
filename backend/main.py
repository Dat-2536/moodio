import uvicorn
from fastapi import FastAPI, UploadFile, File, Query
from fastapi.middleware.cors import CORSMiddleware
import io
import os
import sys
import time
import uuid
import numpy as np
from PIL import Image

# Add project root to path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.append(BASE_DIR)

from ai.inference import load_model, predict
from ai.stats_service import safe_save_detection_log, get_stats

app = FastAPI(title="Moodio AI - Emotion Recognition")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model once at startup
MODEL_PATH = os.path.join(BASE_DIR, 'ai/best_model_final.pth')
model = load_model(MODEL_PATH)

# Load OpenCV face detector (Haar cascade — ships with opencv-python, no extra download)
import cv2
_CASCADE_PATH = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
face_cascade = cv2.CascadeClassifier(_CASCADE_PATH)


def detect_faces_cv2(pil_image):
    """
    Detect all faces in a PIL Image using OpenCV Haar cascade.
    Returns list of (x, y, w, h) in original image coordinates.
    """
    img_rgb = np.array(pil_image.convert('RGB'))
    img_gray = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2GRAY)
    # scaleFactor=1.1, minNeighbors=5 gives reasonable precision/recall balance
    faces = face_cascade.detectMultiScale(
        img_gray,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(40, 40)
    )
    if len(faces) == 0:
        return []
    return [(int(x), int(y), int(w), int(h)) for (x, y, w, h) in faces]


def crop_face(pil_image, x, y, w, h, margin_ratio=0.15):
    """
    Crop a face region from a PIL Image with an optional margin.
    Clamps coordinates to image bounds.
    """
    img_w, img_h = pil_image.size
    margin_x = int(w * margin_ratio)
    margin_y = int(h * margin_ratio)

    x1 = max(0, x - margin_x)
    y1 = max(0, y - margin_y)
    x2 = min(img_w, x + w + margin_x)
    y2 = min(img_h, y + h + margin_y)

    return pil_image.crop((x1, y1, x2, y2))


def analyze_image_internal(pil_image, source: str, start_time: float):
    """
    Shared logic for /analyze-image and /stream-frame:
    detect all faces → crop → infer → build response.
    """
    img_w, img_h = pil_image.size
    request_id = str(uuid.uuid4())

    faces_detected = detect_faces_cv2(pil_image)

    face_results = []
    for face_id, (x, y, w, h) in enumerate(faces_detected):
        face_crop = crop_face(pil_image, x, y, w, h)
        try:
            prediction = predict(model, face_crop)
            face_results.append({
                "face_id": face_id,
                "emotion": prediction['emotion'],
                # Normalize confidence to 0-1 (predict() returns 0-100)
                "confidence": round(prediction['confidence'] / 100.0, 4),
                "all_probs": {k: round(v / 100.0, 4) for k, v in prediction['all_probs'].items()},
                "bounding_box": {"x": x, "y": y, "width": w, "height": h},
                "bbox": [x, y, w, h]
            })
        except Exception as e:
            # Skip this face if inference fails, log and continue
            print(f"[Moodio] Inference error for face_id={face_id}: {e}")

    latency_ms = round((time.perf_counter() - start_time) * 1000, 2)

    result = {
        "success": True,
        "request_id": request_id,
        "source": "local-backend",
        "image_size": {"width": img_w, "height": img_h},
        "faces": face_results,
        "latency_ms": latency_ms,
    }

    if not face_results:
        result["message"] = "No face detected"

    return result


@app.get("/")
async def root():
    return {"message": "Moodio AI API is running"}


@app.get("/stats/dashboard")
async def stats_dashboard(range: str = Query("week", enum=["week", "month"])):
    return get_stats(range)


@app.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...)):
    """
    Analyze emotion from uploaded image.
    Detects ALL faces, crops each, runs ResNet-18 inference per face.
    """
    start_time = time.perf_counter()
    try:
        contents = await file.read()
        pil_image = Image.open(io.BytesIO(contents)).convert('RGB')
    except Exception as e:
        return {"success": False, "error": f"Invalid image: {e}", "faces": [], "latency_ms": 0}

    try:
        result = analyze_image_internal(pil_image, source='image', start_time=start_time)

        if result['faces']:
            safe_save_detection_log(
                source='image',
                result=result,
                latency_ms=result['latency_ms']
            )

        return result
    except Exception as e:
        return {"success": False, "error": str(e), "faces": [], "latency_ms": 0}


@app.post("/stream-frame")
async def stream_frame(file: UploadFile = File(...)):
    """
    Process webcam frame for real-time emotion recognition.
    Same pipeline as /analyze-image.
    """
    start_time = time.perf_counter()
    try:
        contents = await file.read()
        pil_image = Image.open(io.BytesIO(contents)).convert('RGB')
    except Exception as e:
        return {"success": False, "error": f"Invalid frame: {e}", "faces": [], "latency_ms": 0}

    try:
        result = analyze_image_internal(pil_image, source='webcam', start_time=start_time)
        result['source'] = 'local-backend-webcam'

        if result['faces']:
            safe_save_detection_log(
                source='webcam',
                result=result,
                latency_ms=result['latency_ms']
            )

        return result
    except Exception as e:
        return {"success": False, "error": str(e), "faces": [], "latency_ms": 0}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
