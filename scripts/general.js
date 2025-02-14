AOS.init({
    offset: 0,
    duration: 1000
});

function checkSession() {
    const currSession = sessionStorage.getItem('username');
    if (currSession === null) {
        window.location = "https://socratic.help/";
    }
}

const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
};
firebase.initializeApp(firebaseConfig);

const database = firebase.database();
const users = database.ref('users');
const sessions = database.ref('sessions');