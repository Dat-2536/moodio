---
title: EmotionAI Backend
emoji: 😃
colorFrom: green
colorTo: blue
sdk: docker
app_port: 7860
pinned: false
---

# Emotion AI Backend - Hugging Face Space

Dịch vụ Backend cung cấp API nhận diện cảm xúc khuôn mặt sử dụng mô hình ResNet18 (PyTorch).

## 🚀 Endpoints

### 1. Kiểm tra trạng thái
- **GET** `/health`
- Trả về: `{"status": "ok"}`

### 2. Thông tin mô hình
- **GET** `/model-info`
- Trả về danh sách nhãn cảm xúc và cấu hình tiền xử lý.

### 3. Phân tích ảnh
- **POST** `/analyze-image`
- **Body**: `multipart/form-data` (field `file`)
- Trả về: Kết quả nhận diện, xác suất các cảm xúc và độ trễ.

## 🛠 Chạy local (Docker)

```bash
docker build -t emotion-ai-backend .
docker run -p 7860:7860 emotion-ai-backend
```

## 🌐 Triển khai lên Hugging Face Space

1. Tạo một Space mới với SDK là **Docker**.
2. Upload tất cả file trong thư mục `ai/` lên Space.
3. Hugging Face sẽ tự động build và chạy container.
4. API của bạn sẽ có dạng: `https://<user>-<space-name>.hf.space`

---
*Lưu ý: API này được tối ưu cho CPU để chạy trên gói Free của Hugging Face.*
