import {
  composeObject,
  getQuaternionFromAxisAndAngle,
  getBox,
  putTop,
  squarePositionGenerator,
  putBottom,
  walkPlaneCreator,
  composeObjectWidthMultiply
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
  ArrowHelper,
  AxesHelper
} from "three";
import { axis, unitLength, mainMaterial } from "@/constents";
import { subtract, intersect, union } from "@/utils/bsp";
import Door from "@/components/door";
import HollowHolder from "@/components/hollowHolder";
import { camera, scene } from "../base";
import TWEEN from "@tweenjs/tween.js";

export default class PartTriangle {
  element: Group = new Group();
  relativeCube!: Mesh;
  groupTwo!: Group;
  groupTwoBig!: Group;
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
    // this.rotate();
  }
  planes: Mesh[] = [];
  generateRelativeCube() {
    let geometry = new BoxGeometry(unitLength, unitLength, unitLength);
    let material = mainMaterial;
    const cube = new Mesh(geometry, material);

    const plane = walkPlaneCreator(unitLength, unitLength);
    plane.userData.belongGroup = "partTriangleOne";
    plane.userData.type = "normal";
    plane.userData.index = 0;
    this.planes.push(plane);
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
    const groupTwoBig = new Group();
    // 路径上的第一个边
    const groupOne = new Group();
    let geometry = new BoxGeometry(unitLength, unitLength, unitLength);
    let material = mainMaterial;

    const mesh = new Mesh(geometry, material);
    for (let i = 0; i < 3; i++) {
      const cloneMesh = mesh.clone();
      cloneMesh.translateX(i * unitLength);

      const plane = walkPlaneCreator(unitLength, unitLength);
      plane.userData.belongGroup = "partTriangleTWo";
      plane.userData.type = "normal";
      this.planes.push(plane);
      if (i > 1) {
        this.coverCubes.push(cloneMesh);
      }
      if (i > 0) {
        plane.userData.noLookAt = true;
      }
      composeObject(
        plane,
        new Vector3(0, -unitLength / 2 - 0.005, 0),
        getQuaternionFromAxisAndAngle(axis.x, Math.PI / 2)
      );
      cloneMesh.add(plane);

      groupTwo.add(cloneMesh);
    }
    groupTwo.children.map((item, index) => {
      item.children[0].userData.index = index;
    });

    for (let i = 0; i < 3; i++) {
      const cloneMesh = mesh.clone();
      cloneMesh.translateZ(i * unitLength);

      const plane = walkPlaneCreator(unitLength, unitLength);

      plane.userData.belongGroup = "partTriangleOne";
      plane.userData.type = "normal";
      plane.userData.index = i + 1;
      this.planes.push(plane);
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

    groupTwoBig.position.add(this.relativeCube.position);

    groupTwo.rotateZ(Math.PI / 2);
    groupTwo.translateX(unitLength);

    this.groupTwo = groupTwo;
    this.groupTwoBig = groupTwoBig;
    // groupTwoBig.rotateZ(0);

    const coverPosition = camera.position.clone().multiplyScalar(0.6);
    // groupTwo.children[0].children[0].position.add(coverPosition);

    const helper = new AxesHelper(80);
    const helper2 = new AxesHelper(80);
    groupTwo.add(helper);
    groupTwoBig.add(helper2);

    groupTwoBig.add(groupTwo);
    this.element.add(groupTwoBig);
    this.element.add(groupOne);
  }

  generateCover() {
    const coverPosition = camera.position.clone().multiplyScalar(0.4);
    
    this.groupTwo.updateWorldMatrix(true, false);

    const groupTwoWorldP = new Vector3();

    this.groupTwo.getWorldPosition(groupTwoWorldP);

    const p = coverPosition.add(groupTwoWorldP);
    this.groupTwo.worldToLocal(p);

    this.coverCubes.map(cube => {
      cube.position.add(p);
    });
    const transparentCube = this.coverCubes[0];

    const geo = (transparentCube.geometry as any).clone();
    geo.faces.map((face: any, index: number) => {
      if (face.normal.x === -1) {
        delete geo.faces[index];
      }
    });
    geo.faces = geo.faces.filter((face: any) => face);
    transparentCube.geometry = geo;
  }

  rotate(callback: () => void) {
    // callback();
    const mutation = { x: 0 };
    const tween = new TWEEN.Tween(mutation)
      .to({ x: 1 }, 500)
      .onUpdate(() => {
        this.groupTwoBig.rotation.z = (mutation.x * Math.PI) / 2;
      })
      .onComplete(() => {
        // this.coverCubes.map(cube => {
        //   const material = mainMaterial.clone();

        //   material.depthTest = false;
        //   cube.material = material;
        //   // cube.renderOrder = 1;
        //   // cube.onBeforeRender = function(renderer) {
        //   //   renderer.clearDepth();
        //   // };
        // });
        this.generateCover();
        callback();
      })
      .start();
  }
}
