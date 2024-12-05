document.addEventListener("DOMContentLoaded", function() {
    studentWaiting();
});

function studentWaiting() {
    if (sessionStorage.getItem('position') == null) {
        sessions.once('value', (snapshot) => {

            if (snapshot.numChildren() === 0) {
                var newPosition = 1;
            } else {
                let maxPosition = 0;
                snapshot.forEach((childSnapshot) => {
                    const position = childSnapshot.val().position;
                    if (position > maxPosition) {
                        maxPosition = position;
                    }
                });
                newPosition = maxPosition + 1;
            }

            sessionStorage.setItem('position', newPosition);

            const positionRef = sessions.push({
                position: newPosition,
                active: false
            });

            positionRef.onDisconnect().remove();
        });
    }
}
