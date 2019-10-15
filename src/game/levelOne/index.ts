import {
  composeObject,
  getQuaternionFromAxisAndAngle,
  putTop,
  putBottom
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
  BoxBufferGeometry
} from "three";
import { scene } from "../base";
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

export default class LevelOne {
  mainMaterial = new MeshLambertMaterial({ color: 0x00ffff });
  centerCube!: Mesh;
  centerCubeWidth: number = 5 * unitLength;
  centerCubeHeight: number = 6 * unitLength;
  rotableStair!: Stairway;
  topHollowHolder!: HollowHolder;
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
    scene.add(rotableStair);
    scene.add(valve);
    scene.add(staticStair);
    scene.add(enterPointOne);
    scene.add(outPoint);
    scene.add(centerRotate);
    scene.add(partTriangle);
    centerRotate.rotateY(-Math.PI /2)
  }

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
    let material = new MeshLambertMaterial({ color: 0x00ff00 });
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
    for (let i = 0; i < positions.length; i++) {
      const position = positions[i];
      if (position.x > 0 && position.y > unitLength) {
        let cube = new Mesh(geometry, material);
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
      group.add(cloneCube);
    }

    const smallStairway = new Stairway(1, false);
    const smallStairwayGroup = smallStairway.element;
    smallStairwayGroup.position.add(relativePosition);
    smallStairwayGroup.translateX(unitLength);
    group.add(smallStairwayGroup);

    const largeStairway = new Stairway(2, false);
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

    return centerRotateGroup;
  }
  generatePartTriangle() {
    const partTriangle = new PartTriangle();
    const partTriangleGroup = partTriangle.element;
    // putTop(partTriangleGroup, this.centerCube);

    return partTriangleGroup;
  }
}
