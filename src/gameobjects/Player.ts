import { Cylinder, Material } from "cannon-es";
import {
  CylinderGeometry,
  MeshPhongMaterial,
  PerspectiveCamera,
  Scene,
} from "three";

import GameObject from "../models/GameObject";
import PlayerControls from "../modules/player/PlayerControls";
import PlayerSnowball from "../modules/player/PlayerSnowball";
import Game from "../games/Game";
import ClientGame from "../games/ClientGame";
import GameObjectType from "../constants/GameObjectType";
import IGameObject from "../interfaces/IGameObject";

const SPEED = 2;
const RUN_MULTIPLIER = 1.5;

export default class Player extends GameObject {
  public type = GameObjectType.PLAYER;

  public camera?: PerspectiveCamera;
  public game: Game;
  public controls?: PlayerControls;
  public snowball?: PlayerSnowball;

  public isLocalPlayer: boolean = false;

  constructor(game: Game) {
    super(
      new CylinderGeometry(0.5, 0.5, 2, 16),
      new MeshPhongMaterial({ color: 0xffff00 }),
      new Cylinder(0.5, 0.5, 2, 16)
    );

    this.game = game;

    // this.body = new CapsuleCollider({
    //   heigth: 2,
    //   radius: 0.5,
    //   friction: 0.0,
    // }).body;
    this.body.material = new Material({ friction: 0 });

    this.setPosition(0, 2, 0);

    this.setMass(100);
    this.body.linearDamping = 0.99;
    this.body.fixedRotation = true;
    this.body.updateMassProperties();
  }

  initLocalPlayer() {
    this.isLocalPlayer = true;
    this.camera = this.createCamera();
    this.controls = new PlayerControls(this);
    // this.snowball = new PlayerSnowball(this);
    (this.game as ClientGame).player = this;
    (this.game as ClientGame).camera = this.camera;
  }

  update(delta: number) {
    if (this.isLocalPlayer) {
      this.controls!.update(delta);
      // this.snowball!.update(delta);
    }
  }

  createCamera() {
    const camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    camera.position.set(0, 0.8, 0);
    this.mesh.add(camera);

    return camera;
  }

  sync(go: IGameObject) {
    if (!this.isLocalPlayer) {
      super.sync(go);
    }
  }
}
