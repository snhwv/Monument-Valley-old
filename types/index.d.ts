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

// declare module "threebsp" {
//   // import ThreeBSP from 'threebsp';
//   export class ThreeBSP {
//     constructor(object: any);
//     intersect(object3d: ThreeBSP): any;
//   }
//   export default ThreeBSP;
// }