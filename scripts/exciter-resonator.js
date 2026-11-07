"use strict";

class Exciter {
    radius;
    speed = 5;
    #pulse;
    isDrawingPath = false;
    isBouncing = false;
    velocity = createVector(0, 0);
    intersectPoint;
    intersectLine = [];
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    setCoordinates(x, y) {
        this.x = x;
        this.y = y;
    }

    update(isPulsing = true) {
        this.#drawExciter(isPulsing);
    }

    #drawExciter(isPulsing) {
        this.#pulse = isPulsing ? map(sin(frameCount * this.speed), -1, 1, 0, 5) : 0;
        fill('#f56464');
        noStroke();
        circle(this.x, this.y, this.radius + this.#pulse);
    }

    bounce(verts) {
        this.#drawExciter(false);

        push();
        stroke('#000');
        strokeWeight(1);

        // THIS BOUNCE
        line(this.x, this.y, this.intersectPoint.x, this.intersectPoint.y);

        // NEXT BOUNCE
        const intersectLineVectorX = this.intersectLine[0].x - this.intersectLine[1].x;
        const intersectLineVectorY = this.intersectLine[0].y - this.intersectLine[1].y;
        const intersectLineVector = createVector(intersectLineVectorX, intersectLineVectorY);
        // reflect angle along normal
        let newBounceAngle = 2 * intersectLineVector.heading() - this.velocity.heading();
        let newBounceVector = createVector(cos(newBounceAngle), sin(newBounceAngle));

        const newBouncePoint = createVector(this.intersectPoint.x + newBounceVector.x, this.intersectPoint.y + newBounceVector.y);

        let [newBounceIntersectPoint, _] = edgeIntersect(this.intersectPoint, newBouncePoint, verts);
        line(this.intersectPoint.x, this.intersectPoint.y, newBounceIntersectPoint.x, newBounceIntersectPoint.y);

        pop();

        pop();


        this.setCoordinates(this.x + this.velocity.x / 5, this.y + this.velocity.y / 5);
        this.#drawExciter(false);
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
        fill(0);
        [this.intersectPoint, this.intersectLine] = edgeIntersect(createVector(this.x, this.y), endPos, verts);
        circle(this.intersectPoint.x, this.intersectPoint.y, 10);
        pop();

        // Arrowhead
        strokeWeight(3);
        const intersectDistance = dist(this.x, this.y, this.intersectPoint.x, this.intersectPoint.y);
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
        line(this.x, this.y, this.intersectPoint.x, this.intersectPoint.y);

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
        this.#drawShape();
        for (let vert of this.verts) {
            circle(vert.x, vert.y, 12);
        }
        push();
        noFill();
        strokeWeight(1);
        for (let vert of this.verts) {
            circle(vert.x, vert.y, 22);
        }
        pop();
        strokeWeight(1);
        noFill();
        circle(this.x, this.y, this.radius * 2);
    }

    drawBackground() {
        fill(255);
        this.#drawShape();
    }

    #drawShape() {
        beginShape();
        for (let vert of this.verts) {
            vertex(vert.x, vert.y);
        }
        endShape();
    }
}