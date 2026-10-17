/* Стеклянные кубы: WebGL через three.js (лежит локально в assets/vendor).
   При показе слайда кубы слетаются из глубины на свои места; за ними — лучи света и мягкое свечение.
   Рисуем только пока слайд активен; при reduced-motion кадр статичный. */
(function () {
  const RoundedBoxGeometry = THREE.RoundedBoxGeometry;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function label(text, big) {
    const c = document.createElement("canvas"); c.width = 512; c.height = 512;
    const g = c.getContext("2d");
    g.font = (big ? "600 110px" : "600 78px") + " Onest, 'Segoe UI', sans-serif";
    g.textAlign = "center"; g.textBaseline = "middle";
    g.shadowColor = "rgba(0,0,0,.6)"; g.shadowBlur = 20;
    g.fillStyle = "rgba(240,246,255,.97)";
    g.fillText(text, 256, 262);
    const t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; t.anisotropy = 4;
    return t;
  }
  function radial(inner, outer) {
    const c = document.createElement("canvas"); c.width = c.height = 256;
    const g = c.getContext("2d"), r = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    r.addColorStop(0, inner); r.addColorStop(1, outer); g.fillStyle = r; g.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(c);
  }
  function streakTex() {
    const c = document.createElement("canvas"); c.width = 512; c.height = 32;
    const g = c.getContext("2d"), r = g.createLinearGradient(0, 0, 512, 0);
    r.addColorStop(0, "rgba(120,170,255,0)"); r.addColorStop(.5, "rgba(180,215,255,.9)"); r.addColorStop(1, "rgba(120,170,255,0)");
    g.fillStyle = r; g.fillRect(0, 0, 512, 32);
    const v = g.createLinearGradient(0, 0, 0, 32); v.addColorStop(0, "rgba(0,0,0,1)"); v.addColorStop(.5, "rgba(0,0,0,0)"); v.addColorStop(1, "rgba(0,0,0,1)");
    g.globalCompositeOperation = "destination-out"; g.fillStyle = v; g.fillRect(0, 0, 512, 32);
    return new THREE.CanvasTexture(c);
  }
  const glowTex = radial("rgba(80,140,255,.55)", "rgba(80,140,255,0)");
  const streak = streakTex();

  function mountCubes(canvas, spec) {
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" }); }
    catch (e) { canvas.remove(); return { setActive() {} }; }
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.setSize(1600, 900, false);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = .92;
    renderer.outputEncoding = THREE.sRGBEncoding;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 16 / 9, .1, 200);
    camera.position.set(0, 0, 18);

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

    const rays = new THREE.Group(); scene.add(rays);
    for (let i = 0; i < 7; i++) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(26 + i * 4, .25 + i * .06), new THREE.MeshBasicMaterial({ map: streak, transparent: true, opacity: .18 + (i % 3) * .06, blending: THREE.AdditiveBlending, depthWrite: false }));
      m.position.set((i - 3) * 1.6, (i - 3) * 1.1 - 1, -9 - i);
      m.rotation.z = -.42 + i * .05;
      m.userData = { ph: i * 1.3, sp: .15 + i * .03, base: m.position.clone() };
      rays.add(m);
    }

    const group = new THREE.Group(); scene.add(group);
    const items = spec.map((s, i) => {
      const size = s.size || 2.4;
      const mesh = new THREE.Mesh(new RoundedBoxGeometry(size, size, size * .62, 6, size * .22), glass);
      const cap = new THREE.Mesh(new THREE.PlaneGeometry(size * .98, size * .98), new THREE.MeshBasicMaterial({ map: label(s.text, s.big), transparent: true, depthWrite: false }));
      cap.position.z = size * .31 + .012; cap.renderOrder = 2; mesh.add(cap);
      const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, transparent: true, opacity: .9, blending: THREE.AdditiveBlending, depthWrite: false }));
      glow.scale.set(size * 3.2, size * 3.2, 1); glow.position.z = -size * .6; mesh.add(glow);
      const base = new THREE.Vector3(s.x, s.y, s.z || 0);
      const rot = new THREE.Euler(s.rx == null ? -.35 : s.rx, s.ry == null ? .5 : s.ry, s.rz == null ? -.12 : s.rz);
      mesh.position.copy(base); mesh.rotation.copy(rot);
      mesh.userData = { base, rot, phase: i * 1.7, speed: .55 + i * .08, glow,
        from: new THREE.Vector3(base.x * 2.6 + (i % 2 ? 6 : -6), base.y * 2.2 + 3, -46 - i * 8), delay: .25 + i * .18 };
      group.add(mesh);
      return mesh;
    });

    let active = false, raf = 0, mx = 0, my = 0, t0 = performance.now(), tIn = 0;
    addEventListener("pointermove", e => { mx = (e.clientX / innerWidth - .5); my = (e.clientY / innerHeight - .5); }, { passive: true });
    const ease = k => 1 - Math.pow(1 - Math.min(1, Math.max(0, k)), 3.2);

    function frame(now) {
      const t = (now - t0) / 1000, a = (now - tIn) / 1000;
      items.forEach(m => {
        const u = m.userData, k = reduce ? 1 : ease((a - u.delay) / 1.5);
        const fx = u.base.x + Math.cos(t * u.speed * .7 + u.phase) * .18;
        const fy = u.base.y + Math.sin(t * u.speed + u.phase) * .32;
        m.position.set(u.from.x + (fx - u.from.x) * k, u.from.y + (fy - u.from.y) * k, u.from.z + (u.base.z - u.from.z) * k);
        m.rotation.x = u.rot.x + Math.sin(t * .35 + u.phase) * .16 + my * .25 + (1 - k) * 2.2;
        m.rotation.y = u.rot.y + t * .09 + mx * .35 + (1 - k) * 3.0;
        m.rotation.z = u.rot.z + Math.sin(t * .25 + u.phase) * .06;
        u.glow.material.opacity = .55 + .35 * Math.sin(t * 1.1 + u.phase);
      });
      rays.children.forEach(r => { const u = r.userData; r.position.x = u.base.x + Math.sin(t * u.sp + u.ph) * 3; r.material.opacity = .1 + .12 * (1 + Math.sin(t * u.sp * 2 + u.ph)) / 2; });
      group.rotation.y = mx * .06; group.rotation.x = -my * .04;
      renderer.render(scene, camera);
      if (active && !reduce) raf = requestAnimationFrame(frame);
    }
    return {
      setActive(on) {
        active = on; cancelAnimationFrame(raf);
        if (on) { t0 = performance.now() - 4000; tIn = performance.now(); raf = requestAnimationFrame(frame); }
      }
    };
  }

  const mounts = [];
  document.querySelectorAll("canvas.cubes3d").forEach(c => {
    let spec = []; try { spec = JSON.parse(c.dataset.cubes || "[]"); } catch (e) { console.error("cubes json", e); }
    mounts.push({ el: c.closest(".slide"), m: mountCubes(c, spec) });
  });
  function sync() { mounts.forEach(x => x.m.setActive(x.el.classList.contains("is-active"))); }
  document.addEventListener("slide", sync); sync();
})();
