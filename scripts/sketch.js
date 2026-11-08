/// <reference types="p5/global" />


// window variables:
// window.sides: amount of resonator sides
// window.exciterSpeed: travel speed of the exciter
// window.isBouncing: boolean lets index.js switch mousewheel events (sides/exciterSpeed)

let canvasSize = 450;
let center;
let setExciterPath = false;
let resonator;
let exciter;
let bubbles = [];

// block canvas changes from hovering while adjusting sliders
let startDraggingOffBounds = false;

let tick;
let sounds = []; // used for muting
let volume = 1;

function resetSketch() {
    canvasSize = 450;
    setExciterPath = false;
    bubbles = [];
    center = createVector(width / 2, width / 2);
    angleMode(DEGREES);
    resonator = new Resonator(center.x, center.y, 175);
    exciter = new Exciter(resonator.x, resonator.y, 20);
    window.isBouncing = false;
}

async function setup() {
    createCanvas(canvasSize, canvasSize);
    resetSketch();

    tick = await loadSound("/assets/tick.wav");
    sounds.push(tick);
}

function draw() {
    const bg = exciter.isBouncing ? 251 : 255;
    background(bg);
    resonator.drawBackground();

    for (let bubble of bubbles) bubble.pop();
    bubbles = bubbles.filter(x => !x.done);


    // inset walls by resonator stroke width and radius to prevent 
    // out of bounds bouncing
    const walls = resonator.insetVerts(exciter.radius / 2 + 1.5);

    // User is click-dragging
    if (exciter.isDrawingPath) {
        exciter.update();
        exciter.setExciterPath(walls);
        drawSpeed();
    }
    else if (exciter.isBouncing) {
        drawSpeed();
        exciter.bounce(walls);
    }
    else {
        if (onCanvas() && !startDraggingOffBounds) {
            exciter.pulseSpeed = 25;
            let [intersectPoint, _] = edgeIntersect(createVector(resonator.x, resonator.y), createVector(mouseX, mouseY), walls);
            if (intersectPoint !== null) {
                if (dist(resonator.x, resonator.y, mouseX, mouseY) > dist(resonator.x, resonator.y, intersectPoint.x, intersectPoint.y)) {
                    // Cursor is past the walls: park the exciter 1px inside them, not on them.
                    // Sitting exactly on a wall, a pull that aims outward finds no wall to hit.
                    const inset = createVector(resonator.x - intersectPoint.x, resonator.y - intersectPoint.y).setMag(1);
                    exciter.setCoordinates(intersectPoint.x + inset.x, intersectPoint.y + inset.y);
                    exciter.update();
                } else {
                    exciter.setCoordinates(mouseX, mouseY);
                    exciter.update();
                }
            }
        } else {
            exciter.pulseSpeed = 5;
            exciter.setCoordinates(resonator.x, resonator.y);
            exciter.update();
        }
    }
    drawCursor();

    resonator.update();
}

function onCanvas() {
    return mouseX < canvasSize && mouseX > 0 && mouseY < canvasSize && mouseY > 0;
}

function drawSpeed() {
    push();
    noStroke();
    fill("#000");
    textSize(15);
    text('./speed', 12, 50);
    textSize(30);
    textStyle(BOLD);
    text(Math.round(exciter.speed), 20, 35);
    pop();
}

function drawCursor() {
    push();
    fill('#000');
    circle(mouseX, mouseY, 6);
    pop();
}

function mouseReleased() {
    // only launch if the current aim actually hits a wall
    // (also covers re-aiming mid-bounce and letting go with no valid aim)
    if (exciter.isDrawingPath) exciter.isBouncing = exciter.intersectPoint !== null;
    if (exciter.isBouncing) window.isBouncing = true;
    exciter.isDrawingPath = false;
    startDraggingOffBounds = false;

    // set speed slider
    document.getElementById('range-input-speed').value = exciter.speed;
}

function mousePressed(event) {
    if (mouseButton.left) {
        if (!onCanvas()) {
            startDraggingOffBounds = true;
        }
    } else if (mouseButton.right) {
        resetSketch();
    }
}

function mouseDragged() {
    if (mouseButton.left) {
        if (onCanvas()) {
            if (!startDraggingOffBounds) exciter.isDrawingPath = true;
        }
    }
}

function edgeIntersect(o, p, verts, skipEdge = -1) {
    const rx = p.x - o.x, ry = p.y - o.y;
    let best = [null, null, -1], bestT = Infinity;
    for (let i = 0; i < verts.length; i++) {
        if (i === skipEdge) continue;                 // don't re-hit the wall we're on
        const c = verts[i];
        const d = verts[(i + 1) % verts.length];
        const sx = d.x - c.x, sy = d.y - c.y;
        const denominator = rx * sy - ry * sx;
        if (abs(denominator) < 1e-9) continue;        // parallel, or zero-length edge
        const t = ((c.x - o.x) * sy - (c.y - o.y) * sx) / denominator;
        const u = ((c.x - o.x) * ry - (c.y - o.y) * rx) / denominator;
        if (t > 1e-6 && u >= 0 && u <= 1 && t < bestT) {   // strictly ahead, keep nearest
            bestT = t;
            best = [createVector(o.x + t * rx, o.y + t * ry), [c, d], i];
        }
    }
    return best;   // [null, null, -1] if nothing hit
}