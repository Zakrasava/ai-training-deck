// Публичная сборка колоды: lesson-2/index.html = deck/index.html без заметок ведущего.
// Запуск из папки lesson-2:  node tools/build-public.mjs
// Файлы колоды остаются в deck/ — публичная страница подключает их через <base href="deck/">.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');   // lesson-2/
const src = join(root, 'deck', 'index.html');
const dst = join(root, 'index.html');
const gallery = join(root, 'concepts', 'index.html');

// 1. Галерея концептов, если она ещё лежит в lesson-2/index.html, переезжает в concepts/index.html
if (existsSync(dst)) {
  const cur = readFileSync(dst, 'utf8');
  if (cur.includes('concepts/a.html') && !existsSync(gallery)) {
    mkdirSync(dirname(gallery), { recursive: true });
    writeFileSync(gallery, cur.replace(/(href|src)="concepts\//g, '$1="'));
    console.log('галерея → concepts/index.html');
  }
}

// 2. Колода без заметок
let html = readFileSync(src, 'utf8');
const notes = (html.match(/<aside class="notes">[\s\S]*?<\/aside>/g) || []).length;
html = html.replace(/\s*<aside class="notes">[\s\S]*?<\/aside>/g, '');
html = html.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n<base href="deck/">');
if (!html.includes('<base href="deck/">')) throw new Error('не нашёл <meta charset="utf-8"> для <base>');
if (/class="notes"/.test(html)) throw new Error('в публичной сборке остались заметки');
writeFileSync(dst, html);
console.log(`index.html собран: убрано заметок ${notes}`);
