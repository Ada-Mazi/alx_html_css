// DOM Elements
const hamburger = document.getElementById('hamburger');
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contactForm');
const backToTop = document.createElement('button');
const loading = document.createElement('div');

// Create loading overlay
loading.className = 'loading';
loading.innerHTML = `
    <div class="loading-spinner"></div>
    <div class="loading-text">Loading...</div>
`;
document.body.appendChild(loading);

// Create back to top button
backToTop.className = 'back-to-top';
backToTop.innerHTML = '↑';
backToTop.setAttribute('aria-label', 'Back to top');
document.body.appendChild(backToTop);

// Mobile Menu Toggle
function toggleMenu() {
    const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
    
    hamburger.classList.toggle('active');
    navbar.classList.toggle('active');
    document.body.classList.toggle('menu-open');
    hamburger.setAttribute('aria-expanded', !isExpanded);
    
    // Update hamburger label
    hamburger.setAttribute('aria-label', isExpanded ? 'Open menu' : 'Close menu');
}

// Close Mobile Menu
function closeMenu() {
    hamburger.classList.remove('active');
    navbar.classList.remove('active');
    document.body.classList.remove('menu-open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open menu');
}

// Smooth Scrolling
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Update Active Nav Link
function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Show/Hide Back to Top Button
function toggleBackToTop() {
    if (window.scrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
}

// Form Validation
function validateForm() {
    let isValid = true;
    const formGroups = contactForm.querySelectorAll('.form-group');
    
    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea');
        const errorMessage = group.querySelector('.error-message');
        
        // Remove previous validation classes
        group.classList.remove('error', 'success');
        
        if (input.hasAttribute('required') && !input.value.trim()) {
            group.classList.add('error');
            if (errorMessage) {
                errorMessage.textContent = 'This field is required';
            }
            isValid = false;
        } else if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                group.classList.add('error');
                if (errorMessage) {
                    errorMessage.textContent = 'Please enter a valid email';
                }
                isValid = false;
            } else {
                group.classList.add('success');
            }
        } else if (input.value) {
            group.classList.add('success');
        }
    });
    
    return isValid;
}

// Form Submission
async function handleFormSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    // Show loading
    loading.classList.add('active');
    
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'form-success';
        successMessage.textContent = 'Thank you! Your message has been sent successfully.';
        contactForm.parentNode.insertBefore(successMessage, contactForm.nextSibling);
        
        // Add show class after a brief delay
        setTimeout(() => successMessage.classList.add('show'), 10);
        
        // Reset form
        contactForm.reset();
        contactForm.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('error', 'success');
        });
        
        // Remove success message after 5 seconds
        setTimeout(() => {
            successMessage.classList.remove('show');
            setTimeout(() => successMessage.remove(), 500);
        }, 5000);
        
    } catch (error) {
        console.error('Form submission error:', error);
        alert('Sorry, there was an error submitting your form. Please try again.');
    } finally {
        // Hide loading
        loading.classList.remove('active');
    }
}

// Create error message elements
function createErrorMessageElements() {
    const formGroups = contactForm.querySelectorAll('.form-group');
    
    formGroups.forEach(group => {
        const errorMessage = document.createElement('span');
        errorMessage.className = 'error-message';
        group.appendChild(errorMessage);
    });
}

// Initialize
function init() {
    // Create error message elements for form validation
    if (contactForm) {
        createErrorMessageElements();
    }
    
    // Event Listeners
    hamburger.addEventListener('click', toggleMenu);
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('href');
            
            // Close mobile menu
            closeMenu();
            
            // Smooth scroll to section
            smoothScroll(target);
            
            // Update URL without page reload
            history.pushState(null, null, target);
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && !hamburger.contains(e.target) && navbar.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navbar.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Scroll events
    window.addEventListener('scroll', () => {
        updateActiveLink();
        toggleBackToTop();
    });
    
    // Back to top button
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Form submission
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
        
        // Real-time validation
        contactForm.addEventListener('input', (e) => {
            if (e.target.matches('input, textarea')) {
                validateForm();
            }
        });
    }
    
    // Page load animation
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        
        // Remove loading overlay
        setTimeout(() => {
            loading.classList.remove('active');
        }, 500);
    });
    
    // Scroll animations for sections
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe sections
    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });
    
    // Keyboard navigation for menu
    document.addEventListener('keydown', (e) => {
        if (!navbar.classList.contains('active')) return;
        
        const focused = document.activeElement;
        const menuItems = Array.from(navbar.querySelectorAll('a'));
        const currentIndex = menuItems.indexOf(focused);
        
        switch(e.key) {
            case 'ArrowDown':
                e.preventDefault();
                const nextIndex = currentIndex < menuItems.length - 1 ? currentIndex + 1 : 0;
                menuItems[nextIndex].focus();
                break;
            case 'ArrowUp':
                e.preventDefault();
                const prevIndex = currentIndex > 0 ? currentIndex - 1 : menuItems.length - 1;
                menuItems[prevIndex].focus();
                break;
            case 'Home':
                e.preventDefault();
                menuItems[0].focus();
                break;
            case 'End':
                e.preventDefault();
                menuItems[menuItems.length - 1].focus();
                break;
        }
    });
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}