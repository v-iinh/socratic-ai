document.addEventListener("DOMContentLoaded", function() {
    studentWaiting();
});

function studentWaiting() {
    if (sessionStorage.getItem('position') == null) {
        sessions.once('value', (snapshot) => {
            const count = snapshot.numChildren() + 1;
            sessionStorage.setItem('position', count);

            const newSessionRef = sessions.push({
                position: count
            });
            newSessionRef.onDisconnect().remove()
        });
    }
}
