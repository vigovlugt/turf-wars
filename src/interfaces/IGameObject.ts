import IVector from "./IVector";
import IQuaternion from "./IQuaternion";
import GameObjectType from "../constants/GameObjectType";

export default interface IGameObject {
  id: number;
  type: GameObjectType;
  position: IVector;
  rotation: IQuaternion;
}
