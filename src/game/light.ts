import { scene } from './base';
import THREE,{ DirectionalLight, AmbientLight } from 'three';

var directionalLight = new DirectionalLight(0xffffff,0.7);
directionalLight.position.set(600, 800, 600);
scene.add(directionalLight);

var ambientLight = new AmbientLight(0xffffff,0.4); // soft white light
scene.add(ambientLight);

// dat.add(camera,'position',)