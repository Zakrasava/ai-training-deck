import { useEffect, useRef, useState } from "react";
import { LiquidEngine, hexToRgb, type EngineOptions, type Rect } from "./engine";
import darkSrc from "./sculpture-dark.webp";

/* Обёртка над движком жидкой скульптуры (21st.dev @gughigug) для нашего холста 1600×900.
   Скульптура центрирована в полосе band; курсор превращает её в жидкость; без курсора
   «автопилот» сам слегка водит по ней, чтобы в зале было движение. */
export function LiquidSculpture({
  band = { top: 40, bottom: 640 }, scale = 1.0, autopilot = true, className = "",
  options = {},
}: { band?: { top: number; bottom: number }; scale?: number; autopilot?: boolean; className?: string; options?: Partial<EngineOptions> }) {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [gl, setGl] = useState<"on" | "off">("off");

  useEffect(() => {
    const el = root.current, cv = canvas.current;
    if (!el || !cv) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const imgBg = hexToRgb("#111110", [0.067, 0.067, 0.063]);
    const opts: EngineOptions = {
      interactive: true, strength: 1, radius: 210, density: 1, dotSize: 1, spread: 1, turbulence: 1, returnSpeed: 1,
      streaks: true, restStyle: "image", ambient: true, ambientIntensity: 0.6, speed: 1, intro: true, reducedMotion: reduced,
      bg: imgBg, imgBg, liquid: 1, ...options,
    };
    let engine: LiquidEngine | null = null;
    let dead = false;
    const fail = () => { setGl("off"); };
    try { engine = new LiquidEngine(cv, opts, fail); } catch { fail(); return; }

    const W = () => el.offsetWidth || 1600, H = () => el.offsetHeight || 900;
    let aspect = 2.5;
    const rectFor = (): Rect => {
      const w = W(), h = H();
      const bandH = Math.max(80, band.bottom - band.top);
      let rw = w * 1.02 * scale, maxH = bandH * 1.1 * scale;
      if (rw / aspect > maxH) rw = maxH * aspect;
      const rh = rw / aspect;
      return { x: w / 2 - rw / 2, y: (band.top + band.bottom) / 2 - rh / 2, w: rw, h: rh };
    };
    const resize = () => engine && engine.resize(W(), H(), rectFor());

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (dead || !engine) return;
      aspect = img.naturalWidth / img.naturalHeight;
      try { resize(); engine.setImage(img); setGl("on"); } catch { fail(); }
    };
    img.onerror = fail;
    img.src = darkSrc;

    const ro = new ResizeObserver(resize); ro.observe(el);

    // координаты указателя в логических пикселях холста (сцена масштабируется transform: scale)
    const local = (e: PointerEvent) => {
      const r = el.getBoundingClientRect(), k = r.width / (el.offsetWidth || 1);
      return { x: (e.clientX - r.left) / k, y: (e.clientY - r.top) / k };
    };
    let lastReal = 0;
    const onMove = (e: PointerEvent) => { const p = local(e); lastReal = performance.now(); engine?.pointer("move", p.x, p.y, e.pointerType === "touch"); };
    const onDown = (e: PointerEvent) => { const p = local(e); lastReal = performance.now(); engine?.pointer("down", p.x, p.y, e.pointerType === "touch"); };
    const onUp = (e: PointerEvent) => { const p = local(e); engine?.pointer("up", p.x, p.y, e.pointerType === "touch"); };
    const onLeave = () => engine?.pointer("leave", 0, 0, false);
    el.addEventListener("pointermove", onMove); el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointerup", onUp); el.addEventListener("pointerleave", onLeave);

    // автопилот: раз в ~14 с мягко проводит по скульптуре, если зритель не трогает мышь
    let raf = 0, t0 = performance.now(), phaseStart = -1;
    const auto = (now: number) => {
      raf = requestAnimationFrame(auto);
      if (!autopilot || reduced || !engine) return;
      const sinceReal = now - lastReal;
      const t = (now - t0) / 1000;
      const cycle = t % 14;
      if (sinceReal < 2500) { phaseStart = -1; return; }
      if (cycle < 5.5) {
        if (phaseStart < 0) phaseStart = now;
        const r = rectFor(), u = cycle / 5.5;
        const x = r.x + r.w * (0.15 + 0.7 * u), y = r.y + r.h * (0.5 + 0.28 * Math.sin(u * Math.PI * 2.2));
        engine.stir(x, y);
      } else if (phaseStart >= 0) { phaseStart = -1; engine.release(); }
    };
    raf = requestAnimationFrame(auto);

    return () => {
      dead = true; cancelAnimationFrame(raf); ro.disconnect();
      el.removeEventListener("pointermove", onMove); el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointerup", onUp); el.removeEventListener("pointerleave", onLeave);
      engine?.destroy();
    };
  }, []);

  return (
    <div ref={root} className={"absolute inset-0 " + className} data-gl={gl} style={{ touchAction: "pan-y" }}>
      <img src={darkSrc} alt="" aria-hidden className="absolute pointer-events-none select-none transition-opacity duration-500"
        style={{ left: "-1%", width: "102%", top: (band.top + band.bottom) / 2, transform: "translateY(-50%)", opacity: gl === "on" ? 0 : 1 }} />
      <canvas ref={canvas} className="absolute inset-0 w-full h-full block transition-opacity duration-500" style={{ opacity: gl === "on" ? 1 : 0 }} />
    </div>
  );
}
