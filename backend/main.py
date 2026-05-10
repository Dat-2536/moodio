import uvicorn
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np
import io
from PIL import Image
import random

app = FastAPI(title="Emotion Recognition AI")

# Cho phép CORS cho frontend VueJS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

EMOTIONS = ["Happy", "Sad", "Angry", "Surprised", "Neutral", "Disgusted", "Fearful"]

@app.get("/")
async def root():
    return {"message": "Emotion Recognition API is running"}

@app.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...)):
    """
    Phân tích cảm xúc từ ảnh upload lên.
    """
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))
    
    # Mock kết quả nhận diện (Giả lập ResNet50 xử lý)
    # Trong thực tế, bạn sẽ đưa image qua model.forward() ở đây
    num_faces = random.randint(1, 3)
    results = []
    
    for i in range(num_faces):
        results.append({
            "face_id": i,
            "emotion": random.choice(EMOTIONS),
            "confidence": round(random.uniform(0.7, 0.99), 2),
            "bounding_box": {
                "top": random.randint(50, 100),
                "left": random.randint(50, 100),
                "width": random.randint(100, 200),
                "height": random.randint(100, 200)
            }
        })
    
    return {
        "status": "success",
        "faces": results
    }

@app.post("/stream-frame")
async def stream_frame(file: UploadFile = File(...)):
    """
    Xử lý frame từ Webcam thời gian thực, hỗ trợ nhiều khuôn mặt.
    """
    contents = await file.read()
    # Trong thực tế: convert bytes sang opencv mat, chạy model detection & recognition
    
    # Mock đa khuôn mặt để demo frontend
    num_faces = random.randint(1, 2)
    faces = []
    
    for i in range(num_faces):
        faces.append({
            "face_id": i,
            "emotion": random.choice(EMOTIONS),
            "confidence": round(random.uniform(0.75, 0.98), 2),
            "bounding_box": {
                "top": random.randint(20, 40) + (i * 10),
                "left": random.randint(20, 40) + (i * 30),
                "width": 30, # % của frame
                "height": 40 # % của frame
            }
        })
    
    return {
        "status": "success",
        "faces": faces
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
