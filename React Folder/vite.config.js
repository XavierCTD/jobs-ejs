import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    minify: false,
    sourcemap: true,
    rollupOptions: {
      output: {
        entryFileNames: "assets/main.js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: ({ name }) =>
          name && name.endsWith(".css")
            ? "assets/styles.css"
            : "assets/[name][extname]",
      },
    },
  },
});
