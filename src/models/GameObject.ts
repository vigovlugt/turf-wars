import { Body, BODY_TYPES, Shape } from "cannon-es";
import { Geometry, Material, Mesh } from "three";

export default class GameObject {
  public mesh: Mesh = new Mesh();
  public body: Body = new Body();
  constructor(
    geometry?: Geometry,
    material?: Material,
    shape?: Shape,
    x?: number,
    y?: number,
    z?: number
  ) {
    if (geometry) this.setGeometry(geometry);
    if (material) this.setMaterial(material);
    if (x != null && y != null && z != null) this.setPosition(x, y, z);
    if (shape) this.addShape(shape);

    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
  }

  setGeometry(geometry: Geometry) {
    this.mesh.geometry = geometry;
  }

  setMaterial(material: Material) {
    this.mesh.material = material;
  }

  setPosition(x?: number, y?: number, z?: number) {
    this.mesh.position.set(x, y, z);
    this.body.position.set(x, y, z);
  }

  setMass(mass: number) {
    this.body.mass = mass;
    if (mass > 0) {
      this.body.type = BODY_TYPES.DYNAMIC;
    }

    this.body.updateMassProperties();
  }

  addShape(shape: Shape) {
    this.body.addShape(shape);
  }

  update(dt) {}
}
