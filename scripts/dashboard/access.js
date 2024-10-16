const register = document.getElementById('register')
const login = document.getElementById('login')

const age = document.getElementById('age')
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
    const ageInput = age.value
    const usernameInput = username.value.toLowerCase();
    const emailInput = email.value.toLowerCase();
    const passwordInput = password.value.toLowerCase(); 

    users.orderByChild('username').equalTo(usernameInput).once('value', snapshot => {
        if(snapshot.exists()){
            authText(register, "Invalid", "Register")
        } else {
            if (authRegister(ageInput, usernameInput, emailInput, passwordInput)) {
                users.push({
                    username: usernameInput,
                    eamil: emailInput,
                    password: passwordInput,
                    age: ageInput,
                    admin: false,
                    staff: false
                });
                sessionStorage.setItem('username', usernameInput);
                window.location = "../../redirects/dashboard/staff.html";
            } else {
                authText(register, "Invalid", "Register");
            }
        }
    })
}

function loginUser(){
    const ageInput = age.value
    const usernameInput = username.value.toLowerCase();
    const emailInput = email.value.toLowerCase();
    const passwordInput = password.value.toLowerCase(); 
    
    users.orderByChild('username').equalTo(usernameInput).once('value', snapshot => {
        if(snapshot.exists() && authRegister(ageInput, usernameInput, emailInput, passwordInput)){
            snapshot.forEach(childSnapshot => {
                const userData = childSnapshot.val();
                if(userData.password === passwordInput){
                    sessionStorage.setItem('username', usernameInput)
                    if(userData.admin == false){
                        window.location = "../../redirects/dashboard/staff.html"
                    } else {
                        window.location = "../../redirects/dashboard/admin.html"
                    }
                } else {
                    authText(login, "Invalid", "Login")
                }
            })
        } else {
            authText(login, "Invalid", "Login")
        }
    })
}

function authText(btn, msg, reset){
    btn.innerHTML = msg;
    setTimeout(() => {
        btn.innerHTML = reset;
    }, 1000);
}

function authRegister(age, username, email, password){
    return ((age !== "" && age <= 17) && username !== "" && email !== "" && password !== "");
}