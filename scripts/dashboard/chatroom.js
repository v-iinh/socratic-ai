const userSession = database.ref(sessionStorage.getItem('position'));
const text = document.getElementsByClassName('cursive_text')[0];
const filler = document.getElementsByClassName('filler_content')[0];
const messages = document.getElementsByClassName('messages')[0];
const input = document.getElementById('input')
const is_tutor = sessionStorage.getItem('username') !== null;

document.addEventListener('DOMContentLoaded', function(){
    console.log(is_tutor)
})

input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
})

userSession.on('child_added', (snapshot) => {
    const data = snapshot.val();
    filler.style.display = "none"
    messages.style.display = "flex"
    if (data) {
        addMessage(data.message, data.role);
    }
});

function sendMessage(){
    const message = input.value;
    let role = is_tutor ? "tutor" : "student";

    userSession.push({
        role: role,
        message: message
    })
}

function addMessage(text, role) {
    const message = document.createElement('div');
    message.textContent = text;

    if (is_tutor && role === "tutor") {
        message.classList.add('message', 'you'); 
    } else if (!is_tutor && role === "student") {
        message.classList.add('message', 'you'); 
    } else {
        message.classList.add('message', 'them'); 
    }

    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight

    input.value = ''
}

userSession.onDisconnect().remove();
// Say hello to each other
// Type message ^^ display none
// Dynamic Message generation
// User Leaves, display none the messages
// Display redirect soon for 1 second, then redirect

// Add sessionID node
// if work on disconnect system