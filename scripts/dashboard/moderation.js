const messages = document.getElementsByClassName('messages')[0];
const sessionId = sessionStorage.getItem('selected');
const archiveSession = archive.child(sessionId);

const finetuneControls = document.getElementById('finetune-controls');
const endControls = document.getElementById('end-controls');

const minus = document.getElementById('minus');
const trash = document.getElementById('trash');
const plus = document.getElementById('plus');
const ban = document.getElementById('ban');

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

trash.addEventListener('click', function(){
    archiveSession.remove().then(() => {
        window.location = '../../redirects/dashboard/admin.html'
    })
})

ban.addEventListener('click', function(){
    database.ref(sessionId).update({
        active: false
    })
})

minus.addEventListener('click', function(){
    archiveSession.update({
        weight: -1
    }).then(() => {
        window.location = 'admin.html'
    })
})

plus.addEventListener('click', function(){
    archiveSession.update({
        weight: 1
    }).then(() => {
        window.location = 'admin.html'
    })
})