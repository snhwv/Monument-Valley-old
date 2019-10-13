import {
  BoxGeometry,
  MeshBasicMaterial,
  MeshLambertMaterial,
  Mesh,
  Vector2,
  Quaternion,
  Vector3
} from "three";
import { scene } from "./base";
import { squarePositionGenerator } from "../utils";
import Valve from "@/components/valve";
import Stairway from "@/components/stairway";
import { axis, unitLength } from "@/constents";
import {
  QuarterCirclePathOuter,
  CirclePathInner
} from "@/components/circlePath";
import Door from "@/components/door";
import { intersect } from "@/utils/bsp";
import ThreeBSP from "three-solid";
import("./helpers");
import("./light");
let geometry = new BoxGeometry(20, 20, 20);
let material = new MeshLambertMaterial({ color: 0x00ff00 });
//加入到场景
const positions = squarePositionGenerator(new Vector2(), 5, unitLength);
for (let i = 0; i < positions.length; i++) {
  let cube = new Mesh(geometry, material);
  cube.position.set(positions[i].x, 0, positions[i].y);
  // scene.add(cube);
}
let baseGeo = new BoxGeometry(5 * unitLength, 6 * unitLength, 5 * unitLength);
let basematerial = new MeshLambertMaterial({ color: 0x00ffff });
let baseMesh = new Mesh(baseGeo, basematerial);
baseMesh.position.sub(
  new Vector3(0, -((6 * unitLength) / 2 + unitLength / 2), 0)
);
// scene.add(baseMesh)
const valve = new Valve();
console.log(valve.toMesh());
scene.add(valve.element);
// const stairway = new Stairway(4,false).element;
// scene.add(stairway);
console.log(scene);
const circlePathInner = new CirclePathInner(4, 0, Math.PI).element;
// circlePathInner.position.sub(new Vector3(10,10,10))
// scene.add(circlePathInner);
const circlePathOutter = new QuarterCirclePathOuter(4, 10).element;
// scene.add(circlePathOutter);
// const circlePath = new CirclePathInner(4, 0, Math.PI, false).element;
// scene.add(circlePath);
const door = new Door().element;
// scene.add(door);

// const result = intersect(door, baseMesh);
// scene.add(result);
