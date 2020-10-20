import { Cylinder, Material } from "cannon-es";
import { CylinderGeometry, MeshPhongMaterial, PerspectiveCamera } from "three";

import GameObject from "../models/GameObject";
import PlayerControls from "../modules/player/PlayerControls";

const SPEED = 2;
const RUN_MULTIPLIER = 1.5;

export default class Player extends GameObject {
  public camera: PerspectiveCamera;
  public controls: PlayerControls;
  public attack: PlayerAttack;

  constructor() {
    super(
      new CylinderGeometry(0.5, 0.5, 2, 16),
      new MeshPhongMaterial({ color: 0xffff00 }),
      new Cylinder(0.5, 0.5, 2, 16)
    );

    // this.body = new CapsuleCollider({
    //   heigth: 2,
    //   radius: 0.5,
    //   friction: 0.0,
    // }).body;
    this.body.material = new Material({ friction: 0 });

    this.setPosition(0, 2, 0);

    this.setMass(100);
    this.body.fixedRotation = true;
    this.body.updateMassProperties();

    this.camera = this.createCamera();
    this.controls = this.createControls();
  }

  createControls() {
    this.body.linearDamping = 0.975;

    return new PlayerControls(this);
  }

  update(delta: number) {
    this.controls.update(delta);
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
}
