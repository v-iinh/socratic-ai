const menuItems = document.querySelectorAll(".adminLabel");
const fillers = document.querySelectorAll(".adminFiller");

const pending = document.querySelector(".pending");
const board = document.querySelector(".board");
const archival = document.querySelector(".archival")

document.addEventListener('DOMContentLoaded', function() {
    checkSession();
    checkFiller();
    generateApplicants();
    generateStaffMembers();
    generateArchives();

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

function generateArchives() {
    archive.on('value', (snapshot) => {
        Array.from(archival.querySelectorAll('.log')).forEach(child => child.remove());

        snapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();

            if (!data.active) {
                const log = document.createElement('div');
                log.classList.add('log');
                log.innerHTML = `
                    <div class="row">
                        <div class="label">Name:</div>
                        <div class="text">${data.tutor}</div>
                    </div><hr>
                    <div class="row">
                        <div class="label">Duration:</div>
                        <div class="text">${data.messages.length} Messages</div>
                    </div><hr>
                    <div class="row judge">
                        <div class="label view">
                            <i class="fa-regular fa-eye"></i>
                        </div>
                    </div>`;

                archival.appendChild(log);
                checkFiller();

                const view = log.querySelector(".fa-eye");

                view.addEventListener('click', function () {
                    console.log("View button clicked for session:");
                });
            }
        });

        checkFiller();
    });
}

function checkFiller() {
    const loader1 = document.getElementsByClassName('filler_content')[0]
    const loader2 = document.getElementsByClassName('filler_content')[1]
    const loader3 = document.getElementsByClassName('filler_content')[2]

    const requests = document.querySelectorAll('.request');
    const staffMembers = document.querySelectorAll('.staff_member');
    const logs = document.querySelectorAll('.log');

    if (requests.length > 0) {
        loader1.style.display = 'none'; 
    } else {
        loader1.style.display = 'flex'; 
    }

    if (staffMembers.length > 0) {
        loader2.style.display = 'none';
    } else {
        loader2.style.display = 'flex';
    }

    if (logs.length > 0) {
        loader3.style.display = 'none';
    } else {
        loader3.style.display = 'flex';
    }
}