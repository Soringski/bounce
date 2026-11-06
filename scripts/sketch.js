/// <reference types="p5/global" />

let canvasSize = 450;

let center;
let speed;

let radius = 175;

let resonatorVerts = [];

let setExciterPath = false;

let resonator;
let exciter;
let startDraggingOffBounds = false;

function setup() {
    createCanvas(canvasSize, canvasSize);
    center = createVector(width / 2, width / 2);
    angleMode(DEGREES);

    resonator = new Resonator(center.x, center.y);
    exciter = new Exciter(resonator.x, resonator.y);
}

function draw() {
    background(255);
    if (exciter.isDrawingPath) {
        exciter.update();
        exciter.setExciterPath();
    } else {
        if (onCanvas() && !startDraggingOffBounds) {
            exciter.speed = 25;
            let intersectPoint = edgeIntersect(createVector(resonator.x, resonator.y), createVector(mouseX, mouseY), resonatorVerts);
            if (dist(resonator.x, resonator.y, mouseX, mouseY) > dist(resonator.x, resonator.y, intersectPoint.x, intersectPoint.y)) {
                exciter.setCoordinates(intersectPoint.x, intersectPoint.y);
                exciter.update();
            } else {
                exciter.setCoordinates(mouseX, mouseY);
                exciter.update();
            }
        } else {
            exciter.speed = 5;
            exciter.setCoordinates(resonator.x, resonator.y);
            exciter.update();;
        }
    }
    resonator.update();
    drawCursor();
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
    exciter.isDrawingPath = false;
    startDraggingOffBounds = false;
}

function mousePressed() {
    if (!onCanvas()) {
        startDraggingOffBounds = true;
        console.log(startDraggingOffBounds);

    }
}

function mouseDragged() {
    if (onCanvas()) {
        if (!startDraggingOffBounds) exciter.isDrawingPath = true;
    }
}


function edgeIntersect(o, p, verts) {
    let rx = p.x - o.x, ry = p.y - o.y;
    for (let i = 0; i < verts.length; i++) {
        let c = verts[i];
        let d = verts[(i + 1) % verts.length];
        let sx = d.x - c.x, sy = d.y - c.y;

        let denominator = rx * sy - ry * sx;
        if (denominator === 0) continue;

        let t = ((c.x - o.x) * sy - (c.y - o.y) * sx) / denominator;
        let u = ((c.x - o.x) * ry - (c.y - o.y) * rx) / denominator;

        if (t >= 0 && u >= 0 && u <= 1) {
            return createVector(o.x + t * rx, o.y + t * ry);
        }
    }
    return null;
}