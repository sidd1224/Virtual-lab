let immersionSlider;
let objectY = 100;
let objectHeight = 80;
let baseWaterLevel = 300;
let animationSpeed = 2;

let weightInAir = 10; // in Newtons
let displacedVolume = 0;
let buoyantForce = 0;
let weightInWater = 0;
let immersedDepth = 0;
let springExtension = 0;

let splashParticles = [];
let lastImmersion = 0;

let myFont;

function preload() {
  myFont = loadFont('/static/labs/fonts/myFont.ttf'); // Replace with your own TTF font
}

function setup() {
createCanvas(windowWidth, windowHeight, WEBGL);
  immersionSlider = createSlider(0, objectHeight, 0, 1);
  immersionSlider.position(20, 20);
}

function draw() {
  background(240);
  orbitControl();
  ambientLight(150);
  directionalLight(255, 255, 255, -1, -1, -1);

  immersedDepth = immersionSlider.value();
  calculateForces();
  animateObject();

  if (immersedDepth > lastImmersion) {
    generateSplashParticles();
  }
  lastImmersion = immersedDepth;

  push();
  rotateX(-PI / 6); // Upward camera angle
  drawContainer();
  drawObject();
  updateSplashParticles();
  pop();

  displayForces2D();
}

function drawContainer() {
  let displacedHeight = map(immersedDepth, 0, objectHeight, 0, objectHeight); // Optional
  let waterHeight = 200 + displacedHeight;

  // To align bottom of water to base of container (baseWaterLevel + 150),
  // we place the center of the water box at (baseWaterLevel + 150 - waterHeight / 2)
  let waterY = baseWaterLevel + 250 - waterHeight / 2;

  // Draw water
  push();
  noStroke();
  fill(30, 216, 230, 200);
  translate(0, waterY - 250, 0); // subtract 250 due to WebGL coordinate center
  box(200, waterHeight, 200);
  pop();

  // Draw transparent container
  push();
  noFill();
  stroke(0);
  strokeWeight(2);
  translate(0, baseWaterLevel - 150, 0); // center of 300-height box
  box(200, 300, 200);
  pop();
}

function animateObject() {
  let targetY = baseWaterLevel - objectHeight + immersedDepth;
  objectY += (targetY - objectY) * 0.1;

  let targetExtension = map(weightInAir - buoyantForce, 0, weightInAir, 0, 50);
  springExtension += (targetExtension - springExtension) * 0.1;
}

function drawObject() {
  let submergedY = objectY + objectHeight - immersedDepth;
  let centerY = (objectY + submergedY) / 2;

  push();
  translate(0, centerY - 250, 0);
  fill(180);
  box(60, objectHeight, 60);
  pop();

  // Spring
  let springStartY = -220;
  let springEndY = objectY - 250;
  let springSegments = 10;
  let segmentLength = (springEndY - springStartY) / springSegments;

  stroke(0);
  strokeWeight(2);
  for (let i = 0; i < springSegments; i++) {
    let x1 = (i % 2 === 0 ? -5 : 5);
    let y1 = springStartY + i * segmentLength;
    let x2 = ((i + 1) % 2 === 0 ? -5 : 5);
    let y2 = springStartY + (i + 1) * segmentLength;
    line(x1, y1, 0, x2, y2, 0);
  }

  // Hook base
  noStroke();
  fill(100);
  push();
  translate(0, -240, 0);
  box(80, 20, 80);
  pop();
}

function calculateForces() {
  displacedVolume = immersedDepth * 0.001;
  buoyantForce = displacedVolume * 9.8 * 1;
  weightInWater = weightInAir - buoyantForce;
}

function displayForces2D() {
  resetMatrix();
  camera();

  noStroke();
  fill(255, 240);

  textFont(myFont);
  fill(0);
  textSize(16);

  text(`Buoyant Force: ${buoyantForce.toFixed(2)} N`, -590, -330);
  text(`Immersed Depth: ${immersedDepth} mm`, 120, -50);
  text(`Weight in Air: ${weightInAir.toFixed(2)} N`, 120, -20);
  text(`Weight in Water: ${weightInWater.toFixed(1)} N`, 120, -90);
}

function generateSplashParticles() {
  for (let i = 0; i < 10; i++) {
    splashParticles.push({
      x: random(-30, 30),
      y: objectY - 250 + objectHeight / 2,
      z: random(-30, 30),
      vx: random(-1, 1),
      vy: random(-2, -5),
      vz: random(-1, 1),
      life: 255
    });
  }
}

function updateSplashParticles() {
  for (let i = splashParticles.length - 1; i >= 0; i--) {
    let p = splashParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.z += p.vz;
    p.vy += 0.1;
    p.life -= 5;

    push();
    translate(p.x, p.y, p.z);
    noStroke();
    fill(0, 150, 255, p.life);
    sphere(3);
    pop();

    if (p.life <= 0) splashParticles.splice(i, 1);
  }
}
