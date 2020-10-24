import Player from "../../gameobjects/Player";
import { Object3D, Quaternion, Vector3 } from "three";
import SnowBall from "../../gameobjects/SnowBall";
import { Vec3 } from "cannon-es";

const MIN_CHARGE = 10;
const MAX_CHARGE = 20;
const CHARGE_RATE = 10;

export default class PlayerSnowball {
  private player: Player;
  private throwPos: Object3D;
  private chargeBar: HTMLDivElement;

  private mouseDown: boolean = false;
  private charge: number = 0;

  constructor(player: Player) {
    this.player = player;
    this.setListeners();
    this.throwPos = this.createThrowPositionObject();
    this.chargeBar = PlayerSnowball.createUI();
  }

  private setListeners() {
    document.addEventListener("mousedown", () => (this.mouseDown = true));
    document.addEventListener("mouseup", () => this.onMouseUp());
  }

  private createThrowPositionObject() {
    const throwPos = new Object3D();
    // const throwPos = new Mesh(
    //   new SphereGeometry(0.15),
    //   new MeshPhongMaterial({ color: 0xffffff })
    // );
    this.player.camera.add(throwPos);
    throwPos.position.set(0, 0, -1);

    return throwPos;
  }

  private static createUI() {
    document.body.innerHTML += ` <div class="snowball-charge-container">
            <div class="snowball-charge"></div>
        </div>`;

    return document.body.querySelector(".snowball-charge") as HTMLDivElement;
  }

  private updateUI(charge: number) {
    this.chargeBar.style.width = `${(charge / MAX_CHARGE) * 100}%`;
  }

  public onMouseUp() {
    this.mouseDown = false;

    if (this.charge > MIN_CHARGE) {
      this.throwSnowball(Math.min(this.charge, MAX_CHARGE));
    }

    this.charge = 0;
    this.updateUI(this.charge);
  }

  public update(delta: number) {
    if (this.mouseDown && this.charge < MAX_CHARGE) {
      this.charge += CHARGE_RATE * delta;
      this.updateUI(this.charge);
    }
  }

  private throwSnowball(charge: number) {
    const snowball = new SnowBall();

    const pos = this.throwPos.getWorldPosition(new Vector3());
    snowball.setPosition(pos.x, pos.y, pos.z);

    const rotation = this.throwPos.getWorldQuaternion(new Quaternion());
    snowball.body.quaternion.copy(rotation as any);

    const localVelocity = new Vec3(0, 0, -charge);
    const worldVelocity = snowball.body.quaternion.vmult(localVelocity);
    snowball.body.velocity.copy(worldVelocity);

    this.player.game.create(snowball);
  }
}
