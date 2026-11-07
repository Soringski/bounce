"use strict";

const rangeInput = document.getElementById('range-input');
window.sides = rangeInput.value;
const rangeOutput = document.getElementById('range-output');
rangeOutput.textContent = rangeInput.value;

document.oncontextmenu = () => false;

rangeInput.oninput = () => {
    window.sides = rangeInput.value;
    rangeOutput.textContent = rangeInput.value;
};

for (let elem of document.querySelectorAll('main')) {
    elem.onwheel = (event) => {
        if (!window.isBouncing) {
            rangeInput.value = event.deltaY < 0 ?
                Number(rangeInput.value) + 1 : Number(rangeInput.value) - 1;
            rangeInput.dispatchEvent(new Event('input'));
        } else {

            let speed = event.deltaY < 0 ? exciter.speed + 10 : exciter.speed - 10;
            speed = Math.max(0, speed);
            exciter.speed = speed;
        }
    };
}