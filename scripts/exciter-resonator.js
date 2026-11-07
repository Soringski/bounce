"use strict";

class Exciter {
    radius;
    pulseSpeed = 5;
    #pulse;
    isDrawingPath = false;
    isBouncing = false;
    velocity = createVector(0, 0);
    pointBounceOrigin = createVector(0, 0);
    speed;
    velocityMag;
    intersectPoint = null;   // null = the current aim doesn't hit a wall
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
        this.#pulse = isPulsing ? map(sin(frameCount * this.pulseSpeed), -1, 1, 0, 5) : 0;
        fill('#f56464');
        noStroke();
        circle(this.x, this.y, this.radius + this.#pulse);
    }

    bounce(verts) {
        // Move first: cover speed / 5 px of path this frame. If a wall comes up
        // within that distance, land exactly on it, turn, and spend the rest of
        // the step on the new leg (several walls per frame at high speed).
        let step = this.speed / 5;
        for (let i = 0; i < 20 && step > 0; i++) {
            const toWall = dist(this.x, this.y, this.intersectPoint.x, this.intersectPoint.y);
            if (step < toWall) {
                const k = step / this.speed;
                this.setCoordinates(this.x + this.velocity.x * k, this.y + this.velocity.y * k);
                break;
            }
            step -= toWall;
            this.setCoordinates(this.intersectPoint.x, this.intersectPoint.y);
            const next = this.#nextLeg(verts);
            if (next === null) {          // shouldn't happen, but stop rather than crash
                this.isBouncing = false;
                break;
            }
            [this.velocity, this.intersectPoint, this.intersectLine] = next;
        }

        // Then draw: this leg, the next leg, and the exciter (once)
        push();
        stroke('#000');
        strokeWeight(1);
        line(this.x, this.y, this.intersectPoint.x, this.intersectPoint.y);
        const preview = this.#nextLeg(verts);
        if (preview !== null) line(this.intersectPoint.x, this.intersectPoint.y, preview[1].x, preview[1].y);
        pop();
        this.#drawExciter(false);
    }

    // The leg after the wall we're heading for: [velocity, hit point, wall], or null
    #nextLeg(verts) {
        const [c, d] = this.intersectLine;
        const wall = createVector(c.x - d.x, c.y - d.y);
        const angle = 2 * wall.heading() - this.velocity.heading();   // mirror in the wall
        let v = createVector(cos(angle), sin(angle)).mult(this.speed);

        const from = this.intersectPoint;
        let [hit, nextWall] = edgeIntersect(from, createVector(from.x + v.x, from.y + v.y), verts);
        if (hit === null) {
            // Landed exactly on a corner, where the mirror can point out of the shape: go straight back
            v = createVector(-this.velocity.x, -this.velocity.y);
            [hit, nextWall] = edgeIntersect(from, createVector(from.x + v.x, from.y + v.y), verts);
        }
        return hit === null ? null : [v, hit, nextWall];
    }

    setExciterPath(verts) {
        this.pointBounceOrigin.x = this.x;
        this.pointBounceOrigin.y = this.y;
        push();
        stroke('#000');
        strokeWeight(1);

        // Thin line from cursor to exciter
        line(this.x, this.y, mouseX, mouseY);

        // Thick line from exciter: Velocity vector
        this.velocity.x = this.x - mouseX;
        this.velocity.y = this.y - mouseY;
        this.speed = this.velocity.mag();

        const endX = this.x + this.velocity.x;
        const endY = this.y + this.velocity.y;
        const endPos = createVector(endX, endY);

        [this.intersectPoint, this.intersectLine] = edgeIntersect(createVector(this.x, this.y), endPos, verts);

        // No wall ahead: cursor is on top of the exciter (zero-length pull),
        // or the exciter is outside the shape. Nothing to draw, nothing to launch.
        if (this.intersectPoint === null) {
            pop();
            return;
        }

        push();
        fill(0);
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
    // Same shape with every wall moved inward by d
    insetVerts(d) {
        const r = this.radius - d / cos(180 / window.sides);
        const verts = [];
        for (let i = 0; i <= window.sides; i++) {
            verts.push(createVector(
                this.x + r * sin((360 / window.sides) * i),
                this.y + r * cos((360 / window.sides) * i)
            ));
        }
        return verts;
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