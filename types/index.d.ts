interface Window {
  THREE: any;
  SpinControls: any;
}

declare module "three/examples/js/controls/OrbitControls";

declare namespace THREE {
  export class OrbitControls {
    constructor(object: any, domElement: any);
  }
}
// declare class ThreeBSP {
//   constructor(object: any);
//   intersect(object3d: ThreeBSP): any;
// }
