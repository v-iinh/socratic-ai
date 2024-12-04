document.addEventListener("DOMContentLoaded", function() {
    studentWaiting();
});

function studentWaiting() {
    if (sessionStorage.getItem('waiting') !== 'true') {
        sessions.once('value', (snapshot) => {
            const count = snapshot.numChildren() + 1;
            sessionStorage.setItem('count', count);

            const newSessionRef = sessions.push({
                position: count
            });
            newSessionRef.onDisconnect().remove()
        });
    }
    sessionStorage.setItem('waiting', 'true');
}
