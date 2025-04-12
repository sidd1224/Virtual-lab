let myFont;
let tempSlider;
let showBoiling = false;
let temperature = 25;
let bubbles = [];
let bubbleTimer = 0;

let waterHeight = 60;
let lastEvaporationTime = 0;

let steam = [];
let refillButton;

function preload() {
  myFont = loadFont('/static/labs/fonts/myFont.ttf'); 
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  textFont(myFont);

  tempSlider = createSlider(25, 110, 25);
  tempSlider.position(20, 20);
  tempSlider.style('width', '200px');

  refillButton = createButton('Refill Water');
  refillButton.position(windowWidth - 120, 20);
  refillButton.mousePressed(() => {
    waterHeight = 60;
  });
}

function draw() {
  background(220);
  orbitControl();
  ambientLight(100);
  directionalLight(255, 255, 255, 0, -1, -1);

  temperature = tempSlider.value();
  showBoiling = temperature >= 100;

  // Evaporation
  if (temperature > 50 && millis() - lastEvaporationTime > 1000) {
    let rate1 = (temperature - 50) / 100;
    waterHeight = max(0, waterHeight - rate1);
    lastEvaporationTime = millis();
  }

  // Bubbles
  if (showBoiling && millis() - bubbleTimer > 200) {
    bubbles.push({ x: random(-20, 20), y: 100, z: random(-20, 20), speed: random(0.5, 1.5) });
    bubbleTimer = millis();
  }

  // Steam
  if (showBoiling && random() < 0.3) {
    steam.push({ x: random(-10, 10), y: 20, z: random(-10, 10), speed: random(0.2, 0.6), alpha: 255 });
  }

  drawTableSetup();
  drawBeakerWithWater();
  drawBurner();
  drawThermometer();
  drawBubbles();
  drawSteam();
  drawText2D();
}

function drawTableSetup() {
  push();
  translate(0, 150, 0);
  fill(100);
  box(windowWidth * 0.2, 20, windowWidth * 0.2);
  pop();
}

function drawBeakerWithWater() {
  push();
  translate(0, 50, 0);
  noFill();
  stroke(100);
  strokeWeight(1.5);
  rotateX(PI);
  cylinder(40, 100);
  pop();

  push();
  translate(0, 50 + (100 - waterHeight) / 2, 0);
  fill(showBoiling ? color(0, 191, 255) : color(173, 216, 230));
  noStroke();
  cylinder(38, waterHeight);
  pop();
}

function drawBurner() {
  push();
  translate(0, 155, 0);
  fill(150, 0, 0);
  cylinder(20, 10);
  pop();

  if (temperature > 40) {
    push();
    translate(0, 145, 0);
    fill(255, 140, 0);
    cone(10, 30);
    pop();
  }
}

function drawThermometer() {
  push();
  translate(150, -10, 80);

  push();
  fill(255, 255, 255, 50);
  stroke(150);
  strokeWeight(0.5);
  cylinder(8, 200);
  pop();

  push();
  translate(0, 100, 0);
  fill(255, 0, 0);
  noStroke();
  sphere(10);
  pop();

  let h = map(temperature, 25, 110, 1, 180);

  push();
  translate(0, 100 - h / 2, 0);
  fill(255, 0, 0);
  noStroke();
  cylinder(10, h);
  pop();

  drawTemperatureReadings();
  pop();
}

function drawTemperatureReadings() {
  fill(0);
  textSize(10);
  textFont(myFont);
  textAlign(LEFT, CENTER);

  for (let t = 25; t <= 110; t += 15) {
    let y = map(t, 25, 110, 100, -100);
    push();
    translate(20, y, 0);
    text(`${t}°C`, 0, 0);
    pop();
  }
}

function drawBubbles() {
  push();
  fill(255);
  noStroke();
  for (let i = bubbles.length - 1; i >= 0; i--) {
    let b = bubbles[i];
    push();
    translate(b.x, b.y, b.z);
    sphere(5);
    pop();
    b.y -= b.speed;
    if (b.y < 0) bubbles.splice(i, 1);
  }
  pop();
}

function drawSteam() {
  push();
  noStroke();
  for (let i = steam.length - 1; i >= 0; i--) {
    let s = steam[i];
    fill(200, s.alpha);
    push();
    translate(s.x, s.y, s.z);
    sphere(4);
    pop();
    s.y -= s.speed;
    s.alpha -= 2;
    if (s.alpha <= 0) steam.splice(i, 1);
  }
  pop();
}

function drawText2D() {
  resetMatrix();
  camera();
  fill(0);
  textSize(14);
  textFont(myFont);
  textAlign(LEFT);
  let xOffset = 30;
  let baseY = 160;

  text("Experiment: Determination of Boiling Point of Water", -150,250);
  text("Adjust the temperature using the slider to observe boiling.", -750, -300);
  text("Temperature: " + temperature + "°C", -750, -285);

  let evaporationRate = 0;
  if (temperature > 50) {
    evaporationRate = ((temperature - 50) / 2).toFixed(2);
  }
  text("Evaporation Rate: " + evaporationRate + " ml/min", -750, -270);
  text("Water Level: " + waterHeight.toFixed(1) + " units", -750, -255);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if (immersionSlider) {
    immersionSlider.position(20, 20); // Only call if it's defined
  }
}

