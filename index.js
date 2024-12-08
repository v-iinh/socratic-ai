document.addEventListener('DOMContentLoaded', function(){
    clearFirebase();
    expandElements();
})

function clearFirebase() {
    const databaseRef = firebase.database().ref();
    databaseRef.once('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const childKey = childSnapshot.key;
            childSnapshot.forEach((subChildSnapshot) => {
                if (subChildSnapshot.key === 'active' && subChildSnapshot.val() === false) {
                    databaseRef.child(childKey).remove()
                }
            });
        });
    });
    sessionStorage.clear()
}

function scrollToBottom() {
    const aiContainer = document.querySelector('.chat_history');
    aiContainer.scrollTop = aiContainer.scrollHeight;
}

function scrollToSection(selector, offset = 0) {
    const element = document.querySelector(selector);
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - offset;
    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

function expandElements(){
    const headings = document.querySelectorAll('h2');
    Array.prototype.forEach.call(headings, h => {
    let btn = h.querySelector('button');
    if (!btn) return; 
    let target = h.nextElementSibling;
    btn.onclick = () => {
        let expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', !expanded);
        target.hidden = expanded;
    };
    });
}