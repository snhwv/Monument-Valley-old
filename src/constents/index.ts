import { Vector3, MeshLambertMaterial, Color } from "three";
export const axis = {
  x: new Vector3(1, 0, 0),
  y: new Vector3(0, 1, 0),
  z: new Vector3(0, 0, 1)
};

export const unitLength = 20;

export const mainMaterial = new MeshLambertMaterial({ color: 0xf3e5cc });
// export const mainMaterial = chooseFromHash(gui, mesh, geometry);