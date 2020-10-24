import express from "express";
import http from "http";
import cors from "cors";
import ServerGame from "./games/ServerGame";
import { join } from "path";
import { performance } from "perf_hooks";
// Express setup

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.static(join(__dirname, "..", "dist")));

// Game setup

const game = new ServerGame(server);

let lastTime = performance.now();

setInterval(() => {
  const now = performance.now();
  game.update((now - lastTime) / 1000);
  lastTime = now;
}, (1 / 60) * 1000);

server.listen(3000, () => {
  console.log("listening on port 3000");
});
