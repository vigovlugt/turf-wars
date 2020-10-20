import {
  ContactMaterial,
  GSSolver,
  Material,
  NaiveBroadphase,
  World,
} from "cannon-es";

import {
  AmbientLight,
  AxesHelper,
  DirectionalLight,
  PerspectiveCamera,
  Scene,
} from "three";

import Player from "./gameobjects/Player";
import SnowBall from "./gameobjects/SnowBall";
import GameObject from "./models/GameObject";
// @ts-ignore
import CannonDebugRenderer from "./utils/CannonDebugRenderer";

import Box from "./gameobjects/Box";
import Plane from "./gameobjects/Plane";

export default class MainScene extends Scene {
  public camera: PerspectiveCamera;
  public player: Player;
  public world: World;
  public cdr: CannonDebugRenderer;

  private gameObjects: GameObject[] = [];

  constructor() {
    super();
    this.world = this.createPhysicsWorld();

    // Box
    this.create(new Box());

    // Plane
    this.create(new Plane());

    let x = new SnowBall();
    x.setPosition(0, 2, -2);
    this.create(x);

    // Light
    this.initLights();

    // Utils
    const axesHelper = new AxesHelper(2);
    axesHelper.position.set(-5, 1, -5);
    this.add(axesHelper);

    this.player = new Player();
    this.create(this.player);
    this.camera = this.player.camera;
  }

  create(go: GameObject) {
    super.add(go.mesh);
    this.world.addBody(go.body);
    this.gameObjects.push(go);
  }

  createPhysicsWorld() {
    const world = new World();
    world.gravity.set(0, -10, 0);
    world.broadphase = new NaiveBroadphase();

    this.cdr = new CannonDebugRenderer(this, world);

    return world;
  }

  initLights() {
    const color = 0xffffff;
    const intensity = 0.7;
    const light = new AmbientLight(color, intensity);
    light.position.set(0, 5, 0);
    this.add(light);

    const light2 = new DirectionalLight(color, intensity);
    light2.position.set(3, 5, 5);
    light2.castShadow = true;
    this.add(light2);
  }

  update() {
    const dt = 1 / 144;

    // this.gameObjects.forEach((go) => {
    //   go.body.position.set(
    //     go.mesh.position.x,
    //     go.mesh.position.y,
    //     go.mesh.position.z
    //   );

    //   go.body.quaternion.set(
    //     go.mesh.quaternion.x,
    //     go.mesh.quaternion.y,
    //     go.mesh.quaternion.z,
    //     go.mesh.quaternion.w
    //   );
    // });

    this.world.step(1 / 144);

    this.gameObjects.forEach((go) => {
      go.mesh.position.copy(go.body.position as any);
      if (!(go instanceof Player))
        go.mesh.quaternion.copy(go.body.quaternion as any);
    });
    this.cdr.update();
    this.gameObjects.forEach((go) => go.update(dt));
  }
}
