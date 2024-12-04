const text = document.getElementsByClassName('cursive_text')[0]

document.addEventListener('DOMContentLoaded', function(){
    setInterval(staffWaiting, 1000)
})

function staffWaiting(){
    sessions.once('value', (snapshot) => {
        const count = snapshot.numChildren();
        if(count > 0){
            text.innerHTML = "Student Available"
        } else {
            text.innerHTML = "Finding Student"
        }
    });
}