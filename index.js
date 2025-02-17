document.addEventListener('DOMContentLoaded', function(){
    clearFirebase();
    expandElements();
})

function clearFirebase() {
    const ref = database.ref(); 

    ref.once('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const childKey = childSnapshot.key;

            childSnapshot.forEach((subChildSnapshot) => {
                if (subChildSnapshot.key === 'active' && subChildSnapshot.val() === false) {

                    ref.child(childKey).remove();
                }
            });
        });
    });
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

function expandElements() {
    const headings = document.querySelectorAll('h2');

    headings.forEach(h => {
        const btn = h.querySelector('button');
        if (!btn) return;

        const target = h.nextElementSibling;
        btn.onclick = () => {
            const isExpanded = btn.getAttribute('aria-expanded') === 'true';

            btn.setAttribute('aria-expanded', !isExpanded);

            if (isExpanded) {
                target.style.maxHeight = null;
                target.classList.remove('open');
            } else {
                target.style.maxHeight = `${target.scrollHeight}px`;
                target.classList.add('open');
                target.addEventListener(
                    'transitionend',
                    () => {
                        if (target.classList.contains('open')) {
                            target.style.maxHeight = '1000px';
                        }
                    },
                    { once: true }
                );
            }
        };
    });
}
