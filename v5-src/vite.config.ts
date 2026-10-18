import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

// Сборка кладётся в ../v10 (v5–v9 заморожены для сравнения) и публикуется GitHub Pages рядом с основной колодой.
// Заметки ведущего в публичную сборку не попадают: обычная сборка вырезает их из slides.tsx.
// Локальный показ с заметками: `npm run notes` (dev-сервер в режиме notes), клавиша N.
const stripNotes = (): Plugin => ({
  name: "strip-notes",
  enforce: "pre",
  transform(code, id) {
    if (!id.replace(/\\/g, "/").endsWith("/src/slides.tsx")) return null;
    return { code: code.replace(/notes: "(?:[^"\\]|\\.)*"/g, 'notes: ""'), map: null };
  },
});

export default defineConfig(({ mode }) => {
  const withNotes = mode === "notes";
  return {
    base: "./",
    plugins: [react(), tailwindcss(), ...(withNotes ? [] : [stripNotes()])],
    define: { __NOTES__: JSON.stringify(withNotes) },
    resolve: { alias: { "@": path.resolve(__dirname, "src") } },
    build: { outDir: "../v10", emptyOutDir: true, target: "es2020", chunkSizeWarningLimit: 1200, rollupOptions: { input: { main: path.resolve(__dirname, "index.html") } } },
  };
});
