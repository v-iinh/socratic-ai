const userSession = database.ref(sessionStorage.getItem('position'));
const text = document.getElementsByClassName('cursive_text')[0];
const icon = document.getElementsByClassName('fa-hands-clapping')[0];
const filler = document.getElementsByClassName('filler_content')[0];
const messages = document.getElementsByClassName('messages')[0];
const input = document.getElementById('input')
const is_tutor = sessionStorage.getItem('username') !== null;

document.addEventListener('DOMContentLoaded', function(){
    userSession.once('value', (snapshot) => {
        if (!snapshot.exists()) {
            userSession.set({
                active: true,
            });
        }
    });
    userSession.onDisconnect().update({
        active: false
    })

    setInterval(sessionEnd, 1000)
})

input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
})

userSession.on('child_added', (snapshot) => {
    if (snapshot.key === "active") {
        return;
    }

    const data = snapshot.val();
    filler.style.display = "none";
    messages.style.display = "flex";

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

function sessionEnd() {
    userSession.once('value').then(snapshot => {
        const sessionData = snapshot.val();
        if (!sessionData.active) {
            redirectUsers();
        }
    })
}

function redirectUsers(){
    icon.classList.remove('fa-hands-clapping');
    icon.classList.add('fa-check');

    messages.style.display = "none"
    filler.style.display = "flex"

    userSession.remove()

    setTimeout(() => {
        window.location = '../../index.html'
    }, 1000);
}