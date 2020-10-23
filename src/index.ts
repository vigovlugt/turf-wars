import Renderer from "./Renderer";
import ClientGame from "./games/ClientGame";

let game = new ClientGame();
let renderer = new Renderer();

let lastTime = performance.now();

function render() {
  const now = performance.now();
  game.update((now - lastTime) / 1000);

  renderer.render(game.scene, game.camera);

  requestAnimationFrame(render);
  lastTime = now;
}

render();
