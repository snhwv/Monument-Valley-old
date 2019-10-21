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
import { getQuaternionFromAxisAndAngle } from ".";

var mouseDown = false;
let fromPoint = new Vector3();
let toPoint = new Vector3();
let raycaster = new Raycaster();
let rotateObjectId: string;
let totalRotateAngle: number = 0;
let spinEnabled = true;
// let plane!: Plane;
let helper!: PlaneHelper;
export function SpinControl(object: Rotable) {
  // helper = new PlaneHelper(object.plane, 100, 0xffff00);
  // scene.add(helper);
  renderer.domElement.addEventListener(
    "mousedown",
    e => {
      mousedown(object, e);
    },
    false
  );
  renderer.domElement.addEventListener(
    "touchstart",
    e => {
      if (e.touches.length) {
        mousedown(object, e);
      }
    },
    false
  );
  renderer.domElement.addEventListener(
    "mousemove",
    e => {
      mousemove(object, e);
    },
    false
  );
  renderer.domElement.addEventListener(
    "touchmove",
    e => {
      if (e.touches.length) {
        mousemove(object, e);
      }
    },
    false
  );
  renderer.domElement.addEventListener(
    "mouseup",
    e => {
      mouseup(object, e);
    },
    false
  );
  renderer.domElement.addEventListener(
    "touchend",
    e => {
      mouseup(object, e);
    },
    false
  );
}

function mousedown(object: any, e: any) {
  e.preventDefault();
  if (!spinEnabled) {
    return;
  }
  let mouse = new Vector2();
  let rotateElement = object.rotateElement as Group;

  if (!(e.clientX || (e.touches && e.touches.length && e.touches[0].pageX))) {
    return;
  }

  mouse.x = ((e.clientX || e.touches[0].pageX) / window.innerWidth) * 2 - 1;
  mouse.y = -((e.clientY || e.touches[0].pageY) / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const result = raycaster.intersectObject(scene, true);

  if (result.length && !rotateObjectId) {
    if (isChild(rotateElement, result[0].object)) {
      rotateObjectId = object.element.uuid;
      isFirstMove = true;
      mouseDown = true;
      spinEnabled = false;
      controls.enabled = false;
      // 将第一次的交点放入fromPoint中
      raycaster.ray.intersectPlane(object.plane, fromPoint);
      fromPoint.sub(rotateElement.position);
    }
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
let isFirstMove = true;
function mousemove(object: Rotable, e: any) {
  e.preventDefault();
  if (!mouseDown || object.element.uuid !== rotateObjectId) {
    return;
  }

  if (!(e.clientX || (e.touches && e.touches.length && e.touches[0].pageX))) {
    return;
  }

  const normal = (object.plane as Plane).normal;
  let mouse = new Vector2();
  let objectElement = object.rotateElement as Group;
  mouse.x = ((e.clientX || e.touches[0].pageX) / window.innerWidth) * 2 - 1;
  mouse.y = -((e.clientY || e.touches[0].pageY) / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  raycaster.ray.intersectPlane(object.plane, toPoint);
  toPoint.sub(objectElement.position);

  if(isFirstMove) {
    isFirstMove = false;
    object.animationStartCallbacks.map(callback => {
      callback();
    });
  }

  const direction = getRotateDirection(object.plane.normal);

  const rotateAngle = toPoint.angleTo(fromPoint);
  totalRotateAngle += rotateAngle * direction;
  object.element.rotateOnAxis(normal, rotateAngle * direction);

  fromPoint.copy(toPoint);
}

// 获取旋转方向
function getRotateDirection(planeNormal: Vector3) {
  const velocity = new Vector3();
  velocity.crossVectors(fromPoint, toPoint);
  return velocity.dot(planeNormal) > 0 ? 1 : -1;
}

function mouseup(object: Rotable, evt: any) {
  evt.preventDefault();
  if (object.element.uuid === rotateObjectId) {
    if (totalRotateAngle) {
      calibrator(object);
    } else {
      totalRotateAngle = 0;
      spinEnabled = true;
    }
    reset();
  }
}

function reset() {
  controls.enabled = true;
  rotateObjectId = "";
  mouseDown = false;
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

function calibrator(object: Rotable) {
  const normal = (object.plane as Plane).normal;
  const result = round(Math.PI / 2, totalRotateAngle);

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
      totalRotateAngle = 0;
      spinEnabled = true;
    })
    .easing(TWEEN.Easing.Elastic.Out)
    .start();
}
