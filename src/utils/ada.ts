import {
  composeObject,
  getQuaternionFromAxisAndAngle,
  getBox,
  IUserData
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
  DoubleSide,
  AxesHelper,
  Object3D,
  Raycaster
} from "three";
import { axis, unitLength } from "@/constents";
import { subtract, intersect, union } from "@/utils/bsp";
import TWEEN from "@tweenjs/tween.js";
import { scene } from "@/game/base";

export default class Ada {
  element: Group = new Group();
  position: Vector3 = new Vector3();
  path: IUserData[] = [];
  constructor() {
    var axesHelper = new AxesHelper(80);
    this.element.add(axesHelper);
    this.init();
  }
  init() {
    this.generator();
  }

  generator() {
    let geo = new BoxGeometry(10, 2, 20);
    let material = new MeshLambertMaterial({
      color: 0x03a9f4,
      side: DoubleSide
    });

    const cube = new Mesh(geo, material);
    this.element.add(cube);
  }
  _move() {
    const nextPath = this.path.shift();
    // this.path = [];
    console.log("_move path", this.path);
    if (!nextPath) {
      this.isMoving = false;
      return;
    }
    this.isMoving = true;
    const startPosition = new Vector3();
    const endPosition = new Vector3();

    const hasAdaPlane = this.hasAdaPlane;

    const nextPlane = nextPath.plane;

    scene.attach(this.element);
    window.nodes.map(node => {
      node.hasAda = node.plane.uuid === nextPlane.uuid;
    });

    const mutation = { x: 0 };

    const tween = new TWEEN.Tween(mutation)
      .to({ x: 1 }, 1000)
      .onUpdate(currentP => {

        const isNext = hasAdaPlane.userData.connectPlane
          .map((plane: Mesh) => plane.uuid)
          .includes(nextPlane.uuid);
        if (!isNext) {
          window.nodes.map(node => {
            node.hasAda = node.plane.uuid === hasAdaPlane.uuid;
          });
          this.element.position.copy(hasAdaPlane.localToWorld(new Vector3()));
          hasAdaPlane.attach(this.element);
          TWEEN.remove(tween);
          this.isMoving = false;
          return;
        }

        hasAdaPlane.getWorldPosition(startPosition);
        nextPlane.getWorldPosition(endPosition);

        const subVector = endPosition.sub(startPosition);
        const currentPosition = startPosition.add(
          subVector.multiplyScalar(mutation.x)
        );
        this.element.position.copy(currentPosition);
      })
      .onComplete(() => {
        console.log('down')
        this.hasAdaPlane = nextPlane;
        nextPlane.attach(this.element);
        if(nextPlane.userData.callback) {
          nextPlane.userData.callback();
          TWEEN.remove(tween);
          this.isMoving = false;
        } else {
          this._move();
        }
        // this.setAdaPlane(nextPlane);

        
      })
      .start();
  }
  // pointer: number = 0;
  hasAdaPlane!: Mesh;
  isMoving: boolean = false;
  // path: IUserData[] = [];
  move() {
    // const hasAdaData: IUserData = window.nodes.find(node => node.hasAda);
    // if (hasAdaData) {
    //   this.hasAdaPlane = hasAdaData.plane;
    // }
    // TWEEN.removeAll(); 不能调用removeALL,物体的旋转还需要tween
    this.path = window.path;
    console.log("move clicked path:", this.path);
    // this.pointer = 0;

    // const position = this.position.clone();
    // const tweens: TWEEN.Tween[] = [];
    if (!this.isMoving) {
      this._move();
    }

    // path.map((item, index) => {
    //   let startPosition = new Vector3();
    //   let endPosition = new Vector3();
    //   if (!index) {
    //     startPosition = position;
    //   } else {
    //     path[index - 1].plane.getWorldPosition(startPosition);
    //   }
    //   item.plane.getWorldPosition(endPosition);
    //   const tween = new TWEEN.Tween(startPosition.clone())
    //     .to(endPosition, 1000)
    //     .onUpdate(this.tweenUpdate)
    //     .onComplete((position) => {
    //       this.tweenComplete(position,item);
    //     });
    //   tweens.push(tween);
    // });

    // for (let i = 0; i < tweens.length; i++) {
    //   if (tweens[i + 1]) {
    //     tweens[i].chain(tweens[i + 1]);
    //   }
    // }
    // tweens[0].start();
  }

  // setAdaPlane(plane: Mesh) {
  //   // console.log('gg')
  //   window.nodes.map(node => {
  //     node.hasAda = node.plane.uuid === plane.uuid;
  //     if (node.hasAda) {
  //     }
  //   });
  // }
  addTo(obj: Object3D) {
    obj.add(this.element);

    window.nodes.map(node => {
      node.hasAda = false;
    });
    obj.userData.hasAda = true;

    // const quat = new Quaternion();
    // obj.getWorldQuaternion(quat);
    // this.element.applyQuaternion(quat.inverse());
  }

  tweenUpdate = (re: any) => {
    this.element.position.copy(re);
    // console.log(re);
  };
  tweenComplete = (position: Vector3, userData: IUserData) => {
    const nodes: IUserData[] = window.nodes;
    this.position = position;
    nodes.map(item => {
      item.hasAda = item.uuid === userData.uuid;
    });
    this.element.position.set(0, 0, 0);
    userData.plane.add(this.element);
  };
}
