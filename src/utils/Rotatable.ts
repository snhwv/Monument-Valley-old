import { Vector3, Plane, PlaneHelper } from "three";

export default class Rotatable {
  normal: Vector3;
  constant: number;
  plane!: Plane;
  helper!: PlaneHelper;
  spinControl!:SpinControl;
  
  init() {
    this.plane = new Plane(this.normal, this.constant);

    this.helper = new PlaneHelper(this.plane, 1, 0xffff00);
  }
}
