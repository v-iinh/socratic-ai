const icon = document.getElementsByClassName('fa-spinner')[0]

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
    icon.classList.remove('fa-spinner');
    icon.classList.add('fa-check');
    sessionStorage.setItem('position', sessionData)
    setTimeout(() => {
        window.location = '../../redirects/dashboard/chatroom.html'
    }, 1000);
}