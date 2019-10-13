import THREE, { Object3D, MeshPhongMaterial } from "three";
// import("threebsp");
import ThreeBSP from "three-solid";

export function intersect(objx: Object3D, objy: Object3D) {
  //生成ThreeBSP对象
  var objxBSP = new ThreeBSP(objx);
  var objyBSP = new ThreeBSP(objy);

  //进行并集计算
  var resultBSP = objxBSP.intersect(objyBSP);

  //从BSP对象内获取到处理完后的mesh模型数据
  var result = resultBSP.toMesh();
  //更新模型的面和顶点的数据
  result.geometry.computeFaceNormals();
  result.geometry.computeVertexNormals();

  //重新赋值一个纹理
  var material = new MeshPhongMaterial({ color: 0x00ffff });
  result.material = material;
  return result;
}
