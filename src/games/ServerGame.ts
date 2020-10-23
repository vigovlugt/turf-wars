import Game from "./Game";

export default class ServerGame extends Game {
  constructor() {
    super();

    for(const go of super.getStartingGameObject()){
      this.create(go);
    }
  }

  update(dt: number) {
    super.update(dt);
  }
}
