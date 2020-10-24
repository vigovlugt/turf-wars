import { Body, BODY_TYPES, Shape } from "cannon-es";
import { Geometry, Material, Mesh } from "three";
import IGameObject from "../interfaces/IGameObject";
import GameObjectType from "../constants/GameObjectType";

export default class GameObject {
  public id?: number;

  public mesh: Mesh = new Mesh();
  public body: Body = new Body();

  public type = GameObjectType.EMPTY;

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

  setPosition(x: number, y: number, z: number) {
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

  update(dt: number) {}

  serialize(): IGameObject {
    const position = this.body.position;
    const quaternion = this.body.quaternion;
    return {
      type: this.type,
      id: this.id!,
      position: { x: position.x, y: position.y, z: position.z },
      rotation: {
        x: quaternion.x,
        y: quaternion.y,
        z: quaternion.z,
        w: quaternion.w,
      },
    };
  }

  sync(go:IGameObject){
    this.setPosition(
        go.position.x,
        go.position.y,
        go.position.z
    );

    this.body.quaternion.set(
        go.rotation.x,
        go.rotation.y,
        go.rotation.z,
        go.rotation.w
    );
  }
}
