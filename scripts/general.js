AOS.init({
    offset: 0,
    duration: 1000
});

function checkSession() {
    const currSession = sessionStorage.getItem('username');
    if (currSession === null) {
        window.location = "../../index.html";
    }
}

const firebaseConfig = {
    apiKey: "AIzaSyCttweynNbJH96yEZUS7RTmRMeOfj_vZuk",
    authDomain: "socratic-6bc6d.firebaseapp.com",
    databaseURL: "https://socratic-6bc6d-default-rtdb.firebaseio.com",
    projectId: "socratic-6bc6d",
    storageBucket: "socratic-6bc6d.appspot.com",
    messagingSenderId: "761008333826",
    appId: "1:761008333826:web:8541310b0222e27ce4f31b",
    measurementId: "G-P7JHCCD216"
};
firebase.initializeApp(firebaseConfig);

const database = firebase.database();
const users = database.ref('users');
const sessions = database.ref('sessions');