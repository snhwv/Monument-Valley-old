import {
  composeObject,
  getQuaternionFromAxisAndAngle,
  getBox,
  putTop,
  squarePositionGenerator
} from "@/utils";
import {
  CylinderBufferGeometry,
  MeshLambertMaterial,
  Mesh,
  Group,
  Vector3,
  Quaternion,
  Shape,
  ExtrudeGeometry,
  MeshPhongMaterial,
  Vector2,
  Geometry,
  Curve,
  BoxBufferGeometry,
  MeshBasicMaterial,
  OctahedronBufferGeometry,
  OctahedronGeometry,
  BoxGeometry,
  Plane
} from "three";
import { axis, unitLength } from "@/constents";
import { subtract, intersect, union } from "@/utils/bsp";
import Door from "@/components/door";
import HollowHolder from "@/components/hollowHolder";
import { SpinControl } from "./SpinControl";

export default class Rotable {
  element: Group = new Group();
  plane!: Plane;
  planeNormal!: Vector3;
  rotateElement!: Group;

  animationEndCallbacks:(() => void)[] = [];
  animationStartCallbacks:(() => void)[] = [];

  // planeNormal 是全局向量
  constructor(element: Group, rotateElement: Group, planeNormal: Vector3,positionFactor: Vector3 = new Vector3()) {
    this.changeOrigin(element,positionFactor);
    
    this.rotateElement = rotateElement;
    this.planeNormal = planeNormal;
    this.init();
  }
  init() {
    const distance = 0;
    this.plane = new Plane(axis.y.clone(), distance);
    this.rotateElement.updateMatrixWorld();
    this.plane.applyMatrix4(this.rotateElement.matrixWorld);
    this.plane.normal = this.planeNormal;
  }
  // 为了旋转原点可改变，使用positionFactor来调整，因为有的旋转并不是以inGroup的中心作为原点旋转的
  changeOrigin(inGroup: Group,positionFactor: Vector3) {
    const box = getBox(inGroup);

    const center = new Vector3();
    center.addVectors(box.min, box.max);
    center.multiplyScalar(0.5);
    center.sub(positionFactor);

    // 减去中心，让group的中心是原点，所以group的旋转基点是原点，就是正确的
    inGroup.position.sub(center);
    
    // 减去中心，让group的中心是原点，所以group的旋转基点是原点，就是正确的
    this.element.position.copy(center);

    this.element.add(inGroup);
  }
}
