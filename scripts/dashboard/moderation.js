// Check whether the session is active or inactive

// If active, show the close option
// If inactive, show the finetuning options

// Finetuning algorithm 
// Idea: More prompting?
// Idea: Lower the temperature the more similar a question is to another

const messages = document.getElementsByClassName('messages')[0];
const sessionId = sessionStorage.getItem('selected');
const archiveSession = archive.child(sessionId);

archiveSession.on('value', (snapshot) => {
    Array.from(messages.querySelectorAll('.message')).forEach(child => child.remove());
    const data = snapshot.val();
    data.messages.forEach(element => {
        const text = element.text;
        const role = element.role;
        addMessage(text, role);
    });
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