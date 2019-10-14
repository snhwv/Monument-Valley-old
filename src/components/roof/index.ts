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
  Vector2,
  Curve,
} from 'three';
import { axis, unitLength } from '@/constents';

export default class Roof {
  element: Group = new Group();

  size = 1;

  constructor(size: number) {
    this.size = size;
    this.init();
  }
  init() {
    this.generator();
  }

  generator() {
    this.generateShape();
  }

  generateShape() {
    var shape = new Shape();
    // shape.lineTo(unitLength * this.size, 0);
    // shape.quadraticCurveTo(0, 20, 20, 20);
    const p1 = new Vector2(-20, 15);
    const p2 = new Vector2(30, 10);
    const p3 = new Vector2(20, 30);
    shape.bezierCurveTo(p1.x, p1.y, p3.x, p2.y, p3.x, p3.y);
    const halfPoints = shape.getPoints();
    shape.add(new Curve() )
    shape.lineTo(p3.x, 0);
    var extrudeSettings = {
      depth: unitLength,
      bevelEnabled: false,
      curveSegments: 30
    };

    var geometry = new ExtrudeGeometry(shape, extrudeSettings);

    var mesh = new Mesh(geometry, new MeshPhongMaterial());
    //   mesh.position.sub(
    //     new Vector3(
    //       (unitLength * this.size) / 2,
    //       (unitLength * this.size) / 2,
    //       unitLength / 2
    //     )
    //   );
    this.element.add(mesh);
  }
}
