import THREE, { Object3D, MeshPhongMaterial, MeshLambertMaterial } from "three";
// import("threebsp");
import ThreeBSP from "three-solid";

// 交
export function intersect(objx: any, objy: any) {
  //生成ThreeBSP对象
  var objxBSP = new ThreeBSP(objx);
  var objyBSP = new ThreeBSP(objy);

  //进行并集计算
  var resultBSP = objxBSP.intersect(objyBSP);

  //从BSP对象内获取到处理完后的mesh模型数据
  var result = resultBSP.toGeometry();
  //更新模型的面和顶点的数据
  // result.geometry.computeFaceNormals();
  // result.geometry.computeVertexNormals();

  //重新赋值一个纹理
  // var material = new MeshLambertMaterial({ color: 0x00ffff });
  // result.material = material;
  return result;
}

// 差
export function subtract(objx: any, objy: any) {
  //生成ThreeBSP对象
  var objxBSP = new ThreeBSP(objx);
  var objyBSP = new ThreeBSP(objy);

  var resultBSP = objxBSP.subtract(objyBSP);
  console.log(resultBSP)
  var result = resultBSP.toGeometry();
  return result;
}
// 并
export function union(objx: any, objy: any) {
  //生成ThreeBSP对象
  var objxBSP = new ThreeBSP(objx);
  var objyBSP = new ThreeBSP(objy);

  var resultBSP = objxBSP.union(objyBSP);
  var result = resultBSP.toGeometry();
  return result;
}
