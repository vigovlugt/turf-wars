import GameObject from "../models/GameObject";
import { NaiveBroadphase, World } from "cannon-es";
import Box from "../gameobjects/Box";
import Plane from "../gameobjects/Plane";
import SnowBall from "../gameobjects/SnowBall";

export default class Game {
  private gameObjects: GameObject[] = [];
  protected world: World;

  constructor() {
    this.world = this.createPhysicsWorld();
  }

  public getStartingGameObject() {
    const snowball = new SnowBall();
    snowball.setPosition(0, 2, -2);

    const box = new Box();
    box.setPosition(0, 10, -3);

    return [box, snowball, new Plane()];
  }

  createPhysicsWorld() {
    const world = new World();
    world.gravity.set(0, -10, 0);
    world.broadphase = new NaiveBroadphase();

    return world;
  }

  create(go: GameObject) {
    this.gameObjects.push(go);
    this.world.addBody(go.body);
  }

  update(dt: number) {
    this.gameObjects.forEach((go) => go.update(dt));
  }
}
