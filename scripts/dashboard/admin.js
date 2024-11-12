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
            const userKey = childSnapshot.key;
            if (!userData.staff) {
                users.push({
                    key: userKey,
                    admin: userData.admin,
                    staff: userData.staff,
                    name: userData.username,
                    age: userData.age,
                    email: userData.email,
                    comment: userData.comment
                });
            }
        });
        
        users.forEach(user => {
            if(!user.staff || !user.admin){
                const request = `
                <div class="request" data-key="${user.key}">
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
            }
        });

        deny_request();
    });
}

function deny_request() {
    const requests = document.querySelectorAll(".request");
    
    requests.forEach(element => {
        const deny_btn = element.querySelector(".fa-thumbs-down");
        
        deny_btn.addEventListener('click', function() {
            const userKey = element.getAttribute('data-key');
            if (userKey) {
                database.ref('users/' + userKey).remove() 
                .then(() => {
                    element.remove(); 
                    console.log("User request denied and removed from database.");
                })
                .catch(error => {
                    console.error("Error removing user: ", error);
                });
            }
        });
    });
}

function approve_request() {
    const requests = document.querySelectorAll(".request");
    
    requests.forEach(element => {
        const approve_btn = element.querySelector(".fa-thumbs-up");
        
        deny_btn.addEventListener('click', function() {
        });
    });
}