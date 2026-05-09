# PRD: Emotion Recognition System (AI-Driven)

## 1. Mục đích dự án
- Phát triển ứng dụng nhận diện cảm xúc (Emotion Recognition) đa phương thức (Webcam & Upload).
- Sử dụng công nghệ AI tiên tiến (ResNet50) để cung cấp phản hồi thời gian thực.
- Sản phẩm phục vụ Assignment môn Trí tuệ nhân tạo (AI), yêu cầu cao về tính thẩm mỹ và hiệu năng.

## 2. Công nghệ sử dụng (Tech Stack)
- **Frontend**: VueJS (Vite), CSS/SCSS (Modern/Dynamic), Lucid Icons.
- **Backend**: FastAPI (Python), OpenCV.
- **AI Model**: Deep Learning với kiến trúc ResNet50.
- **Deployment**: Localhost / Docker.

## 3. Người dùng mục tiêu
- **Sinh viên/Giảng viên**: Nghiên cứu và đánh giá độ chính xác của mô hình.
- **Chuyên gia tâm lý**: Phân tích biểu cảm khách hàng/bệnh nhân qua ảnh/video.

## 4. Tính năng cốt lõi
1. **AI Engine**: Nhận diện đa cảm xúc (Vui, Buồn, Giận dữ, Ngạc nhiên, Trung lập, ...) với độ chính xác cao.
2. **Real-time Webcam**: Live stream từ webcam với overlay (bounding box) và label cảm xúc hiển thị tức thời.
3. **Image Analysis**: Cho phép upload các định dạng ảnh phổ biến (.jpg, .png) để phân tích.
4. **Multi-face Detection**: Có khả năng nhận diện đồng thời nhiều khuôn mặt trong cùng một khung hình.
5. **Interactive UI**: Giao diện mang phong cách Futuristic, background động, hiệu ứng chuyển trang mượt mà.
6. **Theme Toggle**: Hỗ trợ Light Mode và Dark Mode với hiệu ứng chuyển đổi (transition) mượt mà.

## 5. Cấu trúc màn hình (Sitemap)
1. **Home**: Giới thiệu dự án, công nghệ sử dụng và hướng dẫn nhanh.
2. **Live Feed (Webcam)**: Màn hình chính sử dụng webcam, hiển thị biểu đồ xác suất cảm xúc bên cạnh luồng video.
3. **Analysis (Upload)**: Khu vực kéo thả ảnh, hiển thị kết quả chi tiết sau khi phân tích.
4. **Dashboard (Statistics)**: Tổng hợp dữ liệu (Số lượt detect, tỷ lệ cảm xúc phổ biến, lịch sử gần đây).

## 6. Yêu cầu thiết kế (Design System)
- **Concept**: NVIDIA style (Futuristic, Data-centric).
- **Chế độ hiển thị**: Mặc định là **Light Mode**.
- **Color Sets**:
  - **Light Mode**:
    - Primary (Brand): `#76B900`
    - Background: `#F8F9FA`
    - Surface: `#FFFFFF`
    - Text Primary: `#1A1A1A`
    - Text Secondary: `#4A4A4A`
  - **Dark Mode**:
    - Primary (Brand): `#76B900`
    - Background: `#000000`
    - Surface: `#1A1A1A`
    - Text Primary: `#FFFFFF`
    - Text Secondary: `#B3B3B3`
- **Typography**: Font không chân (Inter hoặc Roboto), hiện đại, dễ đọc.
- **Interactions**: Nút chuyển đổi Theme dễ tìm (thường ở Header/Navbar). Khi chuyển đổi phải có transition (0.3s - 0.5s) cho toàn bộ màu sắc nền và chữ.

## 7. Tiêu chí thành công (KPIs)
- **Connectivity**: Frontend, Backend và AI Model giao tiếp mượt mà qua API.
- **Accuracy**: Độ chính xác của mô hình đạt trên 90% trên tập test.
- **Performance**: 
  - Latency Webcam: < 0.5s (end-to-end).
  - Latency Upload: < 1.0s.
- **UX/UI**: Đạt điểm cao về thẩm mỹ, không lỗi layout khi co giãn màn hình hoặc chuyển đổi Theme.