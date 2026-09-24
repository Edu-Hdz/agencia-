import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Las peticiones a /api se mandan al servidor de Express
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: { "/api": "http://localhost:3001" },
  },
});
