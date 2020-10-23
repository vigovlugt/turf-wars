import express from "express";
import http from "http";
import socketIo, { Socket } from "socket.io";
import ServerGame from "./games/ServerGame";

// Express setup

const app = express();
const server = http.createServer(app);

app.use(express.static("../dist"));

// Game setup

const scene = new ServerGame();

// SocketIO setup
const io = socketIo(server);

io.on("connection", (socket) => {
  console.log("a user connected");
});

server.listen(3000, () => {
  console.log("listening on port 3000");
});
