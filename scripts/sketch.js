/// <reference types="p5/global" />

let canvasSize = 450;

let center;
let pulse;
let speed = 3;

let radius = 175;
let pointsOnCircle = 4;

function setup() {
    createCanvas(canvasSize, canvasSize);
    center = createVector(width / 2, width / 2);
    pulse = 1;
    angleMode(DEGREES);
}

function draw() {
    background(255);

    translate(center.x, center.y);
    drawExciter();
    drawObject();
}

function drawExciter() {
    fill('#000');
    let pulse = map(sin(frameCount * speed), -1, 1, 0, 5);
    circle(0, 0, 20 + pulse);
}

function drawObject() {
    noFill();
    strokeWeight(3);
    beginShape();
    for (let i = 0; i <= pointsOnCircle; i++) {
        const point = createVector(radius * sin((360 / pointsOnCircle) * i), radius * cos((360 / pointsOnCircle) * i));
        vertex(point.x, point.y);
        push();
        fill('#000');
        circle(point.x, point.y, 10);
        pop();
    }
    endShape();
    strokeWeight(1);
    circle(0, 0, radius * 2);
}