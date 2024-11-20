const pending = document.querySelector(".pending");
const board = document.querySelector(".board");

const all_set = document.getElementById('all_set')
const none_yet = document.getElementById('none_yet')

document.addEventListener('DOMContentLoaded', function() {
    checkSession();
    checkFiller();
    generate_requests();
    generate_board();
});

function checkSession() {
    const currSession = sessionStorage.getItem('username');
    if (currSession === null) {
        window.location = "../../index.html";
    }
}

function generate_requests() {
    users.on('value', (snapshot) => {
        Array.from(pending.querySelectorAll('.request')).forEach(child => child.remove());

        snapshot.forEach((childSnapshot) => {
            const userData = childSnapshot.val();
            const userKey = childSnapshot.key;

            if (!userData.staff && !userData.admin) {
                const request = document.createElement('div');
                request.classList.add('request');
                request.setAttribute('data-key', userKey);
                request.innerHTML = `
                    <div class="row">
                        <div class="label">Name:</div>
                        <div class="text">${userData.username}</div>
                    </div><hr>
                    <div class="row">
                        <div class="label">Age:</div>
                        <div class="text">${userData.age}</div>
                    </div><hr>
                    <div class="row">
                        <div class="label">Email:</div>
                        <div class="text">${userData.email}</div>
                    </div><hr>
                    <div class="row">
                        <div class="label">Comment:</div>
                        <div class="text">${userData.comment || "No Comment"}</div>
                    </div><hr>
                    <div class="row judge">
                        <div class="label approve">
                            <i class="fa-regular fa-thumbs-up"></i>
                        </div>
                        <div class="label reject">
                            <i class="fa-regular fa-thumbs-down"></i>
                        </div>
                    </div>`;

                pending.appendChild(request);
                checkFiller();

                const approve_btn = request.querySelector(".fa-thumbs-up");
                const deny_btn = request.querySelector(".fa-thumbs-down");

                approve_btn.addEventListener('click', function() {
                    database.ref('users/' + userKey).update({
                        staff: true
                    })
                    .then(() => {
                        request.remove();
                        console.log("User request approved and removed from the interface.");
                        checkFiller();
                    })
                    .catch(error => {
                        console.error("Error approving user request: ", error);
                    });
                });

                deny_btn.addEventListener('click', function() {
                    database.ref('users/' + userKey).remove()
                    .then(() => {
                        request.remove();
                        console.log("User request denied and removed from database.");
                        checkFiller();
                    })
                    .catch(error => {
                        console.error("Error removing user: ", error);
                    });
                });
            }
        });

        checkFiller();
    });
}

function generate_board() {
    users.on('value', (snapshot) => {
        Array.from(board.querySelectorAll('.staff_member')).forEach(child => child.remove());

        snapshot.forEach((childSnapshot) => {
            const userData = childSnapshot.val();
            const userKey = childSnapshot.key;

            if (userData.staff && !userData.admin) {
                const member = document.createElement('div');
                member.classList.add('staff_member');
                member.setAttribute('data-key', userKey);
                member.innerHTML = `
                    <div class="row">
                        <div class="label">Name:</div>
                        <div class="text">${userData.username}</div>
                    </div><hr>
                    <div class="row">
                        <div class="label">Age:</div>
                        <div class="text">${userData.age}</div>
                    </div><hr>
                    <div class="row">
                        <div class="label">Email:</div>
                        <div class="text">${userData.email}</div>
                    </div><hr>
                    <div class="row judge">
                        <div class="label kick">
                            <i class="fa-solid fa-ban"></i>
                        </div>
                    </div>`;

                board.appendChild(member);
                checkFiller();

                const remove_btn = member.querySelector(".fa-ban");

                remove_btn.addEventListener('click', function() {
                    database.ref('users/' + userKey).remove()
                    .then(() => {
                        member.remove();
                        console.log("User kicked from staff.");
                        checkFiller();
                    })
                    .catch(error => {
                        console.error("Error removing user: ", error);
                    });
                });
            }
        });

        checkFiller();
    });
}

function checkFiller() {
    const requests = document.querySelectorAll('.request');
    const staffMembers = document.querySelectorAll('.staff_member');

    if (requests.length > 0) {
        all_set.style.display = 'none'; 
    } else {
        all_set.style.display = 'flex'; 
    }

    if (staffMembers.length > 0) {
        none_yet.style.display = 'none';
    } else {
        none_yet.style.display = 'flex';
    }
}