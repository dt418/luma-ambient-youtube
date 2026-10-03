# Luma — Ambient cho YouTube

Chrome Manifest V3 extension tạo ánh sáng ambient đồng bộ với video YouTube. Giao diện tiếng Việt theo phong cách liquid glass, với màu lấy từ video, blur dễ chỉnh và tùy chọn nâng cao.

- [Chính sách quyền riêng tư](https://dt418.github.io/luma-ambient-youtube/privacy-policy.html)
- [Trang dự án](https://dt418.github.io/luma-ambient-youtube/)
- [Gói cài đặt v1.0.0](releases/luma-youtube-ambient-v1.zip)
- [Source ZIP](releases/luma-youtube-ambient-v1-source.zip)
- [Thông tin Chrome Web Store](store-listing-vi.md)
- [Kết quả kiểm thử](docs/QA.md)

## Cài đặt từ ZIP

1. Tải gói cài đặt ở trên và giải nén.
2. Mở `chrome://extensions/` trong Chrome, bật **Developer mode**.
3. Chọn **Load unpacked** rồi chọn thư mục đã giải nén chứa `manifest.json`.
4. Mở lại trang YouTube.

## Chạy kiểm tra và build

Yêu cầu Node.js 22 trở lên.

```sh
npm ci
npm run check
npm run package
```

Build được gói offline; extension không tải mã thực thi từ máy chủ bên ngoài. Mã nguồn chính nằm trong `src/`, giao diện extension trong `extension/`, test trong `tests/`.

## Quyền riêng tư

Luma chỉ yêu cầu quyền `storage` và chạy content script trên YouTube. Màu khung hình được xử lý tạm thời trong bộ nhớ của tab; tùy chọn được lưu cục bộ bằng `chrome.storage.local`. Xem [chính sách đầy đủ](site/privacy-policy.html).

## Pages

GitHub Actions triển khai thư mục `site/` lên GitHub Pages mỗi khi có commit mới trên `main`.
