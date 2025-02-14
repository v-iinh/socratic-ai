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
    apiKey: `${settings.firebase.apiKey}`,
    authDomain: `${settings.firebase.authDomain}`,
    databaseURL: `${settings.firebase.databaseURL}`,
    projectId: `${settings.firebase.projectId}`,
    storageBucket: `${settings.firebase.storageBucket}`,
    messagingSenderId: `${settings.firebase.messagingSenderId}`,
    appId: `${settings.firebase.appId}`,
    measurementId: `${settings.firebase.measurementId}`    
};
firebase.initializeApp(firebaseConfig);

const database = firebase.database();
const users = database.ref('users');
const sessions = database.ref('sessions');