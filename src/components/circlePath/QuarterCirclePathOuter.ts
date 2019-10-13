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
  Path
} from "three";
import { axis, unitLength } from "@/constents";

export class QuarterCirclePathOuter {
  element: Group = new Group();

  size = 2;
  radius = unitLength;
  edgeThickness = 0;

  constructor(size: number, edgeThickness = 0) {
    this.size = size;
    this.edgeThickness = edgeThickness;
    this.radius = (unitLength * this.size) / 2 - this.edgeThickness;
    this.init();
  }
  init() {
    this.generator();
  }

  generator() {
    this.generateShape();
  }

  // 中间的阀塞
  generateShape() {
    var shape = new Shape();
    const outerWidth = (unitLength * this.size) / 2;
    shape.autoClose = false;
    shape.absarc(0, 0, this.radius, 0, Math.PI / 2, false);
    shape.lineTo(0, outerWidth);
    shape.lineTo(outerWidth, outerWidth);
    shape.lineTo(outerWidth, 0);
    shape.lineTo((unitLength * this.size) / 2, 0);
    var extrudeSettings = {
      depth: unitLength,
      bevelEnabled: false
    };

    var geometry = new ExtrudeGeometry(shape, extrudeSettings);

    var mesh = new Mesh(geometry, new MeshPhongMaterial());
    mesh.position.sub(new Vector3(outerWidth / 2,outerWidth / 2,0))
    // mesh.setRotationFromAxisAngle ( axis : Vector3, angle : Float )
    mesh.translateZ(-unitLength / 2);
    this.element.add(mesh);
  }
}
