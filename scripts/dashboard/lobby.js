document.addEventListener("DOMContentLoaded", function(){
    addUserWaiting();
})

window.addEventListener("beforeunload", function(){
    removeUserWaiting();
});
    

function addUserWaiting() {
    if(sessionStorage.getItem('waiting') !== 'true'){
        sessions.once('value', (snapshot) => {
            const count = snapshot.numChildren() + 1;
            sessions.push({
                position: count
            })
        });
    }
    sessionStorage.setItem('waiting', 'true')
}

function removeUserWaiting(){
}