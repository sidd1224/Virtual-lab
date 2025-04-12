let blocks = [];
let platforms = [];
let font;
let weightSlider, resetBtn;
let selectedBlock = null;

function preload() {
  font = loadFont('https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceCodePro-Regular.otf');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  textFont(font);

  // Create platforms
  platforms.push(new Platform(-150, 100, 100, color(0, 150, 255)));
  platforms.push(new Platform(150, 100, 40, color(150, 0, 255)));

  // Create draggable blocks
  blocks.push(new DraggableBlock(-100, -100, 40));
  blocks.push(new DraggableBlock(0, -100, 60));
  blocks.push(new DraggableBlock(100, -100, 80));

  // Create weight slider
  weightSlider = createSlider(10, 100, 50);
  weightSlider.position(20, windowHeight - 40);
  weightSlider.style('width', '200px');

  // Reset button
  resetBtn = createButton('Reset All Blocks');
  resetBtn.position(240, windowHeight - 40);
  resetBtn.mousePressed(() => {
    for (let block of blocks) {
      block.reset();
    }
  });
}

function draw() {
  background(220);
  orbitControl();

  ambientLight(150);
  directionalLight(255, 255, 255, -1, -1, -0.5);

  // Update selected block's weight
  if (selectedBlock) {
    selectedBlock.weight = weightSlider.value();
  }

  // Draw platforms
  for (let p of platforms) {
    p.display();
  }

  // Update and draw blocks
  let results = [];
  for (let b of blocks) {
    b.update();
    b.display();

    for (let p of platforms) {
      if (b.isDropped && p.contains(b)) {
        let area = p.size * p.size;
        let pressure = b.weight / area;
        b.y = p.y - b.weight / 2;
        results.push({
          block: b,
          pressure: pressure,
          weight: b.weight,
          area: area
        });
      }
    }
  }

  // Show HUD
  if (results.length > 0) {
    let lines = results.map((r, i) =>
      `Block ${i + 1}: Weight = ${r.weight} N, Area = ${r.area} cm², Pressure = ${r.pressure.toFixed(3)} N/cm²`
    );
    showHUD(lines, results.map(r => r.pressure));
  } else {
    showHUD([
      "Drop a block on a platform",
      "to calculate pressure."
    ]);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  weightSlider.position(20, windowHeight - 40);
  resetBtn.position(240, windowHeight - 40);
}

function mousePressed() {
  for (let b of blocks) {
    if (b.pressed()) {
      selectedBlock = b;
      weightSlider.value(b.weight);
      break;
    }
  }
}

function mouseReleased() {
  for (let b of blocks) {
    b.released();
  }
}

class Platform {
  constructor(x, y, size, c) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = c;
  }

  display() {
    push();
    translate(this.x, this.y, 0);
    rotateX(HALF_PI);
    fill(this.color);
    stroke(0);
    plane(this.size, this.size);
    pop();

    // Label
    push();
    translate(this.x, this.y - this.size / 2 - 10, 1);
    rotateX(-QUARTER_PI / 2);
    fill(0);
    textSize(12);
    textAlign(CENTER);
    text(this.size > 80 ? "Wide Platform" : "Narrow Platform", 0, 0);
    pop();
  }

  contains(b) {
    let dx = abs(this.x - b.x);
    let dz = abs(0 - b.z);
    return dx < this.size / 2 && dz < this.size / 2;
  }
}

class DraggableBlock {
  constructor(x, y, weight) {
    this.originalX = x;
    this.originalY = y;
    this.x = x;
    this.y = y;
    this.z = 0;
    this.weight = weight;
    this.dragging = false;
    this.isDropped = false;
  }

  update() {
    if (this.dragging) {
      this.x = mouseX - width / 2;
      this.y = mouseY - height / 2;
    }
  }

  display() {
    push();
    translate(this.x, this.y, this.z);
    fill(255, 100, 100);
    this.dragging ? stroke(0, 255, 0) : stroke(0);
    strokeWeight(this.dragging ? 3 : 1);
    box(40, this.weight, 40);
    pop();
  }

  pressed() {
    let dx = mouseX - width / 2 - this.x;
    let dy = mouseY - height / 2 - this.y;
    if (dist(0, 0, dx, dy) < 40) {
      this.dragging = true;
      this.isDropped = false;
      return true;
    }
    return false;
  }

  released() {
    this.dragging = false;
    this.isDropped = true;
  }

  reset() {
    this.x = this.originalX;
    this.y = this.originalY;
    this.isDropped = false;
    this.dragging = false;
  }
}

function showHUD(lines, pressures = []) {
  resetMatrix();
  camera();
  fill(0);
  textSize(16);
  let y = -220;
  for (let line of lines) {
    text(line, -230, y);
    y += 20;
  }

  // Show pressure bars
  if (pressures.length > 0) {
    for (let i = 0; i < pressures.length; i++) {
      let p = pressures[i];
      let barColor = color(0, 255, 0);
      if (p > 0.02 && p <= 0.05) barColor = color(255, 165, 0);
      else if (p > 0.05) barColor = color(255, 0, 0);

      fill(barColor);
      noStroke();
      rect(20, y + 5 + i * 25, p * 500, 10);
      fill(0);
      textSize(12);
      text(`Block ${i + 1}`, 20, y + 20 + i * 25);
    }
  }
}
