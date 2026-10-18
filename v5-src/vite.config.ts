import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

// Сборка кладётся в ../v9 (v5–v8 заморожены для сравнения) и публикуется GitHub Pages рядом с основной колодой.
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
  build: { outDir: "../v9", emptyOutDir: true, target: "es2020", chunkSizeWarningLimit: 1200, rollupOptions: { input: { main: path.resolve(__dirname, "index.html") } } },
});
