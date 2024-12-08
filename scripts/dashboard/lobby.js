const text = document.getElementsByClassName('cursive_text')[0]
const icon = document.getElementsByClassName('fa-address-book')[0]

document.addEventListener("DOMContentLoaded", function() {
    studentWaiting();
    setInterval(checkConnection, 1000);
});

function studentWaiting() {
    if (sessionStorage.getItem('position') == null) {
        const newPosition = guidGenerator()
        sessionStorage.setItem('position', newPosition);

        const positionRef = sessions.push({
            position: newPosition,
            active: false
        });

        positionRef.onDisconnect().remove();
    }
}

function checkConnection() {
    const position = parseInt(sessionStorage.getItem('position')); 
    sessions.orderByChild('position').equalTo(position).once('value', snapshot => {
        if (snapshot.exists()) {
            snapshot.forEach(childSnapshot => {
                const sessionData = childSnapshot.val();
                if (sessionData.position === position && sessionData.active === true) {  
                    connectionAccepted();
                }
            });
        }
    });
}

function connectionAccepted(){
    text.innerHTML = "Tutor Found"
    icon.classList.remove('fa-address-book', 'fa-regular');
    icon.classList.add('fa-check', 'fa-solid');
    setTimeout(() => {
        window.location = 'chatroom.html';
    }, 1000);
}

function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}