# Emotion Recognition System (AI-Driven)

Dự án nhận diện cảm xúc đa phương thức sử dụng Deep Learning (ResNet50), FastAPI và VueJS. Hệ thống hỗ trợ nhận diện qua Webcam thời gian thực và Upload ảnh, được thiết kế theo phong cách NVIDIA với chế độ Light/Dark Mode linh hoạt.

## 🌟 Tính năng nổi bật

- **Nhận diện cảm xúc thời gian thực**: Sử dụng mô hình ResNet50 tối ưu hóa cho tốc độ và độ chính xác.
- **Phân tích đa khuôn mặt**: Tự động phát hiện và gán nhãn cảm xúc cho nhiều người trong cùng một khung hình.
- **Giao diện NVIDIA Style**: Thiết kế hiện đại, futuristic với hiệu ứng chuyển động mượt mà.
- **Dual Theme**: Hỗ trợ Light Mode (mặc định) và Dark Mode với nút chuyển đổi trực quan.
- **Thống kê chi tiết**: Dashboard theo dõi dữ liệu nhận diện và lịch sử phân tích.

## 🛠 Công nghệ sử dụng

- **Frontend**: VueJS 3, Vite, TailwindCSS (hoặc Custom SCSS), Lucid Icons.
- **Backend**: FastAPI (Python 3.9+), OpenCV, PyTorch/TensorFlow (ResNet50).
- **AI**: ResNet50 Architecture trained on FER2013 or similar datasets.

## 🚀 Hướng dẫn cài đặt

### 1. Cài đặt Backend
```bash
cd backend
py -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
py main.py
```

### 2. Cài đặt Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📂 Cấu trúc thư mục

- `backend/`: Chứa mã nguồn API, xử lý hình ảnh và mô hình AI.
- `frontend/`: Chứa mã nguồn giao diện người dùng (VueJS).
- `PRD.md`: Tài liệu yêu cầu sản phẩm chi tiết.
- `frontend-review.md`: Quy trình kiểm tra chất lượng giao diện.

---
*Ghi chú: Đảm bảo bạn đã cài đặt driver webcam và các thư viện cần thiết cho AI trước khi khởi chạy.*
