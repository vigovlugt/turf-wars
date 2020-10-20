import { Box, Material, Vec3 } from "cannon-es";
import {
  BoxGeometry,
  Matrix4,
  Mesh,
  MeshPhongMaterial,
  PlaneGeometry,
  Vector3,
} from "three";
import { Plane as PlaneShape } from "cannon-es";
import GameObject from "../models/GameObject";

export default class Plane extends GameObject {
  constructor() {
    super(
      new PlaneGeometry(300, 300, 50, 50),
      new MeshPhongMaterial({ color: 0xf88070 }),
      new PlaneShape()
    );
    this.body.quaternion.setFromAxisAngle(new Vec3(1, 0, 0), -Math.PI / 2);
    this.mesh.quaternion.setFromAxisAngle(new Vector3(1, 0, 0), -Math.PI / 2);
    this.body.material = new Material({ friction: 0 });
  }
}
