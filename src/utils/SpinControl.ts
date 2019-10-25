import {
  Vector3,
  Plane,
  PlaneHelper,
  Object3D,
  Raycaster,
  Vector2,
  ArrowHelper,
  Group,
  Quaternion,
  Matrix4
} from "three";
import { renderer, camera, scene, controls } from "@/game/base";
import Rotable from "./Rotable";
import TWEEN from "@tweenjs/tween.js";

export class SpinControl {
  mouseDown = false;
  fromPoint = new Vector3();
  toPoint = new Vector3();
  raycaster = new Raycaster();
  rotateObjectId: string = "";
  rotatingRotable: Rotable | null = null;
  totalRotateAngle: number = 0;
  spinEnabled = true;
  isFirstMove = true;

  rotables: Rotable[] = [];
  add(object: Rotable) {
    this.rotables.push(object);
  }

  onMousedown(e: any) {
    
    e.preventDefault();
    if (!this.spinEnabled) {
      return;
    }
    let mouse = new Vector2();
    
    if (!(e.clientX || (e.touches && e.touches.length && e.touches[0].pageX))) {
      return;
    }

    mouse.x = ((e.clientX || e.touches[0].pageX) / window.innerWidth) * 2 - 1;
    mouse.y = -((e.clientY || e.touches[0].pageY) / window.innerHeight) * 2 + 1;
    this.raycaster.setFromCamera(mouse, camera);
    const result = this.raycaster.intersectObject(scene, true);

    if (result.length && !this.rotateObjectId) {
      this.rotables.map(object => {
        let rotateElement = object.rotateElement as Group;
        if (isChild(rotateElement, result[0].object)) {
          this.rotateObjectId = object.element.uuid;
          this.rotatingRotable = object;
          this.isFirstMove = true;
          this.mouseDown = true;
          this.spinEnabled = false;
          controls.enabled = false;
          // 将第一次的交点放入fromPoint中
          this.raycaster.ray.intersectPlane(object.plane, this.fromPoint);
          this.fromPoint.sub(rotateElement.position);
        }
      });
    }
  }

  mousemove(e: any) {
    e.preventDefault();
    if (!this.mouseDown) {
      return;
    }
    if (!(e.clientX || (e.touches && e.touches.length && e.touches[0].pageX))) {
      return;
    }
    let mouse = new Vector2();

    if (this.rotatingRotable) {
      const object = this.rotatingRotable;
      const normal = (object.plane as Plane).normal;
      let objectElement = object.rotateElement as Group;
      mouse.x = ((e.clientX || e.touches[0].pageX) / window.innerWidth) * 2 - 1;
      mouse.y =
        -((e.clientY || e.touches[0].pageY) / window.innerHeight) * 2 + 1;
      this.raycaster.setFromCamera(mouse, camera);
      this.raycaster.ray.intersectPlane(object.plane, this.toPoint);
      this.toPoint.sub(objectElement.position);

      if (this.isFirstMove) {
        this.isFirstMove = false;
        object.animationStartCallbacks.map(callback => {
          callback();
        });
      }

      const direction = this.getRotateDirection(object.plane.normal);

      const rotateAngle = this.toPoint.angleTo(this.fromPoint);
      this.totalRotateAngle += rotateAngle * direction;
      object.element.rotateOnAxis(normal, rotateAngle * direction);

      this.fromPoint.copy(this.toPoint);
    }
  }

  // 获取旋转方向
  getRotateDirection(planeNormal: Vector3) {
    const velocity = new Vector3();
    velocity.crossVectors(this.fromPoint, this.toPoint);
    return velocity.dot(planeNormal) > 0 ? 1 : -1;
  }

  mouseup(evt: any) {
    evt.preventDefault();

    if (this.rotatingRotable) {
      if (this.totalRotateAngle) {
        this.calibrator(this.rotatingRotable);
      } else {
        this.totalRotateAngle = 0;
        this.spinEnabled = true;
      }
      this.reset();
    }
  }

  calibrator(object: Rotable) {
    const normal = (object.plane as Plane).normal;
    const result = round(Math.PI / 2, this.totalRotateAngle);

    const caliQuat = new Quaternion();
    caliQuat.setFromAxisAngle(normal.normalize(), result);

    const endQuat = object.element.quaternion.clone();
    const startQuat = object.element.quaternion.clone();
    endQuat.premultiply(caliQuat);

    new TWEEN.Tween(startQuat)
      .to(endQuat, 1000)
      .onUpdate(() => {
        object.element.quaternion.copy(startQuat.normalize());
      })
      .onComplete(() => {
        object.animationEndCallbacks.map(callback => {
          callback();
        });
        this.totalRotateAngle = 0;
        this.spinEnabled = true;
      })
      .easing(TWEEN.Easing.Elastic.Out)
      .start();
  }

  reset() {
    controls.enabled = true;
    this.rotateObjectId = "";
    this.mouseDown = false;
    this.rotatingRotable = null;
  }
  listen() {
    renderer.domElement.addEventListener(
      "mousedown",
      e => {
        this.onMousedown(e);
      },
      false
    );
    renderer.domElement.addEventListener(
      "touchstart",
      e => {
        if (e.touches.length) {
          this.onMousedown(e);
        }
      },
      false
    );
    renderer.domElement.addEventListener(
      "mousemove",
      e => {
        this.mousemove(e);
      },
      false
    );
    renderer.domElement.addEventListener(
      "touchmove",
      e => {
        if (e.touches.length) {
          this.mousemove(e);
        }
      },
      false
    );
    renderer.domElement.addEventListener(
      "mouseup",
      e => {
        this.mouseup(e);
      },
      false
    );
    renderer.domElement.addEventListener(
      "touchend",
      e => {
        this.mouseup(e);
      },
      false
    );
  }
}

function isChild(parent: Object3D, child: Object3D) {
  let result = false;
  parent.traverse(mesh => {
    if (child === mesh) {
      result = true;
    }
  });
  return result;
}

function round(base: number, num: number) {
  const direction = num > 0 ? 1 : -1;
  num = Math.abs(num);
  const rest = num % base;
  const half = base / 2;

  const times = Math.floor(num / base);

  let result: number;
  if (rest) {
    if (rest >= half) {
      result = base - rest;
    } else {
      result = -rest;
    }
  } else {
    result = 0;
  }
  result = result * direction;
  return result;
}
