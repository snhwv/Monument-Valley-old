import {
  CylinderBufferGeometry,
  MeshLambertMaterial,
  Mesh,
  Group,
  Vector3,
  Quaternion
} from "three";
import { compose } from "@/utils";
import { axis } from "@/constents";

export default class Valve {
  element: Group = new Group();
  
  plugWidth = 20;
  plugR = 8;

  rodWidth = 30;
  rodR = 1.8;
  rodEndWidth = 10;
  rodEndR = 3;

  constructor() {
    this.init();
  }
  init() {
    this.generator();
  }

  generator() {
    const plug = this.generatePlug();
    const rod = this.generateRod();
    this.element.add(plug);
    this.element.add(rod);
  }

  // 中间的阀塞
  generatePlug() {
    var geometry = new CylinderBufferGeometry(this.plugR, this.plugR, this.plugWidth, 32);
    var material = new MeshLambertMaterial({ color: 0xffff00 });
    var cylinder = new Mesh(geometry, material);
    return cylinder;
  }
  // 阀杆
  generateRod() {
    var rod = new Group();
    var geometry = new CylinderBufferGeometry(this.rodR, this.rodR, this.rodWidth * 2, 32);
    var material = new MeshLambertMaterial({ color: 0xffff00 });
    var verticalCylinder = new Mesh(geometry, material);
    verticalCylinder.setRotationFromAxisAngle(axis.x.normalize(), Math.PI / 2);
    var horizontalCylinder = verticalCylinder.clone();
    horizontalCylinder.setRotationFromAxisAngle(
      axis.z.normalize(),
      Math.PI / 2
    );

    rod.add(verticalCylinder);
    rod.add(horizontalCylinder);
    var endGeometry = new CylinderBufferGeometry(this.rodEndR, this.rodEndR, this.rodEndWidth, 32);
    var endMaterial = new MeshLambertMaterial({ color: 0xffff00 });
    var endCylinder = new Mesh(endGeometry, endMaterial);
    endCylinder.position.set(this.rodWidth - this.rodEndWidth / 2, 0, 0);
    endCylinder.setRotationFromAxisAngle(axis.z, Math.PI / 2);
    for (let i = 0; i < 4; i++) {
      const mesh = endCylinder.clone();

      var quaternion = new Quaternion();
      quaternion.setFromAxisAngle(axis.y, (Math.PI / 2) * i);

      compose(
        mesh,
        new Vector3(0, 0, 0),
        quaternion
      );
      rod.add(mesh);
    }
    return rod;
  }
}
