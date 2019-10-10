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
import { axis } from "@/constents";

export default class Stairway {
  element: Group = new Group();

  size = 1;
  haSpedestal = false;

  constructor(size: number, haSpedestal: boolean) {
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

  // 中间的阀塞
  generateShape() {
    var heartShape = new Shape();

    heartShape.moveTo(0, 0);
    heartShape.lineTo(10,0);
    heartShape.lineTo(10,10);
    heartShape.lineTo(20,10);
    heartShape.lineTo(20,20);
    console.log(heartShape)
    var extrudeSettings = {
      amount: 8,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 2,
      bevelSize: 1,
      bevelThickness: 1
    };

    var geometry = new ExtrudeGeometry(heartShape, extrudeSettings);

    var mesh = new Mesh(geometry, new MeshPhongMaterial());
    this.element.add(mesh);
  }
}
