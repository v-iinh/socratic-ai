document.addEventListener('DOMContentLoaded', function(){
    checkSession();
})

function checkSession(){
    const currSession = sessionStorage.getItem('username')
    if(currSession === null){
        window.location = "../../index.html"
    }
}