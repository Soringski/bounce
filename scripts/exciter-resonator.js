"use strict";

class Exciter {
    speed = 5;
    pulse;
    isDrawingPath = false;
    velocity = createVector(0, 0);
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

    setExciterPath() {
        push();
        stroke('#000');
        strokeWeight(1);
        // Thin line from cursor to exciter
        line(this.x, this.y, mouseX, mouseY);
        // Thick line from exciter: Velocity vector
        this.velocity.x = this.x - mouseX;
        this.velocity.y = this.y - mouseY;
        const endX = this.x + this.velocity.x;
        const endY = this.y + this.velocity.y;
        strokeWeight(3);
        line(this.x, this.y, endX, endY);
        // Arrowhead
        if (this.velocity.mag() > 0) {
            const len = 14;   // point length
            const half = 6;   // Half the base length 
            push();
            translate(endX, endY);
            rotate(this.velocity.heading());
            fill(0);
            noStroke();
            triangle(0, -half, 0, half, len, 0);
            pop();
        }
        pop();
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