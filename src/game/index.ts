import {
  BoxGeometry,
  MeshBasicMaterial,
  MeshLambertMaterial,
  Mesh
} from "three";
import {scene} from './base';
import('./helpers');
let geometry = new BoxGeometry(20, 20, 20);
let material = new MeshLambertMaterial({ color: 0x00ff00 });
let cube = new Mesh(geometry, material);
//加入到场景
scene.add(cube);