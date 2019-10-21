import {
  composeObject,
  getQuaternionFromAxisAndAngle,
  getBox,
  putTop,
  squarePositionGenerator,
  putBottom,
  walkPlaneCreator
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
import { camera, scene } from "../base";

export default class PartTriangle {
  element: Group = new Group();
  relativeCube!: Mesh;
  groupTwo!: Group;
  coverCubes: Mesh[] = [];
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

    const plane = walkPlaneCreator(unitLength, unitLength);
    plane.userData.belongGroup = "partTriangleTWo";
    plane.userData.index = 0;
    composeObject(
      plane,
      new Vector3(0, unitLength / 2 + 0.005, 0),
      getQuaternionFromAxisAndAngle(axis.x, Math.PI / 2)
    );
    cube.add(plane);

    cube.position.add(
      new Vector3(0, 8 * unitLength + unitLength / 2, -(7 * unitLength))
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
    // 路径上的第二个边
    const groupTwo = new Group();
    // 路径上的第一个边
    const groupOne = new Group();
    let geometry = new BoxGeometry(unitLength, unitLength, unitLength);
    let material = new MeshLambertMaterial({ color: 0x00ff00 });

    const mesh = new Mesh(geometry, material);
    for (let i = 0; i < 3; i++) {
      const cloneMesh = mesh.clone();
      cloneMesh.translateX(i * unitLength);

      const plane = walkPlaneCreator(unitLength, unitLength);
      plane.userData.belongGroup = "partTriangleTWo";

      if (i < 2) {
        this.coverCubes.push(cloneMesh);
      }
      composeObject(
        plane,
        new Vector3(0, unitLength / 2 + 0.005, 0),
        getQuaternionFromAxisAndAngle(axis.x, Math.PI / 2)
      );
      cloneMesh.add(plane);

      groupTwo.add(cloneMesh);
    }
    groupTwo.children.reverse().map((item, index) => {
      item.children[0].userData.index = index + 1;
    });
    groupTwo.position.add(this.relativeCube.position);
    groupTwo.translateX(-3 * unitLength);
    for (let i = 0; i < 3; i++) {
      const cloneMesh = mesh.clone();
      cloneMesh.translateZ(i * unitLength);

      const plane = walkPlaneCreator(unitLength, unitLength);

      plane.userData.belongGroup = "partTriangleOne";
      plane.userData.index = i;
      composeObject(
        plane,
        new Vector3(0, unitLength / 2 + 0.005, 0),
        getQuaternionFromAxisAndAngle(axis.x, Math.PI / 2)
      );
      cloneMesh.add(plane);

      groupOne.add(cloneMesh);
    }
    groupOne.position.add(this.relativeCube.position);
    groupOne.translateZ(unitLength);
    this.groupTwo = groupTwo;
    this.generateCover();
    this.element.add(groupTwo);
    this.element.add(groupOne);
  }

  generateCover() {
    const coverPosition = camera.position.clone().multiplyScalar(0.6);
    this.coverCubes.map(cube => {
      cube.position.add(coverPosition);
    });
    const transparentCube = this.coverCubes[1];

    const geo = (transparentCube.geometry as any).clone();
    geo.faces.map((face: any, index: number) => {
      if (face.normal.x === 1) {
        delete geo.faces[index];
      }
    });
    geo.faces = geo.faces.filter((face: any) => face);
    transparentCube.geometry = geo;
  }
}
