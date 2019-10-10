import { scene } from './base';
import { DirectionalLight, AmbientLight } from 'three';

var directionalLight = new DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1000, 1000, 1000);
scene.add(directionalLight);

var ambientLight = new AmbientLight(0x404040); // soft white light
scene.add(ambientLight);
