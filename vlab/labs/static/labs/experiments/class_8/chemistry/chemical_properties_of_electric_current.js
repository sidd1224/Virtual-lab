let switchOn = false;
let wires = [];
let isDrawing = false;
let startTerminalKey = null;
let arrowOffset = 0;

let terminals = {};

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('Georgia');
  setupTerminals();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setupTerminals();
}

function draw() {
  background(245);
  drawBattery();
  drawBeaker();
  drawBulb();
  drawSwitch();
  drawWires();
  drawLabels();

  if (isDrawing && startTerminalKey) {
    let startPos = terminals[startTerminalKey];
    stroke(0);
    strokeWeight(2);
    line(startPos.x, startPos.y, mouseX, mouseY);
  }

  arrowOffset += 0.05;
}

function setupTerminals() {
  const h = windowHeight;
  const w = windowWidth;

  terminals = {
    batteryPos: { x: w * 0.1, y: h * 0.25 },
    batteryNeg: { x: w * 0.1, y: h * 0.45 },
    electrode1: { x: w * 0.46, y: h * 0.45 },
    electrode2: { x: w * 0.54, y: h * 0.45 },
    bulbPos: { x: w * 0.85, y: h * 0.25 },
    bulbNeg: { x: w * 0.85, y: h * 0.4 },
    switchIn: { x: w * 0.45, y: h * 0.3 },
    switchOut: { x: w * 0.55, y: h * 0.3 }
  };
}

function drawBattery() {
  const x = (windowWidth * 0.1)-5;
  const y = (windowHeight * 0.25)+20;

  fill(200);
  rect(x, y, 30, 100);
  rect(x + 40, y, 30, 100);
  fill(0);
  textSize(18);
  text('+', x + 5, y - 10);
  text('-', x + 45, y - 10);
  const z=-35;
  drawTerminal("batteryPos",z);
  drawTerminal("batteryNeg",z+8);
}

function drawBeaker() {
  const x = windowWidth * 0.5;
  const y = windowHeight * 0.5;
  const z=20;
  noFill();
  stroke(0);
  strokeWeight(2);
  rect(x - 50, y - 50, 100, 120, 20);

  fill(173, 216, 230, 150);
  rect(x - 48, y - 20, 96, 60);

  fill(80);
  rect(x - 30, y - 50, 10, 80);
  rect(x + 20, y - 50, 10, 80);

  drawTerminal("electrode1",-20);
  drawTerminal("electrode2",z);

  if (circuitComplete()) {
    fill(100, 100, 255, 150);
    for (let i = 0; i < 5; i++) {
      ellipse(x - 25 + random(-5, 5), y + 40 - i * 10, 8);
      ellipse(x + 25 + random(-5, 5), y + 40 - i * 10, 8);
    }
  }
}

function drawBulb() {
  const x = windowWidth * 0.85;
  const y = windowHeight * 0.25;
  const z = 0;
  const glow = circuitComplete();

  stroke(0);
  fill(glow ? color(255, 255, 100) : 255);
  ellipse(x, y, 40);
  stroke(0);
  line(x - 10, y, x + 10, y);

  drawTerminal("bulbPos",z);
  drawTerminal("bulbNeg",z);
}

function drawSwitch() {
  const x = windowWidth * 0.45;
  const y = windowHeight * 0.3;
  const z=10;
  fill(switchOn ? 'green' : 'red');
  rect(x, y, 100, 20, 5);
  fill(255);
  textSize(12);
  textAlign(CENTER, CENTER);
  text(switchOn ? 'ON' : 'OFF', x + 40, y + 10);

  drawTerminal("switchIn",30);
  drawTerminal("switchOut",10);
}

function drawTerminal(key,z) {
  let pos = terminals[key];
  fill(0);
  ellipse(pos.x-z, pos.y, 8);
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

function mousePressed() {
  const x = windowWidth * 0.45;
  const y = windowHeight * 0.3;

  if (mouseX > x && mouseX < x + 80 && mouseY > y && mouseY < y + 20) {
    switchOn = !switchOn;
    return;
  }

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

function drawLabels() {
  noStroke();
  fill(0);
  textSize(14);
  textAlign(LEFT);
  text("Battery", windowWidth * 0.08, windowHeight * 0.48);
  text("Beaker with Electrolyte", windowWidth * 0.45, windowHeight * 0.68);
  text("Electrodes", windowWidth * 0.40, windowHeight * 0.43);
  text("       Switch (clickable)", windowWidth * 0.43, windowHeight * 0.28);
  text("Bulb", windowWidth * 0.83, windowHeight * 0.23);
}

function circuitComplete() {
  if (!switchOn) return false;

  let graph = {};
  for (let key in terminals) graph[key] = [];

  for (let wire of wires) {
    graph[wire.a].push(wire.b);
    graph[wire.b].push(wire.a);
  }

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
