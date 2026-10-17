/* Стеклянные кубы на титуле и финале: WebGL через three.js (лежит локально в assets/vendor).
   Рисуем только когда активен слайд с холстом; при reduced-motion кадр статичный. */
(function () {
const RoundedBoxGeometry = THREE.RoundedBoxGeometry, RoomEnvironment = THREE.RoomEnvironment;

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function label(text) {
  const c = document.createElement("canvas"); c.width = 512; c.height = 512;
  const g = c.getContext("2d");
  g.clearRect(0, 0, 512, 512);
  g.font = "600 78px Onest, 'Segoe UI', sans-serif";
  g.textAlign = "center"; g.textBaseline = "middle";
  g.shadowColor = "rgba(0,0,0,.55)"; g.shadowBlur = 18;
  g.fillStyle = "rgba(240,246,255,.96)";
  g.fillText(text, 256, 262);
  const t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; t.anisotropy = 4;
  return t;
}

function mountCubes(canvas, spec) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
  } catch (e) { canvas.remove(); return { setActive() {} }; }
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.setSize(1600, 900, false);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = .92;
  renderer.outputEncoding = THREE.sRGBEncoding;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 16 / 9, .1, 100);
  camera.position.set(0, 0, 18);

  /* своя «студия»: тёмная комната с двумя синими и одной белой лампой, чтобы блики были синими, а не белой комнатой */
  const studio = new THREE.Scene();
  const lampMat = (hex, i) => new THREE.MeshBasicMaterial({ color: new THREE.Color(hex).multiplyScalar(i), side: THREE.DoubleSide });
  const addLamp = (w, h, hex, i, pos, rot) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), lampMat(hex, i)); m.position.copy(pos); m.lookAt(0, 0, 0); if (rot) m.rotateZ(rot); studio.add(m); };
  addLamp(14, 5, 0x3d7bff, 1.6, new THREE.Vector3(-8, 7, 6));
  addLamp(3, 12, 0xeaf3ff, 2.2, new THREE.Vector3(7, 5, 7), .4);
  addLamp(16, 4, 0x1b3ec9, 1.2, new THREE.Vector3(0, -8, -4));
  addLamp(6, 6, 0x6ccbff, 1.0, new THREE.Vector3(9, -3, 3));
  studio.add(new THREE.Mesh(new THREE.SphereGeometry(40, 16, 16), new THREE.MeshBasicMaterial({ color: 0x020510, side: THREE.BackSide })));
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(studio, .02).texture;

  const key = new THREE.DirectionalLight(0xdbe9ff, 1.3); key.position.set(-6, 9, 8); scene.add(key);
  const rim = new THREE.DirectionalLight(0x4f86ff, 3.5); rim.position.set(8, -5, -4); scene.add(rim);
  const rim2 = new THREE.DirectionalLight(0x6ccbff, 2.0); rim2.position.set(-8, -2, -6); scene.add(rim2);
  const fill = new THREE.PointLight(0x6ccbff, 1.4, 40, 2); fill.position.set(0, -6, 6); scene.add(fill);
  scene.add(new THREE.AmbientLight(0x0b1a44, .6));

  const glass = new THREE.MeshPhysicalMaterial({
    color: 0x0a2170, metalness: .05, roughness: .2,
    clearcoat: 1, clearcoatRoughness: .12, envMapIntensity: 1.1, specularIntensity: 1, specularColor: new THREE.Color(0x9fc4ff),
    emissive: 0x08258c, emissiveIntensity: .32, sheen: .4, sheenColor: new THREE.Color(0x6ccbff)
  });

  const group = new THREE.Group(); scene.add(group);
  const items = spec.map((s, i) => {
    const size = s.size || 2.4;
    const geo = new RoundedBoxGeometry(size, size, size * .62, 6, size * .22);
    const mesh = new THREE.Mesh(geo, glass);
    const cap = new THREE.Mesh(new THREE.PlaneGeometry(size * .98, size * .98), new THREE.MeshBasicMaterial({ map: label(s.text), transparent: true, depthWrite: false }));
    cap.position.z = size * .31 + .012;
    mesh.add(cap);
    cap.renderOrder = 2;
    mesh.position.set(s.x, s.y, s.z || 0);
    mesh.rotation.set(s.rx || -.35, s.ry || .5, s.rz || -.12);
    mesh.userData = { base: mesh.position.clone(), rot: mesh.rotation.clone(), phase: i * 1.7, speed: .55 + i * .08 };
    group.add(mesh);
    return mesh;
  });

  let active = false, raf = 0, mx = 0, my = 0, t0 = performance.now();
  window.addEventListener("pointermove", e => { mx = (e.clientX / window.innerWidth - .5); my = (e.clientY / window.innerHeight - .5); }, { passive: true });

  function frame(now) {
    const t = (now - t0) / 1000;
    items.forEach(m => {
      const u = m.userData;
      m.position.y = u.base.y + Math.sin(t * u.speed + u.phase) * .32;
      m.position.x = u.base.x + Math.cos(t * u.speed * .7 + u.phase) * .18;
      m.rotation.x = u.rot.x + Math.sin(t * .35 + u.phase) * .16 + my * .25;
      m.rotation.y = u.rot.y + t * .09 + mx * .35;
      m.rotation.z = u.rot.z + Math.sin(t * .25 + u.phase) * .06;
    });
    group.rotation.y = mx * .06; group.rotation.x = -my * .04;
    renderer.render(scene, camera);
    if (active && !reduce) raf = requestAnimationFrame(frame);
  }

  return {
    setActive(on) {
      active = on;
      cancelAnimationFrame(raf);
      if (on) { t0 = performance.now() - 4000; raf = requestAnimationFrame(frame); }
    }
  };
}

/* автоподключение: каждый <canvas class="cubes3d" data-cubes='[...]'> */
const mounts = [];
document.querySelectorAll("canvas.cubes3d").forEach(c => {
  const spec = JSON.parse(c.dataset.cubes || "[]");
  const m = mountCubes(c, spec);
  mounts.push({ el: c.closest(".slide"), m });
});
function sync() {
  mounts.forEach(x => x.m.setActive(x.el.classList.contains("is-active")));
}
new MutationObserver(sync).observe(document.querySelector(".deck"), { attributes: true, subtree: true, attributeFilter: ["class"] });
sync();
})();
