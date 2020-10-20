import { PCFSoftShadowMap, WebGLRenderer } from "three";

export default class Renderer extends WebGLRenderer {
  constructor() {
    super({ antialias: true });
    this.setSize(window.innerWidth, window.innerHeight);
    this.setClearColor(0xffd764);
    this.shadowMap.enabled = true;
    this.shadowMap.type = PCFSoftShadowMap;
    document.body.appendChild(this.domElement);
  }
}
