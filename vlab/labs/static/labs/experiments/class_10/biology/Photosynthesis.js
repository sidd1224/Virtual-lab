let lightSlider, co2Slider, tempSlider;
let bubbleTimer = 0;
let bubbles = [];
let font;

function preload() {
  font = loadFont('/static/labs/fonts/myFont.ttf'); 
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  lightSlider = createSlider(0, 100, 50);
  lightSlider.position(20, 20);
  lightSlider.style('width', `${min(300, windowWidth * 0.3)}px`);

  co2Slider = createSlider(0, 100, 50);
  co2Slider.position(20, 60);
  co2Slider.style('width', `${min(300, windowWidth * 0.3)}px`);

  tempSlider = createSlider(0, 50, 25);
  tempSlider.position(20, 100);
  tempSlider.style('width', `${min(300, windowWidth * 0.3)}px`);

  textFont(font);
}

function draw() {
  background(200, 230, 255);
  orbitControl();
  directionalLight(255, 255, 255, 0.5, 1, -0.5);
  ambientLight(100);

  drawBeaker();
  drawWater();
  drawPlant();
  drawBubbles();
  drawSunlight();
  drawLightRays();

  let bubbleRate = getPhotosynthesisRate();
  if (millis() - bubbleTimer > 1000 / bubbleRate) {
    let plantTipX = random(-40, 40);
    bubbles.push({ x: plantTipX, y: 50 });
    bubbleTimer = millis();
  }

  displayText2D(bubbleRate);
}

function drawBeaker() {
  push();
  noFill();
  stroke(0);
  strokeWeight(2);
  translate(0, 100, 0);
  box(200, 200, 200);
  pop();
}

function drawWater() {
  push();
  fill(173, 216, 230, 150);
  noStroke();
  translate(0, 150, 0);
  box(200, 100, 200);
  pop();
}

function drawPlant() {
  push();
  translate(0, 180, 0);
  stroke(34, 139, 34);
  fill(34, 139, 34);

  let stemCount = 5;
  for (let i = -40; i <= 40; i += 80 / (stemCount - 1)) {
    push();
    translate(i, 0, 0);
    rotateZ(radians(sin(frameCount * 0.02 + i) * 5));

    let height = 90;
    for (let j = 0; j < height; j += 10) {
      push();
      translate(0, -j, 0);
      cylinder(1.5, 10);
      strokeWeight(0.5);
      for (let angle = 0; angle < TWO_PI; angle += PI / 2) {
        let x = 10 * cos(angle);
        let z = 10 * sin(angle);
        line(0, 0, 0, x, -2, z);
      }
      pop();
    }
    pop();
  }
  pop();
}

function drawBubbles() {
  push();
  noStroke();
  fill(255);
  for (let i = bubbles.length - 1; i >= 0; i--) {
    let b = bubbles[i];
    push();
    translate(b.x, b.y, 0);
    sphere(5);
    pop();
    b.y -= 1;
    if (b.y < -50) bubbles.splice(i, 1);
  }
  pop();
}

function drawSunlight() {
  push();
  translate(250, -250, 0);
  ambientLight(255, 255, 100);
  fill(255, 255, 0);
  noStroke();
  sphere(30);

  for (let i = 0; i < 100; i++) {
    push();
    rotateY(random(TWO_PI));
    rotateX(random(TWO_PI));
    fill(255, 255, 0, 20);
    sphere(1 + random(10));
    pop();
  }
  pop();
}

function drawLightRays() {
  push();
  stroke(255, 255, 0, 100);
  for (let i = -80; i <= 80; i += 20) {
    line(250, -250, i, 0, 150, 0);
  }
  pop();
}

function getPhotosynthesisRate() {
  let light = lightSlider.value();
  let co2 = co2Slider.value();
  let temp = tempSlider.value();
  let tempFactor = 1 - abs(temp - 25) / 25;
  return max(0.5, (light * co2 * tempFactor) / 2000 * 10);
}

function displayText2D(bubbleRate) {
  resetMatrix();
  camera();
  fill(0);
  textSize(14);
  textFont(font);
  textAlign(LEFT);
  let xPos = 30;
  let top = 160;
  text(`Light Intensity: ${lightSlider.value()}%`, -590,-315);
  text(`CO₂ Level: ${co2Slider.value()}%`, -590, -272);
  text(`Temperature: ${tempSlider.value()} °C`, -590,-230);
  text(` = Bubble Rate: ${bubbleRate.toFixed(1)} bubbles/sec`, -590, -205);
  text("Photosynthesis Experiment - Hydrilla Oxygen Release", -175, 250);
}

// Handle window resizing
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  // Reposition sliders proportionally
  lightSlider.position(20, 20);
  co2Slider.position(20, 60);
  tempSlider.position(20, 100);

  let sliderWidth = min(300, windowWidth * 0.3);
  lightSlider.style('width', `${sliderWidth}px`);
  co2Slider.style('width', `${sliderWidth}px`);
  tempSlider.style('width', `${sliderWidth}px`);
}
