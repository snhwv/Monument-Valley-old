import { Scene, PerspectiveCamera, WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
let scene: Scene, camera: PerspectiveCamera, renderer: WebGLRenderer;
//创建场景
scene = new Scene();
//相机
camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
//渲染器
renderer = new WebGLRenderer();
//设置画布大小
renderer.setSize(window.innerWidth, window.innerHeight);
//加入到body
document.body.appendChild(renderer.domElement);

camera.position.z = 5;
const controls = new OrbitControls(camera, renderer.domElement);

//渲染循环
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

export { scene, camera, renderer };
