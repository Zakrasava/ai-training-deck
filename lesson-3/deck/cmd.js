// Слайды‑команды: карточка с текстом из cmds.js, копирование (C), «что ждём» (E). Запускается до deck.js.
(() => {
  const P = window.PULT;
  const esc = s => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  const paras = s => s.split(/\n{2,}/).map(p => `<p>${esc(p)}</p>`).join('');
  const stage = document.getElementById('stage');

  // сообщение цепочки «одно окно — один бот»: полоса 1…6 вверху, текущее выделено
  const rail = k => P.chain.map((c, i) =>
    `<span class="${i + 1 === k ? 'on' : i + 1 < k ? 'done' : ''}"><b>${i + 1}</b>${esc(c.title)}</span>`).join('');

  document.querySelectorAll('section.cmd').forEach(el => {
    const k = +el.dataset.chain || 0, c = k ? P.chain[k - 1] : null;
    const t = c || el.dataset.task === 'second' ? null : P.tasks.find(x => x.n === +el.dataset.task);
    el._text = c ? c.cmd : t ? t.cmd : P.second;
    const list = c ? c.expect : t ? t.expect : [];
    const top = c ? `<div class="top rail fx fade">${rail(k)}</div>`
      : `<div class="top fx fade">${t ? `<b>${t.n}</b>${esc(t.title)}` : 'Любая готовая задача · новое окно, другой агент'}</div>`;
    const head = c ? `<em>Сообщение ${k}</em> · ${esc(c.title)}` : t ? `<em>Команда</em> · ${esc(t.title)}` : '<em>Второй взгляд</em>';
    const hint = c ? 'одно окно агента · папка встреча-3-один-бот' : t ? 'окно агента в папке задачи, без --chrome' : 'новое окно, другой агент';
    el.insertAdjacentHTML('afterbegin', `
      ${top}
      <h2 class="ct"><span class="mask"><span>${head}</span></span></h2>
      <div class="card fx" data-d="200"><div class="txt">${paras(el._text)}</div></div>
      ${list.length ? `<div class="expect" aria-hidden="true"><h3>${c && c.expectTitle ? esc(c.expectTitle) : 'Что агент должен найти сам'}</h3><ol>${list.map(x => `<li>${esc(x)}</li>`).join('')}</ol></div>` : ''}
      <div class="act fx" data-d="350"><button class="copy" type="button">Копировать <kbd>C</kbd></button>
        ${list.length ? '<button class="ghost exp" type="button" aria-pressed="false">Что ждём <kbd>E</kbd></button>' : ''}
        <span class="hint">${hint}</span></div>`);
  });

  const toast = document.createElement('div');
  toast.className = 'toast'; toast.setAttribute('role', 'status');
  stage.appendChild(toast);
  let tt;
  const say = m => { toast.textContent = m; toast.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove('on'), 1600); };
  const curCmd = () => { const el = stage.querySelector('section.slide.cur'); return el && el.classList.contains('cmd') ? el : null; };

  async function copy(el) {
    let ok = false;
    try { await navigator.clipboard.writeText(el._text); ok = true; } catch (_) {
      const ta = document.createElement('textarea'); ta.value = el._text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select(); ok = document.execCommand('copy'); ta.remove();
    }
    const b = el.querySelector('.copy');
    if (ok) { b.classList.add('ok'); b.firstChild.textContent = 'Скопировано '; say('Скопировано — вставьте в окно агента'); }
    else say('Не скопировалось — выделите текст мышью');
    setTimeout(() => { b.classList.remove('ok'); b.firstChild.textContent = 'Копировать '; }, 1800);
  }
  function toggleExpect(el, v) {
    const x = el.querySelector('.expect'), b = el.querySelector('.exp');
    if (!x) return;
    v = v ?? !x.classList.contains('open');
    x.classList.toggle('open', v); x.setAttribute('aria-hidden', String(!v)); b.setAttribute('aria-pressed', String(v));
  }
  // текст ужимается, пока не влезет в карточку (28 → 18 px; короткие сообщения цепочки — от 36)
  function fitText(el) {
    const box = el.querySelector('.card .txt');
    for (let f = el.dataset.chain ? 36 : 28; f >= 18; f--) { box.style.fontSize = f + 'px'; if (box.scrollHeight <= box.clientHeight + 1) break; }
  }

  document.querySelectorAll('section.cmd').forEach(el => {
    el.querySelector('.copy').addEventListener('click', e => { e.stopPropagation(); copy(el); });
    el.querySelector('.exp')?.addEventListener('click', e => { e.stopPropagation(); toggleExpect(el); });
    window.SLIDE_HOOKS[el.id] = (el2, s) => { if (s < 0) toggleExpect(el2, false); fitText(el2); };
  });
  addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const el = curCmd(); if (!el) return;
    if (/^[cсCС]$/.test(e.key)) copy(el);
    else if (/^[eуEУ]$/.test(e.key)) toggleExpect(el);
  });
  document.fonts?.ready.then(() => { const el = curCmd(); if (el) fitText(el); });
})();
