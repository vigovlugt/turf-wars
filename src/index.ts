import MainScene from "./MainScene";
import Renderer from "./Renderer";

let scene: MainScene;
let renderer: Renderer;

async function main() {
  scene = new MainScene();
  renderer = new Renderer();
  animate();
}

let lastTime = performance.now();

function animate() {
  const currentTime = performance.now();
  scene.update((currentTime - lastTime) / 1000);
  renderer.render(scene, scene.camera);

  requestAnimationFrame(animate);
  lastTime = currentTime;
}

main();
