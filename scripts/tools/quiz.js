import Groq from "https://cdn.skypack.dev/groq-sdk";

const llama_key = `${settings.llama.apiKey}`;
const groq = new Groq({ apiKey: llama_key, dangerouslyAllowBrowser: true });

const firstHalf = document.getElementsByClassName('halfSide')[0];
const secondHalf = document.getElementsByClassName('halfSide')[1];
const gridItem = document.getElementsByClassName('grid-item')[0];

const input = document.getElementById('input');
const number = document.getElementById('number');

const questionNumber = document.getElementById('question_number');
const questionText = document.getElementById('question_text');

let questionQueue = 0;

document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && input.value !== '' && number.value !== '' && number.value !== null && number.value <= 5) {
        questionQueue = 0;
        transitionGrid();
    }
})

async function callLlama(subject, quantity) {
    const completion = await groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: `Create ${quantity} questions in a strict JSON array format, e.g. the array is enclosed in brackets [] and each object is enclosed in curly brackets {}. 
                The JSON object should have five properties:
                    1. "question": The question, create a question based on "${subject}".
                    2. "answer": The answer, this is the answer to the question.
                    3. "incorrect1": An incorrect answer to the question.
                    4. "incorrect2": An incorrect answer to the question.
                    5. "incorrect3": An incorrect answer to the question.
                Return only the JSON object and nothing else.`
            },
        ],
        model: "llama-3.3-70b-versatile",
    });

    let response = completion.choices[0].message.content;
    let questions = JSON.parse(response);

    generateQuestion(questions);
}

function generateQuestion(data) {
    const options = document.getElementsByClassName('option');
    const question = data[questionQueue];
    
    questionNumber.classList.add('fade-out');
    questionText.classList.add('fade-out');

    setTimeout(() => {
        questionNumber.innerHTML = `You Are on Question ${questionQueue + 1}`;
        questionText.innerHTML = `${question.question}`;

        questionNumber.classList.remove('fade-out');
        questionText.classList.remove('fade-out');
        questionNumber.classList.add('fade-in');
        questionText.classList.add('fade-in');

        let elements = [
            question.answer,
            question.incorrect1,
            question.incorrect2,
            question.incorrect3
        ];
        elements = elements.sort(() => Math.random() - 0.5);

        for (let i = 0; i < options.length; i++) {
            const option = options[i];

            option.innerHTML = `${elements[i]}`;
            option.addEventListener('click', function() {
                if (option.innerHTML === question.answer) {
                    option.classList.remove('wiggle');
                    questionQueue++;
                    if (questionQueue >= data.length) {
                        questionQueue = 0;
                        quizComplete();
                    } else {
                        generateQuestion(data);
                    }
                } else {
                    option.classList.add('wiggle');
                    setTimeout(() => {
                        option.classList.remove('wiggle');
                    }, 1000);
                }
            });
        }
    }, 500);
}

function transitionGrid() {
    firstHalf.classList.add('fade-out');
    callLlama(input.value, number.value);
    
    setTimeout(() => {
        firstHalf.style.width = '50%';
        gridItem.style.width = '50%';
        secondHalf.style.display = 'flex';

        input.value = '';
        number.value = '';

        setTimeout(() => {
            firstHalf.classList.remove('fade-out');
            firstHalf.classList.add('fade-in');
        }, 500); 
    }, 500); 
}

function quizComplete() {
    questionNumber.classList.add('fade-out');
    questionText.classList.add('fade-out');
    firstHalf.classList.add('fade-out');
    
    setTimeout(() => {
        firstHalf.style.width = '100%';
        gridItem.style.width = '25%';
        secondHalf.style.display = 'none';

        questionNumber.innerHTML = 'Worksheet is Complete';
        questionText.innerHTML = 'Repetition is important to comprehending all the material, so feel free to keep practicing if you need to.';

        setTimeout(() => {
            firstHalf.classList.remove('fade-out');
            firstHalf.classList.add('fade-in');

            questionNumber.classList.remove('fade-out');
            questionText.classList.remove('fade-out');
            questionNumber.classList.add('fade-in');
            questionText.classList.add('fade-in');
        }, 500); 
    }, 500);
}

