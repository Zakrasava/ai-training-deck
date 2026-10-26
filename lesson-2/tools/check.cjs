// Проверка колоды (нужен Playwright: npm i -D playwright, npx playwright install chromium).
// Запуск из папки lesson-2:  node tools/check.cjs [deck/index.html | index.html]
// Проходит все слайды на последнем шаге в трёх размерах: текст за сценой, переполнения, ошибки консоли;
// затем листает колоду клавишами от начала до конца.
const { chromium } = require('playwright');
const { join } = require('node:path');
const { pathToFileURL } = require('node:url');
const root = join(__dirname, '..');
const page0 = pathToFileURL(join(root, process.argv[2] || 'deck/index.html')).href;
(async () => {
const b = await chromium.launch(); const errs = []; let problems = 0;
for (const [w, h] of [[1600, 900], [1280, 720], [844, 390]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  p.on('pageerror', e => errs.push(String(e))); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await p.goto(page0 + '?static#1'); await p.waitForSelector('html[data-ready]');
  const total = await p.evaluate(() => document.querySelectorAll('section.slide').length);
  for (let n = 1; n <= total; n++) {
    await p.evaluate(n => { location.hash = '#' + n + '.99'; }, n); await p.waitForTimeout(120);
    const bad = await p.evaluate(() => {
      const st = document.getElementById('stage').getBoundingClientRect(), out = [];
      document.querySelector('.slide.cur').querySelectorAll('*').forEach(e => {
        if (e.closest('svg') || e.classList.contains('chkwrap')) return;
        const r = e.getBoundingClientRect(), cs = getComputedStyle(e);
        if (!r.width || !r.height || cs.visibility === 'hidden' || cs.opacity === '0' || cs.display === 'none') return;
        if (r.right > st.right + 1 || r.bottom > st.bottom + 1 || r.left < st.left - 1 || r.top < st.top - 1) out.push('за сценой: ' + (e.textContent || e.className).trim().slice(0, 40));
      });
      return out.slice(0, 5);
    });
    if (bad.length) { problems++; console.log(`${w}×${h} слайд ${n}:`, bad); }
  }
  await p.close();
}
const p = await b.newPage({ viewport: { width: 1600, height: 900 } });
p.on('pageerror', e => errs.push(String(e)));
await p.goto(page0 + '#1'); await p.waitForSelector('html[data-ready]');
for (let i = 0; i < 200; i++) { await p.keyboard.press('ArrowRight'); await p.waitForTimeout(40); }
console.log('после 200 нажатий →', await p.evaluate(() => location.hash));
if (errs.length) { problems++; console.log('ошибки консоли:', errs); }
console.log(problems ? `проблем: ${problems}` : 'чисто');
await b.close(); process.exit(problems ? 1 : 0);
})();
