import { BoxGeometry, Mesh, MeshPhongMaterial } from "three";
import GameObject from "../models/GameObject";
import { Body, BODY_TYPES, Box as BoxShape, Vec3 } from "cannon-es";

export default class Box extends GameObject {
  constructor() {
    super(
      new BoxGeometry(),
      new MeshPhongMaterial({ color: 0xff00ff }),
      new BoxShape(new Vec3(0.5, 0.5, 0.5)),
      0,
      10,
      -3
    );
    this.setMass(10);
    this.setPosition(0, 10, -3);
  }

  update(dt) {
    console.log();
  }
}
