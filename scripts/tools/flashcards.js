let isEditing = false;

function enableEdit(icon, event) {
    event.stopPropagation();
    const card = icon.closest('.card');
    const front = card.querySelector('.front');
    const back = card.querySelector('.back');
    
    if (!isEditing) {
        front.contentEditable = "true";
        back.contentEditable = "true";
        front.focus(); 
        icon.classList.add('editing');
        icon.classList.remove('fa-pencil');
        icon.classList.add('fa-times');
        isEditing = true;
    } else {
        resetEditable(); 
    }
}

function resetEditable() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const front = card.querySelector('.front');
        const back = card.querySelector('.back');
        front.contentEditable = "false";
        back.contentEditable = "false";
    });
    const editingIcons = document.querySelectorAll('.fa-pencil.editing, .fa-times.editing');
    editingIcons.forEach(icon => {
        icon.classList.remove('editing');
        icon.classList.add('fa-pencil');
        icon.classList.remove('fa-times');
    });
    isEditing = false;
}

document.addEventListener('click', function (event) {
    if (!event.target.closest('.card')) {
        resetEditable();
    }
});

function toggle(card, event) {
    if (isEditing) {
        return;
    }

    if (event.target.closest('.icons')) {
        return; 
    }

    const front = card.querySelector('.front');
    const back = card.querySelector('.back');

    if (front.style.display === 'none') {
        front.style.display = 'flex';
        back.style.display = 'none';
    } else {
        front.style.display = 'none';
        back.style.display = 'flex';
    }
}
