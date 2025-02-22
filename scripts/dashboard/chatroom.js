const userSession = database.ref(sessionStorage.getItem('position'));

const filler = document.getElementsByClassName('filler_content')[0];
const messages = document.getElementsByClassName('messages')[0];
const input = document.getElementById('input')

const username = sessionStorage.getItem('username')
const isTutor = username !== null;

document.addEventListener('DOMContentLoaded', function(){
    userSession.once('value', (snapshot) => {
        if (!snapshot.exists() && isTutor) {
            userSession.set({
                active: true,
                tutor: username
            });
        }
    });
    userSession.onDisconnect().update({
        active: false
    }).then(() => {
        sessionEnd();
    })
})

input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey && input.value.trim()) {
        event.preventDefault();
        
        input.style.height = '49.6px';
        const inputPosition = input.getBoundingClientRect();
        window.scrollTo({
            top: inputPosition.bottom + window.scrollY - window.innerHeight + 60
        });

        sendMessage();     
    }
})

input.addEventListener('input', () => {
    input.style.height = '1.6rem';
    const newHeight = Math.min(input.scrollHeight, parseInt(getComputedStyle(input).maxHeight));
    input.style.height = Math.max(newHeight, parseInt(getComputedStyle(input).minHeight)) + 'px';
    input.scrollTop = input.scrollHeight;

    const inputPosition = input.getBoundingClientRect();
    window.scrollTo({
        top: inputPosition.bottom + window.scrollY - window.innerHeight + 60
    });
});

userSession.on('child_added', (snapshot) => {
    if (snapshot.key === "active" || snapshot.key === "tutor") {
        return;
    }

    const data = snapshot.val();
    filler.style.display = "none";
    messages.style.display = "flex";

    if (data) {
        addMessage(data.message, data.role);
    }
});

userSession.on('child_removed', (snapshot) => {
    const data = snapshot.val();
    if (!data || data.active === false) {
        redirectUsers();
    }
});

function sendMessage(){
    const message = input.value;
    const messageCount = document.getElementsByClassName('message').length;
    let role = isTutor ? "tutor" : "student";

    userSession.child(messageCount).set({
        role: role,
        message: message
    })
}

function addMessage(text, role) {
    const message = document.createElement('div');
    message.textContent = text;

    if (isTutor && role === "tutor") {
        message.classList.add('message', 'you'); 
    } else if (!isTutor && role === "student") {
        message.classList.add('message', 'you'); 
    } else {
        message.classList.add('message', 'them'); 
    }

    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;

    input.value = '';

    const messageCount = document.getElementsByClassName('message').length - 1;
    archiveMessage(text, role, messageCount);
}

function archiveMessage(text, role, messageCount) {
    const sessionId = sessionStorage.getItem('position');
    const sessionRef = archive.child(sessionId);
    const messagesRef = sessionRef.child("messages");

    userSession.once("value").then(snapshot => {
        const sessionData = snapshot.val();
        const tutorName = sessionData.tutor;
        sessionRef.once("value").then(sessionSnapshot => {
            if (!sessionSnapshot.exists()) {
                sessionRef.set({
                    weight: 0,
                    tutor: tutorName
                }).then(() => {
                    messagesRef.child(messageCount).set({
                        text: text,
                        role: role
                    });
                });
            } else {
                messagesRef.child(messageCount).once("value").then(msgSnapshot => {
                    if (!msgSnapshot.exists()) {
                        messagesRef.child(messageCount).set({
                            text: text,
                            role: role
                        });
                    }
                });
            }
        });
    });
}

function sessionEnd() {
    userSession.once('value').then(snapshot => {
        const sessionData = snapshot.val();
        if (!sessionData.active) {
            userSession.remove();
            redirectUsers();
        }
    });
}

function redirectUsers(){
    const text = document.getElementsByTagName('h2')[1];
    const subText = document.getElementsByTagName('p')[1];
    const icon = document.getElementsByClassName('fa-hands-clapping')[0];

    text.innerHTML= 'Session Has Ended'
    subText.innerHTML = 'Thank you for using Socratic! You will be redirected momentarily.'
    icon.classList.remove('fa-hands-clapping');
    icon.classList.add('fa-check');

    messages.style.display = "none"
    filler.style.display = "flex"

    setTimeout(() => {
        window.location = '../../index.html'
    }, 1000);
}