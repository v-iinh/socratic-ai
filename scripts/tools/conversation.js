const visualizer = document.querySelector('.visualizer');
const btn = document.querySelector('.btn');
const audio = document.querySelector('audio');

window.AudioContext = window.AudioContext || window.webkitAudioContext;
let ctx = null; 
let analyser = null;
let source = null;
let bufferLength, dataArray, elements = [];

const initializeVisualizer = () => {
    if (!ctx) {
        ctx = new AudioContext();
        analyser = ctx.createAnalyser();
        source = ctx.createMediaElementSource(audio);
        source.connect(analyser);
        source.connect(ctx.destination);

        analyser.fftSize = 64;
        bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);

        for (let i = 0; i < bufferLength; i++) {
            const element = document.createElement('span');
            element.classList.add('element');
            elements.push(element);
            visualizer.appendChild(element);
        }
    }
};

btn.addEventListener('click', () => {
    if (!ctx) {
        initializeVisualizer();
    }
    if (ctx.state === 'suspended') {
        ctx.resume();
    }

    if (audio.paused) {
        audio.play();
        btn.classList.replace('fa-microphone-slash', 'fa-microphone');
    } else {
        audio.pause();
        btn.classList.replace('fa-microphone', 'fa-microphone-slash');
    }
});

const clamp = (num, min, max) => Math.max(min, Math.min(num, max));
const update = () => {
    requestAnimationFrame(update);
    if (analyser) {
        analyser.getByteFrequencyData(dataArray);
        for (let i = 0; i < bufferLength; i++) {
            let item = dataArray[i];
            item = item > 150 ? item / 1.5 : item * 1.5;
            elements[i].style.transform = `rotateZ(${i * (360 / bufferLength)}deg) translate(-50%, ${clamp(
                item,
                100,
                145
            )}px)`;
        }
    }
};
update();
