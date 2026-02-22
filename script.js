let scene, camera, renderer;
let cards = [];
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('portfolioCanvas'), antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  const light = new THREE.PointLight(0x00ffff, 2, 100);
  light.position.set(0, 0, 5);
  scene.add(light);

  loadProjects();
  document.getElementById('loadingScreen').style.display = 'none';
}

function loadProjects() {
  fetch('projects.json')
    .then(res => res.json())
    .then(data => {
      data.projects.forEach((project, i) => {
        const geometry = new THREE.BoxGeometry(1.5, 1, 0.2);
        const material = new THREE.MeshStandardMaterial({
          color: 0x111111,
          emissive: 0x00ffff,
          emissiveIntensity: 0.5
        });
        const card = new THREE.Mesh(geometry, material);
        card.position.x = (i - data.projects.length / 2) * 2.2;
        card.userData = project;
        scene.add(card);
        cards.push(card);
      });
    });
}

function animate() {
  requestAnimationFrame(animate);
  cards.forEach(card => {
    card.rotation.y += 0.01;
  });
  renderer.render(scene, camera);
}

function navigate(category) {
  cards.forEach(card => {
    const match = card.userData.type.toLowerCase() === category;
    card.visible = match;
  });
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener('click', onClick);

function onClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(cards);

  if (intersects.length > 0) {
    const project = intersects[0].object.userData;
    showModal(project);
  }
}

function showModal(project) {
  document.getElementById('modalTitle').textContent = project.title;
  document.getElementById('modalDescription').textContent = project.description || "No description provided.";
  document.getElementById('modalLink').href = project.link;
  document.getElementById('projectModal').style.display = 'block';
}

function closeModal() {
  document.getElementById('projectModal').style.display = 'none';
}

document.getElementById('contactForm').addEventListener('submit')