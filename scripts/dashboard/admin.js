const pending = document.querySelector(".pending");

document.addEventListener('DOMContentLoaded', function() {
    checkSession();
    generate_requests();
});

function checkSession() {
    const currSession = sessionStorage.getItem('username');
    if (currSession === null) {
        window.location = "../../index.html";
    }
}

function generate_requests() {
    users.on('value', (snapshot) => {
        const users = [];

        snapshot.forEach((childSnapshot) => {
            const userData = childSnapshot.val();
            if (!userData.staff) {
                users.push({
                    name: userData.username || 'Unknown',
                    age: userData.age || 'Unknown',
                    email: userData.email || 'Not provided',
                    comment: userData.comment || 'No comment available'
                });
            }
        });
        
        users.forEach(user => {
            const request = `
            <div class="request">
                <div class="row">
                    <div class="label">Name:</div>
                    <div class="text">${user.name}</div>
                </div><hr>
                <div class="row">
                    <div class="label">Age:</div>
                    <div class="text">${user.age}</div>
                </div><hr>
                <div class="row">
                    <div class="label">Email:</div>
                    <div class="text">${user.email}</div>
                </div><hr>
                <div class="row">
                    <div class="label">Comment:</div>
                    <div class="text">${user.comment}</div>
                </div><hr>
                <div class="row judge">
                    <div class="label approve">
                        <i class="fa-regular fa-thumbs-up"></i>
                    </div>
                    <div class="label reject">
                        <i class="fa-regular fa-thumbs-down"></i>
                    </div>
                </div>
            </div>`;
            
            pending.insertAdjacentHTML('beforeend', request);
        });

        deny_request();
    });
}

function deny_request() {
    const requests = document.querySelectorAll(".request");
    
    requests.forEach(element => {
        const deny_btn = element.querySelector()
    });
}
