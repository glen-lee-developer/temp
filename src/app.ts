import * as THREE from "three";
import { createCamera } from "./camera";
import { addLights } from "./lights";
import { setupControls } from "./controls";
import { setupResize } from "./resize";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";
import matcap from "../img/orange.png";
import matcap1 from "../img/purple.png";

function init(): void {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const scene = new THREE.Scene();
  const camera = createCamera();
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });

  addLights(scene);
  const controls = setupControls(camera, renderer);
  setupResize(camera, renderer);

  const myMesh = createMyMesh();
  scene.add(myMesh);

  animate(renderer, scene, camera, myMesh);
}

//  Test Mesh
function createMyMesh(): THREE.Mesh {
  const geometry = new THREE.PlaneGeometry(700, 700, 50, 50);
  const material = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    uniforms: {
      time: { value: 0 },
      resolution: { value: new THREE.Vector4() },
      matcap: { value: new THREE.TextureLoader().load(matcap) },
      matcap1: { value: new THREE.TextureLoader().load(matcap1) },
      mouse: { value: new THREE.Vector2(0, 0) },
    },
    vertexShader,
    fragmentShader,
  });
  return new THREE.Mesh(geometry, material);
}

let mouse = new THREE.Vector2();
function mouseEvents(): void {
  document.addEventListener("mousemove", (event: MouseEvent) => {
    mouse.x = event.pageX / window.innerWidth - 0.5;
    mouse.y = -event.pageY / window.innerHeight + 0.5;
  });
}
mouseEvents();

//  Animate
function animate(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.OrthographicCamera | THREE.PerspectiveCamera,
  myMesh: THREE.Mesh
): void {
  function animateFrame(): void {
    requestAnimationFrame(animateFrame);
    (myMesh.material as THREE.ShaderMaterial).uniforms.time.value += 0.01;
    (myMesh.material as THREE.ShaderMaterial).uniforms.mouse.value = mouse;

    renderer.render(scene, camera);
  }
  animateFrame();
}

init();
