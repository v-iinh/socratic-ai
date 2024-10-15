document.addEventListener('DOMContentLoaded', function(){
    expandElements()
})

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