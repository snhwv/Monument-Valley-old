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
  Raycaster,
  Plane,
  PlaneHelper
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
    let geo = new BoxGeometry(10, 20, 2);
    // geo.rotateZ(-Math.PI / 2)
    let material = new MeshLambertMaterial({
      color: 0x03a9f4,
      side: DoubleSide
    });

    const cube = new Mesh(geo, material);
    this.element.add(cube);
    this.element.lookAt(axis.z)
  }

  project(planeMesh: Mesh, point: Vector3) {
    const meshPosition = new Vector3();
    planeMesh.getWorldPosition(meshPosition);
    const projectPlane = new Plane();
    const p = new Vector3();
    planeMesh.localToWorld(p);
    const p1 = axis.z.clone();
    planeMesh.localToWorld(p1);
    p1.sub(p);

    projectPlane.setFromNormalAndCoplanarPoint(p1.normalize(), meshPosition);
    // const planeHelper = new PlaneHelper(projectPlane, 100);

    // scene.add(planeHelper);

    const p3 = new Vector3();
    projectPlane.projectPoint(point, p3);
    return p3;
  }
  _move() {
    const nextPath = this.path.shift();
    // this.path = [];
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

    // 由于在运动中点击时，需要hasAda的plane，所以先将 hasAdaplane设置为下一个，生成的路径才是这个运动完成后的路径
    // 如果运动最终没有到达下一个plane，那么将重置ada点位并停止运动
    window.nodes.map(node => {
      node.hasAda = node.plane.uuid === nextPlane.uuid;
    });

    if (
      hasAdaPlane.userData.type === "normal" &&
      nextPlane.userData.type === "stair"
    ) {
      const startPosition1 = new Vector3();
      const endPosition1 = new Vector3();

      hasAdaPlane.getWorldPosition(startPosition1);
      nextPlane.getWorldPosition(endPosition1);

      const subVector = endPosition1.clone().sub(startPosition1.clone());
      const midVector = subVector.multiplyScalar(0.5).add(startPosition1);

      const targetVector = this.project(hasAdaPlane, midVector);

      endPosition1.copy(targetVector);

      let mutation = { x: 0 };
      const tween = new TWEEN.Tween(mutation)
        .to({ x: 1 }, 500)
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

          const subVector = endPosition1.clone().sub(startPosition1);
          const currentPosition = startPosition1.clone().add(
            subVector.multiplyScalar(mutation.x)
          );
          // if(nextPlane.userData.type !== 'stair') {
            this.element.lookAt(endPosition1);
          // }
          this.element.position.copy(currentPosition);
        });

        const startPosition2 = new Vector3();
        const endPosition2 = new Vector3();
      startPosition2.copy(targetVector);
      nextPlane.getWorldPosition(endPosition2);

      const mutation1 = { x: 0 };
      let nextPlaneCallbackCalled = false;
      const tween1 = new TWEEN.Tween(mutation1)
        .to({ x: 1 }, 500)
        .onUpdate(currentP => {
          if (!nextPlaneCallbackCalled) {
            // nextPlaneCallbackCalled = true;
            // if (nextPlane.userData.callback) {
            //   nextPlane.userData.callback(tween1, this);
            // }
          }

          const subVector = endPosition2.clone().sub(startPosition2);
          const currentPosition = startPosition2.clone().add(
            subVector.multiplyScalar(mutation1.x)
          );
          this.element.position.copy(currentPosition);
        })
        .onComplete(() => {
          this.hasAdaPlane = nextPlane;
          nextPlane.attach(this.element);
          this._move();
        });

      tween.chain(tween1).start();

      return;
    }
    if (
      hasAdaPlane.userData.type === "stair" &&
      nextPlane.userData.type === "normal"
    ) {
      const startPosition1 = new Vector3();
      const endPosition1 = new Vector3();

      nextPlane.getWorldPosition(endPosition1);
      hasAdaPlane.getWorldPosition(startPosition1);

      const subVector = endPosition1.clone().sub(startPosition1.clone());
      const midVector = subVector.multiplyScalar(0.5).add(startPosition1);

      const targetVector = this.project(nextPlane, midVector);

      endPosition1.copy(targetVector);

      let mutation = { x: 0 };
      const tween = new TWEEN.Tween(mutation)
        .to({ x: 1 }, 500)
        .onUpdate(currentP => {
          const isNext = nextPlane.userData.connectPlane
            .map((plane: Mesh) => plane.uuid)
            .includes(hasAdaPlane.uuid);
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

          const subVector = endPosition1.clone().sub(startPosition1);
          const currentPosition = startPosition1.clone().add(
            subVector.multiplyScalar(mutation.x)
          );
          this.element.position.copy(currentPosition);
        });

        const startPosition2 = new Vector3();
        const endPosition2 = new Vector3();
      startPosition2.copy(targetVector);
      nextPlane.getWorldPosition(endPosition2);

      const mutation1 = { x: 0 };
      let nextPlaneCallbackCalled = false;
      const tween1 = new TWEEN.Tween(mutation1)
        .to({ x: 1 }, 500)
        .onUpdate(currentP => {
          if (!nextPlaneCallbackCalled) {
            // nextPlaneCallbackCalled = true;
            // if (hasAdaPlane.userData.callback) {
            //   hasAdaPlane.userData.callback(tween1, this);
            // }
          }

          const subVector = endPosition2.clone().sub(startPosition2);
          const currentPosition = startPosition2.clone().add(
            subVector.multiplyScalar(mutation1.x)
          );
          this.element.position.copy(currentPosition);
        })
        .onComplete(() => {
          this.hasAdaPlane = nextPlane;
          nextPlane.attach(this.element);
          this._move();
        });

      tween.chain(tween1).start();

      return;
    }

    const mutation = { x: 0 };
    let nextPlaneCallbackCalled = false;

    const tween = new TWEEN.Tween(mutation)
      .to({ x: 1 }, 1000)
      .onUpdate(currentP => {
        if (mutation.x < 0.5) {
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
        } else if (!nextPlaneCallbackCalled) {
          nextPlaneCallbackCalled = true;
          if (nextPlane.userData.callback) {
            nextPlane.userData.callback(tween, this);
          }
        }

       

        hasAdaPlane.getWorldPosition(startPosition);
        nextPlane.getWorldPosition(endPosition);

        const subVector = endPosition.clone().sub(startPosition);
        const currentPosition = startPosition.add(
          subVector.multiplyScalar(mutation.x)
        );
        
        console.log(hasAdaPlane.uuid)
        console.log(nextPlane)
        
        this.element.position.copy(currentPosition);
        if(nextPlane.userData.type !== 'stair') {
          this.element.lookAt(endPosition);
        }
      })
      .onComplete(() => {
        this.hasAdaPlane = nextPlane;
        nextPlane.attach(this.element);
        this._move();
      })
      .start();
  }
  hasAdaPlane!: Mesh;
  isMoving: boolean = false;
  // path: IUserData[] = [];
  move() {
    // TWEEN.removeAll(); 不能调用removeALL,物体的旋转还需要tween
    this.path = window.path;
    if (!this.isMoving) {
      this._move();
    }
  }

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
