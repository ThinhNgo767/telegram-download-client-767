# Telegram Downloader — React + Server

## Cấu trúc project
```
project/
├── server/
│   ├── server.js      ← Node.js Express API (thay thế main.js)
│   ├── package.json
│   └── .env           ← TẠO THỦ CÔNG (xem bên dưới)
└── client/
    ├── src/
    │   ├── App.jsx    ← React UI
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## Cài đặt lần đầu

### 1. Tạo file .env trong thư mục server/
```
TG_API_ID=28976684
TG_API_HASH=xxxxxxxxxxxxxxxxxxxx
TG_SESSION=1BQANOTEu...
```

### 2. Cài dependencies server
```bash
cd server
npm install
```

### 3. Cài dependencies client
```bash
cd client
npm install
```

## Chạy hàng ngày

### Terminal 1 — Server (chạy 1 lần, để mở)
```bash
cd server
node server.js
```
Server sẽ in ra IP của máy, ví dụ:
```
✅ Server đang chạy!
   Máy tính : http://localhost:3001
   iPhone   : http://192.168.1.5:3001
```

### Terminal 2 — React dev server (khi đang dev)
```bash
cd client
npm run dev
```
Mở trình duyệt iPhone: `http://192.168.1.5:5173`

### Build production (tùy chọn)
```bash
cd client
npm run build
```
Thư mục `client/dist/` — có thể serve tĩnh qua server.js

## Lưu file trên iPhone

| Loại file | Safari làm gì |
|-----------|--------------|
| `.jpg`, `.png` | Hiện "Thêm vào Ảnh" hoặc "Lưu vào Files" |
| `.mp4`, `.mov` | Hiện "Lưu Video" hoặc "Lưu vào Files" |
| File khác | Lưu vào Files app |

## Lưu ý
- iPhone và máy tính phải cùng mạng WiFi
- Nếu Safari chặn download: Settings → Safari → Downloads → "Allow" từ site này
- Firewall Windows: cho phép Node.js truy cập mạng riêng (private network)
