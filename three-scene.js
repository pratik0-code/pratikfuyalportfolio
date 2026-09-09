/* ==========================================================================
   Pratik Fuyal — Portfolio
   Three.js background: an animated 3D neural network (layered nodes, edges
   and signal pulses) wrapped in a wireframe cage, orbit ring and satellites,
   plus a particle field. Reacts to the mouse, the scroll position and the
   active colour theme. Sits to the right of the hero on desktop.
   ========================================================================== */

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

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

  /* Neural network ------------------------------------------------------- */
  const LAYERS = [4, 6, 6, 4];
  const LAYER_GAP = 1.35;
  const NODE_GAP = 0.62;

  const net = new THREE.Group();
  net.rotation.z = 0.12;
  spin.add(net);

  const nodeGeo = new THREE.SphereGeometry(0.085, 18, 18);
  const hiddenMat = new THREE.MeshStandardMaterial({ metalness: 0.5, roughness: 0.3 });
  const ioMat = new THREE.MeshStandardMaterial({ metalness: 0.7, roughness: 0.2 });

  const layerNodes = LAYERS.map((size, li) => {
    const nodes = [];
    for (let i = 0; i < size; i++) {
      const isIO = li === 0 || li === LAYERS.length - 1;
      const mesh = new THREE.Mesh(nodeGeo, isIO ? ioMat : hiddenMat);
      mesh.position.set(
        (li - (LAYERS.length - 1) / 2) * LAYER_GAP,
        (i - (size - 1) / 2) * NODE_GAP,
        (Math.random() - 0.5) * 0.6
      );
      mesh.userData.phase = Math.random() * Math.PI * 2;
      net.add(mesh);
      nodes.push(mesh);
    }
    return nodes;
  });
  const allNodes = layerNodes.flat();

  // Edges between consecutive layers
  const edges = [];
  const edgePositions = [];
  for (let li = 0; li < LAYERS.length - 1; li++) {
    layerNodes[li].forEach((from) => {
      layerNodes[li + 1].forEach((to) => {
        edges.push({ from, to, layer: li });
        edgePositions.push(
          from.position.x, from.position.y, from.position.z,
          to.position.x, to.position.y, to.position.z
        );
      });
    });
  }
  const edgeGeo = new THREE.BufferGeometry();
  edgeGeo.setAttribute("position", new THREE.Float32BufferAttribute(edgePositions, 3));
  const edgeMat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.22 });
  net.add(new THREE.LineSegments(edgeGeo, edgeMat));

  // Signal pulses travelling along edges, layer by layer
  const layerEdges = LAYERS.slice(0, -1).map((_, li) => edges.filter((e) => e.layer === li));
  const randomEdge = (li, fromNode) => {
    const pool = fromNode ? layerEdges[li].filter((e) => e.from === fromNode) : layerEdges[li];
    return pool[Math.floor(Math.random() * pool.length)];
  };

  const PULSES = 36;
  const pulses = [];
  const pulsePositions = new Float32Array(PULSES * 3);
  for (let i = 0; i < PULSES; i++) {
    pulses.push({
      edge: randomEdge(Math.floor(Math.random() * layerEdges.length)),
      t: Math.random(),
      speed: 0.45 + Math.random() * 0.6,
    });
  }
  const pulseGeo = new THREE.BufferGeometry();
  pulseGeo.setAttribute("position", new THREE.BufferAttribute(pulsePositions, 3));
  const pulseMat = new THREE.PointsMaterial({
    size: 0.13,
    transparent: true,
    opacity: 0.95,
    depthWrite: false,
    sizeAttenuation: true,
  });
  net.add(new THREE.Points(pulseGeo, pulseMat));

  /* Wireframe cage + orbit ring ----------------------------------------- */
  const cageMat = new THREE.MeshBasicMaterial({ wireframe: true, transparent: true, opacity: 0.16 });
  const cage = new THREE.Mesh(new THREE.IcosahedronGeometry(3.3, 1), cageMat);
  spin.add(cage);

  const ringMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.5 });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(3.8, 0.01, 8, 200), ringMat);
  ring.rotation.x = Math.PI / 2.3;
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(3.55, 0.008, 8, 200), ringMat);
  ring2.rotation.x = Math.PI / 1.7;
  ring2.rotation.y = 0.6;
  spin.add(ring, ring2);

  /* Satellites ----------------------------------------------------------- */
  const satMat = new THREE.MeshStandardMaterial({ metalness: 0.9, roughness: 0.15, flatShading: true });
  const satGeos = [
    new THREE.OctahedronGeometry(0.2),
    new THREE.TetrahedronGeometry(0.24),
    new THREE.BoxGeometry(0.26, 0.26, 0.26),
  ];
  const satellites = [];
  for (let i = 0; i < 5; i++) {
    const mesh = new THREE.Mesh(satGeos[i % satGeos.length], satMat);
    mesh.userData = {
      radius: 3.6 + (i % 2) * 0.4,
      speed: 0.22 + i * 0.06,
      phase: (i / 5) * Math.PI * 2,
      tilt: (i / 5) * Math.PI,
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
  const ambient = new THREE.AmbientLight(0xffffff, 0.7);
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

    hiddenMat.color.copy(ink);
    ioMat.color.copy(accent);
    ioMat.emissive.copy(accent).multiplyScalar(0.35);
    edgeMat.color.copy(muted);
    pulseMat.color.copy(accent);
    cageMat.color.copy(muted);
    ringMat.color.copy(accent);
    satMat.color.copy(ink);
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
      baseScale = Math.min(1, w / 1400 + 0.25);
    } else {
      rig.position.x = 0;
      baseY = -2.8;
      baseScale = 0.55;
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
  let last = 0;
  let intro = 0;
  let running = true;

  document.addEventListener("visibilitychange", () => {
    running = !document.hidden;
    if (running) {
      clock.start();
      last = 0;
      render();
    }
  });

  function updatePulses(dt) {
    pulses.forEach((p, i) => {
      p.t += dt * p.speed;
      if (p.t >= 1) {
        const nextLayer = p.edge.layer + 1;
        p.t = 0;
        p.edge = nextLayer < layerEdges.length ? randomEdge(nextLayer, p.edge.to) : randomEdge(0);
      }
      const a = p.edge.from.position;
      const b = p.edge.to.position;
      pulsePositions[i * 3] = a.x + (b.x - a.x) * p.t;
      pulsePositions[i * 3 + 1] = a.y + (b.y - a.y) * p.t;
      pulsePositions[i * 3 + 2] = a.z + (b.z - a.z) * p.t;
    });
    pulseGeo.attributes.position.needsUpdate = true;
  }

  function render() {
    if (!running) return;
    requestAnimationFrame(render);

    const t = clock.getElapsedTime();
    const dt = Math.min(t - last, 0.05);
    last = t;

    // Intro scale-in
    if (intro < 1) {
      intro = Math.min(1, intro + 0.012);
      spin.scale.setScalar(1 - Math.pow(1 - intro, 3));
    }

    smoothMouse.lerp(mouse, 0.05);

    // Network life: pulses + breathing nodes
    updatePulses(dt);
    allNodes.forEach((node) => {
      node.scale.setScalar(1 + 0.28 * Math.sin(t * 2.2 + node.userData.phase));
    });

    // Group motion: time + mouse + scroll
    spin.rotation.y = Math.sin(t * 0.25) * 0.55 + smoothMouse.x * 0.6 + scrollProgress * 1.2;
    spin.rotation.x = Math.sin(t * 0.18) * 0.18 - smoothMouse.y * 0.4 + scrollProgress * 0.5;

    cage.rotation.y = -t * 0.1;
    cage.rotation.z = t * 0.06;
    ring.rotation.z = t * 0.2;
    ring2.rotation.z = -t * 0.15;

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
