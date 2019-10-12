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
  
  export class QuarterCirclePathOuter {
    element: Group = new Group();
  
    size = 2;
    radius = unitLength;
    edgeThickness = 0;
  
    constructor(
      size: number,
      edgeThickness = 0
    ) {
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
      
      shape.moveTo(0,0)
      shape.arc(
        0,
        0,
        this.radius,
        0,
        Math.PI / 2,
        false
      );
      shape.moveTo(this.radius, 0);
      shape.lineTo((unitLength * this.size) / 2, 0);
      shape.lineTo((unitLength * this.size) / 2, (unitLength * this.size) / 2);
      // shape.lineTo(0, (unitLength * this.size) / 2);
      // shape.lineTo(0, this.radius);
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
  