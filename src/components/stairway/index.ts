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

export default class Stairway {
  element: Group = new Group();

  size = 1;
  haSpedestal = false;
  stairNumPerCube = 8;
  stairWidth = unitLength / this.stairNumPerCube;

  constructor(size: number, haSpedestal: boolean = false) {
    this.size = size;
    this.haSpedestal = haSpedestal;
    this.init();
  }
  init() {
    this.generator();
  }

  generator() {
    this.generateShape();
  }

  line(x: number) {
    return -x + unitLength * this.size + this.stairWidth;
  }

  // 中间的阀塞
  generateShape() {
    var shape = new Shape();
    if (this.haSpedestal) {
      shape.moveTo(0, unitLength * this.size - this.stairWidth);
    }
    for (
      let i = this.stairWidth;
      i < unitLength * this.size + this.stairWidth;
      i += this.stairWidth
    ) {
      // i => x
      shape.lineTo(i - this.stairWidth, this.line(i));
      shape.lineTo(i, this.line(i));
    }
    shape.lineTo(unitLength * this.size, 0);
    if (this.haSpedestal) {
      shape.lineTo(unitLength * this.size - this.stairWidth, 0);
    }

    var extrudeSettings = {
      depth: unitLength,
      bevelEnabled: false
    };

    var geometry = new ExtrudeGeometry(shape, extrudeSettings);

    var mesh = new Mesh(geometry, new MeshPhongMaterial());
    mesh.position.sub(
      new Vector3(
        (unitLength * this.size) / 2,
        (unitLength * this.size) / 2,
        unitLength / 2
      )
    );
    this.element.add(mesh);
  }

}
