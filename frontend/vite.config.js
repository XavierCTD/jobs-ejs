import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:3000",
      "/sessions": "http://localhost:3000",
      "/secretWord": "http://localhost:3000",
      "/public": "http://localhost:3000",
    },
  },
  build: {
    minify: false,
    sourcemap: true,
  },
});
