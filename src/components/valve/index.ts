import THREE, {
  CylinderBufferGeometry,
  MeshLambertMaterial,
  Mesh,
  Group,
  Vector3,
  Quaternion,
  Geometry,
  BufferGeometry,
  Matrix4
} from "three";
import { BufferGeometryUtils } from "three/examples/jsm/utils/BufferGeometryUtils";
import {
  composeObjectWidthMultiply,
  composeObject,
  getQuaternionFromAxisAndAngle
} from "@/utils";
import { axis } from "@/constents";

export default class Valve {
  element: Group = new Group();

  plugWidth = 12;
  plugR = 5.2;

  rodWidth = 30;
  rodR = 1.8;
  rodEndWidth = 7;
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
    var geometry = new CylinderBufferGeometry(
      this.plugR,
      this.plugR,
      this.plugWidth,
      32
    );
    var material = new MeshLambertMaterial({ color: 0xffff00 });
    var cylinder = new Mesh(geometry, material);
    return cylinder;
  }
  // 阀杆
  generateRod() {
    var rod = new Group();
    var geometry = new CylinderBufferGeometry(
      this.rodR,
      this.rodR,
      this.rodWidth * 2,
      32
    );
    var material = new MeshLambertMaterial({ color: 0xffff00 });
    const verticalGeo = geometry.clone();
    // geo采用矩阵变换后，mesh就不需要变换了，使用矩阵变换不影响position,rotation等属性
    composeObject(
      verticalGeo,
      new Vector3(),
      getQuaternionFromAxisAndAngle(axis.x.normalize(), Math.PI / 2)
    );
    var verticalCylinder = new Mesh(verticalGeo, material);

    const horizontalGeo = geometry.clone();
    composeObject(
      horizontalGeo,
      new Vector3(),
      getQuaternionFromAxisAndAngle(axis.z.normalize(), Math.PI / 2)
    );
    var horizontalCylinder = new Mesh(horizontalGeo, material);

    rod.add(verticalCylinder);
    rod.add(horizontalCylinder);

    var endGeometry = new CylinderBufferGeometry(
      this.rodEndR,
      this.rodEndR,
      this.rodEndWidth,
      32
    );

    var endMaterial = new MeshLambertMaterial({ color: 0xffff00 });
    var endCylinder = new Mesh(endGeometry, endMaterial);

    // endCylinder.translateX(this.rodWidth - this.rodEndWidth / 2);
    // endCylinder.rotateOnAxis(axis.z, Math.PI / 2);
    composeObject(
      endCylinder,
      new Vector3(this.rodWidth - this.rodEndWidth / 2, 0, 0),
      getQuaternionFromAxisAndAngle(axis.z, Math.PI / 2)
    );

    for (let i = 0; i < 4; i++) {
      const mesh = endCylinder.clone();
      composeObject(
        endCylinder,
        new Vector3(0, 0, 0),
        getQuaternionFromAxisAndAngle(axis.y, Math.PI / 2 * i)
      );
      rod.add(mesh);
    }
    rod.add(endCylinder)
    return rod;
  }

  // toMesh() {
  //   const mergeGeo = new BufferGeometry();
  //   const geos: BufferGeometry[] = [];
  //   this.element.traverse((mesh: any) => {
  //     if (mesh.isMesh) {
  //       const geo = (mesh as Mesh).geometry.clone();
  //       (mesh as Mesh).geometry.dispose(); // 防止内存溢出
  //       if ((geo as Geometry).isGeometry) {
  //         const bufferGeo = new BufferGeometry().fromGeometry(geo as Geometry);
  //         geos.push(bufferGeo);
  //       }
  //       if ((geo as BufferGeometry).isBufferGeometry) {
  //         geos.push(geo as BufferGeometry);
  //       }
  //     }
  //   });

  //   var geometry = BufferGeometryUtils.mergeBufferGeometries(geos);
  //   var endMaterial = new MeshLambertMaterial({ color: 0xffff00 });
  //   var endCylinder = new Mesh(geometry, endMaterial);
  //   // this.empty(this.element);
  //   // this.element.add(endCylinder)
  //   this.element = new Group().add(endCylinder);
  //   console.log("this.element", this.element);
  //   return mergeGeo;
  // }

  // empty(group: Group) {
  //   console.log("gg");
  //   console.log(group.children);
  //   for (let i = 0; i < group.children.length; i++) {
  //     const obj = group.children[i];
  //     console.log(obj as Group);
  //     console.log((obj as Group).isGroup);
  //     if ((obj as Group).isGroup) {
  //       console.log("is G");
  //       this.empty(obj as Group);
  //     } else if (obj.parent) {
  //       // obj.parent.remove(obj);
  //     }
  //   }
  //   // group.traverse((mesh: any) => {
  //   //   if (mesh.isMesh) {
  //   //     group.remove(mesh);
  //   //   } else {

  //   //   }
  //   // });
  // }
}
