import { lazy, Suspense, type ComponentType } from "react";

/* Фоны из React Bits: каждый грузится отдельным чанком только на своём слайде. */
const reduce = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

function lazyBg<P extends object>(load: () => Promise<{ default: ComponentType<P> }>) {
  const C = lazy(load);
  return (props: P) => <Suspense fallback={null}><C {...props} /></Suspense>;
}

const loadSilk = () => import("@/bits/Silk/Silk");
const loadThreads = () => import("@/bits/Threads/Threads");
const loadDotGrid = () => import("@/bits/DotGrid/DotGrid");
const loadLaser = () => import("@/bits/LaserFlow/LaserFlow");

const Silk = lazyBg(loadSilk);
const Threads = lazyBg(loadThreads);
const DotGrid = lazyBg(loadDotGrid);
const Laser = lazyBg(loadLaser);

/* Разделы: синий шёлк, разворот меняется от раздела к разделу */
export const SilkBack = ({ rotation = 0.35, speed = 3 }: { rotation?: number; speed?: number }) => (
  <Silk color="#1d3fb4" sheenColor="#6ccbff" speed={reduce ? 0 : speed} scale={1.1} noiseIntensity={1.1} rotation={rotation} sheen={0.5} depth={0.6} glow={0.25} />
);

/* «Правило ноль»: тонкие нити, реагируют на курсор */
export const ThreadsBack = () => (
  <Threads color={[0.42, 0.8, 1]} accentColor={[0.87, 0.92, 1]} amplitude={reduce ? 0 : 0.9} distance={0.1} enableMouseInteraction lineCount={30} />
);

/* «Две папки»: поле точек, расходится от курсора */
export const DotGridBack = () => (
  <DotGrid dotSize={4} gap={22} baseColor="#15213d" activeColor="#6ccbff" proximity={160} shockRadius={260} shockStrength={4} returnDuration={1.4} glow={0.4} />
);

/* Финал: вертикальный луч */
export const LaserBack = () => (
  <Laser color="#6ccbff" intensity={0.9} beamWidth={0.9} flare={0.9} spread={0.8} fog={0.5} dust={0.4} speed={reduce ? 0 : 1} mouseInteraction intro />
);

/* Подтянуть чанки в простое, чтобы переход на слайд был мгновенным */
export const prefetchBits = () => {
  const run = () => { loadSilk(); loadThreads(); loadDotGrid(); loadLaser(); };
  if ("requestIdleCallback" in window) (window as Window & { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(run);
  else setTimeout(run, 2500);
};
