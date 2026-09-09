/* ==========================================================================
   Pratik Fuyal — Portfolio
   Three.js background: a morphing metallic crystal wrapped in a wireframe
   cage, orbit rings, satellites and a particle field. Reacts to the mouse,
   the scroll position and the active colour theme.
   ========================================================================== */

import * as THREE from "three";

const canvas = document.getElementById("bg-canvas");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!canvas || reduceMotion) {
  canvas?.remove();
} else {
  initScene();
}

function cssColor(name) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return new THREE.Color(value || "#b08d57");
}

function initScene() {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 10);

  // rig: positioned by layout + scroll. spin: rotated by time + mouse.
  const rig = new THREE.Group();
  const spin = new THREE.Group();
  rig.add(spin);
  scene.add(rig);

  /* Core crystal (vertex-displaced icosahedron, flat shaded) ------------- */
  const coreGeo = new THREE.IcosahedronGeometry(1.5, 10);
  const basePositions = Float32Array.from(coreGeo.attributes.position.array);
  const coreMat = new THREE.MeshStandardMaterial({
    metalness: 0.78,
    roughness: 0.22,
    flatShading: true,
  });
  const core = new THREE.Mesh(coreGeo, coreMat);
  spin.add(core);

  /* Wireframe cage ------------------------------------------------------- */
  const cageMat = new THREE.MeshBasicMaterial({ wireframe: true, transparent: true, opacity: 0.28 });
  const cage = new THREE.Mesh(new THREE.IcosahedronGeometry(2.4, 1), cageMat);
  spin.add(cage);

  /* Orbit rings ---------------------------------------------------------- */
  const ringMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.55 });
  const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(3.1, 0.015, 320, 6, 2, 5), ringMat);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(3.7, 0.01, 8, 180), ringMat);
  ring.rotation.x = Math.PI / 2.4;
  spin.add(knot, ring);

  /* Satellites ----------------------------------------------------------- */
  const satMat = new THREE.MeshStandardMaterial({ metalness: 0.9, roughness: 0.15, flatShading: true });
  const satGeos = [
    new THREE.OctahedronGeometry(0.22),
    new THREE.TetrahedronGeometry(0.26),
    new THREE.DodecahedronGeometry(0.2),
  ];
  const satellites = [];
  for (let i = 0; i < 6; i++) {
    const mesh = new THREE.Mesh(satGeos[i % satGeos.length], satMat);
    mesh.userData = {
      radius: 3.2 + (i % 3) * 0.5,
      speed: 0.25 + i * 0.07,
      phase: (i / 6) * Math.PI * 2,
      tilt: (i / 6) * Math.PI,
    };
    satellites.push(mesh);
    spin.add(mesh);
  }

  /* Particle field ------------------------------------------------------- */
  const count = window.innerWidth < 768 ? 500 : 1400;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 5 + Math.random() * 14;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi) - 4;
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({
    size: 0.035,
    transparent: true,
    opacity: 0.6,
    sizeAttenuation: true,
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  /* Lights --------------------------------------------------------------- */
  const ambient = new THREE.AmbientLight(0xffffff, 0.6);
  const key = new THREE.PointLight(0xffffff, 60, 0, 2);
  key.position.set(4, 5, 6);
  const rim = new THREE.PointLight(0x7aa2ff, 30, 0, 2);
  rim.position.set(-6, -4, 3);
  scene.add(ambient, key, rim);

  /* Theme colours -------------------------------------------------------- */
  function applyTheme() {
    const accent = cssColor("--accent");
    const ink = cssColor("--ink");
    const muted = cssColor("--ink-muted");

    coreMat.color.copy(accent);
    coreMat.emissive.copy(accent).multiplyScalar(0.12);
    satMat.color.copy(ink);
    cageMat.color.copy(muted);
    ringMat.color.copy(accent);
    particleMat.color.copy(muted);
    key.color.copy(accent).lerp(new THREE.Color(0xffffff), 0.4);
  }
  applyTheme();
  new MutationObserver(applyTheme).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });

  /* Layout --------------------------------------------------------------- */
  let baseY = 0;
  let baseScale = 1;
  function layout() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);

    if (w > 820) {
      rig.position.x = 3.1;
      baseY = 0;
      baseScale = 1;
    } else {
      rig.position.x = 0;
      baseY = -2.8;
      baseScale = 0.6;
    }
  }
  layout();
  window.addEventListener("resize", layout);

  /* Input ---------------------------------------------------------------- */
  const mouse = new THREE.Vector2();
  const smoothMouse = new THREE.Vector2();
  window.addEventListener("pointermove", (e) => {
    mouse.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
  });

  let scrollProgress = 0;
  window.addEventListener(
    "scroll",
    () => { scrollProgress = window.scrollY / window.innerHeight; },
    { passive: true }
  );

  /* Animation ------------------------------------------------------------ */
  const clock = new THREE.Clock();
  const v = new THREE.Vector3();
  const n = new THREE.Vector3();
  let intro = 0;
  let running = true;

  document.addEventListener("visibilitychange", () => {
    running = !document.hidden;
    if (running) {
      clock.start();
      render();
    }
  });

  function displace(t) {
    const pos = coreGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      v.set(basePositions[i * 3], basePositions[i * 3 + 1], basePositions[i * 3 + 2]);
      n.copy(v).normalize();
      const d =
        1 +
        0.16 * Math.sin(n.x * 3.2 + t * 1.1) * Math.cos(n.y * 2.7 - t * 0.9) +
        0.09 * Math.sin(n.z * 4.5 + t * 1.6);
      pos.setXYZ(i, v.x * d, v.y * d, v.z * d);
    }
    pos.needsUpdate = true;
    coreGeo.computeVertexNormals();
  }

  function render() {
    if (!running) return;
    requestAnimationFrame(render);

    const t = clock.getElapsedTime();

    // Intro scale-in
    if (intro < 1) {
      intro = Math.min(1, intro + 0.012);
      const eased = 1 - Math.pow(1 - intro, 3);
      spin.scale.setScalar(eased);
    }

    smoothMouse.lerp(mouse, 0.05);
    displace(t);

    // Group motion: time + mouse + scroll
    spin.rotation.y = t * 0.18 + smoothMouse.x * 0.6 + scrollProgress * 1.2;
    spin.rotation.x = Math.sin(t * 0.15) * 0.2 - smoothMouse.y * 0.4 + scrollProgress * 0.5;

    cage.rotation.y = -t * 0.12;
    cage.rotation.z = t * 0.08;
    knot.rotation.x = t * 0.1;
    knot.rotation.y = t * 0.05;
    ring.rotation.z = t * 0.2;

    satellites.forEach((s) => {
      const { radius, speed, phase, tilt } = s.userData;
      const a = t * speed + phase;
      s.position.set(
        Math.cos(a) * radius,
        Math.sin(a) * Math.sin(tilt) * radius * 0.6,
        Math.sin(a) * Math.cos(tilt) * radius
      );
      s.rotation.x += 0.01;
      s.rotation.y += 0.015;
    });

    particles.rotation.y = t * 0.02 + scrollProgress * 0.3;
    particles.rotation.x = smoothMouse.y * 0.05;

    // Drift upward and shrink as the user scrolls past the hero
    rig.position.y = baseY + scrollProgress * 2.4;
    rig.scale.setScalar(baseScale * THREE.MathUtils.clamp(1 - scrollProgress * 0.35, 0.3, 1));

    // Subtle camera parallax
    camera.position.x += (smoothMouse.x * 0.5 - camera.position.x) * 0.05;
    camera.position.y += (smoothMouse.y * 0.35 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  spin.scale.setScalar(0);
  render();
}
