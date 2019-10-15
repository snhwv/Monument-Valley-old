import {
  composeObject,
  getQuaternionFromAxisAndAngle,
  getBox,
  putTop
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
  BoxGeometry
} from "three";
import { axis, unitLength } from "@/constents";
import { subtract, intersect, union } from "@/utils/bsp";
import Door from "@/components/door";
import HollowHolder from "@/components/hollowHolder";

export default class OuterPoint {
  element: Group = new Group();

  height!: number;
  door!: Door;
  doorEdge = 2;
  doorGeo!: Geometry;
  bottomMainGeo!: Geometry;
  middleMesh!: Mesh;

  constructor(height: number = 3 * unitLength) {
    this.height = height;
    this.door = new Door({
      doorHeight: this.height,
      edge: this.doorEdge,
      deep: unitLength - this.doorEdge
    });
    this.init();
  }
  init() {
    this.generator();
  }

  generator() {
    this.generateBottom();
    this.generateMiddle();
    this.generateTop();
  }
  generateBottom() {
    const mainX = 2 * unitLength;
    const mainZ = 3 * unitLength;
    this.bottomMainGeo = new BoxGeometry(mainX, this.height, mainZ);

    const material = new MeshLambertMaterial({ color: 0x00ffff });

    const subGeo = new BoxGeometry(
      2 * unitLength - this.doorEdge,
      this.height,
      3 * unitLength - this.doorEdge * 2
    );
    subGeo.translate(-this.doorEdge, -2, 0);
    this.bottomMainGeo = subtract(this.bottomMainGeo, subGeo);

    this.doorGeo = this.door.getGeometry();
    const offsetY = -unitLength / 2;
    this.cutMainGeoByDoor(
      new Vector3(mainX / 2, offsetY, unitLength),
      axis.y,
      Math.PI / 2
    );
    this.cutMainGeoByDoor(
      new Vector3(mainX / 2, offsetY, 0),
      axis.y,
      Math.PI / 2
    );
    this.cutMainGeoByDoor(
      new Vector3(mainX / 2, offsetY, -unitLength),
      axis.y,
      Math.PI / 2
    );
    this.cutMainGeoByDoor(
      new Vector3(mainX / 4, offsetY, mainZ / 2),
      axis.y,
      0
    );
    this.cutMainGeoByDoor(
      new Vector3(-mainX / 4, offsetY, mainZ / 2),
      axis.y,
      0
    );
    this.cutMainGeoByDoor(
      new Vector3(-mainX / 4, offsetY, -mainZ / 2),
      axis.y,
      0
    );
    this.cutMainGeoByDoor(
      new Vector3(mainX / 4, offsetY, -mainZ / 2),
      axis.y,
      0
    );

    const mesh = new Mesh(this.bottomMainGeo, material);
    this.element.add(mesh);
  }
  generateMiddle() {
    const mainX = 2 * unitLength;
    const mainZ = 3 * unitLength;
    let middleGeo = new BoxGeometry(mainX, this.height, mainZ);

    const material = new MeshLambertMaterial({ color: 0x00ffff });

    const doorDeep = 20;
    const doorEdge = 3;
    const doorGeo = new Door({
      edge: doorEdge,
      deep: doorDeep,
      doorHeight: 2 * unitLength
    }).getGeometry();
    composeObject(
      doorGeo,
      new Vector3(unitLength / 2 + doorEdge, -unitLength / 2, 0),
      getQuaternionFromAxisAndAngle(axis.y, Math.PI / 2)
    );
    middleGeo = subtract(middleGeo, doorGeo);
    const mesh = new Mesh(middleGeo, material);
    mesh.translateY(this.height);
    this.middleMesh = mesh;
    this.element.add(mesh);
  }
  generateTop() {
    const topHollowHolder = new HollowHolder(3 * unitLength);
    const topHollowHolderGroup = topHollowHolder.element;
    putTop(topHollowHolderGroup, this.middleMesh);
    topHollowHolderGroup.translateX(unitLength / 2);
    this.element.add(topHollowHolderGroup);
  }
  cutMainGeoByDoor(transtion: Vector3, axis: Vector3, angle: number) {
    const doorGeoClone = this.doorGeo.clone();
    composeObject(
      doorGeoClone,
      transtion,
      getQuaternionFromAxisAndAngle(axis, angle)
    );
    this.bottomMainGeo = subtract(this.bottomMainGeo, doorGeoClone);
  }
}
