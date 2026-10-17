import { useCallback, useEffect, useState } from "react";

export function useDeck(total: number) {
  const fromHash = () => {
    const n = parseInt(location.hash.slice(1), 10);
    return Number.isFinite(n) && n >= 1 && n <= total ? n - 1 : 0;
  };
  const [i, setI] = useState(fromHash);
  const [dir, setDir] = useState(1);
  const [notes, setNotes] = useState(false);
  const [help, setHelp] = useState(false);

  const go = useCallback((n: number) => {
    setI((cur) => {
      const next = Math.max(0, Math.min(total - 1, n));
      setDir(next >= cur ? 1 : -1);
      history.replaceState(null, "", "#" + (next + 1));
      return next;
    });
  }, [total]);
  const next = useCallback(() => setI((c) => { const n = Math.min(total - 1, c + 1); setDir(1); history.replaceState(null, "", "#" + (n + 1)); return n; }), [total]);
  const prev = useCallback(() => setI((c) => { const n = Math.max(0, c - 1); setDir(-1); history.replaceState(null, "", "#" + (n + 1)); return n; }), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
      switch (e.key) {
        case "ArrowRight": case "ArrowDown": case "PageDown": case " ": case "Enter": e.preventDefault(); next(); break;
        case "ArrowLeft": case "ArrowUp": case "PageUp": case "Backspace": e.preventDefault(); prev(); break;
        case "Home": go(0); break;
        case "End": go(total - 1); break;
        case "n": case "N": case "т": case "Т": setNotes((v) => !v); break;
        case "f": case "F": case "а": case "А":
          if (!document.fullscreenElement) document.documentElement.requestFullscreen?.(); else document.exitFullscreen?.();
          break;
        case "?": case "/": setHelp((v) => !v); break;
        case "Escape": setHelp(false); setNotes(false); break;
      }
    };
    const onHash = () => { const n = fromHash(); setI(n); };
    let x0: number | null = null, y0 = 0;
    const ts = (e: TouchEvent) => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; };
    const te = (e: TouchEvent) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) (dx < 0 ? next : prev)();
      x0 = null;
    };
    addEventListener("keydown", onKey); addEventListener("hashchange", onHash);
    addEventListener("touchstart", ts, { passive: true }); addEventListener("touchend", te, { passive: true });
    return () => { removeEventListener("keydown", onKey); removeEventListener("hashchange", onHash); removeEventListener("touchstart", ts); removeEventListener("touchend", te); };
  }, [next, prev, go, total]);

  return { i, dir, next, prev, go, notes, setNotes, help, setHelp };
}

export function useScale(w = 1600, h = 900) {
  const [s, setS] = useState(1);
  useEffect(() => {
    const fit = () => setS(Math.min(innerWidth / w, innerHeight / h));
    fit(); addEventListener("resize", fit); return () => removeEventListener("resize", fit);
  }, [w, h]);
  return s;
}
