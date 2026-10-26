// Движок колоды: сцена 1600×900, шаги внутри слайда, #N в адресе, оглавление, полный экран.
(() => {
  const D = window.DECK_DATA;
  const html = document.documentElement;
  const Q = new URLSearchParams(location.search);
  if (Q.has('static')) html.classList.add('static');
  const calm = () => html.classList.contains('static') || matchMedia('(prefers-reduced-motion: reduce)').matches;

  const stage = document.getElementById('stage');
  const slides = [...stage.querySelectorAll('section.slide')];
  const HOOKS = window.SLIDE_HOOKS || {};
  const seen = new Set();
  let cur = -1, step = 0;

  // данные в текст: <b data-k="calls"></b>
  document.querySelectorAll('[data-k]').forEach(el => { el.textContent = D[el.dataset.k]; });

  // масштаб сцены по меньшему из визуального и layout-вьюпорта: на телефоне они расходятся (панели браузера, вырез),
  // а сцена центрируется в layout-боксе; повторный fit после загрузки и поворота — вьюпорт телефона оседает не сразу
  function fit() {
    const de = document.documentElement, w = Math.min(innerWidth, de.clientWidth || innerWidth), h = Math.min(innerHeight, de.clientHeight || innerHeight);
    stage.style.setProperty('--k', Math.min(w / 1600, h / 900));
  }
  addEventListener('resize', fit); addEventListener('orientationchange', fit); addEventListener('load', fit);
  if (window.visualViewport) visualViewport.addEventListener('resize', fit);
  fit(); setTimeout(fit, 300); setTimeout(fit, 1000);

  // ── полоса внизу ──
  const ICON_MENU = '<svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
  const ICON_FS = '<svg viewBox="0 0 24 24"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>';
  const ICON_FS_EXIT = '<svg viewBox="0 0 24 24"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/></svg>';
  const chrome = document.createElement('div');
  chrome.className = 'chrome';
  chrome.innerHTML = `<button class="ibtn" id="tocBtn" aria-label="Все слайды" aria-expanded="false">${ICON_MENU}</button>
    <span class="blk"></span><span class="rail"><s></s></span><span class="num mono"></span>
    <button class="ibtn" id="fsBtn" aria-label="Во весь экран">${ICON_FS}</button>`;
  stage.appendChild(chrome);
  const rail = chrome.querySelector('.rail'), sweep = rail.querySelector('s');
  for (let n = 0; n < D.total; n++) { const t = document.createElement('i'); t.style.left = (n / (D.total - 1) * 100) + '%'; rail.appendChild(t); }
  const dot = document.createElement('b'); rail.appendChild(dot);
  const pos = n => (n - 1) / (D.total - 1) * 100;

  // ── оглавление ──
  const toc = document.createElement('nav');
  toc.className = 'toc'; toc.setAttribute('aria-label', 'Все слайды');
  const built = new Map(slides.map((s, i) => [+s.dataset.n, i]));
  D.titles.forEach(([, t], k) => {
    const n = k + 1, b = document.createElement('button');
    b.innerHTML = `<span>${String(n).padStart(2, '0')}</span>${t}`;
    b.dataset.n = n;
    if (!built.has(n)) b.disabled = true;
    b.addEventListener('click', e => { e.stopPropagation(); closeToc(); jump(n); });
    toc.appendChild(b);
  });
  // две колонки сверху вниз
  toc.style.gridAutoFlow = 'column'; toc.style.gridTemplateRows = `repeat(${Math.ceil(D.titles.length / 2)}, auto)`;
  stage.appendChild(toc);
  const tocBtn = chrome.querySelector('#tocBtn');
  function openToc() { toc.classList.add('open'); tocBtn.setAttribute('aria-expanded', 'true'); toc.querySelector('button.cur')?.focus({ preventScroll: true }); }
  function closeToc() { toc.classList.remove('open'); tocBtn.setAttribute('aria-expanded', 'false'); }
  tocBtn.addEventListener('click', e => { e.stopPropagation(); toc.classList.contains('open') ? closeToc() : openToc(); });

  // ── полный экран ──
  const fsBtn = chrome.querySelector('#fsBtn');
  fsBtn.addEventListener('click', e => { e.stopPropagation(); toggleFs(); });
  function toggleFs() { document.fullscreenElement ? document.exitFullscreen() : html.requestFullscreen?.(); }
  document.addEventListener('fullscreenchange', () => {
    const on = !!document.fullscreenElement;
    fsBtn.innerHTML = on ? ICON_FS_EXIT : ICON_FS; fsBtn.setAttribute('aria-label', on ? 'Выйти из полного экрана' : 'Во весь экран');
  });
  if (!html.requestFullscreen) fsBtn.hidden = true;  // iPhone: полного экрана нет

  // ── шаги ──
  const maxStep = i => +slides[i].dataset.steps || 0;
  const fxs = el => el.querySelectorAll('.fx,.mask,[data-on]');

  function paint(el, s, instant) {
    if (instant) el.classList.add('instant');
    fxs(el).forEach(f => {
      const on = +(f.dataset.on || 0);
      f.style.transitionDelay = instant || on !== s ? '0ms' : (f.dataset.d || 0) + 'ms';
      f.classList.toggle('on', s >= on && el.classList.contains('in'));
    });
    if (HOOKS[el.id]) HOOKS[el.id](el, s, instant);
    if (instant) { void el.offsetWidth; requestAnimationFrame(() => el.classList.remove('instant')); }
  }

  // ── переход между слайдами: камера едет вдоль маршрута ──
  function travel(from, to, dir) {
    const SHIFT = 160;
    if (from) {
      from.style.transform = `translateX(${-dir * SHIFT}px)`;
      setTimeout(() => { if (!from.classList.contains('cur')) from.style.transform = ''; }, 820);
    }
    if (calm() || !from) { to.style.transform = ''; return; }
    to.style.transition = 'none'; to.style.transform = `translateX(${dir * SHIFT}px)`;
    void to.offsetWidth; to.style.transition = ''; to.style.transform = '';
    // по нижней полосе пробегает отрезок от старой точки к новой
    const a = pos(+from.dataset.n), b = pos(+to.dataset.n);
    sweep.style.left = Math.min(a, b) + '%'; sweep.style.width = Math.abs(b - a) + '%';
    sweep.animate([{ opacity: 1, transform: 'scaleX(0)', transformOrigin: dir > 0 ? 'left' : 'right' },
                   { opacity: 1, transform: 'scaleX(1)', transformOrigin: dir > 0 ? 'left' : 'right', offset: .55 },
                   { opacity: 0, transform: 'scaleX(1)', transformOrigin: dir > 0 ? 'left' : 'right' }],
                  { duration: 800, easing: 'cubic-bezier(.45,.05,.55,.95)' });
  }

  function show(i, s, how) { // how: 'enter' | 'instant' | 'step'
    i = Math.max(0, Math.min(slides.length - 1, i));
    const el = slides[i];
    if (i === cur && how === 'step' && !el.classList.contains('in')) el.classList.add('in'); // шаг раньше, чем закончился вход
    if (i !== cur) {
      const from = slides[cur], dir = cur < 0 ? 1 : (i > cur ? 1 : -1);
      slides.forEach((x, k) => x.classList.toggle('cur', k === i));
      travel(from, el, dir);
      if (how === 'enter') {
        el.classList.add('instant'); el.classList.remove('in');
        fxs(el).forEach(f => f.classList.remove('on'));
        if (HOOKS[el.id]) HOOKS[el.id](el, -1, true);
        void el.offsetWidth; el.classList.remove('instant');
        cur = i; step = s;
        setTimeout(() => { if (slides[cur] !== el || el.classList.contains('in')) return; el.classList.add('in'); paint(el, step, false); }, from && !calm() ? 220 : 30);
      } else {
        el.classList.add('in'); cur = i; step = s; paint(el, s, true);
      }
      seen.add(i);
      const n = +el.dataset.n;
      chrome.querySelector('.blk').textContent = el.dataset.block || '';
      chrome.querySelector('.num').textContent = String(n).padStart(2, '0') + ' / ' + D.total;
      dot.style.left = pos(n) + '%';
      toc.querySelectorAll('button').forEach(b => b.classList.toggle('cur', +b.dataset.n === n));
      history.replaceState(null, '', location.pathname + location.search + '#' + n);
      notes.textContent = (el.querySelector('aside.notes') || {}).textContent || '';
    } else { step = s; paint(el, s, how === 'instant'); }
  }

  function jump(n) {
    const i = built.get(n); if (i === undefined || i === cur) return;
    seen.has(i) ? show(i, maxStep(i), 'instant') : show(i, 0, 'enter');
  }
  function next() {
    if (step < maxStep(cur)) return show(cur, step + 1, 'step');
    if (cur + 1 >= slides.length) return;
    const j = cur + 1;
    seen.has(j) ? show(j, maxStep(j), 'instant') : show(j, 0, 'enter');
  }
  function prev() {
    if (step > 0) return show(cur, step - 1, 'step');
    if (cur <= 0) return;
    show(cur - 1, maxStep(cur - 1), 'instant');
  }
  function fromHash(how) {
    const m = /^#(\d+)(?:\.(\d+))?$/.exec(location.hash);
    if (!m) return show(0, 0, how);
    const i = built.get(+m[1]);
    if (i === undefined) return show(0, 0, how);
    if (m[2] !== undefined) return show(i, Math.min(+m[2], maxStep(i)), 'instant');
    show(i, 0, how);
  }

  // заметки ведущего
  const notes = document.createElement('div'); notes.className = 'notes-pane'; document.body.appendChild(notes);

  addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key;
    if (toc.classList.contains('open')) {
      if (k === 'Escape' || k === 'm' || k === 'M' || k === 'ь' || k === 'Ь') { e.preventDefault(); closeToc(); tocBtn.focus(); }
      return; // внутри оглавления стрелки и Enter работают по кнопкам
    }
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter'].includes(k)) {
      if ((k === 'Enter' || k === ' ') && e.target.closest('button')) return; // кнопка в фокусе: Enter и пробел нажимают её
      e.preventDefault(); next();
    }
    else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(k)) { e.preventDefault(); prev(); }
    else if (k === 'Home') jump(+slides[0].dataset.n);
    else if (k === 'End') jump(+slides[slides.length - 1].dataset.n);
    else if (k === 'm' || k === 'M' || k === 'ь' || k === 'Ь') openToc();
    else if (k === 'n' || k === 'N' || k === 'т' || k === 'Т') html.classList.toggle('show-notes');
    else if (k === 'f' || k === 'F' || k === 'а' || k === 'А') toggleFs();
    else if (/^[1-9]$/.test(k) && window.SLIDE_KEYS && SLIDE_KEYS[slides[cur].id]) SLIDE_KEYS[slides[cur].id](+k);
  });
  // клики по краям; клик мимо открытого оглавления закрывает его
  addEventListener('click', e => {
    if (toc.classList.contains('open')) { if (!e.target.closest('.toc')) closeToc(); return; }
    if (e.target.closest('a,button')) return;
    const x = e.clientX / innerWidth;
    if (x < .25) prev(); else if (x > .75) next();
  });
  // свайпы
  let sx = null, sy = null;
  addEventListener('touchstart', e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  addEventListener('touchend', e => {
    if (sx === null || toc.classList.contains('open')) return;
    const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) dx < 0 ? next() : prev();
    sx = null;
  }, { passive: true });
  addEventListener('hashchange', () => fromHash('instant'));

  document.fonts.ready.then(() => { fromHash('enter'); html.dataset.ready = 1; });
})();
