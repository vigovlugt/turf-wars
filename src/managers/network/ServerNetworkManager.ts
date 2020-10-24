import ServerGame from "../../games/ServerGame";
import socketIo, { Socket } from "socket.io";
import Player from "../../gameobjects/Player";
import MessageType from "../../constants/MessageType";

export default class ServerNetworkManager {
  public game: ServerGame;
  public io;

  constructor(game: ServerGame) {
    this.game = game;

    this.io = socketIo(game.server);

    this.io.on("connection", (socket) => this.onConnect(socket));
  }

  onConnect(socket: Socket) {
    const player = new Player(this.game);
    player.id = this.game.nextId++;
    player.setPosition(0,1,0);
    this.game.create(player);


    socket.emit(MessageType.JOIN, player.id);
  }

  update() {
    this.io.emit(MessageType.GAME_STATE, this.game.getGameState());
  }
}
