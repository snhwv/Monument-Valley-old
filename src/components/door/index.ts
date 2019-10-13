import {
  CylinderBufferGeometry,
  MeshLambertMaterial,
  Mesh,
  Group,
  Vector3,
  Quaternion,
  Shape,
  ExtrudeGeometry,
  MeshPhongMaterial
} from "three";
import { axis, unitLength } from "@/constents";

export default class Door {
  element: Group = new Group();

  edge = 2;
  doorWidth = unitLength - 2 * 2;
  doorHeight = 2 * unitLength;

  constructor(
    doorWidth: number = unitLength - 2 * 2,
    doorHeight: number = 2 * unitLength,
    edge: number = 2
  ) {
    this.init();
    this.doorWidth = doorWidth;
    this.doorHeight = doorHeight;
    this.edge = edge;
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
    const depth = this.doorWidth;
    var extrudeSettings = {
      depth,
      bevelEnabled: false
    };

    var geometry = new ExtrudeGeometry(shape, extrudeSettings);

    var door = new Mesh(geometry, new MeshPhongMaterial());

    door.position.sub(
      new Vector3(
        this.doorWidth / 2,
        (this.doorWidth / 2 + this.doorHeight) / 2,
        depth / 2
      )
    );
    return door;
  }

  toMesh() {}
}
