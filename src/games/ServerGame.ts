import Game from "./Game";
import { Server } from "http";
import ServerNetworkManager from "../managers/network/ServerNetworkManager";

export default class ServerGame extends Game {
  public nextId: number = 0;
  public server: Server;

  public networkManager: ServerNetworkManager;

  constructor(server: Server) {
    super();
    this.server = server;
    this.networkManager = new ServerNetworkManager(this);

    for (const go of super.getStartingGameObject()) {
      this.create(go);
    }
  }

  update(dt: number) {
    super.update(dt);
    this.networkManager.update();
  }

  getGameState() {
    return {
      gameObjects: this.gameObjects
        .filter((go) => go.id != undefined)
        .map((go) => go.serialize()),
    };
  }
}
