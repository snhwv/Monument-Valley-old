declare module "three/examples/js/controls/OrbitControls";

interface Window {
  THREE: any;
  nodes: any[];
  path: any[];
  groupedPlanesObject: any;
  originGroupedPlanesObject: any;
  adaPalne: any;
  SpinControls: any;
}

declare namespace THREE {
  export class OrbitControls {
    constructor(object: any, domElement: any);
  }
}
