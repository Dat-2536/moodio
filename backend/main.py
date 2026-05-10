import uvicorn
from fastapi import FastAPI, UploadFile, File, Query
from fastapi.middleware.cors import CORSMiddleware
import io
import os
import sys
import time
from PIL import Image

# Thêm đường dẫn tới thư mục gốc để import ai
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.append(BASE_DIR)

from ai.inference import load_model, predict
from ai.stats_service import safe_save_detection_log, get_stats

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
MODEL_PATH = os.path.join(BASE_DIR, 'ai/best_model_final.pth')
model = load_model(MODEL_PATH)

@app.get("/")
async def root():
    return {"message": "Moodio AI API is running"}

@app.get("/stats/dashboard")
async def stats_dashboard(range: str = Query("week", enum=["week", "month"])):
    """
    Trả về thống kê thực tế cho dashboard.
    """
    return get_stats(range)

@app.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...)):
    """
    Phân tích cảm xúc từ ảnh upload lên sử dụng mô hình ResNet-18 thực tế.
    """
    start_time = time.perf_counter()
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Thực hiện dự đoán
        prediction = predict(model, image)
        
        latency_ms = (time.perf_counter() - start_time) * 1000
        
        result = {
            "status": "success",
            "latency_ms": latency_ms,
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
        
        # Log detection
        safe_save_detection_log(
            source='image',
            result=result,
            latency_ms=latency_ms
        )
        
        return result
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/stream-frame")
async def stream_frame(file: UploadFile = File(...)):
    """
    Xử lý frame từ Webcam thời gian thực.
    """
    start_time = time.perf_counter()
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Thực hiện dự đoán
        prediction = predict(model, image)
        
        latency_ms = (time.perf_counter() - start_time) * 1000
        
        result = {
            "status": "success",
            "latency_ms": latency_ms,
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
        
        # Log detection (throttled in stats_service)
        safe_save_detection_log(
            source='webcam',
            result=result,
            latency_ms=latency_ms
        )
        
        return result
    except Exception as e:
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    # Sử dụng "main:app" để hỗ trợ tính năng reload khi code thay đổi
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
