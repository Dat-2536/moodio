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

# Load OpenCV face detectors
# Using alt2 (more robust than default) and profileface (for side views)
_CASCADE_DIR = cv2.data.haarcascades
face_cascade_frontal = cv2.CascadeClassifier(_CASCADE_DIR + 'haarcascade_frontalface_alt2.xml')
face_cascade_profile = cv2.CascadeClassifier(_CASCADE_DIR + 'haarcascade_profileface.xml')


def compute_iou(boxA, boxB):
    """
    Compute Intersection over Union (IoU) of two boxes [x, y, w, h].
    """
    xA = max(boxA[0], boxB[0])
    yA = max(boxA[1], boxB[1])
    xB = min(boxA[0] + boxA[2], boxB[0] + boxB[2])
    yB = min(boxA[1] + boxA[3], boxB[1] + boxB[3])

    interWidth = max(0, xB - xA)
    interHeight = max(0, yB - yA)
    interArea = interWidth * interHeight

    areaA = boxA[2] * boxA[3]
    areaB = boxB[2] * boxB[3]

    if areaA + areaB - interArea == 0:
        return 0
    
    return interArea / float(areaA + areaB - interArea)


def non_max_suppression(boxes, iou_threshold=0.35):
    """
    Simple NMS to remove overlapping duplicate boxes.
    Expects list of [x, y, w, h].
    Sorts by area descending to keep larger/more prominent boxes.
    """
    if not boxes:
        return []

    # Sort by area descending
    boxes = sorted(boxes, key=lambda b: b[2] * b[3], reverse=True)
    keep = []
    
    while boxes:
        current = boxes.pop(0)
        keep.append(current)
        boxes = [b for b in boxes if compute_iou(current, b) < iou_threshold]
    
    return keep


def detect_faces_cv2(pil_image, source="image"):
    """
    Enhanced detection using multiple cascades (frontal + profile) with NMS.
    """
    img_rgb = np.array(pil_image.convert('RGB'))
    img_w, img_h = pil_image.size
    img_gray = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2GRAY)
    
    # 1. Dynamic minSize
    min_dim = min(img_w, img_h)
    # Using slightly smaller minSize (3%) but higher minNeighbors (7) for better precision/recall
    min_s = max(30, int(min_dim * 0.03))

    # 2. Multi-Cascade Detection
    # Frontal (Alt2 is more accurate than default)
    # scaleFactor=1.05 gives finer search resolution to find missed faces
    frontal_faces = face_cascade_frontal.detectMultiScale(
        img_gray,
        scaleFactor=1.05,
        minNeighbors=7,
        minSize=(min_s, min_s)
    )
    
    # Profile (Side faces)
    profile_faces = face_cascade_profile.detectMultiScale(
        img_gray,
        scaleFactor=1.05,
        minNeighbors=7,
        minSize=(min_s, min_s)
    )

    # Combine detections
    raw_boxes = []
    for (x, y, w, h) in frontal_faces:
        raw_boxes.append([int(x), int(y), int(w), int(h)])
    for (x, y, w, h) in profile_faces:
        raw_boxes.append([int(x), int(y), int(w), int(h)])
    
    raw_count = len(raw_boxes)
    if raw_count == 0:
        return [], {"raw": 0, "after_filter": 0, "final": 0}

    # 3. Quality Filtering
    filtered_boxes = []
    img_area = img_w * img_h
    
    for b in raw_boxes:
        x, y, w, h = b
        
        # Aspect Ratio Check (faces are [0.6, 1.6])
        aspect_ratio = w / float(h)
        if aspect_ratio < 0.6 or aspect_ratio > 1.6:
            continue
            
        # Area Ratio Check (Reject very tiny noise)
        if (w * h) < (img_area * 0.001):
            continue

        # Boundary intersection check (at least 60% must be inside)
        x1, y1 = max(0, x), max(0, y)
        x2, y2 = min(img_w, x + w), min(img_h, y + h)
        inter_area = max(0, x2 - x1) * max(0, y2 - y1)
        if inter_area < (0.6 * w * h):
            continue
            
        filtered_boxes.append(b)

    filter_count = len(filtered_boxes)

    # 4. NMS (Merge overlaps from frontal vs profile detections)
    final_boxes = non_max_suppression(filtered_boxes, iou_threshold=0.3)
    final_count = len(final_boxes)

    debug_info = {
        "raw": raw_count,
        "after_filter": filter_count,
        "final": final_count
    }

    return final_boxes, debug_info


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

    if model is None:
        return {"success": False, "error": "Model not loaded", "faces": [], "latency_ms": 0}
    if face_cascade_frontal is None or face_cascade_frontal.empty():
        return {"success": False, "error": "Face detector not ready", "faces": [], "latency_ms": 0}

    faces_detected, debug_info = detect_faces_cv2(pil_image, source=source)
    print(f"[Moodio] request_id={request_id} source={source} detection={debug_info}")

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
        "source": source,
        "image_size": {"width": img_w, "height": img_h},
        "faces": face_results,
        "latency_ms": latency_ms,
        "debug": debug_info
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
