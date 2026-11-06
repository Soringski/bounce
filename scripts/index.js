"use strict";

const rangeInput = document.getElementById('range-input');
window.sides = rangeInput.value;
const rangeOutput = document.getElementById('range-output');
rangeOutput.textContent = rangeInput.value;

rangeInput.oninput = () => {
    window.sides = rangeInput.value;
    rangeOutput.textContent = rangeInput.value;
};
