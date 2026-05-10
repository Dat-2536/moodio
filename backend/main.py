import uvicorn
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import io
import os
import sys
from PIL import Image

# Thêm đường dẫn tới thư mục ai để import inference
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from ai.inference import load_model, predict

app = FastAPI(title="Moodio AI - Emotion Recognition")

# Cấu hình CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model khi khởi động
MODEL_PATH = os.path.join(os.path.dirname(__file__), '../ai/best_model_final.pth')
model = load_model(MODEL_PATH)

@app.get("/")
async def root():
    return {"message": "Moodio AI API is running"}

@app.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...)):
    """
    Phân tích cảm xúc từ ảnh upload lên sử dụng mô hình ResNet-18 thực tế.
    """
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))
    
    # Thực hiện dự đoán
    prediction = predict(model, image)
    
    # Ở phiên bản này, chúng ta giả định ảnh upload là một khuôn mặt tập trung
    # Trong tương lai có thể thêm Face Detection (MTCNN) ở đây
    return {
        "status": "success",
        "faces": [
            {
                "face_id": 0,
                "emotion": prediction['emotion'],
                "confidence": prediction['confidence'],
                "all_probs": prediction['all_probs'],
                "bounding_box": {
                    "top": 10, "left": 10, "width": 80, "height": 80
                }
            }
        ]
    }

@app.post("/stream-frame")
async def stream_frame(file: UploadFile = File(...)):
    """
    Xử lý frame từ Webcam thời gian thực.
    """
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))
    
    # Thực hiện dự đoán
    prediction = predict(model, image)
    
    return {
        "status": "success",
        "faces": [
            {
                "face_id": 0,
                "emotion": prediction['emotion'],
                "confidence": prediction['confidence'],
                "all_probs": prediction['all_probs'],
                "bounding_box": {
                    "top": 20, "left": 30, "width": 40, "height": 50
                }
            }
        ]
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
