import {
  Vector3,
  Plane,
  PlaneHelper,
  Object3D,
  Raycaster,
  Vector2,
  ArrowHelper,
  Group
} from "three";
import { renderer, camera, scene, controls } from "@/game/base";
import Rotable from "./Rotable";

var mouseDown = false;
let fromPoint = new Vector3();
let toPoint = new Vector3();
let raycaster = new Raycaster();
let rotateObjectId: string;
// let plane!: Plane;
let helper!: PlaneHelper;
export function SpinControl(object: Rotable) {
  // object.rotateElement.updateMatrix();
  // object.rotateElement.updateMatrixWorld();
  // console.log(object.rotateElement.localToWorld(new Vector3(1,0,0)));
    // object.element.updateWorldMatrix(true,true);
  helper = new PlaneHelper(object.plane, 100, 0xffff00);
  scene.add(helper);
  renderer.domElement.addEventListener("mousedown", e => {
    mousedown(object, e);
  });
  renderer.domElement.addEventListener("mousemove", e => {
    mousemove(object, e);
  });
  renderer.domElement.addEventListener("mouseup", e => {
    mouseup(e);
  });
}

function mousedown(object: any, e: any) {
  e.preventDefault();
  let mouse = new Vector2();
  let rotateElement = object.rotateElement as Group;
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const result = raycaster.intersectObject(scene, true);
  if (result.length && !rotateObjectId) {
    // console.log(result);
    // console.log(raycaster);
    if(isChild(rotateElement, result[0].object)){

      rotateObjectId = object.element.uuid;
      mouseDown = true;
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
    if(child === mesh) {
      result = true;
    }
  });
  return result;
}

function mousemove(object: Rotable, e: any) {
  if (!mouseDown || object.element.uuid !== rotateObjectId) {
    return;
  }
  const normal = (object.plane as Plane).normal;
  e.preventDefault();
  let mouse = new Vector2();
  let objectElement = object.rotateElement as Group;
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  raycaster.ray.intersectPlane(object.plane, toPoint);
  toPoint.sub(objectElement.position);

  const direction = getRotateDirection(object.plane.normal);

  const rotateAngle = toPoint.angleTo(fromPoint);

  // plane
  object.element.rotateOnAxis(normal, rotateAngle * direction);
  // object.element.children.map(item => {
  //   item.rotateOnWorldAxis(normal, rotateAngle * direction);
  // });
  fromPoint.copy(toPoint);
}

// 获取旋转方向
function getRotateDirection(planeNormal: Vector3) {
  const velocity = new Vector3();
  velocity.crossVectors(fromPoint, toPoint);
  return velocity.dot(planeNormal) > 0 ? 1 : -1;
}

function mouseup(evt: any) {
  evt.preventDefault();
  console.log('up')
  controls.enabled = true;
  rotateObjectId = "";
  mouseDown = false;
}
