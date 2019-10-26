import {
  composeObject,
  getQuaternionFromAxisAndAngle,
  getBox,
  putTop,
  squarePositionGenerator,
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

export default class CenterRotate {
  element: Group = new Group();

  sizeWidth: number = 5;
  cylinderR: number = 6;
  cubeSize = unitLength;
  positions!: Vector2[];
  loopCube!: Mesh;
  rotateElement: Group = new Group();
  constructor() {
    this.init();
  }
  init() {
    this.generator();
  }

  generator() {
    this.positions = squarePositionGenerator(
      new Vector2(),
      this.sizeWidth,
      this.cubeSize
    );
    this.generateLoopCube();
    this.generateLoopCylinder();
    this.element.add(this.rotateElement);
    this.generateOneTriangle();
    this.generatePartTriangle();
  }
  generateLoopCylinder() {
    var geometry = new CylinderBufferGeometry(
      this.cylinderR,
      this.cylinderR,
      this.cubeSize + 4,
      32
    );
    var material = new MeshLambertMaterial({ color: 0xffff00 });
    var cylinder = new Mesh(geometry, material);

    const loop = new Group();
    const positions = this.positions;
    const maxWidth = (this.cubeSize * (this.sizeWidth - 1)) / 2;
    for (let i = 0; i < positions.length; i++) {
      const position = positions[i];
      let cylinderClone = cylinder.clone();
      cylinderClone.position.set(position.x, 0, position.y);
      if (Math.abs(position.x) === maxWidth) {
        cylinderClone.rotateOnAxis(new Vector3(0, 0, 1), Math.PI / 2);
      }
      if (Math.abs(position.y) === maxWidth) {
        cylinderClone.rotateOnAxis(new Vector3(1, 0, 0), Math.PI / 2);
      }
      loop.add(cylinderClone);
    }
    let cylinderClone1 = cylinder.clone();
    cylinderClone1.position.sub(new Vector3(maxWidth, 0, maxWidth));
    cylinderClone1.rotateOnAxis(new Vector3(0, 0, 1), Math.PI / 2);
    let cylinderClone2 = cylinder.clone();
    cylinderClone2.position.sub(new Vector3(-maxWidth, 0, maxWidth));
    cylinderClone2.rotateOnAxis(new Vector3(0, 0, 1), Math.PI / 2);
    let cylinderClone3 = cylinder.clone();
    cylinderClone3.position.sub(new Vector3(maxWidth, 0, -maxWidth));
    cylinderClone3.rotateOnAxis(new Vector3(0, 0, 1), Math.PI / 2);
    let cylinderClone4 = cylinder.clone();
    cylinderClone4.position.sub(new Vector3(-maxWidth, 0, -maxWidth));
    cylinderClone4.rotateOnAxis(new Vector3(0, 0, 1), Math.PI / 2);
    loop.add(cylinderClone1);
    loop.add(cylinderClone2);
    loop.add(cylinderClone3);
    loop.add(cylinderClone4);
    this.rotateElement.add(loop);
    // this.element.add(loop);
  }
  generateLoopCube() {
    const edgeWidth = this.sizeWidth * this.cubeSize;
    let geometry = new BoxGeometry(edgeWidth, this.cubeSize, edgeWidth);
    let material = new MeshLambertMaterial({ color: 0x00ff00 });
    this.loopCube = new Mesh(geometry, material);
    this.rotateElement.add(this.loopCube);
    // this.element.add(this.loopCube);
  }
  generateOneTriangle() {
    const group = new Group();
    let geometry = new BoxGeometry(unitLength, unitLength * 8, unitLength);
    let material = new MeshLambertMaterial({ color: 0x00ff00 });

    const doorDeep = 15;
    const doorEdge = 8;
    const doorGeo = new Door({
      edge: doorEdge,
      deep: doorDeep,
      doorHeight: unitLength * 0.8
    }).getGeometry();
    composeObject(
      doorGeo,
      new Vector3(unitLength / 2 - doorDeep / 2, -unitLength * 1.5, 0),
      getQuaternionFromAxisAndAngle(axis.y, Math.PI / 2)
    );

    const doorGeo2 = doorGeo.clone();
    composeObject(
      doorGeo2,
      new Vector3(0, 3 * unitLength, 0),
      getQuaternionFromAxisAndAngle(axis.y, 0)
    );
    const triangleEdgeGeo = subtract(subtract(geometry, doorGeo2), doorGeo);
    const triangleEdge = new Mesh(triangleEdgeGeo, material);

    const plane = walkPlaneCreator(unitLength, unitLength);
    plane.userData.belongGroup = 'centerRotateTopPath';
    plane.userData.type = 'normal';
    plane.userData.index = 0;
      composeObject(
        plane,
        new Vector3(0, (unitLength * 8) / 2 + 0.005, 0),
        getQuaternionFromAxisAndAngle(axis.x, Math.PI / 2)
      );
      triangleEdge.add(plane);

    putTop(triangleEdge, this.loopCube);

    group.add(triangleEdge);

    this.element.add(group);
  }

  generatePartTriangle() {
    const bottomGroup = new Group();
    const topGroup = new Group();
    let geometry = new BoxGeometry(unitLength, unitLength, unitLength);
    let material = new MeshLambertMaterial({ color: 0x00ff00 });
    const mesh = new Mesh(geometry, material);
    for (let i = 0; i < 3; i++) {
      const cloneMesh = mesh.clone();
      cloneMesh.translateX(i * unitLength);

      const plane = walkPlaneCreator(unitLength, unitLength);
      plane.userData.belongGroup = 'centerRotateBottomPath';
      plane.userData.type = 'normal';
      plane.userData.index = i;
      // if(i === 2) {
      //   plane.userData.isConnectPoint = true;
      // }
      composeObject(
        plane,
        new Vector3(0, unitLength / 2 + 0.005, 0),
        getQuaternionFromAxisAndAngle(axis.x, Math.PI / 2)
      );
      cloneMesh.add(plane);

      bottomGroup.add(cloneMesh);
    }
    bottomGroup.position.add(new Vector3(unitLength, unitLength, 0));

    for (let i = 0; i < 3; i++) {
      const cloneMesh = mesh.clone();
      cloneMesh.translateZ(i * unitLength);
      const plane = walkPlaneCreator(unitLength, unitLength);
      plane.userData.belongGroup = 'centerRotateTopPath';
      plane.userData.type = 'normal';
      plane.userData.index = i + 1;
      composeObject(
        plane,
        new Vector3(0, unitLength / 2 + 0.005, 0),
        getQuaternionFromAxisAndAngle(axis.x, Math.PI / 2)
      );
      cloneMesh.add(plane);

      topGroup.add(cloneMesh);
    }
    topGroup.position.add(new Vector3(0, 8 * unitLength, unitLength));

    this.element.add(bottomGroup);
    this.element.add(topGroup);
  }
}
