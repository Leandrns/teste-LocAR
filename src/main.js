import * as THREE from "three";
import * as LocAR from "locar";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

// Configurando a câmera
const camera = new THREE.PerspectiveCamera(
	80,
	window.innerWidth / window.innerHeight,
	0.001,
	1000
	// Mais detalhes sobre esse tipo de câmera em: https://threejs.org/docs/?q=pers#api/en/cameras/PerspectiveCamera
);

// Criando um renderizador WebGL que exibe as cenas
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// Mais detalhes: https://threejs.org/docs/?q=web#api/en/renderers/WebGLRenderer

// Criando uma cena
const scene = new THREE.Scene();

// Adicionando uma luz ambiente e uma luz direcional à cena
const ambientLight = new THREE.AmbientLight(0xffffff, 1); // luz branca e suave
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 10, 10); // posição da luz
scene.add(directionalLight);

// Criando um AR baseado em localização que recebe a cena e a câmera como parâmetros
const locar = new LocAR.LocationBased(scene, camera);

// Ajuste e redimensionamento da câmera de acordo com a janela do navegador
window.addEventListener("resize", (e) => {
	// pega o evento de resize
	renderer.setSize(window.innerWidth, window.innerHeight); // atualiza o tamanho do renderizador
	camera.aspect = window.innerWidth / window.innerHeight; // atualiza a proporção da câmera
	camera.updateProjectionMatrix(); // atualiza a matriz de projeção da câmera
});

// Criação de um objeto responsável por mostrar o vídeo da câmera como fundo da cena, recebendo o renderizador como parâmetro
const cam = new LocAR.WebcamRenderer(renderer);

let firstLocation = true;

// Criação de um objeto para controlar a orientação do dispositivo, recebendo a câmera como parâmetro
const deviceOrientationControls = new LocAR.DeviceOrientationControls(camera);

const loader = new GLTFLoader();
let mixer;
let modelGroup;

const clock = new THREE.Clock();

// Adicionando um evento manipulador, que nesse ocorre quando o GPS do dispositivo é atualizado
locar.on("gpsupdate", (pos, distMoved) => {
	if (firstLocation) {
		loader.load("./models/Horse.glb", (gltf) => {
			modelGroup = gltf.scene;

			modelGroup.scale.set(0.5, 0.5, 0.5); // Redimensiona o grupo todo

			locar.add(modelGroup, pos.coords.longitude + 0.0009, pos.coords.latitude);
			
			// modelGroup.traverse((child) => {
			// 	if (child.isMesh) {
			// 		child.scale.set(0.5,0.5,0.5); // Redimensiona o modelo

			// 		locar.add(
			// 			child,
			// 			pos.coords.longitude + 0.0009, // pega a longitude do GPS e adiciona 0.0009
			// 			pos.coords.latitude // pega a latitude do GPS e adiciona 0.0009
			// 		);
			// 	}
			// });
			mixer = new AnimationMixer(modelGroup);
			gltf.animations.forEach((clip) => {
				mixer.clipAction(clip).play();
			});
		});

		firstLocation = false; // para não criar mais de um objeto
	}
});

locar.startGps(); // Inicia o GPS

renderer.setAnimationLoop(animate); // Executa a geração do objeto 3D em loop

function animate() {
	const delta = clock.getDelta(); // pega o tempo entre os frames
	if (mixer) {
		mixer.update(delta); // Atualiza o mixer de animação
	}

	if (modelGroup) {
		modelGroup.rotation.y += delta * 0.5; // Rotaciona o modelo em torno do eixo Y
	}

	cam.update(); // Atualiza o vídeo da câmera
	deviceOrientationControls.update(); // Atualiza a orientação da câmera com base nos movimentos do dispositivo
	renderer.render(scene, camera); // Renderiza a cena e a câmera atualizados
}
