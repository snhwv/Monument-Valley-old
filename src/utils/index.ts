import {
  Vector2,
  Vector3,
  Quaternion,
  Object3D,
  Matrix4,
  Geometry,
  Mesh,
  Box3,
  PlaneGeometry,
  MeshLambertMaterial,
  DoubleSide
} from "three";
import { axis } from "@/constents";

export function squarePositionGenerator(
  center: Vector2 = new Vector2(),
  edgeCubeNum: number = 5,
  cubeSize: number = 20
): Vector2[] {
  if (edgeCubeNum < 2) {
    return [];
  }
  let positions = [];
  for (let i = 0; i < edgeCubeNum - 1; i++) {
    positions.push(new Vector2(i * cubeSize, 0));
  }
  const centerWidth = ((edgeCubeNum - 1) * cubeSize) / 2;
  const squareCenter = new Vector2(centerWidth, centerWidth);
  positions.push(
    ...positions.map(item => {
      const p = item.clone();
      p.rotateAround(squareCenter, Math.PI / 2);
      p.round();
      return p;
    })
  );
  positions.push(
    ...positions.map(item => {
      const p = item.clone();
      p.rotateAround(squareCenter, Math.PI);
      p.round();
      return p;
    })
  );
  positions.map(item => {
    return item.sub(squareCenter.sub(center));
  });
  return positions;
}

export function composeObjectWidthMultiply(
  obj: Object3D,
  translation: Vector3 = new Vector3(),
  rotation: Quaternion,
  scale: Vector3 = new Vector3(1, 1, 1)
) {
  var rotWorldMatrix = new Matrix4(); //创建一个4*4矩阵
  rotWorldMatrix.compose(
    translation,
    rotation,
    scale
  );
  rotWorldMatrix.multiply(obj.matrix); // pre-multiply
  obj.applyMatrix(rotWorldMatrix);
}
export function composeObject(
  geo: any,
  translation: Vector3 = new Vector3(),
  rotation: Quaternion,
  scale: Vector3 = new Vector3(1, 1, 1)
) {
  var rotWorldMatrix = new Matrix4(); //创建一个4*4矩阵
  rotWorldMatrix.compose(
    translation,
    rotation,
    scale
  );
  geo.applyMatrix(rotWorldMatrix);
}

export function getQuaternionFromAxisAndAngle(axis: Vector3, angle: number) {
  var quaternion = new Quaternion();
  quaternion.setFromAxisAngle(axis, angle);
  return quaternion;
}

export function getBox(obj: Object3D) {
  const box = new Box3();
  box.setFromObject(obj);
  return {
    XWidth: box.max.x - box.min.x,
    YWidth: box.max.y - box.min.y,
    ZWidth: box.max.z - box.min.z,
    max: box.max,
    min: box.min
  };
}
export function putTop(targetObj: Object3D, relativeObj: Object3D) {
  const relativeBox = getBox(relativeObj);
  const targetBox = getBox(targetObj);
  targetObj.position.add(relativeObj.position);
  targetObj.translateY((relativeBox.YWidth + targetBox.YWidth) / 2);
}

export function putBottom(targetObj: Object3D,relativeObj: Object3D) {
  const relativeBox = getBox(relativeObj);
  const targetBox = getBox(targetObj);
  targetObj.position.add(relativeObj.position);
  targetObj.translateY(-(relativeBox.YWidth + targetBox.YWidth) / 2);
}


export function walkPlaneCreator(width: number, height: number) {
  let planeGeo = new PlaneGeometry(width, height);
  let material = new MeshLambertMaterial({
    color: 0xffff00,
    side: DoubleSide
  });
  const plane = new Mesh(planeGeo, material);
  plane.userData.normal = axis.z.clone();
  plane.userData.plane = plane;
  plane.userData.connectPlane = [];
  window.nodes.push(plane.userData);
  return plane;
}