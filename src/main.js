import * as THREE from 'three';
import { ARView } from 'locar';

const initAR = async () => {
  const view = new ARView();
  await view.start();

  const scene = view.scene;
  const camera = view.camera;
  const renderer = view.renderer;

  // Cria o cubo
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0xff9900 });
  const cube = new THREE.Mesh(geometry, material);

  // Posiciona o cubo
  cube.position.set(0, 0, -10); // 10 metros à frente
  scene.add(cube);

  // Loop de renderização com cálculo de distância
  const animate = () => {
    requestAnimationFrame(animate);

    const distance = camera.position.distanceTo(cube.position);
    const scale = Math.max(0.5, 5 / distance);
    cube.scale.set(scale, scale, scale);

    renderer.render(scene, camera);
  };

  animate();
};

initAR();