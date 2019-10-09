import {
  BoxGeometry,
  MeshBasicMaterial,
  Mesh
} from "three";
import {scene} from './base';
let geometry = new BoxGeometry(1, 1, 1);
let material = new MeshBasicMaterial({ color: 0x00ff00 });
let cube = new Mesh(geometry, material);
//加入到场景
scene.add(cube);