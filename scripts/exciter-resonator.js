"use strict";

class Exciter {
    speed = 5;
    pulse;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    setCoordinates(x, y) {
        this.x = x;
        this.y = y;
    }

    update() {
        fill('#f56464');
        noStroke();
        this.pulse = map(sin(frameCount * this.speed), -1, 1, 0, 5);
        circle(this.x, this.y, 20 + this.pulse);
    }
}

class Resonator {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    update() {
        resonatorVerts = [];
        for (let i = 0; i <= window.sides; i++) {
            const point = createVector(
                this.x + radius * sin((360 / window.sides) * i),
                this.y + radius * cos((360 / window.sides) * i)
            );
            resonatorVerts.push(point);
        }
        noFill();
        stroke('#000');
        strokeWeight(3);
        beginShape();
        for (let vert of resonatorVerts) {
            vertex(vert.x, vert.y);
            push();
            fill('#000');
            circle(vert.x, vert.y, 10);
            pop();
        }
        endShape();
        strokeWeight(1);
        circle(this.x, this.y, radius * 2);
    }
}