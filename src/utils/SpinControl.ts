import {
  Vector3,
  Plane,
  PlaneHelper,
  Object3D,
  Raycaster,
  Vector2,
  ArrowHelper
} from "three";
import { renderer, camera, scene, controls } from "@/game/base";

var mouseDown = false;
let fromPoint = new Vector3();
let toPoint = new Vector3();
let rotateScene: any;
let raycaster = new Raycaster();
let plane!: Plane;
let helper!: PlaneHelper;
export function SpinControl(
  object: Object3D,
  normal: Vector3,
  constant: number
) {
  plane = new Plane(normal, -constant);

  helper = new PlaneHelper(plane, 100, 0xffff00);
  scene.add(helper);
  renderer.domElement.addEventListener("mousedown", e => {
    mousedown(object, e);
  });
  renderer.domElement.addEventListener("mousemove", e => {
    mousemove(object, normal, e);
  });
  renderer.domElement.addEventListener("mouseup", e => {
    mouseup(e);
  });
}

function mousedown(object: Object3D, e: any) {
  e.preventDefault();
  controls.enabled = false;
  let mouse = new Vector2();
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const result = raycaster.intersectObject(object, true);
  if (result.length) {
    mouseDown = true;
    // 将第一次的交点放入fromPoint中
    raycaster.ray.intersectPlane(plane, fromPoint);
    fromPoint.sub(object.position);
  }
}

function mousemove(object: Object3D, normal: Vector3, e: any) {
  if (!mouseDown) {
    return;
  }

  e.preventDefault();
  let mouse = new Vector2();
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  raycaster.ray.intersectPlane(plane, toPoint);
  toPoint.sub(object.position);
  var arrowHelper = new ArrowHelper( toPoint.normalize(),object.position, 100, 0xffff00 );
  scene.add(arrowHelper);
  const rotateAngle = toPoint.angleTo(fromPoint);
  console.log(rotateAngle);
  object.rotateOnWorldAxis(normal, rotateAngle);
  fromPoint.copy(toPoint);
  //   mouseX = e.clientX;
  //   mouseY = e.clientY;
  //   rotateScene(deltaX, deltaY);
}

function mouseup(evt: any) {
  evt.preventDefault();
  console.log("mouseup");
  controls.enabled = true;
  mouseDown = false;
}

// function addMouseHandler(canvas: any) {
//   canvas.addEventListener(
//     "mousemove",
//     function(e: any) {
//       onMouseMove(e);
//     },
//     false
//   );
//   canvas.addEventListener(
//     "mousedown",
//     function(e: any) {
//       onMouseDown(e);
//     },
//     false
//   );
//   canvas.addEventListener(
//     "mouseup",
//     function(e: any) {
//       onMouseUp(e);
//     },
//     false
//   );
// }

// function onMouseDown(evt: any) {
//     evt.preventDefault();

//     console.log("mousedown");
//     mouseDown = true;
//     mouseX = evt.clientX;
//     mouseY = evt.clientY;
//   }

// rotateScene = (deltaX:any, deltaY:any) => {
// this.valve.rotation.y += deltaX / 100;
// this.valve.rotation.x += deltaY / 100;
// }
// addMouseHandler(renderer.domElement);
