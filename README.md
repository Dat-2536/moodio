# Emotion Recognition System (AI-Driven)

Dự án nhận diện cảm xúc đa phương thức sử dụng Deep Learning (ResNet50), FastAPI và VueJS. Hệ thống hỗ trợ nhận diện qua Webcam thời gian thực và Upload ảnh, được thiết kế theo phong cách NVIDIA với chế độ Light/Dark Mode linh hoạt.

## ✨ Cải tiến mới (Premium UI/UX)

- **Giao diện NVIDIA High-Tech**: Sử dụng hiệu ứng Glassmorphism, Grid-background, và hiệu ứng quét (Scanner) hiện đại.
- **Micro-interactions**: Các nút bấm có hiệu ứng Glow và Shine, chuyển cảnh mượt mà giữa các tab.
- **Smart Navbar**: Tự động xử lý lỗi hiển thị khi thay đổi kích thước trình duyệt (Responsive Fix).
- **Trải nghiệm người dùng**: Bổ sung phần giới thiệu tính năng chi tiết và chỉ số trạng thái hệ thống (System Status).

## 🌟 Tính năng cốt lõi

- **Nhận diện cảm xúc thời gian thực**: Sử dụng mô hình ResNet50 tối ưu hóa cho tốc độ và độ chính xác.
- **Phân tích đa khuôn mặt**: Tự động phát hiện và gán nhãn cảm xúc cho nhiều người trong cùng một khung hình.
- **Dual Theme**: Hỗ trợ Light Mode (mặc định) và Dark Mode với hiệu ứng chuyển đổi mượt mà (0.4s).

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

## 🛠 Lộ trình phát triển & Nâng cao chất lượng (Future Improvements)

Để nâng cao chất lượng dự án hơn nữa, các nội dung sau có thể được thực hiện:

1.  **Tích hợp thực tế ResNet50**: Chuyển từ mock sang load weights thực tế của mô hình đã train trên bộ dữ liệu FER2013.
2.  **Websocket Support**: Thay vì gửi frame qua HTTP POST, sử dụng Websocket để giảm độ trễ tối đa cho luồng Webcam.
3.  **Lịch sử & Phân tích (Analytics)**: Lưu trữ lịch sử nhận diện vào Database (SQLite/PostgreSQL) và hiển thị biểu đồ xu hướng cảm xúc theo thời gian.
4.  **Xuất báo cáo (Export)**: Cho phép người dùng xuất kết quả nhận diện dưới dạng PDF hoặc Excel để nghiên cứu.
5.  **Multi-language**: Hỗ trợ đa ngôn ngữ (Tiếng Anh, Tiếng Việt, Tiếng Nhật) để mở rộng đối tượng người dùng.
6.  **PWA Support**: Biến ứng dụng thành Progressive Web App để có thể cài đặt và sử dụng trên điện thoại như một app native.

---
*Ghi chú: Đảm bảo bạn đã cài đặt driver webcam và các thư viện cần thiết cho AI trước khi khởi chạy.*
