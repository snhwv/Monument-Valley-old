import { Vector3, Mesh } from "three";

interface IUserData {
  belongGroup: string;
  connectPlane: IUserData[];
  index: number;
  normal: Vector3;
  plane: Mesh;
  checked: boolean;
}

export function find(
  originUserData: IUserData,
  targetUserData: IUserData,
  path: any[]
) {
  path.push(originUserData);
  originUserData.checked = true;
  const connectPlane = originUserData.connectPlane;
  for (let i = 0; i < connectPlane.length; i++) {
    const connect = connectPlane[i];
    if (connect.checked) {
      continue;
    }
    if (connect === targetUserData) {
      console.log("got it");
      path.push(connect);
      break;
    } else {
      path.push(...find(connect, targetUserData, path));
      // path.push(...dfs(connect, targetUserData, path));
    }
  }
  return path;
}
