import io from "socket.io-client";

import MessageType from "../../constants/MessageType";
import IGameState from "../../interfaces/IGameState";

import ClientGame from "../../games/ClientGame";

export default class ClientNetworkManager {
  private socket: SocketIOClient.Socket;
  public game: ClientGame;

  public localPlayerId?: number;

  constructor(game: ClientGame) {
    this.game = game;

    this.socket = io();

    this.socket.on(MessageType.JOIN, (id: number) => this.onJoin(id));
  }

  onJoin(id: number) {
    this.localPlayerId = id;

    console.log("JOIN " + id);

    this.socket.on(MessageType.GAME_STATE, (gameState: IGameState) =>
      this.onGameState(gameState)
    );
  }

  onGameState(gameState: IGameState) {
    gameState.gameObjects.forEach((go) => {
      const localGameObject = this.game.gameObjects.find((g) => g.id === go.id);
      if (localGameObject == undefined) {
        this.game.createIGameObject(go);
      } else {
        localGameObject.sync(go);
      }
    });
  }

  onConnect() {}
}
