import Groq from "https://cdn.skypack.dev/groq-sdk";

const llama_key = "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";
const groq = new Groq({ apiKey: llama_key, dangerouslyAllowBrowser: true });

const typeInput = document.getElementsByTagName('select')[0];
const quantityInput = document.getElementsByTagName('input')[0];
const subjectInput = document.getElementsByTagName('input')[1];

async function callLlama(type, quantity, subject) {
    const completion = await groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: `Create ${quantity} flashcard/s in a strict JSON array format, e.g the array is enclosed in brackets [] and each flashcard object is enclosed in curly brackets {}. 
                The JSON object should have two properties:
                    1. "front": The text for the front of the flashcard, create a "${type} based on "${subject}".
                    2. "back": The text for the back of the flashcard, providing the answer or explanation.
                Return only the JSON object and nothing else.`
            },
        ],
        model: "llama3-8b-8192",
    });

    let response = completion.choices[0].message.content;
    let flashcards = JSON.parse(response);

    flashcards.forEach(flashcard => {
        const { front, back } = flashcard;
        generateCards(front, back);
    });
}

document.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {

        const type = typeInput.value;
        const quantity = quantityInput.value;
        const subject = subjectInput.value;

        if (type !== "" && (quantity !== "" && (quantity >= 1 && quantity <= 5)) && subject !== "") {
            callLlama(type, quantity, subject);
        }

        typeInput.value = "";
        quantityInput.value = "";
        subjectInput.value = "";
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