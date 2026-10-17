import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

// Сборка кладётся в ../v5 и публикуется GitHub Pages рядом с основной колодой.
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
  build: { outDir: "../v5", emptyOutDir: true, target: "es2020", chunkSizeWarningLimit: 1200 },
});
