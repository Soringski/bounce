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

    setExciterPath(verts) {
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
        const endPos = createVector(endX, endY);

        push();
        noFill();
        let intersectPoint = edgeIntersect(createVector(this.x, this.y), endPos, verts);
        circle(intersectPoint.x, intersectPoint.y, 20);
        pop();

        // Arrowhead
        strokeWeight(3);
        const intersectDistance = dist(this.x, this.y, intersectPoint.x, intersectPoint.y);
        const mag = this.velocity.mag();
        if (mag > 0) {
            const len = 14;                         // arrow length
            const headLen = min(len, mag);          // head smaller than length
            const half = 6 * (headLen / len);       // scaling
            const lineLen = min(mag - headLen, intersectDistance - headLen);          // stops at base

            push();
            translate(this.x, this.y);
            rotate(this.velocity.heading());
            // Thick line: Velocity vector
            line(0, 0, lineLen, 0);
            // Arrowhead stops at vector length
            fill(0);
            noStroke();
            triangle(lineLen, -half, lineLen, half, min(mag, intersectDistance), 0);
            pop();
        }

        // draw dotted pathline
        strokeWeight(1);
        drawingContext.setLineDash([5, 5]);
        line(this.x, this.y, intersectPoint.x, intersectPoint.y);

        pop();
    }
}

class Resonator {
    verts = [];
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }
    update() {
        this.verts = [];
        for (let i = 0; i <= window.sides; i++) {
            const point = createVector(
                this.x + this.radius * sin((360 / window.sides) * i),
                this.y + this.radius * cos((360 / window.sides) * i)
            );
            this.verts.push(point);
        }
        noFill();
        stroke('#000');
        strokeWeight(3);
        beginShape();
        for (let vert of this.verts) {
            vertex(vert.x, vert.y);
            push();
            fill('#000');
            circle(vert.x, vert.y, 10);
            pop();
        }
        endShape();
        strokeWeight(1);
        circle(this.x, this.y, this.radius * 2);
    }
}
