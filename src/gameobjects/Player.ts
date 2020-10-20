import { ContactMaterial, Cylinder, Material, Vec3 } from "cannon-es";
import {
  BoxGeometry,
  CylinderGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  PerspectiveCamera,
} from "three";

import GameObject from "../models/GameObject";
import { PlayerControls } from "../modules/player/PlayerControls";
import { CapsuleCollider } from "../models/colliders/CapsuleCollider";

const SPEED = 2;
const RUN_MULTIPLIER = 1.5;

export default class Player extends GameObject {
  public camera: PerspectiveCamera;
  public controls: any;

  public inputs = { vertical: 0, horizontal: 0 };
  public isSprinting = false;

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

    this.initCamera();
    this.initControls();
  }

  initControls() {
    this.body.linearDamping = 0.975;

    this.controls = new PlayerControls(this.camera, this.body);
    this.mesh.add(this.controls.getObject());
  }

  update(delta: number) {
    this.controls.update(delta);
  }

  initCamera() {
    this.camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 0.8, 0);
    // this.mesh.add(this.camera);
  }
}
