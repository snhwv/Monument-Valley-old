import { Scene, OrthographicCamera, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
let scene: Scene, camera: OrthographicCamera, renderer: WebGLRenderer;
//创建场景
scene = new Scene();
const width = window.innerWidth;
const height = window.innerHeight;
//相机
camera = new OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 1, 10000);
//渲染器
renderer = new WebGLRenderer({
  alpha: true,
  antialias: true,
});
//设置画布大小
renderer.setSize(width, height);
//加入到body
document.body.appendChild(renderer.domElement);

camera.position.set(1000, 1000, 1000);
const controls = new OrbitControls(camera, renderer.domElement);

//渲染循环
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

export { scene, camera, renderer };
