import Groq from "https://cdn.skypack.dev/groq-sdk";

const llama_key = `${settings.llama.apiKey}`;
const groq = new Groq({ apiKey: llama_key, dangerouslyAllowBrowser: true });

const filler = document.getElementsByClassName('filler_content')[0];
const messages = document.getElementsByClassName('messages')[0];
const input = document.getElementById('input');

let initializedWeights = false;

let conversationHistory = [
    {
        role: "system",
        content: `You are a helpful, friendly, and engaging educational assistant. Your goal is to help students learn by encouraging inquiry, guiding them step-by-step, and giving positive reinforcement. Always adapt your tone to be approachable and clear. If the user makes mistakes, offer gentle hints to guide them toward understanding. Avoid giving the answer directly. And only provide one step at a time.`
    },
];

input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey && input.value !== '') {
        event.preventDefault();

        input.style.height = '49.6px';
        const inputPosition = input.getBoundingClientRect();
        window.scrollTo({
            top: inputPosition.bottom + window.scrollY - window.innerHeight + 60
        });
        
        hideFiller();
        addMessage(input.value, 'user');
    }
})

input.addEventListener('input', () => {
    input.style.height = '1.6rem';
    const newHeight = Math.min(input.scrollHeight, parseInt(getComputedStyle(input).maxHeight));
    input.style.height = Math.max(newHeight, parseInt(getComputedStyle(input).minHeight)) + 'px';
    input.scrollTop = input.scrollHeight;

    const inputPosition = input.getBoundingClientRect();
    window.scrollTo({
        top: inputPosition.bottom + window.scrollY - window.innerHeight + 60
    });
});

async function callLlama(text) {
    if(!initializedWeights){
        fetchWeights();
        initializedWeights = true;
    }

    conversationHistory.push({
        role: "user",
        content: text,
    });

    const layerRef = await groq.chat.completions.create({
        messages: weightsdb,
        model: "llama-3.3-70b-versatile",
    });

    let response = layerRef.choices[0].message.content;

    conversationHistory.push({
        role: "assistant",
        content: response,
    });

    addMessage(response, 'assistant');
}

function addMessage(text, role) {
    const message = document.createElement('div');
    const formattedText = text.replace(/\n/g, '<br>');

    message.innerHTML = formattedText;

    if (role === "user") {
        message.classList.add('message', 'you');
        callLlama(text);
    } else {
        message.classList.add('message', 'them');
    }

    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;

    input.value = '';
}

function hideFiller(){
    messages.style.display = "flex"
    filler.style.display = "none"
}