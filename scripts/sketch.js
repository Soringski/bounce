/// <reference types="p5/global" />

let canvasSize = 450;

let center;
let pulse;
let speed;

let radius = 175;

let objectVerts = [];

function setup() {
    createCanvas(canvasSize, canvasSize);
    center = createVector(width / 2, width / 2);
    pulse = 1;
    angleMode(DEGREES);
}

function draw() {
    background(255);

    if (
        mouseX < canvasSize
        && mouseX > 0
        && mouseY < canvasSize
        && mouseY > 0
    ) {
        speed = 25;
        let intersectPoint = edgeIntersect(center, createVector(mouseX, mouseY), objectVerts);
        if (
            dist(center.x, center.y, mouseX, mouseY) >
            dist(center.x, center.y, intersectPoint.x, intersectPoint.y)
        ) {
            drawExciter(intersectPoint.x, intersectPoint.y);
        } else {
            drawExciter(mouseX, mouseY);
        }
    } else {
        speed = 5;
        drawExciter(center.x, center.y);
    }

    drawObject();
}

function drawExciter(x, y) {
    fill('#f56464');
    noStroke();
    let pulse = map(sin(frameCount * speed), -1, 1, 0, 5);
    circle(x, y, 20 + pulse);
}

function drawObject() {
    objectVerts = [];
    for (let i = 0; i <= window.sides; i++) {
        const point = createVector(
            center.x + radius * sin((360 / window.sides) * i),
            center.y + radius * cos((360 / window.sides) * i)
        );
        objectVerts.push(point);

    }
    noFill();
    stroke('#000');
    strokeWeight(3);
    beginShape();
    for (let vert of objectVerts) {
        vertex(vert.x, vert.y);
        push();
        fill('#000');
        circle(vert.x, vert.y, 10);
        pop();
    }
    endShape();
    strokeWeight(1);
    circle(center.x, center.y, radius * 2);
}

function edgeIntersect(o, p, verts) {
    let rx = p.x - o.x, ry = p.y - o.y;
    for (let i = 0; i < verts.length; i++) {
        let c = verts[i];
        let d = verts[(i + 1) % verts.length];
        let sx = d.x - c.x, sy = d.y - c.y;

        let noemer = rx * sy - ry * sx;
        if (noemer === 0) continue;

        let t = ((c.x - o.x) * sy - (c.y - o.y) * sx) / noemer;
        let u = ((c.x - o.x) * ry - (c.y - o.y) * rx) / noemer;

        if (t >= 0 && u >= 0 && u <= 1) {
            return createVector(o.x + t * rx, o.y + t * ry);
        }
    }
    return null;
}