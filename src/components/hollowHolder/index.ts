import { composeObject, getQuaternionFromAxisAndAngle } from "@/utils";
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
  BoxGeometry
} from "three";
import { axis, unitLength } from "@/constents";
import { subtract, intersect, union } from "@/utils/bsp";
import Door from "../door";

export default class HollowHolder {
  element: Group = new Group();

  height!: number;
  door!: Door;

  constructor(
    height: number = 3 * unitLength,
    doorHeight: number = 2 * unitLength
  ) {
    this.height = height;
    this.door = new Door({ doorHeight, deep: unitLength });
    this.init();
  }
  init() {
    this.generator();
  }

  generator() {
    this.generateShape();
  }
  generateShape() {
    const mainGeo = new BoxGeometry(unitLength, this.height, unitLength);

    const material = new MeshLambertMaterial({ color: 0x00ffff });

    const doorGeo = this.door.getGeometry();
    const doorGeox = this.door.getGeometry().clone();

    composeObject(
      doorGeox,
      new Vector3(),
      getQuaternionFromAxisAndAngle(axis.y, Math.PI / 2)
    );

    const subGeo = new BoxGeometry(
      this.door.doorWidth,
      this.door.height,
      this.door.doorWidth
    );

    doorGeo.translate(0, -(this.height - this.door.height) / 2, 0);
    doorGeox.translate(0, -(this.height - this.door.height) / 2, 0);
    subGeo.translate(0, -(this.height - this.door.height) / 2, 0);
    const resultx = subtract(
      subtract(subtract(mainGeo, doorGeo), doorGeox),
      subGeo
    );
    const mesh = new Mesh(resultx, material);
    this.element.add(mesh);
  }
}
