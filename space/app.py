import time
import io
import json
import os
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import torch
import numpy as np

# Import existing inference logic
from inference import load_model, predict

app = FastAPI(title="Emotion AI Backend - Hugging Face Space")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For demo purposes, allows all origins. In production, restrict to Vercel domain.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Constants
MODEL_PATH = "model/best_model_final.pth"
LABELS_PATH = "model/labels.json"
PREPROCESS_PATH = "model/preprocess.json"

# Global state for model
model = None
model_info = {}

@app.on_event("startup")
async def startup_event():
    global model, model_info
    try:
        # Load metadata
        with open(LABELS_PATH, "r") as f:
            labels_data = json.load(f)
        with open(PREPROCESS_PATH, "r") as f:
            preprocess_data = json.load(f)
        
        model_info = {
            "model_name": "Emotion Recognition ResNet18",
            "classes": labels_data["classes"],
            "preprocess": preprocess_data,
            "runtime": "huggingface-space-cpu"
        }
        
        # Load model
        model = load_model(MODEL_PATH)
        print("Model loaded successfully.")
    except Exception as e:
        print(f"Error loading model: {e}")

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.get("/model-info")
async def get_model_info():
    return model_info

@app.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...)):
    start_time = time.perf_counter()
    
    if not model:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        # Read image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Perform prediction (using existing logic)
        # Note: Current inference assumes one face per image or predicts the entire frame.
        prediction = predict(model, image)
        
        latency_ms = (time.perf_counter() - start_time) * 1000
        
        # Format response as requested
        # Since we don't have a face detector in the base inference, 
        # we return the result as a single face covering the main area.
        return {
            "faces": [
                {
                    "face_id": 0,
                    "emotion": prediction['emotion'],
                    "confidence": prediction['confidence'] / 100.0, # Normalize to 0-1
                    "bounding_box": {
                        "x": 0,
                        "y": 0,
                        "width": image.width,
                        "height": image.height
                    },
                    "all_probs": prediction['all_probs']
                }
            ],
            "latency_ms": round(latency_ms, 2),
            "source": "huggingface-space"
        }
    except Exception as e:
        print(f"Prediction error: {e}")
        return {"faces": [], "error": str(e), "latency_ms": 0}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7860)
