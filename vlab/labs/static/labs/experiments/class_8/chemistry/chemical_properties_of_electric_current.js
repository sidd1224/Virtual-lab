let myFont;
let switchOn = false;
let wires = [];
let isDrawing = false;
let startTerminalKey = null;
let arrowOffset = 0;
let terminals = {};

function preload() {
  // Make sure this font file exists in your local directory
  myFont = loadFont('/static/labs/fonts/myFont.ttf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont(myFont);
  setupTerminals();
}

function draw() {
  background(245);

  // Draw circuit components
  drawBattery(100, 150);
  drawBeaker(400, 300);
  drawBulb(650, 150);
  drawSwitch();
  drawWires();
  drawLabels();

  // Draw wire preview
  if (isDrawing && startTerminalKey) {
    let startPos = terminals[startTerminalKey];
    stroke(0);
    strokeWeight(2);
    line(startPos.x, startPos.y, mouseX, mouseY);
  }

  // Animate arrows
  arrowOffset += 0.05;

  // Info Panel
  drawInfoPanel();
}

// === Setup Circuit Terminals ===
function setupTerminals() {
  terminals = {
    batteryPos: { x: 115, y: 150 },
    batteryNeg: { x: 115, y: 250 },
    electrode1: { x: 370, y: 270 },
    electrode2: { x: 430, y: 270 },
    bulbPos: { x: 650, y: 170 },
    bulbNeg: { x: 650, y: 230 },
    switchIn: { x: 380, y: 190 },
    switchOut: { x: 420, y: 190 }
  };
}

// === Components ===

function drawBattery(x, y) {
  fill(200);
  rect(x, y, 30, 100);
  rect(x + 40, y, 30, 100);
  fill(0);
  textSize(18);
  text('+', x + 5, y - 10);
  text('-', x + 45, y - 10);

  drawTerminal("batteryPos");
  drawTerminal("batteryNeg");
}

function drawBeaker(x, y) {
  noFill();
  stroke(0);
  strokeWeight(2);
  rect(x - 50, y - 50, 100, 120, 20);

  fill(173, 216, 230, 150);
  rect(x - 48, y - 20, 96, 60);

  fill(80);
  rect(x - 30, y - 50, 10, 80);
  rect(x + 20, y - 50, 10, 80);

  drawTerminal("electrode1");
  drawTerminal("electrode2");

  if (circuitComplete()) {
    fill(100, 100, 255, 150);
    for (let i = 0; i < 5; i++) {
      ellipse(x - 25 + random(-5, 5), y + 40 - i * 10, 8);
      ellipse(x + 25 + random(-5, 5), y + 40 - i * 10, 8);
    }
  }
}

function drawBulb(x, y) {
  const glow = circuitComplete();
  stroke(0);
  fill(glow ? color(255, 255, 100) : 255);
  ellipse(x, y, 40);
  stroke(0);
  line(x - 10, y, x + 10, y);

  drawTerminal("bulbPos");
  drawTerminal("bulbNeg");
}

function drawSwitch() {
  fill(switchOn ? 'green' : 'red');
  rect(380, 180, 40, 20, 5);
  fill(255);
  textSize(12);
  textAlign(CENTER, CENTER);
  text(switchOn ? 'ON' : 'OFF', 400, 190);

  drawTerminal("switchIn");
  drawTerminal("switchOut");
}

function drawTerminal(key) {
  let pos = terminals[key];
  fill(0);
  ellipse(pos.x, pos.y, 8);
}

function drawWires() {
  stroke(0);
  strokeWeight(2);
  for (let wire of wires) {
    let a = terminals[wire.a];
    let b = terminals[wire.b];
    line(a.x, a.y, b.x, b.y);

    if (circuitComplete()) {
      drawArrowOnLine(a, b);
    }
  }
}

function drawArrowOnLine(a, b) {
  let t = (sin(arrowOffset) + 1) / 2;
  let x = lerp(a.x, b.x, t);
  let y = lerp(a.y, b.y, t);
  let angle = atan2(b.y - a.y, b.x - a.x);
  push();
  translate(x, y);
  rotate(angle);
  fill('red');
  noStroke();
  triangle(0, 0, -5, -3, -5, 3);
  pop();
}

// === Mouse Interaction ===

function mousePressed() {
  // Toggle switch
  if (mouseX > 380 && mouseX < 420 && mouseY > 180 && mouseY < 200) {
    switchOn = !switchOn;
    return;
  }

  // Start drawing a wire
  for (let key in terminals) {
    let t = terminals[key];
    if (dist(mouseX, mouseY, t.x, t.y) < 10) {
      isDrawing = true;
      startTerminalKey = key;
      return;
    }
  }
}

function mouseReleased() {
  if (isDrawing && startTerminalKey) {
    for (let key in terminals) {
      let t = terminals[key];
      if (dist(mouseX, mouseY, t.x, t.y) < 10 && key !== startTerminalKey) {
        wires.push({ a: startTerminalKey, b: key });
        break;
      }
    }
  }
  isDrawing = false;
  startTerminalKey = null;
}

// === UI and Logic ===

function drawLabels() {
  noStroke();
  fill(0);
  textSize(14);
  textAlign(LEFT);
  text("Battery", 90, 270);
  text("Beaker with Electrolyte", 370, 440);
  text("Electrodes", 375, 260);
  text("Switch (clickable)", 370, 170);
  text("Bulb", 640, 140);
}

function drawInfoPanel() {
  fill(0);
  textSize(14);
  textFont(myFont);
  textAlign(LEFT);

  text("Experiment: Electrolysis Circuit Simulation", 20, 40);
  text("Click on the switch to turn ON/OFF the circuit.", 20, 60);
  text("Click and drag between terminals to connect wires.", 20, 80);
  text("Switch: " + (switchOn ? "ON" : "OFF"), 20, 100);
  text("Connections: " + wires.length, 20, 120);
  text("Circuit Complete: " + (circuitComplete() ? "YES" : "NO"), 20, 140);
}

function circuitComplete() {
  if (!switchOn) return false;

  // Build graph of connections
  let graph = {};
  for (let key in terminals) {
    graph[key] = [];
  }

  for (let wire of wires) {
    graph[wire.a].push(wire.b);
    graph[wire.b].push(wire.a);
  }

  // BFS from batteryPos to batteryNeg
  let visited = {};
  let queue = ["batteryPos"];

  while (queue.length > 0) {
    let current = queue.shift();
    if (current === "batteryNeg") return true;
    visited[current] = true;
    for (let neighbor of graph[current]) {
      if (!visited[neighbor]) queue.push(neighbor);
    }
  }

  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}