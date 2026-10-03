# Luma v1 — Kết quả kiểm chứng

Ngày: 2026-10-03. Môi trường: Windows, Node.js 24.20.0, Chrome phiên đang mở của người dùng.

## Passed

- Regression check after the popup-dialog layering fix: `npm run check` passed with 43/43 tests; new DOM coverage verifies YouTube's fixed popup container stacks above the ambient `ytd-app` layer. This verifies the CSS contract, not a live subscription action.
- Baseline trước lượt UI/FPS mới: `npm run check` qua, 42/42 tests, build MV3 và package checks qua.
- Settings normalize, ghi nhiều tab không mất tùy chọn, race khi đọc storage lần đầu, preset không ghi đè toggle tab khác.
- Letterbox/pillarbox/all-black, hysteresis, smoothing, highlight cap, video chưa sẵn sàng và SecurityError.
- Scheduler tối đa 30 FPS bằng timer độc lập tần số màn hình; các mode thủ công đặt 12/24/30 FPS. Auto khởi đầu Balanced, governor điều chỉnh độ chi tiết lấy mẫu theo thời gian xử lý.
- Một canvas, dọn tài nguyên, không redraw frame tĩnh khi setting không đổi.
- DOM: SPA watch→home→watch, đổi video, pending callback cancel, reparent fullscreen/exit, bỏ mutation không liên quan.
- Back-forward cache: pagehide cleanup và pageshow persisted khởi tạo lại, không listener trùng.
- UI: chọn preset, custom intensity, reset, trạng thái lỗi; popover Escape trả focus, có thể tắt hai nút Luma trong thanh công cụ player.
- Tính contrast theo compositing cho chữ chính/phụ và border trên trắng, đen, đỏ, xanh dương, xanh lá: AA.
- Chrome preview thật trên localhost: sampler đọc video tổng hợp, ánh sáng phản ứng theo màu, Simple/Pro, floating panel, pause/resume, SPA với canvas count 0 khi rời và 1 khi trở lại.
- UI theo yêu cầu mới: Simple chỉ hiện blur và bật/tắt; preset/cường độ và các tùy chọn khác trong Nâng cao. Palette video dùng chung cho nền, nội dung, panel và nút player; không làm mờ chữ/video.
- Regression RED→GREEN: màu đổi rất chậm vẫn được vẽ; seek/đổi màu lúc pause cập nhật ngay; nguồn mới trên cùng video phục hồi sau SecurityError; edge toggle độc lập không mất; bảng nổi tính chiều cao từ tọa độ top thật.
- Chrome preview trước lượt sửa này: slider 64→66px bằng phím; đổi cảnh làm palette đổi; mở Nâng cao trong bảng điều khiển cuộn được và không vượt viewport mặc định. Escape đóng và trả focus.
- Compatibility: dữ liệu edges kiểu cũ và từng edge kiểu mới được hợp nhất, kể cả nhiều event trong lúc read đang chờ.
- Lượt sửa hiện tại: `npm run typecheck`, `npm run build` và package checks qua; Vitest chưa chạy lại. Popup gửi preview sang tab YouTube ngay khi tương tác; thao tác lưu được debounce. Giảm alpha nền surfaces xuống 0.5, giảm tông tím, hạ blur glass và ambient. Thêm lớp hover trung tính cho phần mô tả video. Bộ hẹn giờ lấy mẫu không phụ thuộc refresh màn hình. Popup dùng giới hạn chiều cao ổn định 600px để tránh vòng lặp đo viewport ban đầu của Chrome làm popup co còn vài chục pixel; nội dung nâng cao vẫn cuộn trong panel. Header playlist đồng bộ ở wrapper `.header`; transcript đồng bộ nền nội dung và header trong `engagement-panel-searchable-transcript`; hàng video đang phát bỏ nền tím YouTube và dùng mặt ambient kèm viền nhấn màu video. Khối thông tin dưới video giữ màu ambient nhưng bỏ đệm và bo góc riêng để nối liền với player; ô mô tả bên trong giữ nguyên. Đây là sửa theo CSS selector/DOM, chưa xác nhận bằng screenshot của bản đóng gói mới.

## Blocked

- Trang `chrome://extensions/` bị công cụ browser từ chối do URL policy chỉ cho HTTP/HTTPS. Không dùng cách vòng qua hạn chế. Người dùng phải tự Load unpacked.
- Kích hoạt fullscreen trong preview bị Chrome từ chối với `TypeError: not granted`. Vòng đời fullscreen qua DOM test đã pass; hình ảnh fullscreen thật chưa xác nhận.

## Not run

- Visual recheck of the latest build in Chrome's actual extension popup and YouTube player popover; the user needs to reload the unpacked extension to see this revision.
- Cài bản unpacked và chạy content script trên YouTube thật; normal/theater/fullscreen, playlist/seek, hover mô tả và popup công cụ YouTube.
- Benchmark GPU/CPU/throttling nhiều máy; FPS hiển thị là mục tiêu, không phải số đo thực tế.
- Kiểm thử xung đột với extension khác; không tự cài phần mềm bên thứ ba.
- Render đầy đủ trên các theme YouTube sáng/tối sau cập nhật DOM của YouTube.
- Viewport 320×720 có test DOM tính bounds pass; override viewport Chrome không thay đổi kích thước DOM thực tế (vẫn 2174×1263), nên chưa xác minh visual màn hình nhỏ.
- Kiểm chứng visual riêng ở zoom 125%/150%, prefers-reduced-motion và thiếu backdrop-filter trong Chrome. CSS có fallback và test logic contrast, chưa có screenshot cho từng cấu hình này.

## Checklist sau khi người dùng cài

1. Load unpacked, tải lại YouTube; xác nhận hai nút Luma nằm cạnh cài đặt trong thanh player và ánh sáng.
2. Bật/tắt từ popup và nút player; chỉnh blur rồi mở Nâng cao chọn preset/cường độ; kiểm tra tìm kiếm vẫn hoạt động.
3. Normal→theater→fullscreen→normal; video không đổi tỉ lệ và control không bị che.
4. Pause/resume, seek, chuyển 10 video rồi Back/Forward; không canvas/UI trùng.
5. Đổi tab rồi quay lại; video có letterbox/pillarbox và video dọc.
6. YouTube Light/Dark; cảnh trắng; keyboard/focus; reduced motion và zoom.

Đây là bản v1 để dùng thử, chưa tuyên bố đạt toàn bộ live QA trong đặc tả hoặc đã phát hành Chrome Web Store.
