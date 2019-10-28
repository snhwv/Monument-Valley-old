import { Vector3, MeshLambertMaterial, Color } from "three";
import { gui } from "@/utils/dat";

export const axis = {
  x: new Vector3(1, 0, 0),
  y: new Vector3(0, 1, 0),
  z: new Vector3(0, 0, 1)
};

export const unitLength = 20;

export const mainMaterial = new MeshLambertMaterial({ color: 0xf3e5cc });
export const secendMaterial = new MeshLambertMaterial({ color: 0xf6a0a4 });

var data = {
  color: mainMaterial.color.getHex(),
  emissive: mainMaterial.emissive.getHex(),
};
var secendData = {
  color: secendMaterial.color.getHex(),
  emissive: secendMaterial.emissive.getHex(),
};

var folder = gui.addFolder("mainMaterial");
var secendfolder = gui.addFolder("secendMaterial");

folder.addColor(data, "color").onChange(handleColorChange(mainMaterial.color));
secendfolder.addColor(secendData, "color").onChange(handleColorChange(secendMaterial.color));
folder
  .addColor(data, "emissive")
  .onChange(handleColorChange(mainMaterial.emissive));
  secendfolder
  .addColor(secendData, "emissive")
  .onChange(handleColorChange(secendMaterial.emissive));

function handleColorChange(color: Color) {
  return function(value: any) {
    if (typeof value === "string") {
      value = value.replace("#", "0x");
    }

    color.setHex(value);
  };
}