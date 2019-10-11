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
import { squarePositionGenerator, compose } from "../utils";
import Valve from "@/components/valve";
import Stairway from "@/components/stairway";
import { axis, unitLength } from "@/constents";
import CirclePath from "@/components/circlePath";
import("./helpers");
import("./light");
let geometry = new BoxGeometry(20, 20, 20);
let material = new MeshLambertMaterial({ color: 0x00ff00 });
//加入到场景
const positions = squarePositionGenerator(new Vector2(), 4, unitLength);
for (let i = 0; i < positions.length; i++) {
  let cube = new Mesh(geometry, material);
  cube.position.set(positions[i].x, 0, positions[i].y);
  // scene.add(cube);
}
// const valve = new Valve().element;

// scene.add(valve);
// const stairway = new Stairway(4,false).element;
// var quaternion = new Quaternion();
// quaternion.setFromAxisAngle(axis.x, Math.PI / 2);

// compose(
//   stairway,
//   new Vector3(0, 20, 0),
//   quaternion
// );
// scene.add(stairway);
console.log(scene);
const circlePath = new CirclePath(4, false, 0, Math.PI, false).element;
scene.add(circlePath)
