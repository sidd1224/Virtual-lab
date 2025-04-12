let stage = 0;
let heating = false;
let soapFormed = false;
let progress = 0;
let beakerY;
let steamParticles = [];

let myFont;

function preload() {
  myFont = loadFont('/static/labs/fonts/myFont.ttf');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  beakerY = 50;
  textFont(myFont);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(200, 240, 255);
  orbitControl();

  drawTable();
  drawBeaker();
  drawButtons();

  if (heating && progress < 100) {
    progress += 0.1;
    createSteam();
  }

  if (progress >= 100 && !soapFormed) {
    soapFormed = true;
  }

  drawProgressBar();
  drawSteam();

  if (soapFormed) {
    drawSoapLayer();
  }
}

function drawTable() {
  push();
  translate(0, 150, 0);
  fill(150, 100, 50);
  box(400, 20, 300);
  pop();
}

function drawBeaker() {
  push();
  translate(0, beakerY, 0);
  noFill();
  stroke(0);
  cylinder(60, 100);
  noStroke();

  if (stage >= 1) {
    push();
    translate(0, 25, 0);
    fill(255, 255, 150);
    cylinder(58, 50);
    pop();
  }
  if (stage >= 2) {
    push();
    translate(0, 5, 0);
    fill(180, 250, 255);
    cylinder(58, 70);
    pop();
  }
  if (stage >= 4 && progress < 100) {
    push();
    translate(0, 5, 0);
    fill(255, 220, 200);
    cylinder(58, 70);
    pop();
  }
  pop();
}

function drawSoapLayer() {
  push();
  translate(0, beakerY - 20, 0);
  fill(255, 255, 255, 220);
  cylinder(58, 10);
  pop();
}

function drawButtons() {
  camera();
  textSize(14);
  textFont(myFont);
  textAlign(LEFT);

  const baseX = -windowWidth / 2 + 20;
  let baseY = -windowHeight / 2 + 40;

  drawButton("Add Oil", baseX, baseY, 0);
  drawButton("Add NaOH", baseX, baseY + 40, 1);
  drawButton("Stir", baseX, baseY + 80, 2);
  drawButton("Heat", baseX, baseY + 120, 3);
  drawButton("Add Salt", baseX, baseY + 160, 4);
}

function drawButton(label, x, y, s) {
  push();
  translate(x, y, 0);
  fill(stage === s ? [100, 200, 100] : 255);
  stroke(0);
  rect(0, 0, 140, 30);
  fill(0);
  noStroke();
  textFont(myFont);
  text(label, 10, 20);
  pop();
}

function mousePressed() {
  let mX = mouseX - width / 2;
  let mY = mouseY - height / 2;

  const baseX = -width / 2 + 20;
  const buttons = [
    { label: "Add Oil", y: 40 },
    { label: "Add NaOH", y: 80 },
    { label: "Stir", y: 120 },
    { label: "Heat", y: 160 },
    { label: "Add Salt", y: 200 }
  ];

  for (let i = 0; i < buttons.length; i++) {
    const bx = baseX;
    const by = -height / 2 + buttons[i].y;
    if (insideButton(mX, mY, bx, by)) {
      handleStage(i);
    }
  }
}

function handleStage(s) {
  if (s === 0 && stage === 0) stage = 1;
  if (s === 1 && stage === 1) stage = 2;
  if (s === 2 && stage === 2) stage = 3;
  if (s === 3 && stage === 3) {
    stage = 4;
    heating = true;
  }
  if (s === 4 && stage === 4 && progress >= 100) {
    soapFormed = true;
  }
}

function insideButton(mx, my, x, y) {
  return mx > x && mx < x + 140 && my > y && my < y + 30;
}

function drawProgressBar() {
  camera();
  fill(0);
  textFont(myFont);
  text("Saponification Progress:", -windowWidth / 2 + 20, -windowHeight / 2 + 260);
  fill(255);
  stroke(0);
  rect(-windowWidth / 2 + 20, -windowHeight / 2 + 270, 200, 20);
  noStroke();
  fill(0, 150, 0);
  rect(-windowWidth / 2 + 20, -windowHeight / 2 + 270, progress * 2, 20);
}

function createSteam() {
  for (let i = 0; i < 2; i++) {
    steamParticles.push({
      x: random(-20, 20),
      y: 0,
      z: random(-20, 20),
      alpha: 255
    });
  }
}

function drawSteam() {
  push();
  translate(0, beakerY - 60, 0);
  for (let p of steamParticles) {
    push();
    translate(p.x, -p.y, p.z);
    fill(255, p.alpha);
    noStroke();
    sphere(5);
    pop();
    p.y += 1;
    p.alpha -= 2;
  }
  steamParticles = steamParticles.filter(p => p.alpha > 0);
  pop();
}
