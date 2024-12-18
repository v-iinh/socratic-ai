import Groq from "https://cdn.skypack.dev/groq-sdk";

const llama_key = "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";
const groq = new Groq({ apiKey: llama_key, dangerouslyAllowBrowser: true });

const typeInput = document.getElementsByTagName('select')[0];
const quantityInput = document.getElementsByTagName('input')[0];
const subjectInput = document.getElementsByTagName('input')[1];

const addButton = document.querySelector('.add');

let isEditing = false;

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

    for (let i = 0; i < flashcards.length; i++) {
        const { front, back } = flashcards[i];
        generateCards(front, back);
        await delay(500);
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
    newCard.innerHTML = `
        <div class="front">${front}</div>
        <div class="back">${back}</div>
        <div class="icons">
            <div class="fa-solid fa-pencil"></div>
            <div class="fa-solid fa-trash"></div>
        </div>
    `;

    newCard.addEventListener('click', function(event) {
        toggle(newCard, event);
    });

    addButton.insertAdjacentElement('afterend', newCard);
}

document.addEventListener('click', function (event) {
    if (event.target.classList.contains('fa-pencil')) {
        enableEdit(event.target, event);
    } else if (event.target.classList.contains('fa-trash')) {
        removeCard(event.target, event);
    } else if (event.target.classList.contains('fa-times')) {
        disableEdit(event.target, event);
    } else if (!event.target.closest('.card')) {
        resetEditable();
    }
});

function disableEdit(icon, event) {
    event.stopPropagation();
    const card = icon.closest('.card');
    const front = card.querySelector('.front');
    const back = card.querySelector('.back');

    front.contentEditable = "false";
    back.contentEditable = "false";

    icon.classList.remove('editing');
    icon.classList.remove('fa-times');
    icon.classList.add('fa-pencil');

    isEditing = false;
}

function enableEdit(icon, event) {
    event.stopPropagation();
    const card = icon.closest('.card');
    const front = card.querySelector('.front');
    const back = card.querySelector('.back');

    if (!isEditing) {
        front.contentEditable = "true";
        back.contentEditable = "true";
        front.focus();

        icon.classList.add('editing');
        icon.classList.remove('fa-pencil');
        icon.classList.add('fa-times');

        isEditing = true;
    }
}

function resetEditable() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const front = card.querySelector('.front');
        const back = card.querySelector('.back');
        front.contentEditable = "false";
        back.contentEditable = "false";
    });

    const editingIcons = document.querySelectorAll('.fa-times.editing');
    editingIcons.forEach(icon => {
        icon.classList.remove('editing');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-pencil');
    });

    isEditing = false;
}

function removeCard(element, event) {
    event.stopPropagation();
    const card = element.closest('.card');
    if (card) {
        card.remove();
    }
}

function addCard() {
    const newCard = document.createElement('div');

    newCard.classList.add('card');
    newCard.innerHTML = `
        <div class="front"></div>
        <div class="back"></div>
        <div class="icons">
            <div class="fa-solid fa-pencil"></div>
            <div class="fa-solid fa-trash"></div>
        </div>
    `;

    newCard.addEventListener('click', function(event) {
        toggle(newCard, event);
    });

    addButton.insertAdjacentElement('afterend', newCard);
}

addButton.addEventListener('click', function() {
    addCard();
});

function toggle(card, event) {
    if (isEditing) {
        return;
    }

    if (event.target.closest('.icons')) {
        return; 
    }

    const front = card.querySelector('.front');
    const back = card.querySelector('.back');

    if (front.style.display === 'none') {
        front.style.display = 'flex';
        back.style.display = 'none';
    } else {
        front.style.display = 'none';
        back.style.display = 'flex';
    }
}