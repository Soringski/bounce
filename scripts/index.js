"use strict";

const rangeInput = document.getElementById('range-input');
window.sides = rangeInput.value;
const rangeOutput = document.getElementById('range-output');
rangeOutput.textContent = rangeInput.value;

rangeInput.oninput = () => {
    window.sides = rangeInput.value;
    rangeOutput.textContent = rangeInput.value;
};

for (let elem of document.querySelectorAll('main')) {
    elem.onwheel = (event) => {
        rangeInput.value = event.deltaY < 0 ?
            Number(rangeInput.value) + 1 : Number(rangeInput.value) - 1;
        rangeInput.dispatchEvent(new Event('input'));
    };
}