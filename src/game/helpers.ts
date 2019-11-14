import { GridHelper, AxesHelper } from 'three';
import { scene } from './base';

// const gridHelper = new GridHelper(800, 80);
// scene.add(gridHelper);
var axesHelper = new AxesHelper( 800 );
scene.add( axesHelper );