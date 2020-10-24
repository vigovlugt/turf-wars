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
import IGameObject from "../interfaces/IGameObject";
import GameObjectType from "../constants/GameObjectType";
import ClientNetworkManager from "../managers/network/ClientNetworkManager";

export default class ClientGame extends Game {
  public scene: Scene;

  public camera: PerspectiveCamera;
  public player?: Player;
  public cdr: CannonDebugRenderer;

  public networkManager: ClientNetworkManager;

  constructor() {
    super();
    this.scene = this.createScene();
    this.world = this.createPhysicsWorld();
    this.networkManager = new ClientNetworkManager(this);

    this.camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    this.camera.position.set(0, 0.8, 5);

    for (const go of super.getStartingGameObject()) {
      this.create(go);
    }

    // Light
    this.initLights();

    // Utils
    const axesHelper = new AxesHelper(2);
    axesHelper.position.set(-5, 1, -5);
    this.scene.add(axesHelper);
  }

  createPhysicsWorld() {
    const world = super.createPhysicsWorld();
    this.cdr = new CannonDebugRenderer(this.scene, world);

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

  public create(go: GameObject) {
    super.create(go);
    this.scene.add(go.mesh);
  }

  update(dt: number) {
    super.update(dt);
    this.cdr.update();
    this.sync();
  }

  sync() {
    this.gameObjects.forEach((go) => {
      go.mesh.position.copy(go.body.position as any);
      if (!(go instanceof Player))
        go.mesh.quaternion.copy(go.body.quaternion as any);
    });
  }

  createIGameObject(go: IGameObject) {
    if (go.type == GameObjectType.PLAYER) {
      const player = new Player(this);
      player.id = go.id;
      player.setPosition(go.position.x, go.position.y, go.position.z);
      if (go.id == this.networkManager.localPlayerId) {
        player.initLocalPlayer();
      }
      this.create(player);
    }
  }
}
