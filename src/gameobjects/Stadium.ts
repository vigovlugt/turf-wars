import GameObject from "../models/GameObject";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
export default class Stadium {
  constructor() {}

  async load() {
    // Instantiate a loader
    var loader = new GLTFLoader();

    await loader.loadAsync("models");
  }
}
