const userSession = database.ref(sessionStorage.getItem('position'));
const text = document.getElementsByClassName('cursive_text')[0];
const filler = document.getElementsByClassName('filler_content')[0];
const messages = document.getElementsByClassName('messages')[0];
const input = document.getElementById('input');
const is_tutor = sessionStorage.getItem('username') !== null;
const is_active = userSession.child('active');

document.addEventListener('DOMContentLoaded', function () {
    is_active.set(true);
    is_active.onDisconnect().set(false);
});

input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

userSession.child('messages').on('child_added', (snapshot) => {
    const data = snapshot.val();
    filler.style.display = "none";
    messages.style.display = "flex";
    if (data) {
        addMessage(data.message, data.role);
    }
});

function sendMessage() {
    const message = input.value;
    const role = is_tutor ? "tutor" : "student";

    userSession.child('messages').push({
        role: role,
        message: message,
    });

    input.value = '';
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
    messages.scrollTop = messages.scrollHeight;
}

userSession.child('active').on('value', (snapshot) => {
    const active = snapshot.val();
    if (!active) {
        sessionEnd();
    }
});

function sessionEnd() {
    messages.style.display = "none";
    filler.style.display = "flex";
}
