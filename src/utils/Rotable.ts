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
  element!: Group;
  plane!: Plane;
  planeNormal!: Vector3;
  rotateElement!: Group;

  // planeNormal 是全局向量
  constructor(element: Group, rotateElement: Group,planeNormal: Vector3) {
    this.element = element;
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
    SpinControl(this);
  }
}
