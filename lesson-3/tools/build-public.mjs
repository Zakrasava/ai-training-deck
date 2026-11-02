// Публичная сборка колоды: lesson-3/index.html = deck/index.html без заметок ведущего (как во встрече 2).
// Запуск из папки lesson-3:  node tools/build-public.mjs
// Файлы колоды остаются в deck/ — публичная страница подключает их через <base href="deck/">.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');   // lesson-3/
let html = readFileSync(join(root, 'deck', 'index.html'), 'utf8');
const notes = (html.match(/<aside class="notes">[\s\S]*?<\/aside>/g) || []).length;
html = html.replace(/\s*<aside class="notes">[\s\S]*?<\/aside>/g, '');
html = html.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n<base href="deck/">');
if (!html.includes('<base href="deck/">')) throw new Error('не нашёл <meta charset="utf-8"> для <base>');
if (/class="notes"/.test(html)) throw new Error('в публичной сборке остались заметки');
writeFileSync(join(root, 'index.html'), html);
console.log(`index.html собран: убрано заметок ${notes}`);
