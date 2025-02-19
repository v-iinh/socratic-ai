const signUpSubmit = document.getElementById('signUpSubmit');
const signInSubmit = document.getElementById('signInSubmit');

const age = document.getElementById('signUpAge');
const username = document.getElementById('signUpUsername');
const email = document.getElementById('signUpEmail');
const password = document.getElementById('signUpPassword');
const comment = document.getElementById('additionalComments');

const signInUsername = document.getElementById('signInUsername');
const signInPassword = document.getElementById('signInPassword');

let active = "login";

function openSignIn() {
    container.classList.remove("right-panel-active");
    active = "login";
}

function openSignUp() {
    container.classList.add("right-panel-active");
    active = "register";
}

signUpSubmit.addEventListener('click', function () {
    registerUser();
});

signInSubmit.addEventListener('click', function () {
    loginUser();
});

function registerUser() {
    const ageInput = age.value;
    const usernameInput = username.value.toLowerCase();
    const emailInput = email.value.toLowerCase();
    const passwordInput = password.value.toLowerCase();
    const commentInput = comment.value;

    users.orderByChild('username').equalTo(usernameInput).once('value', snapshot => {
        if (snapshot.exists()) {
            authText(signUpSubmit, "Register");
        } else {
            if (authRegister(ageInput, usernameInput, emailInput, passwordInput)) {
                users.push({
                    username: usernameInput,
                    email: emailInput,
                    password: passwordInput,
                    age: ageInput,
                    comment: commentInput,
                    admin: false,
                    staff: false
                });
                sessionStorage.setItem('username', usernameInput);
                window.location = "../../redirects/dashboard/pending.html";
            } else {
                authText(signUpSubmit, "Register");
            }
        }
    });
}

function loginUser() {
    const usernameInput = signInUsername.value.toLowerCase();
    const passwordInput = signInPassword.value.toLowerCase();

    users.orderByChild('username').equalTo(usernameInput).once('value', snapshot => {
        if (snapshot.exists()) {
            snapshot.forEach(childSnapshot => {
                const userData = childSnapshot.val();
                if (userData.password === passwordInput) {
                    sessionStorage.setItem('username', usernameInput);
                    if (userData.admin === false) {
                        if (userData.staff === false) {
                            window.location = "../../redirects/dashboard/pending.html";
                        } else {
                            window.location = "../../redirects/dashboard/staff.html";
                        }
                    } else {
                        window.location = "../../redirects/dashboard/admin.html";
                    }
                } else {
                    authText(signInSubmit, "Enter");
                }
            });
        } else {
            authText(signInSubmit, "Enter");
        }
    });
}

function authText(buttonElement, defaultText) {
    buttonElement.innerHTML = "Invalid";
    setTimeout(() => {
        buttonElement.innerHTML = defaultText;
    }, 1000);
}

function authRegister(ageInput, usernameInput, emailInput, passwordInput) {
    return (
        ageInput !== "" &&
        ageInput <= 17 &&
        usernameInput !== "" &&
        emailInput !== "" &&
        passwordInput !== ""
    );
}