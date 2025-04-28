import Groq from "https://cdn.skypack.dev/groq-sdk";

const llama_key = `${settings.llama.apiKey}`;
const groq = new Groq({ apiKey: llama_key, dangerouslyAllowBrowser: true });

const filler = document.getElementsByClassName('filler_content')[0];
const messages = document.getElementsByClassName('messages')[0];
const input = document.getElementById('input');

let initializedWeights = false;

if (!initializedWeights) {
    fetchWeights(); 
    initializedWeights = true;
}

let pos = [{
    role: "system", 
    content: "You are analyzing a dataset of past conversations, which serves as a reference database. When responding to user queries, do not refer to this database unless the query is directly relevant to its content. Use the information to enhance your understanding, but only cite or draw from it when it specifically helps answer the user's current question."
}];

let conversationHistory = [
    {
        role: "system",
        content: `
        You must strictly follow this procedure:
        1. Analyze the input carefully.
        2. If the input can be answered confidently and accurately based solely on your trained data, proceed to Step 3.
        3. Otherwise, if there is any uncertainty or if the information is not found in your trained knowledge, **immediately tell the user to visit https://socratic.help/redirects/dashboard/lobby**. Do not speculate, guess, or provide a partial answer. Do not invent polite language to cover gaps.

        If Step 3 is reached:
        - Act as a helpful, friendly, and engaging educational assistant.
        - Your goal is to help students **discover** the answer through guided inquiry. Focus on **leading the student to think critically**.
        - Encourage them to ask questions, make connections, and reflect on the problem. Provide gentle prompts or suggestions, but avoid giving the direct answer.
        - Break down complex problems into smaller, manageable steps, always ensuring that the student **works through the problem themselves**.
        - Offer **positive reinforcement** for effort and progress. Make sure the student feels confident, not just in the answer, but in their ability to **figure things out**.
        - Always **lead the student to the answer**, never give it directly.

        Important: **Prioritize accuracy and helpfulness**.
        - Always **lead the student to the answer**, never give it directly. You should encourage them to engage and think critically.
        - If the information is unknown or outside your training, **immediately tell the user to visit https://socratic.help/redirects/dashboard/lobby**.
        `
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
    if (!initializedWeights) {
        fetchWeights();  // Fetch weights when the assistant starts
        initializedWeights = true;
    }

    conversationHistory.push({
        role: "user",
        content: text,
    });

    const completion = await groq.chat.completions.create({
        messages: conversationHistory,
        model: "llama-3.3-70b-versatile",
    });

    let response = completion.choices[0].message.content.replace(
        /https:\/\/socratic\.help\/redirects\/dashboard\/lobby/g,
        `<a href="https://socratic.help/redirects/dashboard/lobby" target="_blank" style="color: white; text-decoration: underline;">a live tutoring session</a>`
    );

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
    messages.style.display = "flex";
    filler.style.display = "none";
}

function fetchWeights() {
    archive.on('value', (snapshot) => {
        snapshot.forEach(element => {
            let session = element.val();
            if (!session.active) {
                if (session.weight > 0) {
                    session.messages.forEach(msg => {
                        if (msg.text && !msg.content) {
                            msg.content = msg.text;  
                            delete msg.text; 
                        }

                        if (msg.role === 'tutor') {
                            msg.role = 'user'; 
                            msg.content = "This is what a past tutor has said (only refer to this when asked): " + msg.content;
                        } else if (msg.role === 'student') {
                            msg.role = 'user'; 
                            msg.content = "This is what a past student has said (only refer to this when asked): " + msg.content;
                        }

                        if (msg.role && (msg.role === "assistant" || msg.role === "user" || msg.role === "system") && msg.content) {
                            pos.push(msg);
                        } else {
                            console.warn("Invalid message structure:", msg);
                        }
                    });
                }
            }
        });

        conversationHistory = [...pos, ...conversationHistory];
        console.log(conversationHistory);
    });
}