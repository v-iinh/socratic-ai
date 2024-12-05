const text = document.getElementsByClassName('cursive_text')[0]
const finding = document.getElementsByClassName('fa-address-book')[0]
const available = document.getElementsByClassName('fa-comments')[0]

document.addEventListener('DOMContentLoaded', function(){
    setInterval(staffWaiting, 1000);
})

available.addEventListener('click', function(){
    acceptSession();
})

function staffWaiting(){
    sessions.once('value', (snapshot) => {
        const count = snapshot.numChildren();
        if(count > 0){
            studentAvailable();
        } else {
            findingStudent();
        }
    });
}

function studentAvailable(){
    text.innerHTML = "Student Found"
    finding.style.display = "none"
    available.style.display = "flex"
}

function findingStudent(){
    text.innerHTML = "Finding Student"
    available.style.display = "none"
    finding.style.display = "flex"
}

function acceptSession() {
    sessions.once('value', (snapshot) => {

        const child = snapshot.val(); 
        const sessionKey = Object.keys(child)[0];
        const sessionData = child[sessionKey].position; 

        database.ref('sessions/' + sessionKey).update({
            active: true
        })
        .then(() => {
            connectSession(sessionData)
        })
        .catch(error => {
            console.error(error);
        });

    });
}

function connectSession(sessionData){
    sessionStorage.setItem('position', sessionData)
    window.location = 'chatroom.html'
}