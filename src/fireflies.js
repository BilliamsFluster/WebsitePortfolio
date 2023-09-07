import * as THREE from 'three';
const FIREFLY_POOL = [];
const LIGHT_POOL = [];
export const fireflies = [];
const fireflyGeometry = new THREE.SphereGeometry(0.1, 32, 32); // adjust size as needed
const fireflyMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 }); // adjust color as needed

export function createFirefly(scene) {
  let firefly, fireflyLight;

  if (FIREFLY_POOL.length > 0) {
    firefly = FIREFLY_POOL.pop();
    //fireflyLight = LIGHT_POOL.pop();
  } else {
    firefly = new THREE.Mesh(fireflyGeometry, fireflyMaterial);
    //fireflyLight = new THREE.PointLight(0xffff00, 1, 2); // adjust color, intensity and distance as needed
  }

  firefly.position.set(Math.random() * 10 - 5, Math.random() * 20 - 10, Math.random() * 100 - 50); // adjust range as needed
  //fireflyLight.position.copy(firefly.position);

  scene.add(firefly, fireflyLight);
  
  return {
    firefly, 
    fireflyLight, 
    velocity: new THREE.Vector3((Math.random() - 0.5) * 0.1, (Math.random() - 0.5) * 0.1, (Math.random() - 0.5) * 0.1)
  };
}

function destroyFirefly(scene, fireflyObject) {
  scene.remove(fireflyObject.firefly, fireflyObject.fireflyLight);

  FIREFLY_POOL.push(fireflyObject.firefly);
  //LIGHT_POOL.push(fireflyObject.fireflyLight);
}


