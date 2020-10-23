import {
  AmbientLight,
  AxesHelper,
  DirectionalLight,
  PerspectiveCamera,
  Scene,
} from "three";

import Player from "../gameobjects/Player";
import GameObject from "../models/GameObject";

// @ts-ignore
import CannonDebugRenderer from "../utils/CannonDebugRenderer";

import Game from "./Game";

export default class ClientGame extends Game {
  public scene: Scene;

  public camera: PerspectiveCamera;
  public player: Player;
  public cdr: CannonDebugRenderer;

  constructor() {
    super();
    this.world = this.createPhysicsWorld();
    this.scene = this.createScene();

    for(const go of super.getStartingGameObject()){
      this.create(go);
    }

    // Light
    this.initLights();

    // Utils
    const axesHelper = new AxesHelper(2);
    axesHelper.position.set(-5, 1, -5);
    this.scene.add(axesHelper);

    this.player = new Player();
    this.create(this.player);
    this.camera = this.player.camera;
  }

  createPhysicsWorld() {
    const world = super.createPhysicsWorld();
    this.cdr = new CannonDebugRenderer(this, world);

    return world;
  }

  createScene() {
    return new Scene();
  }

  initLights() {
    const color = 0xffffff;
    const intensity = 0.7;
    const light = new AmbientLight(color, intensity);
    light.position.set(0, 5, 0);
    this.scene.add(light);

    const light2 = new DirectionalLight(color, intensity);
    light2.position.set(3, 5, 5);
    light2.castShadow = true;
    this.scene.add(light2);
  }

  create(go: GameObject) {
    super.create(go);
    this.scene.add(go.mesh);
  }

  update(dt: number) {
    super.update(dt);
    this.cdr.update();
  }
}
