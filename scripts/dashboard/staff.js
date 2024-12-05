const text = document.getElementsByClassName('cursive_text')[0]
const finding = document.getElementsByClassName('fa-address-book')[0]
const available = document.getElementsByClassName('fa-comments')[0]

document.addEventListener('DOMContentLoaded', function(){
    setInterval(staffWaiting, 1000)
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

function connectRedirect(){
    // Continue Here
}