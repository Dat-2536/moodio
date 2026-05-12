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
face_cascade_frontal = None
face_cascade_profile = None


@app.on_event("startup")
async def startup_event():
    global model, model_info, face_cascade_frontal, face_cascade_profile

    # Load face cascades (Frontal Alt2 + Profile)
    _CASCADE_DIR = cv2.data.haarcascades
    face_cascade_frontal = cv2.CascadeClassifier(_CASCADE_DIR + "haarcascade_frontalface_alt2.xml")
    face_cascade_profile = cv2.CascadeClassifier(_CASCADE_DIR + "haarcascade_profileface.xml")
    
    if face_cascade_frontal.empty():
        print("[Moodio] WARNING: Frontal cascade failed to load!")
    else:
        print(f"[Moodio] Cascades loaded from {_CASCADE_DIR}")

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
    Sorts by area descending.
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


def detect_faces(pil_image: Image.Image, source="image"):
    """
    Enhanced detection using multiple cascades (frontal + profile) with NMS.
    """
    img_rgb  = np.array(pil_image.convert("RGB"))
    img_w, img_h = pil_image.size
    img_gray = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2GRAY)
    
    # 1. Dynamic minSize (3% of smaller dimension)
    min_dim = min(img_w, img_h)
    min_s = max(30, int(min_dim * 0.03))

    # 2. Multi-Cascade Detection (scaleFactor 1.05 for better accuracy)
    frontal_faces = face_cascade_frontal.detectMultiScale(
        img_gray,
        scaleFactor=1.05,
        minNeighbors=7,
        minSize=(min_s, min_s),
    )
    
    profile_faces = face_cascade_profile.detectMultiScale(
        img_gray,
        scaleFactor=1.05,
        minNeighbors=7,
        minSize=(min_s, min_s),
    )

    raw_boxes = []
    for (x, y, w, h) in frontal_faces:
        raw_boxes.append([int(x), int(y), int(w), int(h)])
    for (x, y, w, h) in profile_faces:
        raw_boxes.append([int(x), int(y), int(w), int(h)])
    
    raw_count = len(raw_boxes)
    if raw_count == 0:
        return [], {"raw": 0, "final": 0}

    # 3. Filtering
    filtered_boxes = []
    img_area = img_w * img_h
    for b in raw_boxes:
        x, y, w, h = b
        
        # Aspect Ratio (faces are 0.6 - 1.6)
        aspect_ratio = w / float(h)
        if aspect_ratio < 0.6 or aspect_ratio > 1.6:
            continue
            
        # Area Ratio (0.1% min)
        if (w * h) < (img_area * 0.001):
            continue
            
        # Intersection (60% inside)
        x1, y1 = max(0, x), max(0, y)
        x2, y2 = min(img_w, x + w), min(img_h, y + h)
        if (max(0, x2 - x1) * max(0, y2 - y1)) < (0.6 * w * h):
            continue

        filtered_boxes.append(b)

    # 4. NMS
    final_boxes = non_max_suppression(filtered_boxes, iou_threshold=0.3)
    
    debug_info = {
        "raw": raw_count,
        "after_filter": len(filtered_boxes),
        "final": len(final_boxes)
    }

    return final_boxes, debug_info


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
    if face_cascade_frontal is None or face_cascade_frontal.empty():
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

    # Detect all faces with improved filtering
    source_context = request.query_params.get("source", "image")
    faces_detected, debug_info = detect_faces(pil_image, source=source_context)
    print(f"[Moodio] request_id={request_id} source={source_context} detection={debug_info}")

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
        "debug":      debug_info,
    }

    if not face_results:
        result["message"] = "No face detected"

    return result


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7860)
