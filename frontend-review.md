---
name: frontend-review
description: Kiểm tra tính nhất quán - NVIDIA Design System - Light/Dark Mode - Performance
---

# When to use
Sử dụng khi cần review các component hoặc tính năng. Đặc biệt lưu ý khi có thay đổi về UI/UX hoặc hệ thống màu sắc (Theme).

# Required input
- Tên component/màn hình vừa thực hiện.
- Mô tả ngắn gọn thay đổi.
- File code liên quan (Vue, CSS, hoặc API service).

# Procedure
1. **Đối chiếu PRD**: Kiểm tra xem tính năng có đáp ứng đúng mục 4, 5 và 6 trong `PRD.md` không.
2. **Review Hệ thống Theme**:
   - **Mặc định**: Trang web phải load ở chế độ Light Mode khi truy cập lần đầu.
   - **Toggle**: Nút chuyển đổi Theme có nằm ở vị trí dễ thấy (Navbar) không? Icon (Sun/Moon) có thay đổi tương ứng không?
   - **Hiệu ứng**: Khi chuyển đổi, màu nền và màu chữ có sử dụng `transition` (0.3s - 0.5s) không? Tuyệt đối không để xảy ra hiện tượng đổi màu đột ngột (flicker).
3. **Review Thiết kế (NVIDIA Style)**:
   - Màu sắc: Kiểm tra bảng màu Light/Dark theo đúng mã hex trong PRD.
   - Tương phản: Đảm bảo Text Primary và Secondary dễ đọc trên cả hai nền.
4. **Kiểm tra Responsive**:
   - Desktop (1280px+): Layout Dashboard và Webcam overlay.
   - Mobile (375px): Menu navigation và Theme Toggle trên mobile.
5. **Kiểm tra Hiệu năng & Logic**:
   - Webcam: Độ trễ hiển thị bounding box (mục tiêu < 0.5s).
   - Multi-face: Bounding box có hiển thị đúng vị trí cho nhiều người không?

# Output format
## Summary (Review trạng thái hiện tại)
## Issues
- **Critical**: Lỗi logic nhận diện, lỗi kết nối API, nút Toggle Theme không hoạt động.
- **Major**: Màu sắc sai lệch Color Set trong PRD, không có hiệu ứng transition khi đổi theme, vỡ layout mobile.
- **Minor**: Icon theme không thay đổi, sai font chữ, lỗi chính tả.
## Suggested fixes (Diff code hoặc hướng dẫn sửa)
## Remaining risks

# Stop conditions
- Không "Pass" nếu hiệu ứng chuyển đổi Theme bị gấp gáp (thiếu transition).
- Không "Pass" nếu màu sắc ở chế độ Light Mode không đạt tiêu chuẩn về độ tương phản.

# Do not