import THREE, {
  CylinderBufferGeometry,
  MeshLambertMaterial,
  Mesh,
  Group,
  Vector3,
  Quaternion,
  Geometry,
  BufferGeometry,
  Matrix4,
  Plane,
  ArrowHelper,
  CylinderGeometry
} from "three";
import { BufferGeometryUtils } from "three/examples/jsm/utils/BufferGeometryUtils";
import {
  composeObjectWidthMultiply,
  composeObject,
  getQuaternionFromAxisAndAngle
} from "@/utils";
import { axis } from "@/constents";
import TWEEN from "@tweenjs/tween.js";

export default class Valve {
  element: Group = new Group();

  plugWidth = 12;
  plugR = 5.2;

  rodWidth = 30;
  rodR = 1.8;
  rodEndWidth = 7;
  rodEndR = 3;

  plane!: Plane;
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
  verticalCylinder!: Mesh;
  horizontalCylinder!: Mesh;
  endGeometry!: BufferGeometry;
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
    // geo采用矩阵变换后，mesh就不需要变换了，使用geo矩阵变换不影响position,rotation等属性
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
    this.verticalCylinder = verticalCylinder;
    this.horizontalCylinder = horizontalCylinder;
    rod.add(verticalCylinder);
    rod.add(horizontalCylinder);

    var endGeometry = new CylinderBufferGeometry(
      this.rodEndR,
      this.rodEndR,
      this.rodEndWidth,
      32
    );
    this.endGeometry = endGeometry;
    var endMaterial = new MeshLambertMaterial({ color: 0xffff00 });
    var endCylinder = new Mesh(endGeometry, endMaterial);

    composeObject(
      endCylinder,
      new Vector3(this.rodWidth - this.rodEndWidth / 2, 0, 0),
      getQuaternionFromAxisAndAngle(axis.z, Math.PI / 2)
    );
    for (let i = 0; i < 4; i++) {
      const mesh = endCylinder.clone();
      composeObject(
        mesh,
        new Vector3(0, 0, 0),
        getQuaternionFromAxisAndAngle(axis.y, (Math.PI / 2) * i)
      );
      rod.add(mesh);
    }
    // rod.add(endCylinder);
    return rod;
  }

  isHide = false;
  isShow = true;
  ratio = 0.26;
  hide() {
    if (this.isHide || !this.isShow) {
      return;
    }
    const mutation = { x: 1 };
    let moveDistence = this.rodWidth;
    this.isHide = true;
    this.isShow = false;
    const tween = new TWEEN.Tween(mutation)
      .to({ x: this.ratio }, 220)
      .easing(TWEEN.Easing.Back.Out)
      .onUpdate(() => {
        this.verticalCylinder.scale.set(1, 1, mutation.x);
        this.horizontalCylinder.scale.set(mutation.x, 1, 1);

        this.endGeometry.translate(
          0,
          moveDistence - this.rodWidth * mutation.x,
          0
        );
        moveDistence = this.rodWidth * mutation.x;
      });
    tween.start();
  }

  show() {
    if (this.isShow || !this.isHide) {
      return;
    }
    const mutation = { x: 1 };
    let moveDistence = this.rodWidth;
    this.isShow = true;
    this.isHide = false;
    const tween = new TWEEN.Tween(mutation)
      .to({ x: this.ratio }, 220)
      .easing(TWEEN.Easing.Back.Out)
      .onUpdate(() => {
        this.verticalCylinder.scale.set(1, 1,1 + this.ratio - mutation.x);
        this.horizontalCylinder.scale.set( 1 + this.ratio - mutation.x, 1, 1);

        this.endGeometry.translate(
          0,
          -(moveDistence - this.rodWidth * mutation.x),
          0
        );
        moveDistence = this.rodWidth * mutation.x;
      });
    tween.start();
  }
}
