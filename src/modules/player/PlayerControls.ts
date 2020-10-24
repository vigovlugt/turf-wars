import * as THREE from "three";
import * as CANNON from "cannon-es";
import Player from "../../gameobjects/Player";

const SPEED = 15;
const RUN_MULTIPLIER = 1.5;
const JUMP_VELOCITY = 15;
const SENSITIVITY = 1;

export default class PlayerControls {
  private player: Player;

  private pressedKeys: string[] = [];

  private canJump = false;
  private enabled = true;

  constructor(player: Player) {
    this.player = player;

    this.setListeners();
  }

  private setListeners() {
    // Mouse

    document.addEventListener("click", (e) => {
      document.getElementsByTagName("canvas")[0].requestPointerLock();
      // document.getElementsByTagName("canvas")[0].requestFullscreen();
    });

    document.addEventListener("mousemove", (e) => this.onMouseMove(e));

    // Keys

    document.addEventListener("keydown", (e) => {
      const key = e.key.toLowerCase();
      if (!this.pressedKeys.includes(key)) this.pressedKeys.push(key);
    });

    document.addEventListener("keyup", (e) => {
      const key = e.key.toLowerCase();
      this.pressedKeys = this.pressedKeys.filter((k) => k != key);
    });

    // Body

    this.player.body.addEventListener("collide", (e: any) => this.onCollide(e));
  }

  private onMouseMove(e: MouseEvent) {
    if (!this.enabled) return;

    const movementX = e.movementX || 0;
    const movementY = e.movementY || 0;

    this.player.mesh.rotation.y -= movementX * 0.002;
    this.player.body.quaternion.setFromAxisAngle(
      new CANNON.Vec3(0, 1, 0),
      this.player.mesh.rotation.y
    );
    this.player.camera!.rotation.x -= movementY * 0.002;

    this.player.camera!.rotation.x = Math.max(
      -Math.PI / 2,
      Math.min(Math.PI / 2, this.player.camera!.rotation.x)
    );
  }

  private onCollide(e: any) {
    const contactNormal = new CANNON.Vec3(); // Normal in the contact, pointing *out* of whatever the player touched
    const upAxis = new CANNON.Vec3(0, 1, 0);

    const contact = e.contact;

    // contact.bi and contact.bj are the colliding bodies, and contact.ni is the collision normal.
    // We do not yet know which one is which! Let's check.
    if (contact.bi.id == this.player.body.id)
      // bi is the player body, flip the contact normal
      contact.ni.negate(contactNormal);
    else contactNormal.copy(contact.ni); // bi is something else. Keep the normal as it is

    // If contactNormal.dot(upAxis) is between 0 and 1, we know that the contact normal is somewhat in the up direction.
    if (contactNormal.dot(upAxis) > 0.5)
      // Use a "good" threshold value between 0 and 1 here!
      this.canJump = true;
  }

  public update(delta: number) {
    if (!this.enabled) return;

    let inputVelocity = new THREE.Vector3();
    const euler = new THREE.Euler();

    if (this.pressedKeys.includes("w")) {
      inputVelocity.z = -1;
    }

    if (this.pressedKeys.includes("s")) {
      inputVelocity.z = 1;
    }

    if (this.pressedKeys.includes("a")) {
      inputVelocity.x = -1;
    }

    if (this.pressedKeys.includes("d")) {
      inputVelocity.x = 1;
    }

    let yVelocity = -9.81 * delta;
    if (this.canJump && this.pressedKeys.includes(" ")) {
      yVelocity += JUMP_VELOCITY;
      this.canJump = false;
    }

    let speedMultiplier = 1;
    if (this.pressedKeys.includes("shift")) {
      speedMultiplier *= RUN_MULTIPLIER;
    }

    // Convert velocity to world coordinates
    euler.x = this.player.camera!.rotation.x;
    euler.y = this.player.mesh.rotation.y;
    euler.order = "XYZ";

    const quat = new THREE.Quaternion();
    quat.setFromEuler(euler);
    inputVelocity = inputVelocity
      .applyQuaternion(quat)
      .normalize()
      .multiplyScalar(SPEED * speedMultiplier * delta);

    // Add to the object
    this.player.body.velocity.x += inputVelocity.x;
    this.player.body.velocity.z += inputVelocity.z;
    this.player.body.velocity.y += yVelocity;
  }
}
