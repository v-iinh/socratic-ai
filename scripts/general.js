(function() {
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
})();

function scrollToSection(selector, offset = 0) {
  const element = document.querySelector(selector);
  const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
  const offsetPosition = elementPosition - offset;
  window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
  });
}