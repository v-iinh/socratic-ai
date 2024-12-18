import Groq from "https://cdn.skypack.dev/groq-sdk";

const llama_key = "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";
const groq = new Groq({ apiKey: llama_key, dangerouslyAllowBrowser: true });

const filler = document.getElementsByClassName('filler_content')[0];
const messages = document.getElementsByClassName('messages')[0];
const input = document.getElementById('input');

let conversationHistory = [];

input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && input.value !== '') {
        redirectUsers();
        addMessage(input.value, 'user');
    }
})

async function callLlama(text) {
    conversationHistory.push({
        role: "user",
        content: text,
    });

    const completion = await groq.chat.completions.create({
        messages: conversationHistory,
        model: "llama3-8b-8192",
    });

    let response = completion.choices[0].message.content;

    conversationHistory.push({
        role: "assistant",
        content: response,
    });

    addMessage(response, 'bot');
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

function redirectUsers(){
    messages.style.display = "flex"
    filler.style.display = "none"
}