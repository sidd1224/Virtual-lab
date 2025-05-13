let dropletTimer = 0;
let droplets = [];
let dropletCount = 0;
let font;
let lightSlider;
let resetButton;
let stopButton;

let graphData = [];
let startTime;
let isRunning = true;

function preload() {
  font = loadFont('/static/labs/fonts/myFont.ttf');  // Ensure the correct path
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  lightSlider = createSlider(0, 100, 50);
  lightSlider.position(20, 20);
  lightSlider.style('width', '200px');

  resetButton = createButton("Reset");
  resetButton.position(230, 20);
  resetButton.mousePressed(resetSimulation);

  stopButton = createButton("Stop");
  stopButton.position(300, 20);
  stopButton.mousePressed(toggleSimulation);

  textFont(font);
  startTime = millis();
}

function draw() {
  background(200, 230, 255);
  orbitControl();
  directionalLight(255, 255, 255, 0.5, 1, -0.5);
  ambientLight(100);

  let lightVal = lightSlider.value();

  drawSun(lightVal);
  drawSunRays(lightVal);
  drawGlassBox();
  drawPot();
  drawPlant();
  drawPlasticCover();
  drawDroplets();
  drawLabels();

  if (isRunning) {
    let rate1 = lightVal / 10;
    if (rate1 > 0 && millis() - dropletTimer > 1000 / rate1) {
      let x = random(-20, 20);
      let y = random(-80, -30);
      droplets.push({ x, y, z: random(-20, 20), size: 3 });
      dropletCount++;
      dropletTimer = millis();

      graphData.push({ time: millis() / 1000, count: dropletCount });
      if (graphData.length > 100) graphData.shift();
    }
  }

  displayText2D();
  drawGraph2D();
}

function resetSimulation() {
  droplets = [];
  dropletCount = 0;
  graphData = [];
  startTime = millis();
  isRunning = true;
  stopButton.html("Stop");
}

function toggleSimulation() {
  isRunning = !isRunning;
  stopButton.html(isRunning ? "Stop" : "Resume");
}

function drawPot() {
  push();
  fill(139, 69, 19);
  noStroke();
  translate(0, 150, 0);
  cylinder(60, 40);
  pop();
}

function drawPlant() {
  push();
  translate(0, 80, 0);
  fill(34, 139, 34);
  cylinder(3, 60);

  let angleFactor = map(lightSlider.value(), 0, 100, 0, PI / 18);

  for (let i = 0; i < 6; i++) {
    push();
    let height = -i * 10;
    translate(0, height, 0);

    push();
    rotateZ(PI / 6 + angleFactor);
    translate(15, 0, 0);
    cylinder(1, 20);
    translate(0, -10, 0);
    drawLeaf();
    pop();

    push();
    rotateZ(-PI / 6 - angleFactor);
    translate(-15, 0, 0);
    cylinder(1, 20);
    translate(0, -10, 0);
    drawLeaf();
    pop();

    pop();
  }
  pop();
}

function drawLeaf() {
  fill(50, 205, 50);
  beginShape();
  vertex(0, 0, 0);
  bezierVertex(5, -5, 10, -10, 0, -20);
  bezierVertex(-10, -10, -5, -5, 0, 0);
  endShape(CLOSE);
}

function drawPlasticCover() {
  push();
  noFill();
  stroke(135, 206, 250, 100);
  strokeWeight(1);
  translate(0, 20, 0);
  scale(1, 1.5, 1);
  sphere(60, 24, 18);
  pop();
}

function drawDroplets() {
  push();
  fill(173, 216, 230, 180);
  noStroke();
  for (let i = droplets.length - 1; i >= 0; i--) {
    let d = droplets[i];
    push();
    translate(d.x, d.y, d.z);
    sphere(d.size);
    pop();
  }
  pop();
}

function drawLabels() {
  push();
  fill(0);
  textFont(font);
  textSize(12);
  textAlign(CENTER);

  push();
  translate(0, 180, 70);
  text("Pot", 0, 0);
  pop();

  push();
  translate(70, 60, 70);
  text("---------->Plant", 0, 0);
  pop();

  push();
  translate(-90, -40, 70);
  text("Plastic Cover --->", 0, 0);
  pop();

  push();
  translate(70, -45, 30);
  text("  --> Water Droplets", 0, 0);
  pop();

  pop();
}

function displayText2D() {
  resetMatrix();
  camera();
  fill(0);
  textSize(14);
  textFont(font);
  textAlign(LEFT);

  let lightVal = lightSlider.value();
  let elapsed = ((millis() - startTime) / 1000).toFixed(1);

  text("Light Intensity: " + lightVal + "%", -700, -290);
  text("Droplet Formation Rate: " + lightVal + "%", -700,-275);
  text("Total Droplets Formed: " + dropletCount, -700,-260);
  text("Time Elapsed: " + elapsed + "s", -700,-245);
  text("Experiment: Transpiration in Plants", -120, 220);
}

function drawGraph2D() {
  push();
  resetMatrix();
  camera();
  translate(width - 340, height - 190);

  stroke(0);
  noFill();
  rect(0, 0, 300, 120);

  if (graphData.length > 1) {
    stroke(0, 100, 200);
    noFill();
    beginShape();
    for (let i = 0; i < graphData.length; i++) {
      let x = map(i, 0, graphData.length - 1, 0, 300);
      let y = map(graphData[i].count, 0, max(dropletCount, 1), 110, 10);
      vertex(x, y);
    }
    endShape();
  }

  fill(0);
  noStroke();
  textSize(12);
  text("Droplet Count Over Time", 60, -10);
  pop();
}

function drawSun(intensity) {
  push();
  let sunBrightness = map(intensity, 0, 100, 50, 255);
  translate(-300, -200, -300);
  fill(255, 255, 0, sunBrightness);
  noStroke();
  sphere(30);
  pop();
}

function drawSunRays(intensity) {
  push();
  stroke(255, 255, 0, map(intensity, 0, 100, 50, 100));
  strokeWeight(2);
  for (let i = -5; i <= 5; i++) {
    line(-300, -200, -300, i * 20, 100, 0);
  }
  pop();
}

function drawGlassBox() {
  push();
  noFill();
  stroke(100, 100, 255, 30);
  strokeWeight(1);
  box(300, 300, 300);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
