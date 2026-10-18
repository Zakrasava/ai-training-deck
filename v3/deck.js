/* Навигация по слайдам: стрелки, пробел, клики по краям, свайпы, хеш в адресе,
   прогресс, заметки ведущего (N), полный экран (F), справка (?). */
(function () {
  const slides = Array.from(document.querySelectorAll(".slide"));
  const bar = document.querySelector(".hud .bar");
  const counter = document.querySelector(".hud .counter");
  const notes = document.querySelector(".notes");
  const help = document.querySelector(".help");
  const total = slides.length;
  let i = 0;

  function fit() {
    const s = Math.min(window.innerWidth / 1600, window.innerHeight / 900);
    document.documentElement.style.setProperty("--s", s.toFixed(4));
  }

  function show(n, push) {
    n = Math.max(0, Math.min(total - 1, n));
    const prev = slides[i] && slides[i].classList.contains("is-active") ? slides[i] : null;
    if (prev) prev.classList.remove("is-active");
    i = n;
    const el = slides[i];
    el.classList.add("is-active");
    document.dispatchEvent(new CustomEvent("slide", { detail: { el: el, prev: prev, index: i } }));
    document.body.className = "mood-" + (el.dataset.mood || "quiet");
    bar.style.width = ((i + 1) / total * 100) + "%";
    counter.textContent = (i + 1) + " / " + total;
    const note = el.querySelector(".note");
    notes.innerHTML = "<h4>Заметки ведущего</h4>" + (note ? note.innerHTML : "<p>Без заметок.</p>");
    if (push !== false) history.replaceState(null, "", "#" + (i + 1));
  }

  function next() { show(i + 1); }
  function prev() { show(i - 1); }

  document.addEventListener("keydown", function (e) {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    switch (e.key) {
      case "ArrowRight": case "ArrowDown": case "PageDown": case " ": case "Enter": e.preventDefault(); next(); break;
      case "ArrowLeft": case "ArrowUp": case "PageUp": case "Backspace": e.preventDefault(); prev(); break;
      case "Home": show(0); break;
      case "End": show(total - 1); break;
      case "n": case "N": case "т": case "Т": notes.classList.toggle("on"); break;
      case "f": case "F": case "а": case "А": toggleFull(); break;
      case "?": case "/": help.classList.toggle("on"); break;
      case "Escape": help.classList.remove("on"); notes.classList.remove("on"); break;
    }
  });

  function toggleFull() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen && document.documentElement.requestFullscreen();
    else document.exitFullscreen && document.exitFullscreen();
  }

  document.querySelector(".nav-zone.next").addEventListener("click", next);
  document.querySelector(".nav-zone.prev").addEventListener("click", prev);
  document.querySelector(".hud .b-next").addEventListener("click", next);
  document.querySelector(".hud .b-prev").addEventListener("click", prev);
  document.querySelector(".hud .b-notes").addEventListener("click", function () { notes.classList.toggle("on"); });
  document.querySelector(".hud .b-full").addEventListener("click", toggleFull);
  document.querySelector(".hud .b-help").addEventListener("click", function () { help.classList.toggle("on"); });
  help.addEventListener("click", function () { help.classList.remove("on"); });

  let x0 = null, y0 = null;
  document.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
  document.addEventListener("touchend", function (e) {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) (dx < 0 ? next : prev)();
    x0 = y0 = null;
  }, { passive: true });

  window.addEventListener("resize", fit);
  window.addEventListener("hashchange", function () { const n = parseInt(location.hash.slice(1), 10); if (n && n - 1 !== i) show(n - 1, false); });
  fit();
  const start = parseInt(location.hash.slice(1), 10);
  show(start ? start - 1 : 0, false);
})();
