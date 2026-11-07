/// <reference types="p5/global" />

// resonator sides through window.sides from index.js
let canvasSize = 450;
let center;
let setExciterPath = false;
let resonator;
let exciter;

// block canvas changes from hovering while adjusting sliders
let startDraggingOffBounds = false;

function setup() {
    createCanvas(canvasSize, canvasSize);
    center = createVector(width / 2, width / 2);
    angleMode(DEGREES);

    resonator = new Resonator(center.x, center.y, 175);
    exciter = new Exciter(resonator.x, resonator.y, 20);
}

function draw() {
    const bg = exciter.isBouncing ? 251 : 255;
    background(bg);

    resonator.drawBackground();

    // Walls for the exciter's centre: the real walls pulled in by the disc's radius
    // (circle() takes a diameter, so that's radius / 2) plus half the wall's strokeWeight(3).
    // When the centre reaches these, the edge of the disc touches the real wall.
    const walls = resonator.insetVerts(exciter.radius / 2 + 1.5);

    if (exciter.isDrawingPath) {
        exciter.update();
        exciter.setExciterPath(walls);
    }
    else if (exciter.isBouncing) {
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
    exciter.isDrawingPath = false;
    startDraggingOffBounds = false;
}

function mousePressed() {
    if (!onCanvas()) {
        startDraggingOffBounds = true;
    }
}

function mouseDragged() {
    if (onCanvas()) {
        if (!startDraggingOffBounds) exciter.isDrawingPath = true;
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