function toggle(card, event) {
    // Check if the clicked target is an icon (ignore the click if it's an icon)
    if (event.target.closest('.icons')) {
        return; // Ignore clicks on the icons
    }

    const front = card.querySelector('.front');
    const back = card.querySelector('.back');

    if (front.style.display === 'none') {
        front.style.display = 'block';
        back.style.display = 'none';
    } else {
        front.style.display = 'none';
        back.style.display = 'block';
    }
}
