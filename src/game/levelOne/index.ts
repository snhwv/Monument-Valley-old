import {
  composeObject,
  getQuaternionFromAxisAndAngle,
  putTop,
  putBottom,
  composeObjectWidthMultiply,
  walkPlaneCreator,
  getBox
} from "@/utils";
import {
  BoxGeometry,
  MeshBasicMaterial,
  MeshLambertMaterial,
  Mesh,
  Vector2,
  Quaternion,
  Vector3,
  Object3D,
  Group,
  BoxBufferGeometry,
  ArrowHelper,
  Matrix4,
  PlaneGeometry,
  Box3,
  DoubleSide
} from "three";
import * as THREE from "three";
import { scene, camera, renderer } from "../base";
import { squarePositionGenerator } from "@/utils";
import Valve from "@/components/valve";
import Stairway from "@/components/stairway";
import { axis, unitLength } from "@/constents";
import {
  QuarterCirclePathOuter,
  CirclePathInner
} from "@/components/circlePath";
import Door from "@/components/door";
import { intersect, subtract } from "@/utils/bsp";
import ThreeBSP from "three-solid";
import Roof from "@/components/roof";
import HollowHolder from "@/components/hollowHolder";
import EnterPoint from "@/components/enterPoint";
import OuterPoint from "./OuterPoint";
import CenterRotate from "./CenterRotate";
import PartTriangle from "./PartTriangle";
import { SpinControl } from "@/utils/SpinControl";
import Rotable from "@/utils/Rotable";
import TWEEN from "@tweenjs/tween.js";
import WalkPlane from "@/utils/WalkPlane";

export default class LevelOne {
  mainMaterial = new MeshLambertMaterial({ color: 0x00ffff });
  centerCube!: Mesh;
  centerCubeWidth: number = 5 * unitLength;
  centerCubeHeight: number = 6 * unitLength;
  rotableStair!: Stairway;
  topHollowHolder!: HollowHolder;
  valve!: Group;
  centerRotable!: Rotable;
  constructor() {
    this.init();
  }
  init() {
    const bottomCubs = this.generateBottomLoopCube();
    const centerCube = this.generateCenterCube();
    const planePath = this.generatePlanePath();
    const rotableStair = this.generateRotableStair();
    const valve = this.generateValve();

    const staticStair = this.generateStaticStair();

    // 屋顶下的进入部分
    const enterPointOne = this.generateEnterPointOne();
    // 出口部分
    const outPoint = this.generateOutPoint();
    // 中间可旋转的部分
    const centerRotate = this.generateCenterRotate();
    // 除开中间可旋转部分，组成培恩洛兹三角形的另外部分
    const partTriangle = this.generatePartTriangle();
    scene.add(bottomCubs);
    scene.add(centerCube);
    scene.add(planePath);
    scene.add(staticStair);
    scene.add(enterPointOne);
    scene.add(outPoint);
    scene.add(partTriangle);

    const rotableGroup = new Group();

    rotableGroup.add(valve);
    rotableGroup.add(rotableStair);

    const rotable = new Rotable(rotableGroup, valve, new Vector3(0, 0, 1));

    const boxdata = getBox(centerRotate.element);

    // 这是中间可旋转部分的box中心，相对于原点，所以使用这个中心vector3校准旋转中心
    const centerRotateCenter = boxdata.min.add(boxdata.max).multiplyScalar(0.5);

    const centerRotable = new Rotable(
      centerRotate.element,
      centerRotate.rotateElement,
      new Vector3(0, 1, 0),
      new Vector3(centerRotateCenter.x, 0, centerRotateCenter.z)
    );
    centerRotable.element.rotateOnAxis(axis.y, -Math.PI / 2);
    scene.add(rotable.element);
    scene.add(centerRotable.element);
    this.centerRotable = centerRotable;

    this.changeNodesDataStruct();

    this.centerRotationBindCall();

    // this.test();
  }

  centerRotationBindCall() {
    const centerRotable = this.centerRotable;
    const groupedPlanesObject = window.groupedPlanesObject;
    const originGroupedPlanesObject = window.originGroupedPlanesObject;
    console.log(groupedPlanesObject);

    
    centerRotable.animationStartCallbacks.push(() => {
      const resets: {
        [key: string]: number;
      } = {
        staticStairWay: 4,
        centerRotateBottomPath: 2,
        rotateTrigger: 0,
        partTriangleOne: 2,
        partTriangleTWo: 3,
        centerRotateTopPath: 3,
        enterPointOne: 0
      };
      const keys = Object.keys(resets);

      
    let material = new MeshLambertMaterial({ color: 0x000000,side: DoubleSide });
      keys.map(item => {
        const plane = groupedPlanesObject[item][resets[item]];
        plane.connectPlane = [
          ...originGroupedPlanesObject[item][resets[item]].connectPlane
        ];
        console.log(plane.plane)
        plane.plane.material = material;
      });
      console.log(window.originGroupedPlanesObject);
      console.log(window.groupedPlanesObject);
    });


    centerRotable.animationEndCallbacks.push(() => {
      console.log(groupedPlanesObject);
      const relativeNormal = centerRotable.element
        .worldToLocal(axis.x.clone())
        .round();
      console.log(relativeNormal);
      const calls = [
        {
          condition: { x: 1, z: 0 },
          call: () => {
            groupedPlanesObject.centerRotateBottomPath[2].connectPlane.push(
              groupedPlanesObject.rotateTrigger[0]
            );
          }
        },
        {
          condition: { x: 0, z: 1 },
          call: () => {
            groupedPlanesObject.centerRotateBottomPath[2].connectPlane.push(
              groupedPlanesObject.rotateTrigger[0]
            );
          }
        },
        {
          condition: { x: 1, z: 0 },
          call: () => {
            groupedPlanesObject.centerRotateBottomPath[2].connectPlane.push(
              groupedPlanesObject.rotateTrigger[0]
            );
          }
        },
        {
          condition: { x: 1, z: 0 },
          call: () => {
            groupedPlanesObject.centerRotateBottomPath[2].connectPlane.push(
              groupedPlanesObject.rotateTrigger[0]
            );
          }
        }
      ];
    });
  }

  changeNodesDataStruct() {
    const nodes = window.nodes;
    const obj: {
      [key: string]: any[];
    } = {};
    nodes.map(item => {
      if (obj[item.belongGroup]) {
        obj[item.belongGroup][item.index] = item;
      } else {
        obj[item.belongGroup] = [];
        obj[item.belongGroup][item.index] = item;
      }
    });
    const keys = Object.keys(obj);
    keys.map(item => {
      this.generateConnection(obj[item]);
    });
    window.groupedPlanesObject = obj;
    const origin: {
      [key: string]: any[];
    } = {};
    keys.map(item => {
      origin[item] = obj[item].map(plane => ({
        ...plane,
        connectPlane: [...plane.connectPlane]
      }));
    });

    window.originGroupedPlanesObject = origin;
  }

  generateConnection(userDataArr: any[]) {
    const localArr = [...userDataArr];
    for (let i = 0; i < localArr.length; i++) {
      if (i) {
        localArr[i].connectPlane.push(localArr[i - 1]);
      }
    }
    localArr.reverse();
    for (let i = 0; i < localArr.length; i++) {
      if (i) {
        localArr[i].connectPlane.push(localArr[i - 1]);
      }
    }
  }

  test() {}

  generateCenterCube() {
    let centerCubeGeo = new BoxGeometry(
      this.centerCubeWidth,
      this.centerCubeHeight,
      this.centerCubeWidth
    );
    let centerCube = new Mesh(centerCubeGeo, this.mainMaterial);
    centerCube.position.sub(
      new Vector3(
        0,
        -(this.centerCubeHeight / 2 + unitLength / 2 + unitLength / 2),
        0
      )
    );
    this.centerCube = new Mesh(centerCubeGeo, this.mainMaterial);
    return centerCube;
  }

  generateBottomLoopCube() {
    let geometry = new BoxGeometry(unitLength, unitLength, unitLength);

    let material = new MeshLambertMaterial({ color: 0xffff00 });
    const loop = new Group();
    const positions = squarePositionGenerator(new Vector2(), 5, unitLength);
    for (let i = 0; i < positions.length; i++) {
      let cube = new Mesh(geometry, material);

      cube.position.set(positions[i].x, 0, positions[i].y);
      loop.add(cube);
    }
    loop.translateY(unitLength / 2);
    return loop;
  }

  generatePlanePath() {
    let geometry = new BoxGeometry(unitLength, 2, unitLength);
    let material = new MeshLambertMaterial({ color: 0x00ff00 });
    const loop = new Group();
    const positions = squarePositionGenerator(new Vector2(), 7, unitLength);

    let index = 0;
    for (let i = 0; i < positions.length; i++) {
      const position = positions[i];
      if (position.x > 0 && position.y > unitLength) {
        let cube = new Mesh(geometry, material);
        const plane = walkPlaneCreator(unitLength, unitLength);
        plane.rotateOnAxis(axis.x, Math.PI / 2);
        plane.translateZ(-(2 / 2 + 0.01));
        plane.userData.belongGroup = "bottomPath";
        plane.userData.index = index;
        index++;
        cube.add(plane);

        cube.position.set(position.x, 0, position.y);
        loop.add(cube);
      }
    }

    loop.translateY(2 / 2 + 3 * unitLength);
    return loop;
  }

  generateRotableStair() {
    const stairSize = 3;
    const stairway = new Stairway(stairSize, false);
    stairway.walkPlanes.map((item, index) => {
      item.userData.belongGroup = "rotateStairWay";
      item.userData.index = index;
    });
    const stairwayGroup = stairway.element;
    const halfStair = (stairSize * unitLength) / 2;
    stairwayGroup.position.sub(
      new Vector3(
        -unitLength / 2 + halfStair,
        -3 * unitLength - halfStair,
        -this.centerCubeWidth / 2 - stairway.depth / 2
      )
    );
    this.rotableStair = stairway;
    return stairwayGroup;
  }

  generateValve() {
    const valve = new Valve();
    const valveGroup = valve.element;
    valveGroup.position.add(this.rotableStair.element.position);
    valveGroup.translateZ(this.rotableStair.depth / 2 + valve.plugWidth / 2);
    valveGroup.rotateOnAxis(axis.x, Math.PI / 2);
    valve.updatePlane();

    return valveGroup;
  }

  generateStaticStair() {
    const group = new Group();
    const relativePosition = new Vector3(
      -(this.centerCubeWidth / 2 + unitLength + unitLength / 2),
      this.centerCubeHeight + unitLength - unitLength / 2,
      this.centerCubeWidth / 2 + unitLength / 2
    );
    var geometry = new BoxBufferGeometry(unitLength, unitLength, unitLength);
    var cube = new Mesh(geometry, this.mainMaterial);
    for (let i = 0; i < 3; i++) {
      const cloneCube = cube.clone();
      cloneCube.position.add(relativePosition);
      cloneCube.translateZ(-unitLength * i);
      if (!i) {
        const plane = walkPlaneCreator(unitLength, unitLength);
        plane.userData.belongGroup = "staticStairWay";
        plane.userData.index = 1;
        composeObject(
          plane,
          new Vector3(0, unitLength / 2 + 0.005, 0),
          getQuaternionFromAxisAndAngle(axis.x, Math.PI / 2)
        );
        cloneCube.add(plane);
      }
      group.add(cloneCube);
    }

    const smallStairway = new Stairway(1, false);
    smallStairway.walkPlanes.map((item, index) => {
      item.userData.belongGroup = "staticStairWay";
      item.userData.index = index;
    });
    const smallStairwayGroup = smallStairway.element;
    smallStairwayGroup.position.add(relativePosition);
    smallStairwayGroup.translateX(unitLength);
    group.add(smallStairwayGroup);

    const largeStairway = new Stairway(2, false);
    largeStairway.walkPlanes.reverse().map((item, index) => {
      item.userData.belongGroup = "staticStairWay";
      item.userData.index = index + 2;
    });
    const largeStairwayGroup = largeStairway.element;
    largeStairwayGroup.position.add(relativePosition);
    largeStairwayGroup.position.add(
      new Vector3(0, (unitLength * 3) / 2, (-unitLength * 3) / 2)
    );
    largeStairwayGroup.rotateY(-Math.PI / 2);
    group.add(largeStairwayGroup);

    const topHollowHolder = new HollowHolder(4 * unitLength);
    const topHollowHolderGroup = topHollowHolder.element;
    topHollowHolderGroup.position.add(relativePosition);
    topHollowHolderGroup.position.add(
      new Vector3(
        0,
        unitLength * 2 + unitLength / 2 + topHollowHolder.height / 2,
        -unitLength * 3
      )
    );
    this.topHollowHolder = topHollowHolder;
    group.add(topHollowHolder.element);

    const bottomhollowHolder = new HollowHolder(
      6 * unitLength + unitLength / 2,
      5 * unitLength
    );

    const plane = walkPlaneCreator(unitLength, unitLength);
    plane.userData.belongGroup = "staticStairWay";
    plane.userData.index = 4;
    composeObject(
      plane,
      new Vector3(0, (6 * unitLength + unitLength / 2) / 2 + 0.005, 0),
      getQuaternionFromAxisAndAngle(axis.x, Math.PI / 2)
    );
    bottomhollowHolder.element.add(plane);

    const bottomhollowHolderGroup = bottomhollowHolder.element;

    putBottom(bottomhollowHolderGroup, topHollowHolderGroup);
    // bottomhollowHolderGroup.position.add(topHollowHolderGroup.position);
    // bottomhollowHolderGroup.translateY(
    //   -(topHollowHolder.height / 2 + bottomhollowHolder.height / 2)
    // );
    group.add(bottomhollowHolder.element);

    return group;
  }

  generateEnterPointOne() {
    const group = new Group();

    // 上楼梯后的镂空架子
    const topHollowHolderGroup = this.topHollowHolder.element;

    const geometry = new BoxBufferGeometry(unitLength, unitLength, unitLength);
    const bottomCube = new Mesh(geometry, this.mainMaterial);
    putTop(bottomCube, topHollowHolderGroup);
    const midCube = bottomCube.clone();
    midCube.position.set(0, 0, 0);
    putTop(midCube, bottomCube);
    const topCube = bottomCube.clone();
    topCube.position.set(0, 0, 0);

    const plane = walkPlaneCreator(unitLength, unitLength);
    plane.userData.belongGroup = "enterPointOne";
    plane.userData.index = 0;
    composeObject(
      plane,
      new Vector3(0, unitLength / 2 + 0.005, 0),
      getQuaternionFromAxisAndAngle(axis.x, Math.PI / 2)
    );
    topCube.add(plane);
    putTop(topCube, midCube);

    const enterPoint = new EnterPoint();
    const enterPointGroup = enterPoint.element;
    putTop(enterPointGroup, topCube);

    const roof = new Roof();
    putTop(roof.element, enterPointGroup);

    group.add(bottomCube);
    group.add(midCube);
    group.add(topCube);
    group.add(enterPointGroup);
    group.add(roof.element);
    return group;
  }

  generateOutPoint() {
    const outerPoint = new OuterPoint();
    const outerPointGroup = outerPoint.element;
    outerPointGroup.position.add(
      new Vector3(
        this.centerCubeWidth / 2 + unitLength,
        (3 * unitLength) / 2,
        0
      )
    );
    return outerPoint.element;
  }
  generateCenterRotate() {
    const centerRotate = new CenterRotate();
    const centerRotateGroup = centerRotate.element;
    putTop(centerRotateGroup, this.centerCube);

    return centerRotate;
  }
  generatePartTriangle() {
    const partTriangle = new PartTriangle();
    const partTriangleGroup = partTriangle.element;
    // putTop(partTriangleGroup, this.centerCube);

    return partTriangleGroup;
  }
}
