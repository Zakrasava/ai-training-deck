/* «Портал»: две светящиеся дуги с частицами сверху и снизу, как на главной странице‑референсе.
   Canvas 2D с аддитивным смешиванием; рисуется только пока слайд активен. */
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function mount(canvas) {
    const g = canvas.getContext("2d");
    const W = canvas.width = 1600, H = canvas.height = 900;
    const rings = [
      { cy: 96, rx: 740, ry: 50, tilt: 1 },   // верхняя, видим снизу
      { cy: 792, rx: 740, ry: 50, tilt: -1 }   // нижняя, видим сверху
    ];
    const off = document.createElement("canvas"); off.width = W; off.height = H; const og = off.getContext("2d");
    const N = 900;
    const parts = [];
    for (let i = 0; i < N; i++) {
      const r = rings[i % 2];
      parts.push({ r, a: Math.random() * Math.PI * 2, d: (Math.random() - .5) * 2, v: (Math.random() - .5) * 2, s: .4 + Math.random() * 2.2, sp: .002 + Math.random() * .004, tw: Math.random() * 6.28, life: Math.random() });
    }
    let active = false, raf = 0, t0 = performance.now();

    function arc(r, t, k) {
      const rx = r.rx * k, ry = r.ry * k, ext = 170;
      // плазменная полоса: вертикальный градиент, затем маска по ширине эллипса
      og.clearRect(0, 0, W, H);
      og.globalCompositeOperation = "source-over";
      const grad = og.createLinearGradient(0, r.cy, 0, r.cy + r.tilt * ext);
      grad.addColorStop(0, "rgba(120,180,255,.75)"); grad.addColorStop(.18, "rgba(70,135,255,.38)"); grad.addColorStop(.5, "rgba(40,95,220,.14)"); grad.addColorStop(1, "rgba(5,7,11,0)");
      og.fillStyle = grad;
      og.fillRect(W / 2 - rx, r.tilt > 0 ? r.cy : r.cy - ext, rx * 2, ext);
      // мягкие мерцающие языки плазмы
      og.filter = "blur(16px)";
      for (let i = 0; i < 22; i++) {
        const x = W / 2 + Math.sin(i * 12.9898 + t * .25) * rx * .92, h = 50 + Math.abs(Math.sin(i * 3.7 + t * 1.1)) * 110;
        const lg = og.createLinearGradient(0, r.cy, 0, r.cy + r.tilt * h);
        lg.addColorStop(0, "rgba(170,215,255,.42)"); lg.addColorStop(1, "rgba(170,215,255,0)");
        og.fillStyle = lg; og.fillRect(x - 22, r.tilt > 0 ? r.cy : r.cy - h, 44, h);
      }
      og.filter = "none";
      const mask = og.createLinearGradient(W / 2 - rx, 0, W / 2 + rx, 0);
      mask.addColorStop(0, "rgba(0,0,0,0)"); mask.addColorStop(.12, "rgba(0,0,0,1)"); mask.addColorStop(.88, "rgba(0,0,0,1)"); mask.addColorStop(1, "rgba(0,0,0,0)");
      og.globalCompositeOperation = "destination-in"; og.fillStyle = mask; og.fillRect(0, 0, W, H);
      g.drawImage(off, 0, 0);
      // внутренняя поверхность кольца (тёмно-синяя)
      g.beginPath(); g.ellipse(W / 2, r.cy, rx, ry, 0, 0, Math.PI * 2);
      g.fillStyle = "rgba(30,70,170,.22)"; g.fill();
      // сама дуга: слои свечения
      for (let i = 0; i < 4; i++) {
        g.beginPath(); g.ellipse(W / 2, r.cy, rx, ry, 0, 0, Math.PI * 2);
        g.lineWidth = [30, 14, 5, 1.6][i];
        g.strokeStyle = ["rgba(40,110,255,.10)", "rgba(80,150,255,.22)", "rgba(150,200,255,.6)", "rgba(235,246,255,.95)"][i];
        g.stroke();
      }
    }

    function frame(now) {
      const t = (now - t0) / 1000, k = reduce ? 1 : Math.min(1, t / 1.6), kk = 1 - Math.pow(1 - k, 3);
      g.clearRect(0, 0, W, H);
      g.globalCompositeOperation = "lighter";
      rings.forEach(r => arc(r, t, .2 + .8 * kk));
      // частицы вдоль дуг, поднимаются от дуги в сторону центра и гаснут
      for (const p of parts) {
        p.a += p.sp; p.life += .006 + p.s * .002; if (p.life > 1) { p.life = 0; p.a = Math.random() * 6.28; }
        const r = p.r, rx = r.rx * (.2 + .8 * kk), ry = r.ry * (.2 + .8 * kk);
        const x = W / 2 + Math.cos(p.a) * rx + p.d * 12;
        const y = r.cy + Math.sin(p.a) * ry + r.tilt * (p.life * 190) + p.v * 6;
        const a = (1 - p.life) * (.35 + .65 * Math.abs(Math.sin(t * 2 + p.tw))) * kk;
        g.fillStyle = `rgba(${170 + 60 * p.life | 0},${210 + 30 * p.life | 0},255,${a})`;
        g.beginPath(); g.arc(x, y, p.s * (1 - p.life * .5), 0, 6.28); g.fill();
      }
      g.globalCompositeOperation = "source-over";
      if (active && !reduce) raf = requestAnimationFrame(frame);
    }
    return { setActive(on) { active = on; cancelAnimationFrame(raf); if (on) { t0 = performance.now(); raf = requestAnimationFrame(frame); } } };
  }

  const mounts = [];
  document.querySelectorAll("canvas.portal").forEach(c => mounts.push({ el: c.closest(".slide"), m: mount(c) }));
  function sync() { mounts.forEach(x => x.m.setActive(x.el.classList.contains("is-active"))); }
  document.addEventListener("slide", sync); sync();
})();
