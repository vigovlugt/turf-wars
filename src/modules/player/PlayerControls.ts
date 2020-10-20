import * as THREE from "three";
import * as CANNON from "cannon-es";
import Player from "../../gameobjects/Player";

const SPEED = 10;
const JUMP_VELOCITY = 10;
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
      this.pressedKeys.push(e.key);
    });

    document.addEventListener("keyup", (e) => {
      this.pressedKeys = this.pressedKeys.filter((key) => key != e.key);
    });

    // Body

    this.player.body.addEventListener("collide", (e: any) => this.onCollide(e));
  }

  private onMouseMove(e: MouseEvent) {
    if (!this.enabled) return;

    const movementX = e.movementX || 0;
    const movementY = e.movementY || 0;

    this.player.mesh.rotation.y -= movementX * 0.002;
    this.player.body.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0), this.player.mesh.rotation.y);
    this.player.camera.rotation.x -= movementY * 0.002;

    this.player.camera.rotation.x = Math.max(
      -Math.PI / 2,
      Math.min(Math.PI / 2, this.player.camera.rotation.x)
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

    var inputVelocity = new THREE.Vector3();
    var euler = new THREE.Euler();

    if (this.pressedKeys.includes("w")) {
      inputVelocity.z = -SPEED * delta;
    }

    if (this.pressedKeys.includes("s")) {
      inputVelocity.z = SPEED * delta;
    }

    if (this.pressedKeys.includes("a")) {
      inputVelocity.x = -SPEED * delta;
    }

    if (this.pressedKeys.includes("d")) {
      inputVelocity.x = SPEED * delta;
    }

    // Convert velocity to world coordinates
    euler.x = this.player.camera.rotation.x;
    euler.y = this.player.mesh.rotation.y;
    euler.order = "XYZ";

    const quat = new THREE.Quaternion();
    quat.setFromEuler(euler);
    inputVelocity.applyQuaternion(quat);
    //quat.multiplyVector3(inputVelocity);

    // Add to the object
    this.player.body.velocity.x += inputVelocity.x;
    this.player.body.velocity.z += inputVelocity.z;
  }
}

// var PlayeControls = function (camera, cannonBody) {
//   var eyeYPos = 2; // eyes are 2 meters above the ground
//   var velocityFactor = 10;
//   var jumpVelocity = 10;
//   var scope = this;
//
//   var pitchObject = new THREE.Object3D();
//   pitchObject.add(camera);
//
//   var yawObject = new THREE.Object3D();
//   yawObject.add(pitchObject);
//
//   var quat = new THREE.Quaternion();
//
//   var moveForward = false;
//   var moveBackward = false;
//   var moveLeft = false;
//   var moveRight = false;
//
//   var canJump = false;
//
//   var contactNormal = new CANNON.Vec3(); // Normal in the contact, pointing *out* of whatever the player touched
//   var upAxis = new CANNON.Vec3(0, 1, 0);
//   cannonBody.addEventListener("collide", function (e) {
//     var contact = e.contact;
//
//     // contact.bi and contact.bj are the colliding bodies, and contact.ni is the collision normal.
//     // We do not yet know which one is which! Let's check.
//     if (contact.bi.id == cannonBody.id)
//       // bi is the player body, flip the contact normal
//       contact.ni.negate(contactNormal);
//     else contactNormal.copy(contact.ni); // bi is something else. Keep the normal as it is
//
//     // If contactNormal.dot(upAxis) is between 0 and 1, we know that the contact normal is somewhat in the up direction.
//     if (contactNormal.dot(upAxis) > 0.5)
//       // Use a "good" threshold value between 0 and 1 here!
//       canJump = true;
//   });
//
//   var velocity = cannonBody.velocity;
//
//   var PI_2 = Math.PI / 2;
//
//   var onMouseMove = function (event) {
//     if (scope.enabled === false) return;
//
//     var movementX =
//       event.movementX || event.mozMovementX || event.webkitMovementX || 0;
//     var movementY =
//       event.movementY || event.mozMovementY || event.webkitMovementY || 0;
//
//     yawObject.rotation.y -= movementX * 0.002;
//     pitchObject.rotation.x -= movementY * 0.002;
//
//     pitchObject.rotation.x = Math.max(
//       -PI_2,
//       Math.min(PI_2, pitchObject.rotation.x)
//     );
//   };
//
//   var onKeyDown = function (event) {
//     switch (event.keyCode) {
//       case 38: // up
//       case 87: // w
//         moveForward = true;
//         break;
//
//       case 37: // left
//       case 65: // a
//         moveLeft = true;
//         break;
//
//       case 40: // down
//       case 83: // s
//         moveBackward = true;
//         break;
//
//       case 39: // right
//       case 68: // d
//         moveRight = true;
//         break;
//
//       case 32: // space
//         if (canJump === true) {
//           velocity.y = jumpVelocity;
//         }
//         canJump = false;
//         break;
//     }
//   };
//
//   var onKeyUp = function (event) {
//     switch (event.keyCode) {
//       case 38: // up
//       case 87: // w
//         moveForward = false;
//         break;
//
//       case 37: // left
//       case 65: // a
//         moveLeft = false;
//         break;
//
//       case 40: // down
//       case 83: // a
//         moveBackward = false;
//         break;
//
//       case 39: // right
//       case 68: // d
//         moveRight = false;
//         break;
//     }
//   };
//
//   document.addEventListener("mousemove", onMouseMove, false);
//   document.addEventListener("keydown", onKeyDown, false);
//   document.addEventListener("keyup", onKeyUp, false);
//
//   this.enabled = true;
//
//   this.getObject = function () {
//     return yawObject;
//   };
//
//   this.getDirection = function (targetVec) {
//     targetVec.set(0, 0, -1);
//     quat.multiplyVector3(targetVec);
//   };
//
//   // Moves the camera to the Cannon.js object position and adds velocity to the object if the run key is down
//   var inputVelocity = new THREE.Vector3();
//   var euler = new THREE.Euler();
//   this.update = function (delta) {
//     if (scope.enabled === false) return;
//
//     inputVelocity.set(0, 0, 0);
//
//     if (moveForward) {
//       inputVelocity.z = -velocityFactor * delta;
//     }
//     if (moveBackward) {
//       inputVelocity.z = velocityFactor * delta;
//     }
//
//     if (moveLeft) {
//       inputVelocity.x = -velocityFactor * delta;
//     }
//     if (moveRight) {
//       inputVelocity.x = velocityFactor * delta;
//     }
//
//     // Convert velocity to world coordinates
//     euler.x = pitchObject.rotation.x;
//     euler.y = yawObject.rotation.y;
//     euler.order = "XYZ";
//     quat.setFromEuler(euler);
//     inputVelocity.applyQuaternion(quat);
//     //quat.multiplyVector3(inputVelocity);
//
//     // Add to the object
//     velocity.x += inputVelocity.x;
//     velocity.z += inputVelocity.z;
//   };
// };
