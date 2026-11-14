// =========================================================
// Integra – Visor 3D (Gaussian Splat)
// Se carga SOLO cuando alguien pulsa "Ver en 3D" (no afecta la velocidad de la página).
// Usa three.js + Spark (sparkjs.dev), definidos en el importmap de index.html.
// =========================================================
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { SparkRenderer, SplatMesh } from "@sparkjsdev/spark";

let state = null; // { renderer, scene, camera, controls, mesh, ro, raf }

const modal = document.getElementById("visor3d");
const stage = modal.querySelector(".v3d-stage");
const loader = modal.querySelector(".v3d-loader");
const bar = modal.querySelector(".v3d-bar span");
const pct = modal.querySelector(".v3d-pct");
const title = modal.querySelector(".v3d-title");

function setProgress(p) {
  const v = Math.max(0, Math.min(100, Math.round(p)));
  bar.style.width = v + "%";
  pct.textContent = v + "%";
}

function showError(msg) {
  loader.hidden = false;
  loader.querySelector(".v3d-msg").innerHTML = msg;
  modal.querySelector(".v3d-progress").hidden = true;
}

export async function abrir(item) {
  cerrar(); // limpia un visor anterior
  title.textContent = item.titulo || "Vista 3D";
  loader.hidden = false;
  modal.querySelector(".v3d-progress").hidden = false;
  loader.querySelector(".v3d-msg").textContent = "Cargando cocina en 3D…";
  setProgress(0);

  const v = item.vista3d || {};
  const target = new THREE.Vector3(...(v.objetivo || [0, 0, 0]));
  const camPos = new THREE.Vector3(...(v.camara || [0, 0, 3]));

  const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0x0b1b2e, 1);
  stage.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(v.fov || 60, 1, 0.01, 100);
  camera.position.copy(camPos);

  const spark = new SparkRenderer({ renderer });
  scene.add(spark);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.copy(target);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  const dist = camPos.distanceTo(target);
  controls.minDistance = dist * (v.zoomMin ?? 0.35);
  controls.maxDistance = dist * (v.zoomMax ?? 1.4);
  // Limita el giro para no "salir" de la cocina ni verla desde abajo
  const off = camPos.clone().sub(target);
  const sph = new THREE.Spherical().setFromVector3(off);
  const giroH = THREE.MathUtils.degToRad(v.giroHorizontal ?? 70);
  const giroV = THREE.MathUtils.degToRad(v.giroVertical ?? 30);
  controls.minAzimuthAngle = sph.theta - giroH;
  controls.maxAzimuthAngle = sph.theta + giroH;
  controls.minPolarAngle = Math.max(0.05, sph.phi - giroV);
  controls.maxPolarAngle = Math.min(Math.PI - 0.05, sph.phi + giroV);
  controls.update();

  const resize = () => {
    const w = stage.clientWidth, h = stage.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // En pantallas verticales (celular) se abre el ángulo para que quepa la cocina a lo ancho
    const baseFov = v.fov || 60, refAspect = 1.3;
    camera.fov = camera.aspect >= refAspect ? baseFov
      : Math.min(85, THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(baseFov / 2)) * refAspect / camera.aspect)));
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(stage);
  resize();

  state = { renderer, scene, camera, controls, ro, mesh: null, raf: 0, camPos: camPos.clone(), target: target.clone() };
  const myState = state;

  const loop = () => {
    if (state !== myState) return;
    controls.update();
    renderer.render(scene, camera);
    myState.raf = requestAnimationFrame(loop);
  };
  loop();

  try {
    const mesh = new SplatMesh({
      url: item.modelo3d,
      onProgress: (e) => { if (e.lengthComputable) setProgress((e.loaded / e.total) * 100); },
    });
    // Rotación del modelo (los escaneos de nerfstudio vienen con Z hacia arriba)
    const r = v.rotacion || [-90, 0, 0];
    mesh.rotation.set(...r.map(THREE.MathUtils.degToRad));
    myState.mesh = mesh;
    scene.add(mesh);
    await mesh.initialized;
    if (state !== myState) return;
    setProgress(100);
    loader.hidden = true;
    requestAnimationFrame(resize); // asegura el primer cuadro dibujado
  } catch (err) {
    console.error(err);
    if (state === myState) showError("No se pudo cargar el modelo 3D.<br><small>Revisa tu conexión o intenta más tarde.</small>");
  }
}

export function cerrar() {
  if (!state) return;
  cancelAnimationFrame(state.raf);
  state.ro.disconnect();
  state.controls.dispose();
  if (state.mesh) { state.scene.remove(state.mesh); state.mesh.dispose(); }
  state.renderer.dispose();
  state.renderer.forceContextLoss?.();
  state.renderer.domElement.remove();
  state = null;
}

// Solo para ajustar la vista inicial desde la consola del navegador.
export const _estado = () => state;

export function reiniciarVista() {
  if (!state) return;
  state.camera.position.copy(state.camPos);
  state.controls.target.copy(state.target);
  state.controls.update();
}
