import { composeObject, getQuaternionFromAxisAndAngle, getBox } from "@/utils";
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
  Geometry,
  Curve,
  BoxBufferGeometry,
  MeshBasicMaterial,
  OctahedronBufferGeometry,
  OctahedronGeometry
} from "three";
import { axis, unitLength, mainMaterial } from "@/constents";
import { subtract, intersect, union } from "@/utils/bsp";

export default class Roof {
  element: Group = new Group();

  size = 1;
  // material = new MeshLambertMaterial({ color: 0x00ffff });
  hatHeight = 28;
  constructor(size: number = 1) {
    this.size = size;
    this.init();
  }
  init() {
    this.generator();
  }

  generator() {
    this.generatePedestal();
    this.generateHat();
    const largeSize = 1.4,smallSize = 1.2;
    const octahedronLarge = this.generateOctahedron(largeSize);
    const octahedronSmall = this.generateOctahedron(smallSize);
    (octahedronLarge.geometry as Geometry).vertices[3] = new Vector3(0, -4, 0);
    octahedronLarge.translateY(this.hatHeight + 2);
    this.element.add(octahedronLarge)
    octahedronSmall.translateY(this.hatHeight + 2 + largeSize + smallSize);
    this.element.add(octahedronSmall)
    this.element.translateY(-getBox(this.element).YWidth / 2);
  }
  generateOctahedron(size: number) {
    var geometry = new OctahedronGeometry(size);
    var octahedron = new Mesh(geometry, mainMaterial);
    return octahedron;
  }
  generatePedestal() {
    const thickness = 1;
    var geometry = new BoxBufferGeometry(unitLength + 4, thickness, unitLength + 4);

    var cube = new Mesh(geometry, mainMaterial);
    cube.translateY(thickness / 2);
    
    this.element.add(cube);
  }
  generateHat() {
    var shape = new Shape();
    const p1 = new Vector2(-10, 18);
    const p2 = new Vector2(15, 14);
    const p3 = new Vector2(10, this.hatHeight);
    shape.bezierCurveTo(p1.x, p1.y, p3.x, p2.y, p3.x, p3.y);
    const reflectP1 = new Vector2(30, 18);
    const reflectP2 = new Vector2(10, 14);
    const reflectP3 = new Vector2(20, 0);
    shape.bezierCurveTo(
      reflectP2.x,
      reflectP2.y,
      reflectP1.x,
      reflectP1.y,
      reflectP3.x,
      reflectP3.y
    );
    const depth = unitLength * 2;
    var extrudeSettings = {
      depth,
      bevelEnabled: false,
      curveSegments: 30
    };

    var verticalGeometry = new ExtrudeGeometry(shape, extrudeSettings);
    composeObject(
      verticalGeometry,
      new Vector3(-depth / 2, 0, 10),
      getQuaternionFromAxisAndAngle(axis.y, Math.PI / 2)
    );
    var horizontalGeometry = new ExtrudeGeometry(shape, extrudeSettings);
    composeObject(
      horizontalGeometry,
      new Vector3(-10, 0, -depth / 2),
      getQuaternionFromAxisAndAngle(axis.y, 0)
    );
    const result = intersect(verticalGeometry, horizontalGeometry);
    const mesh = new Mesh(result, mainMaterial);
    
    this.element.add(mesh);
  }
}
