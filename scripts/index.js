"use strict";

const rangeInputSides = document.getElementById('range-input-sides');
window.sides = rangeInputSides.value;
const rangeOutputSides = document.getElementById('range-output-sides');
rangeOutputSides.textContent = rangeInputSides.value;

const rangeInputDivision = document.getElementById('range-input-division');
const rangeOutputDivision = document.getElementById('range-output-division');
rangeOutputDivision.textContent = rangeInputDivision.value;

const rangeOutputType = document.getElementById('range-output-type');
const rangeOutputMode = document.getElementById('range-output-mode');

const rangeOutputSpeed = document.getElementById('range-output-speed');
const rangeInputSpeed = document.getElementById('range-input-speed');

const imgMute = document.getElementById('img-mute');
imgMute.onclick = () => {
    imgMute.classList.toggle('exciter-mute-mute');
    imgMute.classList.toggle('exciter-mute-volume');
    volume = Number(!volume);
    sounds.forEach(x => x.amp(volume));
};

rangeInputSpeed.oninput = () => {
    rangeOutputSpeed.textContent = rangeInputSpeed.value;
    exciter.speed = Number(rangeInputSpeed.value);
};

rangeInputDivision.oninput = () => {
    rangeOutputDivision.textContent = rangeInputDivision.value;
};

document.oncontextmenu = () => false;

rangeInputSides.oninput = () => {
    window.sides = rangeInputSides.value;
    rangeOutputSides.textContent = rangeInputSides.value;
};

for (let elem of document.querySelectorAll('main')) {
    elem.onwheel = (event) => {
        if (!window.isBouncing) {
            rangeInputSides.value = event.deltaY < 0 ?
                Number(rangeInputSides.value) + 1 : Number(rangeInputSides.value) - 1;
            rangeInputSides.dispatchEvent(new Event('input'));
        } else {

            let speed = event.deltaY < 0 ? exciter.speed + 10 : exciter.speed - 10;
            speed = Math.max(0, speed);
            exciter.speed = speed;
            rangeInputSpeed.value = speed;
        }
    };
}

// btn group type: Tick, Synth, Drone, Noise
for (let btn of document.querySelectorAll('#btn-box-type>div>button')) {
    btn.onclick = () => {
        document.querySelectorAll('#btn-box-type>div>button').forEach(x => x.classList = '');
        btn.classList = 'btn-active';
        rangeOutputType.textContent = btn.innerHTML;
    };
}

// btn group mode: fixed speed or fixed BPM
for (let btn of document.querySelectorAll('#btn-box-mode>div>button')) {
    btn.onclick = () => {
        document.querySelectorAll('#btn-box-mode>div>button').forEach(x => x.classList = '');
        btn.classList = 'btn-active';
        rangeOutputMode.textContent = btn.innerHTML;
    };
}