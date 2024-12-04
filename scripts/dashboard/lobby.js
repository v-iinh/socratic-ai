document.addEventListener("DOMContentLoaded", function() {
    addUserWaiting();
});

window.addEventListener("beforeunload", function(e) {
    e.returnValue = true;
});

window.addEventListener("unload", function() {
    removeUserWaiting();
});

function performCleanup() {
    navigator.sendBeacon('/api/cleanup');
    console.log("Cleanup function executed.");
}

function addUserWaiting() {
    if (sessionStorage.getItem('waiting') !== 'true') {
        sessions.once('value', (snapshot) => {
            const count = snapshot.numChildren() + 1;
            sessionStorage.setItem('count', count)
            sessions.push({
                position: count
            });
        });
    }
    sessionStorage.setItem('waiting', 'true');
}

function removeUserWaiting() {
    const userPosition = sessionStorage.getItem('count'); 

    if (!userPosition) {
        console.error('No position found in sessionStorage.');
        return;
    }

    sessions.orderByChild('position').equalTo(parseInt(userPosition)).once('value', (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const sessionKey = childSnapshot.key; 
                sessions.child(sessionKey).remove().then(() => {
                    console.log(`Session ${sessionKey} removed successfully.`);
                }).catch((error) => {
                    console.error('Error removing session:', error);
                });
            });
        });
        
    sessionStorage.setItem('waiting', 'false');
}