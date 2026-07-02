import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // Proxy /api/* → server Node.js khi dev (tránh CORS)
    // proxy: {
    //   "/api": {
    //     target: import.meta.env.VITE_URI_ROOT_API,
    //     changeOrigin: true,
    //   },
    // },
    // Cho phép truy cập từ iPhone cùng mạng khi dev
    host: "0.0.0.0",
    port: 3000,
  },
});
