// TODO // 

// In admin panel, create an Ongoing Sessions tab. 
// For sessions tabs in admin panel, have the buttons save the ID to session storage and redirect to moderation.html
// In moderation.html, read the session storage and save the ID
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
        addMessage(text);
    });
});

function addMessage(text) {
    const message = document.createElement('div');
    console.log(text)
    message.textContent = text;

    message.classList.add('message', 'you'); 

    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
}