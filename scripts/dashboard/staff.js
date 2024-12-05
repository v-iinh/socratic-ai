const text = document.getElementsByClassName('cursive_text')[0]
const finding = document.getElementsByClassName('fa-address-book')[0]
const available = document.getElementsByClassName('fa-comments')[0]

document.addEventListener('DOMContentLoaded', function(){
    setInterval(staffWaiting, 1000);
})

available.addEventListener('click', function(){
    connectRedirect();
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
    text.innerHTML = "Student Available"
    finding.style.display = "none"
    available.style.display = "flex"
}

function findingStudent(){
    text.innerHTML = "Finding Student"
    available.style.display = "none"
    finding.style.display = "flex"
}

function connectRedirect() {
    sessions.once('value', (snapshot) => {

        const child = snapshot.val(); 
        const sessionKey = Object.keys(child)[0];
        const sessionData = child[sessionKey]; 

        database.ref('sessions/' + sessionKey).remove()
        .then(() => {
            console.log('First session removed:', sessionData.position);
        })
        .catch(error => {
            console.error("Error removing first session:", error);
        });

    });
}