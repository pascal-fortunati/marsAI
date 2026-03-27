import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0",
    port: 4001,
    allowedHosts: true,
    watch: {
      usePolling: process.env.VITE_USE_POLLING === "true",
      interval: Number(process.env.VITE_POLL_INTERVAL || 300),
    },
    proxy: {
      "/api": {
        target: process.env.VITE_DEV_PROXY_TARGET || "http://localhost:4000",
        changeOrigin: true,
      },
      "/partners": {
        target: process.env.VITE_DEV_PROXY_TARGET || "http://localhost:4000",
        changeOrigin: true,
      },
      "/uploads": {
        target: process.env.VITE_DEV_PROXY_TARGET || "http://localhost:4000",
        changeOrigin: true,
      },
    },
  },
});
