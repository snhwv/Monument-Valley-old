import { scene } from "./base";
import THREE, {
  DirectionalLight,
  AmbientLight,
  PointLight,
  Color,
  Scene,
  Fog,
  HemisphereLight,
  SphereBufferGeometry,
  MeshBasicMaterial,
  Mesh
} from "three";
import { gui } from "@/utils/dat";

var directionalLight = new DirectionalLight(0xffffff, 1);
directionalLight.position.set(300, 360, 240);
scene.add(directionalLight);

var ambientLight = new AmbientLight(0xffffff, 0.4); // soft white light
scene.add(ambientLight);

var folderScene = gui.addFolder("Scene");

var sceneData = {
  background: "#000000",
  "ambient light": ambientLight.color.getHex(),
  "directional light": directionalLight.color.getHex(),
  "direct intensity": directionalLight.intensity,
  "ambient intensity": ambientLight.intensity,
  "position x": directionalLight.position.x,
  "position y": directionalLight.position.y,
  "position z": directionalLight.position.z
};

folderScene
  .addColor(sceneData, "ambient light")
  .onChange(handleColorChange(ambientLight.color));
folderScene
  .addColor(sceneData, "directional light")
  .onChange(handleColorChange(directionalLight.color));

folderScene.add(sceneData, "direct intensity", 0, 1).onChange((value: number) => {
  directionalLight.intensity = value;
});
folderScene.add(sceneData, "ambient intensity", 0, 1).onChange((value: number) => {
  ambientLight.intensity = value;
});
folderScene.add(sceneData, "position x", 0, 600).onChange((value: number) => {
  directionalLight.position.setX(value);
});
folderScene.add(sceneData, "position y", 0, 600).onChange((value: number) => {
  directionalLight.position.setY(value);
});
folderScene.add(sceneData, "position z", 0, 600).onChange((value: number) => {
  directionalLight.position.setZ(value);
});

function handleColorChange(color: Color) {
  return function(value: any) {
    if (typeof value === "string") {
      value = value.replace("#", "0x");
    }

    color.setHex(value);
  };
}
guiSceneFog(folderScene, scene);

function guiSceneFog(folder: any, scene: Scene) {
  var fogFolder = folder.addFolder("scene.fog");
  const fogColor = new Color("rgba(0,0,0)").getHex();
  var fog = new Fog(fogColor, 0, 1300);

  var data = {
    fog: {
      "THREE.Fog()": false,
      "scene.fog.color": fog.color.getHex()
    }
  };

  fogFolder.add(data.fog, "THREE.Fog()").onChange(function(useFog: boolean) {
    if (useFog) {
      scene.fog = fog;
    } else {
      scene.fog = null;
    }
  });

  fogFolder
    .addColor(data.fog, "scene.fog.color")
    .onChange(handleColorChange(fog.color));
}

// const light1 = new PointLight(0xFFCC66, 0.5, 500);
// light1.position.set(100, 600, 100);

// var sphere = new SphereBufferGeometry(10, 16, 8);
// light1.add(
//   new Mesh(sphere, new MeshBasicMaterial({ color: 0xff0040 }))
// );
// scene.add(light1);
