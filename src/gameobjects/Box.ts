import { BoxGeometry, MeshPhongMaterial } from "three";
import GameObject from "../models/GameObject";
import { Box as BoxShape, Vec3 } from "cannon-es";

export default class Box extends GameObject {
  constructor() {
    super(
      new BoxGeometry(),
      new MeshPhongMaterial({ color: 0xff00ff }),
      new BoxShape(new Vec3(0.5, 0.5, 0.5))
    );
    this.setMass(10);
    this.setPosition(0, 10, -3);
  }
}
