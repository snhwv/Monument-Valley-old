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
  
  export class CirclePathInner {
    element: Group = new Group();
  
    size = 2;
    radius = unitLength;
    startAngle = 0;
    endAngle = Math.PI / 2;
    clockwise = false;
  
    constructor(
      size: number,
      startAngle = 0,
      endAngle = Math.PI / 2,
      clockwise = false
    ) {
      this.size = size;
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
      var shape = new Shape();
  
      shape.arc(
        0,
        0,
        this.radius,
        this.startAngle,
        this.endAngle,
        this.clockwise
      );
      shape.lineTo(0, 0);
      var extrudeSettings = {
        depth: unitLength,
        bevelEnabled: false
      };
  
      var geometry = new ExtrudeGeometry(shape, extrudeSettings);
  
      var mesh = new Mesh(geometry, new MeshPhongMaterial());
      
      mesh.translateZ(-unitLength / 2);
      this.element.add(mesh);
    }
  }
  