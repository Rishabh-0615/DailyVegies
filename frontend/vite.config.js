import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true, // Ensures proper handling of CORS
        secure: false, // Set to true if using HTTPS in backend
      },
    },
  },
});
