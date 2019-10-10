import { BoxGeometry, MeshBasicMaterial, MeshLambertMaterial, Mesh, Vector2 } from 'three';
import { scene } from './base';
import { squarePositionGenerator } from '../utils';
import('./helpers');
import('./light');
let geometry = new BoxGeometry(20, 20, 20);
let material = new MeshLambertMaterial({ color: 0x00ff00 });
//加入到场景
const positions = squarePositionGenerator(new Vector2(), 5, 20);
for (let i = 0; i < positions.length; i++) {
  let cube = new Mesh(geometry, material);
  cube.position.set(positions[i].x, 0, positions[i].y);
  scene.add(cube);
}
