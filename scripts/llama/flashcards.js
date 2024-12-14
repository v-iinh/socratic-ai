import Groq from "https://cdn.skypack.dev/groq-sdk";

const llama_key = "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";
const groq = new Groq({ apiKey: llama_key, dangerouslyAllowBrowser: true });

async function callLlama(subject, type) {
    const completion = await groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: `Create a flashcard in strict JSON format. 
                The JSON object should have two properties:
                1. "front": The text for the front of the flashcard, based on "${subject}" and "${type}".
                2. "back": The text for the back of the flashcard, providing the answer or explanation.
                Return only the JSON object and nothing else.`
            },
        ],
        model: "llama3-8b-8192",
    });

    let response = completion.choices[0].message.content;

    const flashcard = JSON.parse(response);
    const { front, back } = flashcard;

    generateCards(front, back);
}

document.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        const type = document.getElementsByTagName('input')[0].value;
        const quantity = document.getElementsByTagName('input')[1].value;
        const subject = document.getElementsByTagName('input')[2].value;        

        if(type !== null && quantity !== null && subject !== null){
            for(let i=0; i<parseInt(quantity); i++){
                callLlama(subject, type);
            }
        }
    }
});

function generateCards(front, back) {
    const addButton = document.querySelector('.add');
    const newCard = document.createElement('div');

    newCard.classList.add('card');
    newCard.setAttribute('onclick', 'toggle(this, event)');
    newCard.innerHTML = `
        <div class="front">${front}</div>
        <div class="back">${back}</div>
        <div class="icons">
            <div class="fa-solid fa-pencil" onclick="enableEdit(this, event)"></div>
            <div class="fa-solid fa-trash" onclick="removeCard(this, event)"></div>
        </div>
    `;

    addButton.insertAdjacentElement('afterend', newCard);
}