// Finetuning algorithm 
// Idea: More prompting?
// Idea: Lower the temperature the more similar a question is to another

const messages = document.getElementsByClassName('messages')[0];
const sessionId = sessionStorage.getItem('selected');
const archiveSession = archive.child(sessionId);

const finetuneControls = document.getElementById('finetune-controls');
const endControls = document.getElementById('end-controls');

archiveSession.on('value', (snapshot) => {
    Array.from(messages.querySelectorAll('.message')).forEach(child => child.remove());
    const data = snapshot.val();

    data.messages.forEach(element => {
        const text = element.text;
        const role = element.role;
        addMessage(text, role);
    });

    if (data.active) {
        finetuneControls.style.display = 'none';
        endControls.style.display = 'flex';
    } else {
        finetuneControls.style.display = 'flex';
        endControls.style.display = 'none';
    }
});

function addMessage(text, role) {
    const message = document.createElement('div');
    message.textContent = text;

    if(role === "tutor"){
        message.classList.add('message', 'you'); 
    } else {
        message.classList.add('message', 'them'); 
    }

    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
}