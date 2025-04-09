import * as THREE from "three";
import * as LocAR from "locar";

function startLocAR() {
	// Câmera
	const camera = new THREE.PerspectiveCamera(
		80,
		window.innerWidth / window.innerHeight,
		0.001,
		1000
	);
	
	// Renderizador
	const renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
	
	// Cena
	const scene = new THREE.Scene();
	
	// LocAR
	const locar = new LocAR.LocationBased(scene, camera);
	
	// Webcam + orientação
	const cam = new LocAR.WebcamRenderer(renderer);
	const deviceOrientationControls = new LocAR.DeviceOrientationControls(camera);
	
	// Redimensionamento da janela
	window.addEventListener("resize", () => {
		renderer.setSize(window.innerWidth, window.innerHeight);
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
	});
	
	let firstLocation = true;
	let cubePOI = null; // Guarda o mesh e coordenadas do cubo
	
	locar.on("gpsupdate", (pos) => {
		if (firstLocation) {
			const geometry = new THREE.BoxGeometry(10, 10, 10);
			const material = new THREE.MeshBasicMaterial({ color: 0x00ffcc });
			const cube = new THREE.Mesh(geometry, material);
	
			// Coloca o cubo a 10 metros ao norte (aproximadamente)
			const latOffset = 0.00009; // Aproximadamente 10 metros
			const targetLat = pos.coords.latitude + latOffset;
			const targetLon = pos.coords.longitude;
	
			locar.add(cube, targetLon, targetLat);
	
			cubePOI = {
				mesh: cube,
				lat: targetLat,
				lon: targetLon,
			};
	
			firstLocation = false;
		}
	});
	
	// Inicia GPS
	locar.startGps();
	
	// Loop de animação
	renderer.setAnimationLoop(animate);
	
	function animate() {
		cam.update();
		deviceOrientationControls.update();
	
		// Atualiza escala do cubo com base na distância
		if (cubePOI) {
			const distance = locar.getDistanceFromUser(cubePOI.lat, cubePOI.lon);
			const scale = Math.max(0.3, 8 / distance); // mínimo de escala pra não desaparecer
			cubePOI.mesh.scale.set(scale, scale, scale);
		}
	
		renderer.render(scene, camera);
	}
}

document.getElementById("startBtn").addEventListener("click", () => {
	startLocAR(); // sua função de inicialização vai aqui
	document.getElementById("startBtn").style.display = "none";
});
