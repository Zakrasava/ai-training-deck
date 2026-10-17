import { GodRays, MeshGradient, GrainGradient, NeuroNoise, Warp } from "@paper-design/shaders-react";

const reduce = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
const sp = (v: number) => (reduce ? 0 : v);
const full = { position: "absolute" as const, inset: 0, width: "100%", height: "100%" };

/* Титул: лучи света из глубины, синие, как свечение на главной референса */
export const HeroRays = () => (
  <GodRays style={full} colorBack="#05070b" colorBloom="#2f63f5" colors={["#2f63f5", "#0d1c44", "#6ccbff", "#1b3ec9"]}
    density={0.35} intensity={0.42} bloom={0.25} spotty={0.45} midSize={0.2} midIntensity={0.35} speed={sp(0.35)} offsetY={-0.9} />
);

/* Разделы: тягучий тёмно-синий градиент */
export const SectionMesh = () => (
  <MeshGradient style={full} colors={["#05070b", "#070d1f", "#0d1c44", "#05070b", "#132a6e"]} distortion={0.9} swirl={0.6} grainMixer={0.1} grainOverlay={0.05} speed={sp(0.35)} />
);

/* Карта ступеней: нейро-сеть */
export const NeuroBack = () => (
  <NeuroNoise style={full} colorFront="#2f63f5" colorMid="#0d1c44" colorBack="#05070b" brightness={0.1} contrast={0.6} scale={1.1} speed={sp(0.5)} />
);

/* Финал: зернистая волна */
export const FinalGrain = () => (
  <GrainGradient style={full} colorBack="#05070b" colors={["#0d1c44", "#1b3ec9", "#2f63f5"]} softness={0.9} intensity={0.3} noise={0.25} shape="wave" speed={sp(0.6)} />
);

/* Запас: искажённые полосы */
export const WarpBack = () => (
  <Warp style={full} colors={["#05070b", "#0d1c44", "#2f63f5", "#6ccbff"]} proportion={0.4} softness={0.9} shape="stripes" shapeScale={0.5} distortion={0.2} swirl={0.6} swirlIterations={8} speed={sp(0.4)} />
);
