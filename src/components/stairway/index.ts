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
  Vector2
} from "three";
import { axis, unitLength, mainMaterial } from "@/constents";
import { walkPlaneCreator } from "@/utils";

export default class Stairway {
  element: Group = new Group();

  walkPlanes!: Mesh[];
  size = 1;
  haSpedestal = false;
  stairNumPerCube = 8; // 一个单位长度有多少个阶梯
  stairWidth = unitLength / this.stairNumPerCube;
  depth = unitLength;
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
      depth: this.depth,
      bevelEnabled: false
    };

    var geometry = new ExtrudeGeometry(shape, extrudeSettings);
    const planes = this.generateWalkPlanes();
    this.walkPlanes = planes;
    var mesh = new Mesh(geometry, mainMaterial);
    mesh.add(...planes);
    mesh.position.sub(
      new Vector3(
        (unitLength * this.size) / 2,
        (unitLength * this.size) / 2,
        unitLength / 2
      )
    );
    this.element.add(mesh);
  }

  generateWalkPlanes() {
    const width = new Vector2(unitLength,unitLength).length();
    const planes= [];
    for(let i = 0;i<this.size;i++){
      const plane = walkPlaneCreator(width,this.depth);
      const x = unitLength * (i + 0.5) + this.stairWidth;

      plane.position.add(new Vector3(x, this.line(x),this.depth / 2))
      // plane.translateZ();
      plane.rotateX(Math.PI / 2);
      plane.rotateY(-Math.PI / 4);
      
      planes.push(plane);
    }
    return planes;
  }
}
