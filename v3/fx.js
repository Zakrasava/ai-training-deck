/* Эффекты: звёздное поле с «прыжком» между слайдами, вылет элементов, живые макеты
   интерфейса (курсор, переключатели, набор текста), счётчики, столбики. */
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- звёздное поле ---------- */
  const sky = document.createElement("canvas");
  sky.className = "sky"; document.body.prepend(sky);
  const g = sky.getContext("2d");
  let W, H, stars = [], warp = 0;
  function resize() { W = sky.width = innerWidth; H = sky.height = innerHeight; }
  function seed() {
    stars = Array.from({ length: 520 }, () => ({ x: (Math.random() - .5) * 2, y: (Math.random() - .5) * 2, z: Math.random() * .9 + .1, tw: Math.random() * 6.28 }));
  }
  function draw(t) {
    g.clearRect(0, 0, W, H);
    const cx = W / 2, cy = H / 2;
    for (const s of stars) {
      const sp = (s.z < .3 ? .0009 : .00035) + warp * .02;
      s.z -= sp; if (s.z <= .05) { s.z = 1; s.x = (Math.random() - .5) * 2; s.y = (Math.random() - .5) * 2; }
      const k = 1 / s.z, px = cx + s.x * k * cx * .9, py = cy + s.y * k * cy * .9;
      if (px < 0 || px > W || py < 0 || py > H) continue;
      const a = Math.min(1, (1 - s.z) * 1.2) * (.45 + .35 * Math.sin(t * .002 + s.tw));
      const r = (1 - s.z) * 1.6 + .3;
      if (warp > .02) {
        const k2 = 1 / (s.z + sp * 6), qx = cx + s.x * k2 * cx * .9, qy = cy + s.y * k2 * cy * .9;
        g.strokeStyle = `rgba(150,200,255,${a * .9})`; g.lineWidth = r; g.beginPath(); g.moveTo(px, py); g.lineTo(qx, qy); g.stroke();
      } else {
        g.fillStyle = `rgba(190,215,255,${a})`; g.beginPath(); g.arc(px, py, r, 0, 6.28); g.fill();
      }
    }
    warp *= .9;
    if (!reduce) requestAnimationFrame(draw);
  }
  addEventListener("resize", resize); resize(); seed(); requestAnimationFrame(draw);

  /* ---------- вспышка-луч при смене слайда ---------- */
  const beam = document.createElement("div"); beam.className = "beam"; document.body.appendChild(beam);

  /* ---------- хореография слайда ---------- */
  const timers = new WeakMap();
  function clearTimers(el) { (timers.get(el) || []).forEach(clearTimeout); timers.set(el, []); }
  function later(el, fn, ms) { const id = setTimeout(fn, reduce ? 0 : ms); timers.get(el).push(id); return id; }

  function enter(el) {
    clearTimers(el);
    if (!reduce) { warp = 1; beam.classList.remove("go"); void beam.offsetWidth; beam.classList.add("go"); }
    let i = 0;
    el.querySelectorAll(".fly").forEach(n => {
      const d = n.dataset.delay ? parseInt(n.dataset.delay, 10) : 160 + i++ * 110;
      later(el, () => n.classList.add("in"), d);
    });
    el.querySelectorAll("[data-type]").forEach(n => typeInto(el, n));
    el.querySelectorAll("[data-steps]").forEach(n => runSteps(el, n));
    el.querySelectorAll("[data-count]").forEach(n => later(el, () => count(n), 500));
    el.querySelectorAll(".bar[data-v]").forEach((n, k) => later(el, () => n.style.setProperty("--v", n.dataset.v), 500 + k * 120));
    el.querySelectorAll(".pulse-line").forEach(n => later(el, () => n.classList.add("in"), 300));
  }
  function leave(el) {
    clearTimers(el);
    el.querySelectorAll(".fly.in").forEach(n => n.classList.remove("in"));
    el.querySelectorAll(".pulse-line.in").forEach(n => n.classList.remove("in"));
    el.querySelectorAll("[data-type]").forEach(n => { n.textContent = ""; n.classList.remove("done"); });
    el.querySelectorAll("[data-count]").forEach(n => { n.textContent = "0"; delete n.dataset.done; });
    el.querySelectorAll(".bar[data-v]").forEach(n => n.style.setProperty("--v", 0));
    el.querySelectorAll(".cursor").forEach(c => c.remove());
    el.querySelectorAll("[data-steps] .on-demo").forEach(n => n.classList.remove("on-demo", "on"));
  }

  function typeInto(el, n) {
    const text = n.dataset.type, start = parseInt(n.dataset.delay || "700", 10), speed = parseInt(n.dataset.speed || "18", 10);
    n.textContent = "";
    if (reduce) { n.textContent = text; n.classList.add("done"); return; }
    let k = 0;
    later(el, function tick() {
      n.textContent = text.slice(0, ++k);
      if (k < text.length) later(el, tick, speed + (text[k - 1] === "," || text[k - 1] === "." ? 120 : 0));
      else n.classList.add("done");
    }, start);
  }

  function runSteps(el, box) {
    let steps; try { steps = JSON.parse(box.dataset.steps); } catch (e) { return; }
    const cur = document.createElement("div"); cur.className = "cursor"; box.appendChild(cur);
    const br = () => box.getBoundingClientRect();
    cur.style.left = "20%"; cur.style.top = "85%";
    let t = 900;
    steps.forEach(s => {
      const target = box.querySelector(s.sel); if (!target) return;
      t += s.t || 900;
      later(el, () => {
        const r = target.getBoundingClientRect(), b = br();
        const sc = b.width / box.offsetWidth; // учёт масштаба сцены
        cur.style.left = ((r.left - b.left) / sc + (s.x || 40)) + "px";
        cur.style.top = ((r.top - b.top) / sc + r.height / sc / 2) + "px";
        cur.classList.add("show");
      }, t);
      later(el, () => {
        cur.classList.add("click"); setTimeout(() => cur.classList.remove("click"), 300);
        if (s.cls) { target.classList.add(s.cls, "on-demo"); }
        if (s.off) box.querySelectorAll(s.off).forEach(x => x.classList.remove("on"));
        if (s.text) target.textContent = s.text;
      }, t + 650);
    });
    later(el, () => cur.classList.remove("show"), t + 2400);
  }

  function count(el) {
    if (el.dataset.done) return; el.dataset.done = "1";
    const to = parseFloat(el.dataset.count), suffix = el.dataset.suffix || "", t0 = performance.now(), dur = 1300;
    (function tick(t) {
      const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(to * e) + suffix;
      if (k < 1 && !reduce) requestAnimationFrame(tick); else el.textContent = to + suffix;
    })(t0);
  }

  document.addEventListener("slide", e => { if (e.detail.prev) leave(e.detail.prev); enter(e.detail.el); });
  const act = document.querySelector(".slide.is-active"); if (act) enter(act);
})();
