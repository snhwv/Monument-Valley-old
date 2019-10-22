import { composeObject, getQuaternionFromAxisAndAngle, getBox } from "@/utils";
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
  DoubleSide
} from "three";
import { axis, unitLength } from "@/constents";
import { subtract, intersect, union } from "@/utils/bsp";

export default class Ada {
  element: Group = new Group();
  position!: Vector3;
  constructor(position: Vector3) {
    this.position = position;
    this.init();
  }
  init() {
    this.generator();
  }

  generator() {
    let geo = new BoxGeometry(10, 10, 10);
    let material = new MeshLambertMaterial({
      color: 0x03a9f4,
      side: DoubleSide
    });

    const cube = new Mesh(geo, material);
    this.element.position.add(this.position);
    this.element.add(cube);
  }
}
