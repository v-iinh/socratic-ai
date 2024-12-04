const text = document.getElementsByClassName('cursive_text')[0]

document.addEventListener('DOMContentLoaded', function(){
    staffWaiting();
})

function staffWaiting(){
    sessions.once('value', (snapshot) => {
        const count = snapshot.numChildren();
        if(count > 0){
            text.innerHTML = "Student Available"
        }
    });
}