import { BoxGeometry, MeshPhongMaterial, SphereGeometry } from "three";
import GameObject from "../models/GameObject";
import { Box as BoxShape, Sphere, Vec3 } from "cannon-es";

export default class SnowBall extends GameObject {
  constructor() {
    super();
    this.setGeometry(new SphereGeometry(0.15));
    this.setMaterial(new MeshPhongMaterial({ color: 0xffffff }));
    this.addShape(new Sphere(0.15));
    this.setMass(0.5);
  }
}
