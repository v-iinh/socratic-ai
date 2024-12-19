import Groq from "https://cdn.skypack.dev/groq-sdk";

const llama_key = "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";
const groq = new Groq({ apiKey: llama_key, dangerouslyAllowBrowser: true });

const visualizer = document.querySelector('.visualizer');
const btn = document.querySelector('.btn');

const filler = document.getElementsByClassName('filler_content')[0];
const messages = document.getElementsByClassName('messages')[0];

let ctx = null;
let analyser = null;
let stream = null;
let bufferLength, dataArray, elements = [];
let animationId = null;

let recognition; 
let recordedMessage = ""; 
let recognitionLanguage = navigator.language; 

let conversationHistory = [];

async function callLlama(input) {
    conversationHistory.push({
        role: "user",
        content: input,
    });

    const completion = await groq.chat.completions.create({
        messages: [
            ...conversationHistory,
            {
                role: "user",
                content: `You are a friendly and engaging teacher. The user (me) wants to have a conversation with you. Respond to my message in a friendly manner and keep the conversation going. Your response should be conversational, informative, and encouraging. Keep your replies to no more than 3 sentences. The message I sent you is: ${input}`
            }
        ],
        model: "llama3-70b-8192",
    });

    let response = completion.choices[0].message.content;

    conversationHistory.push({
        role: "assistant",
        content: response,
    });

    addMessage(response, 'bot');
    llamaSpeaks(response);
}

function llamaSpeaks(response) {
    if (response !== '') {
        if (!stream) {  
            startVoiceVisualizer(false);  
        }

        const utterance = new SpeechSynthesisUtterance(response);

        utterance.volume = 1;
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.onend = function() { 
            stopVoiceVisualizer(); 
        };
        window.speechSynthesis.speak(utterance);
    }
}

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

const startVoiceVisualizer = async (is_record) => {
    try {

        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const source = ctx.createMediaStreamSource(stream);
        source.connect(analyser);
        updateVisualizer();
        if(is_record){
            recordUser();
        }
    } catch (error) {
        console.error(error);
    }
};

function recordUser() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        console.error("SpeechRecognition is not supported in this browser.");
        return;
    }

    recognition = new SpeechRecognition();
    recognition.lang = recognitionLanguage; 
    recognition.continuous = true;
    recognition.interimResults = false; 

    recordedMessage = ""; 
    recognition.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript.trim();
            recordedMessage += transcript + " ";
        }
    };

    recognition.start();
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

function addMessage(text, role) {
    const message = document.createElement('div');

    message.innerHTML = text;

    if (role === "user") {
        message.classList.add('message', 'you');
    } else {
        message.classList.add('message', 'them');
    }

    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
}

function enterPrompt() {
    if (recognition) {
        recognition.stop();
        recognition.onend = () => {
            addMessage(recordedMessage, 'user');
            callLlama(recordedMessage.trim());
            hideFiller();
        };
    }

    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }

    if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        stream = null;
    }

    elements.forEach((element) => {
        element.style.transform = "translate(-50%, 100px)";
    });
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

function hideFiller(){
    messages.style.display = "flex"
    filler.style.display = "none"
}

btn.addEventListener('click', async () => {
    if (!ctx) {
        initializeVisualizer();
    }

    if (ctx.state === 'suspended') {
        await ctx.resume();
    }

    if (btn.classList.contains('fa-microphone')) {
        stopVoiceVisualizer();
        btn.classList.replace('fa-microphone', 'fa-microphone-slash');
    } else {
        stopVoiceVisualizer();
        await startVoiceVisualizer(true);
        window.speechSynthesis.cancel();
        btn.classList.replace('fa-microphone-slash', 'fa-microphone');
    }
});

function cleanupAudioResources() {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }

    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }

    if (recognition) {
        recognition.stop();
        recognition = null;
    }

    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }

    if (elements) {
        elements.forEach(element => {
            element.style.transform = 'translate(-50%, 100px)';
        });
    }
}
window.addEventListener('beforeunload', cleanupAudioResources);