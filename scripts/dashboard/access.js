const register = document.getElementById('register');
const login = document.getElementById('login');
const submit = document.getElementById('submit');

const age = document.getElementById('age');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');

let active = "login";

register.addEventListener('click', function(event) {
    event.preventDefault();

    register.style.backgroundColor = "#c6b6fc"
    register.style.color = "white"

    login.style.backgroundColor = "#f7f8fc";
    login.style.color = "#6c757d";

    active = "register";
});

login.addEventListener('click', function(event) {
    event.preventDefault();

    login.style.backgroundColor = "#c6b6fc"
    login.style.color = "white"

    register.style.backgroundColor = "#f7f8fc";
    register.style.color = "#6c757d";

    active = "login";
});

submit.addEventListener('click', function(){
    if(active === "login"){
        loginUser();
    } else {
        registerUser();
    }
})

function registerUser(){
    const ageInput = age.value;
    const usernameInput = username.value.toLowerCase();
    const emailInput = email.value.toLowerCase();
    const passwordInput = password.value.toLowerCase(); 

    users.orderByChild('username').equalTo(usernameInput).once('value', snapshot => {
        if(snapshot.exists()){
            authText();
        } else {
            if (authRegister(ageInput, usernameInput, emailInput, passwordInput)) {
                users.push({
                    username: usernameInput,
                    email: emailInput, 
                    password: passwordInput,
                    age: ageInput,
                    admin: false,
                    staff: false
                });
                sessionStorage.setItem('username', usernameInput);
                window.location = "../../redirects/dashboard/staff.html";
            } else {
                authText();
            }
        }
    });
}

function loginUser(){
    const ageInput = age.value;
    const usernameInput = username.value.toLowerCase();
    const emailInput = email.value.toLowerCase();
    const passwordInput = password.value.toLowerCase(); 
    
    users.orderByChild('username').equalTo(usernameInput).once('value', snapshot => {
        if(snapshot.exists()){
            snapshot.forEach(childSnapshot => {
                const userData = childSnapshot.val();
                if(userData.password === passwordInput && authRegister(ageInput, usernameInput, emailInput, passwordInput)){
                    sessionStorage.setItem('username', usernameInput);
                    if(userData.admin == false){
                        window.location = "../../redirects/dashboard/staff.html";
                    } else {
                        window.location = "../../redirects/dashboard/admin.html";
                    }
                } else {
                    authText();
                }
            });
        } else {
            authText();
        }
    });
}

function authText(){
    submit.innerHTML = "Invalid";
    setTimeout(() => {
        submit.innerHTML = "Submit";
    }, 1000);
}

function authRegister(ageInput, usernameInput, emailInput, passwordInput){
    return (ageInput !== "" && ageInput <= 17 && usernameInput !== "" && emailInput !== "" && passwordInput !== "");
}