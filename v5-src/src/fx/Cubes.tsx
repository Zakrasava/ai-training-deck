import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

export type CubeSpec = { text?: string; x: number; y: number; z?: number; size?: number; rx?: number; ry?: number; rz?: number; big?: boolean; far?: boolean };

const reduce = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

function label(text: string, big?: boolean) {
  const c = document.createElement("canvas"); c.width = 512; c.height = 512;
  const g = c.getContext("2d")!;
  g.font = (big ? "600 110px" : "600 78px") + " Onest, 'Segoe UI', sans-serif";
  g.textAlign = "center"; g.textBaseline = "middle"; g.shadowColor = "rgba(0,0,0,.6)"; g.shadowBlur = 20; g.fillStyle = "rgba(240,246,255,.97)";
  g.fillText(text, 256, 262);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}
function radial() {
  const c = document.createElement("canvas"); c.width = c.height = 256;
  const g = c.getContext("2d")!, r = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  r.addColorStop(0, "rgba(80,140,255,.55)"); r.addColorStop(1, "rgba(80,140,255,0)"); g.fillStyle = r; g.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

function mount(canvas: HTMLCanvasElement, spec: CubeSpec[]) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(2, devicePixelRatio || 1)); renderer.setSize(1600, 900, false);
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = .92; renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 16 / 9, .1, 200); camera.position.set(0, 0, 18);

  const studio = new THREE.Scene();
  const lamp = (w: number, h: number, hex: number, i: number, pos: THREE.Vector3, rot?: number) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(hex).multiplyScalar(i), side: THREE.DoubleSide }));
    m.position.copy(pos); m.lookAt(0, 0, 0); if (rot) m.rotateZ(rot); studio.add(m);
  };
  lamp(14, 5, 0x3d7bff, 1.6, new THREE.Vector3(-8, 7, 6)); lamp(3, 12, 0xeaf3ff, 1.1, new THREE.Vector3(7, 5, 7), .4);
  lamp(16, 4, 0x1b3ec9, 1.2, new THREE.Vector3(0, -8, -4)); lamp(6, 6, 0x6ccbff, 1.0, new THREE.Vector3(9, -3, 3));
  studio.add(new THREE.Mesh(new THREE.SphereGeometry(40, 16, 16), new THREE.MeshBasicMaterial({ color: 0x020510, side: THREE.BackSide })));
  const pmrem = new THREE.PMREMGenerator(renderer); scene.environment = pmrem.fromScene(studio, .02).texture;

  const key = new THREE.DirectionalLight(0xeaf3ff, 1.35); key.position.set(-6, 9, 8); scene.add(key);
  const rim = new THREE.DirectionalLight(0x4f86ff, 3.5); rim.position.set(8, -5, -4); scene.add(rim);
  const rim2 = new THREE.DirectionalLight(0x6ccbff, 2.0); rim2.position.set(-8, -2, -6); scene.add(rim2);
  scene.add(new THREE.AmbientLight(0x0b1a44, .6));

  const glass = new THREE.MeshPhysicalMaterial({ color: 0x4a8cff, metalness: 0, roughness: .34, clearcoat: .9, clearcoatRoughness: .3, envMapIntensity: .75, specularIntensity: .7, specularColor: new THREE.Color(0xdfeeff), emissive: 0x1a46c0, emissiveIntensity: .3, sheen: 1, sheenRoughness: .5, sheenColor: new THREE.Color(0x9fd0ff), transparent: true, opacity: .96 });
  const glassFar = glass.clone(); glassFar.opacity = .55; glassFar.emissiveIntensity = .18;
  const glowTex = radial();

  const items = spec.map((s, i) => {
    const size = s.size ?? 2.4;
    const mesh = new THREE.Mesh(new RoundedBoxGeometry(size, size, size * .66, 7, size * .26), s.far ? glassFar : glass);
    if (s.text) {
      const cap = new THREE.Mesh(new THREE.PlaneGeometry(size * .98, size * .98), new THREE.MeshBasicMaterial({ map: label(s.text, s.big), transparent: true, depthWrite: false, opacity: s.far ? .5 : 1 }));
      cap.position.z = size * .33 + .012; cap.renderOrder = 2; mesh.add(cap);
    }
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, transparent: true, opacity: s.far ? .35 : .9, blending: THREE.AdditiveBlending, depthWrite: false }));
    glow.scale.set(size * 3.4, size * 3.4, 1); glow.position.z = -size * .6; mesh.add(glow);
    const base = new THREE.Vector3(s.x, s.y, s.z ?? 0), rot = new THREE.Euler(s.rx ?? -.3, s.ry ?? .4, s.rz ?? -.1);
    mesh.position.copy(base); mesh.rotation.copy(rot); scene.add(mesh);
    return { mesh, base, rot, phase: i * 1.7, speed: .55 + i * .08, glow, from: new THREE.Vector3(base.x * 2.6 + (i % 2 ? 6 : -6), base.y * 2.2 + 3, -46 - i * 8), delay: .25 + i * .18 };
  });

  let raf = 0, mx = 0, my = 0; const t0 = performance.now(), tIn = performance.now();
  const onMove = (e: PointerEvent) => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; };
  addEventListener("pointermove", onMove, { passive: true });
  const ease = (k: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, k)), 3.2);
  const frame = (now: number) => {
    const t = (now - t0) / 1000 + 4, a = (now - tIn) / 1000;
    for (const u of items) {
      const k = reduce ? 1 : ease((a - u.delay) / 1.5);
      const fx = u.base.x + Math.cos(t * u.speed * .7 + u.phase) * .18, fy = u.base.y + Math.sin(t * u.speed + u.phase) * .32;
      u.mesh.position.set(u.from.x + (fx - u.from.x) * k, u.from.y + (fy - u.from.y) * k, u.from.z + (u.base.z - u.from.z) * k);
      u.mesh.rotation.x = u.rot.x + Math.sin(t * .35 + u.phase) * .16 + my * .25 + (1 - k) * 2.2;
      u.mesh.rotation.y = u.rot.y + Math.sin(t * .3 + u.phase) * .12 + mx * .35 + (1 - k) * 3;
      u.mesh.rotation.z = u.rot.z + Math.sin(t * .25 + u.phase) * .06;
      (u.glow.material as THREE.SpriteMaterial).opacity = .55 + .35 * Math.sin(t * 1.1 + u.phase);
    }
    renderer.render(scene, camera);
    if (!reduce) raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);
  return () => { cancelAnimationFrame(raf); removeEventListener("pointermove", onMove); renderer.dispose(); pmrem.dispose(); };
}

export function Cubes({ spec, className }: { spec: CubeSpec[]; className?: string }) {
  const near = useRef<HTMLCanvasElement>(null), far = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const u1 = near.current ? mount(near.current, spec.filter(s => !s.far)) : undefined;
    const f = spec.filter(s => s.far);
    const u2 = far.current && f.length ? mount(far.current, f) : undefined;
    return () => { u1?.(); u2?.(); };
  }, []);
  return (
    <>
      {spec.some(s => s.far) && <canvas ref={far} width={1600} height={900} className={"absolute inset-0 w-[1600px] h-[900px] pointer-events-none blur-[7px] opacity-85 " + (className || "")} aria-hidden />}
      <canvas ref={near} width={1600} height={900} className={"absolute inset-0 w-[1600px] h-[900px] pointer-events-none " + (className || "")} aria-hidden />
    </>
  );
}
