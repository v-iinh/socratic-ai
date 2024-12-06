const text = document.getElementsByClassName('cursive_text')[0]
const icon = document.getElementsByClassName('fa-address-book')[0]

document.addEventListener('DOMContentLoaded', function(){
    checkSession();
    setInterval(staffWaiting, 1000);
})

function staffWaiting(){
    sessions.once('value', (snapshot) => {
        const count = snapshot.numChildren();
        if(count > 0){
            checkConnection();
        }
    });
}

function checkConnection() {
    sessions.once('value', (snapshot) => {
        const child = snapshot.val(); 
        const sessionKey = Object.keys(child)[0];
        const sessionData = child[sessionKey].position; 
        database.ref('sessions/' + sessionKey).update({
            active: true
        })
        .then(() => {
            connectionAccepted(sessionData);
        })
        .catch(error => {
            console.error(error);
        });

    });
}

function connectionAccepted(sessionData){
    text.innerHTML = "Student Found"
    icon.classList.remove('fa-address-book', 'fa-regular');
    icon.classList.add('fa-check', 'fa-solid');
    sessionStorage.setItem('position', sessionData)
    setTimeout(() => {
        window.location = 'chatroom.html'
    }, 1000);
}