import MainScene from "./MainScene";
import Renderer from "./Renderer";

let scene: MainScene;
let renderer: Renderer;

async function main() {
  scene = new MainScene();
  renderer = new Renderer();
  animate();
}

function animate() {
  scene.update();
  renderer.render(scene, scene.camera);

  requestAnimationFrame(animate);
}

main();
