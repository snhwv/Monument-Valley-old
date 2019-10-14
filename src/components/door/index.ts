import { getQuaternionFromAxisAndAngle } from '@/utils';
import { composeObject } from '@/utils';
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
  BufferGeometry,
  Geometry,
} from 'three';
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils';
import { axis, unitLength } from '@/constents';

export default class Door {
  element: Group = new Group();

  edge = 2;
  doorWidth = unitLength - 2 * 2;
  deep: number;
  doorHeight = 2 * unitLength;
  geo: any;
  constructor(doorWidth: number = unitLength - 2 * 2, doorHeight: number = 2 * unitLength,deep:number = 0, edge: number = 2) {
    this.doorWidth = doorWidth;
    this.doorHeight = doorHeight;
    this.edge = edge;
    this.deep = deep || this.doorWidth;
    this.init();
  }
  init() {
    this.generator();
  }

  generator() {
    const door = this.generateDoor();
    this.element.add(door);
  }

  generateDoor() {
    var shape = new Shape();
    shape.lineTo(this.doorWidth, 0);
    shape.lineTo(this.doorWidth, this.doorHeight);
    shape.lineTo(this.doorWidth / 2, this.doorHeight + this.doorWidth / 2);
    shape.lineTo(0, this.doorHeight);
    shape.lineTo(0, 0);
    const depth = this.deep;
    var extrudeSettings = {
      depth,
      bevelEnabled: false,
    };

    var geometry = new ExtrudeGeometry(shape, extrudeSettings);

    composeObject(
      geometry,
      new Vector3(-this.doorWidth / 2, -(this.doorWidth / 2 + this.doorHeight) / 2, -depth / 2),
      // new Vector3(),
      getQuaternionFromAxisAndAngle(axis.x, 0)
    );
    this.geo = geometry;
    var door = new Mesh(geometry, new MeshPhongMaterial());

    // door.position.sub(new Vector3(this.doorWidth / 2, (this.doorWidth / 2 + this.doorHeight) / 2, depth / 2));
    return door;
  }

  getGeometry() {
    return this.geo;
  }
}
