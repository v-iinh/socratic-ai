const visualizer = document.querySelector('.visualizer');
const btn = document.querySelector('.btn');

let ctx = null;
let analyser = null;
let stream = null;
let bufferLength, dataArray, elements = [];
let animationId = null;

const initializeVisualizer = () => {
    if (!ctx) {
        ctx = new AudioContext();
        analyser = ctx.createAnalyser();

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

const startVoiceVisualizer = async () => {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const source = ctx.createMediaStreamSource(stream);
    source.connect(analyser);
    updateVisualizer();
    recordUser();
};

function recordUser(){
    // Keep a record of what the user is saying.
}

const stopVoiceVisualizer = () => {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
    elements.forEach(element => {
        element.style.transform = 'translate(-50%, 100px)';
    });

    enterPrompt();
};

function enterPrompt(){
    // Stop recording.
    // Whatever the user recorded, input it into chatgpt api. 
    // User cannot click button until the ai is finished speaking its part. 
}

const updateVisualizer = () => {
    animationId = requestAnimationFrame(updateVisualizer);
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
};

const clamp = (num, min, max) => Math.max(min, Math.min(num, max));

btn.addEventListener('click', async () => {
    if (!ctx) {
        initializeVisualizer();
    }

    if (ctx.state === 'suspended') {
        await ctx.resume();
    }

    if (stream) {
        stopVoiceVisualizer();
        btn.classList.replace('fa-microphone', 'fa-microphone-slash');
    } else {
        await startVoiceVisualizer();
        btn.classList.replace('fa-microphone-slash', 'fa-microphone');
    }
});
