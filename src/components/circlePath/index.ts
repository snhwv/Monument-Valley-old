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
import { compose } from "@/utils";
import { axis, unitLength } from "@/constents";

export default class CirclePath {
  element: Group = new Group();

  size = 2;
  radius = unitLength;
  isInner = false;
  startAngle = 0;
  endAngle = Math.PI / 2;
  clockwise = false;

  constructor(
    size: number,
    isInner: boolean = false,
    startAngle = 0,
    endAngle = Math.PI / 2,
    clockwise = false
  ) {
    this.size = size;
    this.isInner = isInner;
    this.startAngle = startAngle;
    this.endAngle = endAngle;
    this.clockwise = clockwise;
    this.radius = (unitLength * this.size) / 2;
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
    var heartShape = new Shape();

    heartShape.arc(
      0,
      0,
      this.radius,
      this.startAngle,
      this.endAngle,
      this.clockwise
    );
    heartShape.lineTo(0, 0);
    var extrudeSettings = {
      depth: unitLength,
      bevelEnabled: false
    };

    var geometry = new ExtrudeGeometry(heartShape, extrudeSettings);

    var mesh = new Mesh(geometry, new MeshPhongMaterial());
    
    mesh.translateZ(-unitLength / 2);
    this.element.add(mesh);
  }
}
