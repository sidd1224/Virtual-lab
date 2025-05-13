let massSlider, forceSlider, applyButton;
let mass = 1, force = 0, acceleration = 0, velocity = 0, position = -150;
let isRunning = false;
let myFont;

function preload() {
  myFont = loadFont('/static/labs/fonts/myFont.ttf'); // Load your custom font
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  // Mass slider
  massSlider = createSlider(1, 10, 1);
  massSlider.position(20, 20);

  // Force slider
  forceSlider = createSlider(0, 50, 0);
  forceSlider.position(20, 60);

  // Apply Force button
  applyButton = createButton("Apply Force");
  applyButton.position(20, 100);
  applyButton.mousePressed(() => {
    isRunning = true;
    mass = massSlider.value();
    force = forceSlider.value();
    acceleration = force / mass;
    velocity = 0;
    position = -windowWidth / 6;
  });

  textFont(myFont);
}

function draw() {
  background(240);
  orbitControl();

  // Update mass and force from sliders
  mass = massSlider.value();
  force = forceSlider.value();

  // Physics calculation
  if (isRunning) {
    velocity += acceleration * 0.1;
    position += velocity * 0.1;
    if (position > windowWidth / 6) {
      isRunning = false;
    }
  }

  // Draw floor
  push();
  fill(180);
  translate(0, 100, 0);
  box(windowWidth * 0.5, 10, 100);
  pop();

  // Draw moving block
  push();
  translate(position, 75, 0);
  fill(255, 100, 100);
  stroke(0);
  box(50, 50, 50);
  pop();

  // Reset to 2D UI overlay
  resetMatrix();
  camera();
  fill(0);
  textFont(myFont);
  textSize(16);

  const lines = [
    `Mass (kg): ${mass}`,
    `Force (N): ${force}`,
    `Acceleration: ${acceleration.toFixed(2)} m/s²`,
    `Velocity: ${velocity.toFixed(2)} m/s`
  ];

  let y = -330;
  for (let line of lines) {
    text(line, -590, y);
    y += 25;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
