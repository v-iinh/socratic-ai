const register = document.getElementById('register')
const login = document.getElementById('login')

const username = document.getElementById('username')
const email = document.getElementById('email')
const password = document.getElementById('password')

register.addEventListener('click', function(event) {
    event.preventDefault();
    registerUser()
});

login.addEventListener('click', function(event) {
    event.preventDefault();
    loginUser()
});

function registerUser(){
    const usernameInput = username.value.toLowerCase();
    const emailInput = email.value.toLowerCase();
    const passwordInput = password.value.toLowerCase(); 

    users.orderByChild('username').equalTo(usernameInput).once('value', snapshot => {
        if(snapshot.exists()){
            console.log("Username Exists");
        } else {
            users.push({
                username: usernameInput,
                eamil: emailInput,
                password: passwordInput
            });
        }
    })
}

function loginUser(){
    const usernameInput = username.value.toLowerCase();
    const passwordInput = password.value.toLowerCase(); 
    
    users.orderByChild('username').equalTo(usernameInput).once('value', snapshot => {
        snapshot.forEach(childSnapshot => {
            const userData = childSnapshot.val();
            if(userData.password === passwordInput){
                console.log("Works")
            }
        })
    })
}