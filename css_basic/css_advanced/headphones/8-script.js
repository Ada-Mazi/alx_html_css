document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-item a');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navbar.classList.toggle('active');
        document.body.style.overflow = navbar.classList.contains('active') ? 'hidden' : '';
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navbar.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    document.addEventListener('click', function(event) {
        if (!navbar.contains(event.target) && !hamburger.contains(event.target)) {
            hamburger.classList.remove('active');
            navbar.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            hamburger.classList.remove('active');
            navbar.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});