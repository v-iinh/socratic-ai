const menuItems = document.querySelectorAll(".adminLabel");
const fillers = document.querySelectorAll(".adminFiller");

const pending = document.querySelector(".pending");
const board = document.querySelector(".board");

const all_set = document.getElementById('all_set')
const none_yet = document.getElementById('none_yet')

document.addEventListener('DOMContentLoaded', function() {
    checkSession();
    checkFiller();
    generateApplicants();
    generateStaffMembers();

    menuItems.forEach((item, index) => {
        item.addEventListener("click", function () {
            menuItems.forEach(menu => menu.classList.remove("active"));
            item.classList.add("active");

            fillers.forEach(filler => filler.style.display = "none");
            fillers[index].style.display = "flex";
        });
    });
});


function generateApplicants() {
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
                        checkFiller();
                    })
                    .catch(error => {
                        console.error(error);
                    });
                });

                deny_btn.addEventListener('click', function() {
                    database.ref('users/' + userKey).remove()
                    .then(() => {
                        request.remove();
                        checkFiller();
                    })
                    .catch(error => {
                        console.error(error);
                    });
                });
            }
        });

        checkFiller();
    });
}

function generateStaffMembers() {
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
                        checkFiller();
                    })
                    .catch(error => {
                        console.error(error);
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