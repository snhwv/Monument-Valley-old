import { Vector2, Vector3, Quaternion, Object3D, Matrix4 } from "three";

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

export function compose(
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
  obj.applyMatrix( rotWorldMatrix );
}
