# Hướng dẫn triển khai Emotion AI (Free Tier)

Tài liệu này hướng dẫn cách triển khai hệ thống Emotion AI lên các nền tảng miễn phí: **Vercel** (Frontend) và **Hugging Face Space** (AI Backend).

## 🏗 Kiến trúc hệ thống
- **Frontend**: Vue 3 + Vite, host trên Vercel.
- **AI Backend**: FastAPI + PyTorch (ResNet-18), chạy trên Hugging Face Space (Docker CPU).
- **Thống kê (Stats)**: Lưu trữ tại `localStorage` của trình duyệt (không cần database server).

---

## 1. Triển khai AI Backend (Hugging Face Space)

1. Truy cập [huggingface.co/spaces](https://huggingface.co/spaces) và tạo Space mới.
2. Thiết lập:
   - **Space SDK**: Docker
   - **Docker template**: Blank
   - **Public/Private**: Public (để Frontend gọi được API)
3. Upload toàn bộ nội dung trong thư mục `/ai` lên Space.
4. Chờ Hugging Face build Docker image. Sau khi xong, bạn sẽ thấy trạng thái "Running".
5. Copy URL của Space (ví dụ: `https://user-emotionai-backend.hf.space`).

---

## 2. Triển khai Frontend (Vercel)

1. Đẩy mã nguồn lên GitHub.
2. Truy cập [vercel.com](https://vercel.com) và import repository.
3. Thiết lập Project:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
   - **Environment Variables**:
     - `VITE_API_BASE_URL`: Dán URL từ Hugging Face Space ở bước trên.
4. Nhấn **Deploy**.

---

## 3. Cấu hình Quan trọng

### Fix lỗi 404 khi Refresh (Vercel)
File `frontend/vercel.json` đã được cấu hình để chuyển hướng tất cả request về `index.html`, giúp Vue Router hoạt động mượt mà.

### Tối ưu hóa Webcam cho Free Tier
- Mặc định, webcam sẽ gửi yêu cầu phân tích mỗi **2 giây** để tránh làm quá tải CPU miễn phí của Hugging Face.
- Hệ thống có cơ chế chặn yêu cầu chồng chéo (`isProcessingFrame`).

### Thống kê (Stats Dashboard)
- Dữ liệu thống kê hiện được lưu cục bộ trong trình duyệt. Nếu bạn xoá cache trình duyệt, dữ liệu thống kê sẽ biến mất.
- Điều này giúp ứng dụng hoạt động hoàn toàn miễn phí mà không cần máy chủ database.

---

## 🧪 Kiểm tra sau khi triển khai

1. Kiểm tra Health: `https://your-space.hf.space/health` -> Phải trả về `{"status": "ok"}`.
2. Kiểm tra Model Info: `https://your-space.hf.space/model-info` -> Phải trả về thông tin nhãn cảm xúc.
3. Truy cập trang web trên Vercel, thử upload một tấm ảnh và kiểm tra kết quả.
