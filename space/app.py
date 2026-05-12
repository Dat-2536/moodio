"""
Moodio Emotion AI - Hugging Face Space Backend
Pipeline: Detect faces (OpenCV) -> Crop -> ResNet-18 Inference -> Response
"""
import time
import io
import json
import os
import uuid

import cv2
import numpy as np
from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image

from emotion_inference import load_model, predict

app = FastAPI(title="Moodio Emotion AI - Hugging Face Space")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Paths ─────────────────────────────────────────────────────────────────────
MODEL_PATH      = "model/best_model_final.pth"
LABELS_PATH     = "model/labels.json"
PREPROCESS_PATH = "model/preprocess.json"

# ── Global state ──────────────────────────────────────────────────────────────
model        = None
model_info   = {}
face_cascade = None


@app.on_event("startup")
async def startup_event():
    global model, model_info, face_cascade

    # Load Haar cascade for face detection
    cascade_path = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    face_cascade = cv2.CascadeClassifier(cascade_path)
    if face_cascade.empty():
        print("[Moodio] WARNING: Haar cascade failed to load!")
    else:
        print(f"[Moodio] Haar cascade loaded: {cascade_path}")

    # Load model metadata & weights
    try:
        with open(LABELS_PATH, "r") as f:
            labels_data = json.load(f)
        with open(PREPROCESS_PATH, "r") as f:
            preprocess_data = json.load(f)

        model_info = {
            "model_name": "Emotion Recognition ResNet18",
            "classes":    labels_data["classes"],
            "preprocess": preprocess_data,
            "runtime":    "huggingface-space-cpu",
        }

        model = load_model(MODEL_PATH)
        print("[Moodio] Model loaded successfully.")
    except Exception as e:
        print(f"[Moodio] Error loading model: {e}")


# ── Face detection & crop helpers ─────────────────────────────────────────────

def detect_faces(pil_image: Image.Image):
    """
    Detect all faces using OpenCV Haar cascade.
    Returns list of (x, y, w, h) in original image pixel coordinates.
    """
    img_rgb  = np.array(pil_image.convert("RGB"))
    img_gray = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2GRAY)
    faces    = face_cascade.detectMultiScale(
        img_gray,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(40, 40),
    )
    if len(faces) == 0:
        return []
    return [(int(x), int(y), int(w), int(h)) for (x, y, w, h) in faces]


def crop_face(pil_image: Image.Image, x, y, w, h, margin_ratio=0.15):
    """
    Crop a face region with a margin, clamped to image bounds.
    """
    img_w, img_h = pil_image.size
    mx = int(w * margin_ratio)
    my = int(h * margin_ratio)
    x1 = max(0, x - mx)
    y1 = max(0, y - my)
    x2 = min(img_w, x + w + mx)
    y2 = min(img_h, y + h + my)
    return pil_image.crop((x1, y1, x2, y2))


# ── Endpoints ─────────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {
        "name":       "Moodio Emotion AI Backend",
        "status":     "running",
        "docs":       "/docs",
        "health":     "/health",
        "model_info": "/model-info",
    }


@app.get("/health")
async def health():
    return {"status": "ok", "model_loaded": model is not None}


@app.get("/model-info")
async def get_model_info():
    return model_info


@app.post("/analyze-image")
@app.post("/analyze-image/")
@app.post("/api/analyze-image")
@app.post("/stream-frame")
async def analyze_image(request: Request, file: UploadFile = File(...)):
    request_id = request.headers.get("x-request-id", str(uuid.uuid4()))
    print(f"[analyze-image] start request_id={request_id}")

    if not model:
        raise HTTPException(status_code=503, detail="Model not loaded")
    if face_cascade is None or face_cascade.empty():
        raise HTTPException(status_code=503, detail="Face detector not ready")

    start_time = time.perf_counter()

    # Decode image
    try:
        contents  = await file.read()
        pil_image = Image.open(io.BytesIO(contents)).convert("RGB")
    except Exception as e:
        return {
            "success":    False,
            "request_id": request_id,
            "error":      f"Invalid image: {e}",
            "faces":      [],
            "latency_ms": 0,
        }

    img_w, img_h = pil_image.size

    # Detect all faces
    faces_detected = detect_faces(pil_image)

    # Run inference per face
    face_results = []
    for face_id, (x, y, w, h) in enumerate(faces_detected):
        face_crop = crop_face(pil_image, x, y, w, h)
        try:
            prediction = predict(model, face_crop)
            face_results.append({
                "face_id":      face_id,
                "emotion":      prediction["emotion"],
                # emotion_inference.py returns confidence 0–100; normalize to 0–1
                "confidence":   round(prediction["confidence"] / 100.0, 4),
                "all_probs":    {k: round(v / 100.0, 4)
                                 for k, v in prediction["all_probs"].items()},
                # bounding_box in ORIGINAL image pixel coordinates
                "bounding_box": {"x": x, "y": y, "width": w, "height": h},
                "bbox":         [x, y, w, h],
            })
        except Exception as e:
            print(f"[Moodio] Inference error face_id={face_id}: {e}")

    latency_ms = round((time.perf_counter() - start_time) * 1000, 2)
    print(f"[analyze-image] done request_id={request_id} faces={len(face_results)} latency_ms={latency_ms}")

    result = {
        "success":    True,
        "request_id": request_id,
        "source":     "huggingface-space",
        "image_size": {"width": img_w, "height": img_h},
        "faces":      face_results,
        "latency_ms": latency_ms,
    }

    if not face_results:
        result["message"] = "No face detected"

    return result


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7860)
