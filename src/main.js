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

const ambientLight = new THREE.AmbientLight(0xffffff, 1); // luz branca e suave
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 10, 10); // posição da luz
scene.add(directionalLight);

// Criando um AR baseado em localização que recebe a cena e a câmera como parâmetros
const locar = new LocAR.LocationBased(scene, camera);

// Ajuste e redimensionamento da câmera de acordo com a janela do navegador
window.addEventListener("resize", (e) => {	// pega o evento de resize
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

// Adicionando um evento manipulador, que nesse ocorre quando o GPS do dispositivo é atualizado
locar.on("gpsupdate", (pos, distMoved) => {
	if (firstLocation) {
		// Criando um objeto Three.js que gera uma geometria de cubo
		const geom = new THREE.BoxGeometry(20, 20, 20);

		// Criando uma malha 3D passando a geometria e o material do objeto como parâmetros
		const mesh = new THREE.Mesh(
			geom,
			new THREE.MeshPhongMaterial({ color: "black", emissive: "purple", shininess: 100 })
			// O material é um MeshPhongMaterial, que é um material que reflete a luz
			// Mais detalhes sobre os materiais podem ser vistos em https://threejs.org/manual/#en/materials
		);


		loader.load("./models/Flamingo.glb", (gltf) => {
			const modelGroup = gltf.scene;

			modelGroup.traverse((child) => {
				if (child.isMesh) {
					child.scale.set(0.5,0.5,0.5); // Redimensiona o modelo
					
					locar.add(
						child,
						pos.coords.longitude + 0.0009, // pega a longitude do GPS e adiciona 0.0009
						pos.coords.latitude // pega a latitude do GPS e adiciona 0.0009
					);
				}
			});
		});

		// Adicionando o objeto 3D em uma latitude e longitude específicas
		// locar.add(
		// 	mesh,
		// 	pos.coords.longitude + 0.0009, // pega a longitude do GPS e adiciona 0.0009
		// 	pos.coords.latitude + 0.0009 // pega a latitude do GPS e adiciona 0.0009
		// );
        
		firstLocation = false; // para não criar mais de um objeto
	}
});

locar.startGps(); // Inicia o GPS

renderer.setAnimationLoop(animate); // Executa a geração do objeto 3D em loop

function animate() {
	cam.update(); // Atualiza o vídeo da câmera
	deviceOrientationControls.update(); // Atualiza a orientação da câmera com base nos movimentos do dispositivo
	renderer.render(scene, camera); // Renderiza a cena e a câmera atualizados
}