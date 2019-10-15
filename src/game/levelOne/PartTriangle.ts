import {
  composeObject,
  getQuaternionFromAxisAndAngle,
  getBox,
  putTop,
  squarePositionGenerator,
  putBottom
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

export default class PartTriangle {
  element: Group = new Group();
  relativeCube!: Mesh;
  constructor() {
    this.init();
  }
  init() {
    this.generator();
  }

  generator() {
    this.generateRelativeCube();
    this.generateBase();
    this.generatePartTriangle();
  }

  generateRelativeCube() {
    let geometry = new BoxGeometry(unitLength, unitLength, unitLength);
    let material = new MeshLambertMaterial({ color: 0x00ff00 });
    const cube = new Mesh(geometry, material);
    cube.position.add(
      new Vector3(
        0,
        8 * unitLength + unitLength / 2,
        -(7 * unitLength)
      )
    );
    this.relativeCube = cube;
    this.element.add(this.relativeCube);
  }
  generateBase() {
    const topHollowHolder = new HollowHolder(6 * unitLength, 5 * unitLength);
    const topHollowHolderGroup = topHollowHolder.element;
    putBottom(topHollowHolderGroup, this.relativeCube);
    this.element.add(topHollowHolderGroup);
  }

  generatePartTriangle() {
      const group1 = new Group();
      const group2 = new Group();
      let geometry = new BoxGeometry(unitLength, unitLength, unitLength);
      let material = new MeshLambertMaterial({ color: 0x00ff00 });
      const mesh = new Mesh(geometry, material);
      for (let i = 0; i < 3; i++) {
        const cloneMesh = mesh.clone();
        cloneMesh.translateX(i * unitLength);
        group1.add(cloneMesh);
      }
      group1.position.add(this.relativeCube.position);
      group1.translateX(-3 *unitLength);
      for (let i = 0; i < 3; i++) {
        const cloneMesh = mesh.clone();
        cloneMesh.translateZ(i * unitLength);
        group2.add(cloneMesh);
      }
      group2.position.add(this.relativeCube.position);
      group2.translateZ(unitLength);
      this.element.add(group1);
      this.element.add(group2);
  }
}
