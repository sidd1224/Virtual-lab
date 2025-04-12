let t = 0;
let rBase = 80;
let foodParticles = [];
let amoebaPos;
let font;
let streamShift = 0;
let showScene = false;
let startButton;

function preload() {
  font = loadFont('/static/labs/fonts/myFont.ttf'); 
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  textFont(font);
  textSize(14);
  amoebaPos = createVector(0, 0);

  for (let i = 0; i < 5; i++) {
    foodParticles.push(createVector(random(-150, 150), random(-150, 150)));
  }

  startButton = createButton("Start Microscope");
  startButton.position(20, 20);
  startButton.mousePressed(() => {
    showScene = true;
    startButton.hide();
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);
  orbitControl();
  lights();

  if (!showScene) {
    drawIntro();
    return;
  }

  drawMicroscopeScene();
}

function drawIntro() {
  resetMatrix();
  fill(255);
  textAlign(CENTER);
  textSize(min(width, height) * 0.03);
  text("🧫 Amoeba Microscope Simulation", 0, -height / 2 + 100);
  textSize(min(width, height) * 0.02);
  text("Click 'Start Microscope' to begin observing.", 0, -height / 2 + 140);
}

function drawMicroscopeScene() {
  drawFoodParticles();
  drawAmoeba();
  drawLabels();

  // Microscope Circle View
  resetMatrix();
  noFill();
  noStroke(255);
  strokeWeight(4);
  ellipse(width / 2, height / 2, min(width, height) * 0.5);

  t += 1;
  streamShift += 0.02;
}

function drawAmoeba() {
  let closestFood = null;
  let minDist = Infinity;
  for (let f of foodParticles) {
    let d = dist(amoebaPos.x, amoebaPos.y, f.x, f.y);
    if (d < minDist) {
      minDist = d;
      closestFood = f;
    }
  }

  if (closestFood && minDist > 20) {
    let dir = p5.Vector.sub(closestFood, amoebaPos).normalize().mult(0.5);
    amoebaPos.add(dir);
  } else if (closestFood && minDist <= 20) {
    foodParticles.splice(foodParticles.indexOf(closestFood), 1);
  }

  // Cytoplasmic streaming
  push();
  translate(amoebaPos.x, amoebaPos.y, -10);
  for (let i = 0; i < 500; i++) {
    let angle = noise(i * 0.1, streamShift) * TWO_PI * 2;
    let r = random(rBase * 0.6);
    let x = cos(angle) * r;
    let y = sin(angle) * r;
    stroke(150 + r, 200, 255, 40);
    point(x, y);
  }
  pop();

  // Outer amoeba
  push();
  fill(100, 200, 220, 180);
  translate(amoebaPos.x, amoebaPos.y, -20);
  beginShape();
  let totalPoints = 40;
  for (let i = 0; i < totalPoints; i++) {
    let angle = map(i, 0, totalPoints, 0, TWO_PI);
    let r = rBase + 10 * sin(t * 0.05 + i * 0.8);
    let x = r * cos(angle);
    let y = r * sin(angle);
    vertex(x, y);
  }
  endShape(CLOSE);
  pop();

  // Nucleus
  push();
  fill(150, 100, 200, 220);
  translate(amoebaPos.x, amoebaPos.y, 10);
  sphere(15);
  pop();

  // Vacuole
  push();
  fill(255, 255, 200, 180);
  translate(amoebaPos.x + 25, amoebaPos.y + 15, 5);
  sphere(10);
  pop();
}

function drawFoodParticles() {
  for (let f of foodParticles) {
    push();
    translate(f.x, f.y, 0);
    fill(255, 150, 0);
    sphere(6);
    pop();
  }
}

function drawLabels() {
  resetMatrix();
  fill(255);
  textAlign(LEFT);
  textSize(min(width, height) * 0.015);

  let x = -260;
  let y = -260;
  let gap = 20;

  text("🔬 Amoeba Under Microscope", x, y);
  text("🧠 Nucleus", x, y + gap);
  text("💧 Vacuole", x, y + gap * 2);
  text("🍕 Food Particle", x, y + gap * 3);
  text("🌊 Cytoplasmic Streaming", x, y + gap * 4);
  text("🦶 Pseudopodia Motion", x, y + gap * 5);

  // Icons
  noStroke();

  fill(255);
  ellipse(x - 20, y - 5, 12);

  fill(150, 100, 200);
  ellipse(x - 20, y + gap - 5, 15);

  fill(255, 255, 200);
  ellipse(x - 20, y + gap * 2 - 5, 12);

  fill(255, 150, 0);
  ellipse(x - 20, y + gap * 3 - 5, 10);

  fill(100, 200, 220);
  ellipse(x - 20, y + gap * 4 - 5, 14);

  // Pseudopodia icon
  fill(0, 255, 100);
  beginShape();
  for (let i = 0; i < TWO_PI; i += PI / 4) {
    let r = 6 + 2 * sin(millis() / 500 + i * 3);
    vertex(x - 20 + cos(i) * r, y + gap * 5 - 5 + sin(i) * r);
  }
  endShape(CLOSE);
}
