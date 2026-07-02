// ===== المتغيرات العامة =====
let currentTheme = localStorage.getItem('theme') || 'light';
let isMenuOpen = false;

// ===== عناصر DOM =====
const loader = document.getElementById('loader');
const scrollTop = document.getElementById('scrollTop');
const header = document.getElementById('header');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const themeToggle = document.getElementById('themeToggle');
const filterBtns = document.querySelectorAll('.filter-btn');
const projectsGrid = document.getElementById('projectsGrid');
const tabBtns = document.querySelectorAll('.tab-btn');
const workTimeline = document.getElementById('workTimeline');
const educationTimeline = document.getElementById('educationTimeline');
const contactForm = document.getElementById('contactForm');
const navLinks = document.querySelectorAll('.nav-link');
const statNumbers = document.querySelectorAll('.stat-number');

// ===== Loader =====
window.addEventListener('load', () => {
    setTimeout(() => {
        loader.classList.add('hidden');
    }, 1500);
});

// ===== Scroll Events =====
window.addEventListener('scroll', () => {
    // Header scroll effect
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Scroll top button
    if (window.scrollY > 300) {
        scrollTop.classList.add('show');
    } else {
        scrollTop.classList.remove('show');
    }
    
    // Active nav link based on scroll position
    const sections = document.querySelectorAll('section');
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ===== Scroll Top Button =====
scrollTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===== Mobile Menu Toggle =====
menuToggle.addEventListener('click', () => {
    isMenuOpen = !isMenuOpen;
    navMenu.classList.toggle('active');
    menuToggle.innerHTML = isMenuOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
});

// Close menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        isMenuOpen = false;
    });
});

// ===== Theme Toggle =====
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    if (theme === 'dark') {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
}

themeToggle.addEventListener('click', () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(currentTheme);
});

// Initialize theme
setTheme(currentTheme);

// ===== Projects Filter =====
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Filter projects
        const filter = btn.dataset.filter;
        const projects = document.querySelectorAll('.project-card');
        
        projects.forEach(project => {
            if (filter === 'all' || project.dataset.category === filter) {
                project.style.display = 'block';
                setTimeout(() => {
                    project.style.opacity = '1';
                    project.style.transform = 'scale(1)';
                }, 100);
            } else {
                project.style.opacity = '0';
                project.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    project.style.display = 'none';
                }, 300);
            }
        });
    });
});

// ===== Experience Tabs =====
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        if (btn.dataset.tab === 'work') {
            workTimeline.classList.add('active');
            educationTimeline.classList.remove('active');
        } else {
            educationTimeline.classList.add('active');
            workTimeline.classList.remove('active');
        }
    });
});

// ===== Animate Stats Numbers =====
function animateNumbers() {
    statNumbers.forEach(number => {
        const target = parseInt(number.dataset.target);
        let current = 0;
        const increment = target / 50;
        const updateNumber = () => {
            if (current < target) {
                current += increment;
                number.textContent = Math.ceil(current);
                requestAnimationFrame(updateNumber);
            } else {
                number.textContent = target;
            }
        };
        updateNumber();
    });
}

// Trigger animation when stats section is visible
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateNumbers();
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelector('.hero-stats') && observer.observe(document.querySelector('.hero-stats'));

// ===== Contact Form =====
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };
    
    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
        showNotification('الرجاء ملء جميع الحقول المطلوبة', 'error');
        return;
    }
    
    if (!isValidEmail(formData.email)) {
        showNotification('البريد الإلكتروني غير صحيح', 'error');
        return;
    }
    
    // Simulate form submission
    showNotification('جاري إرسال الرسالة...', 'info');
    
    setTimeout(() => {
        showNotification('تم إرسال الرسالة بنجاح! سأتواصل معك قريباً', 'success');
        contactForm.reset();
    }, 2000);
});

// Email validation
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles for notification
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.padding = '1rem 2rem';
    notification.style.background = type === 'success' ? '#00b894' : type === 'error' ? '#d63031' : '#0984e3';
    notification.style.color = 'white';
    notification.style.borderRadius = '50px';
    notification.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
    notification.style.zIndex = '10000';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center';
    notification.style.gap = '1rem';
    notification.style.animation = 'slideDown 0.3s ease';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translate(-50%, -20px);
        }
        to {
            opacity: 1;
            transform: translate(-50%, 0);
        }
    }
    
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translate(-50%, 0);
        }
        to {
            opacity: 0;
            transform: translate(-50%, -20px);
        }
    }
`;
document.head.appendChild(style);

// ===== Smooth Scroll for Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== Intersection Observer for Animations =====
const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.service-card, .project-card, .skill-card, .timeline-item, .testimonial-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease';
    animateOnScroll.observe(el);
});

// ===== Typing Effect for Hero Subtitle =====
const heroSubtitle = document.querySelector('.hero-subtitle');
const texts = ['مهندس برمجيات', 'مطور ويب متكامل', 'متخصص في Laravel', 'خبير JavaScript'];
let textIndex = 0;
let charIndex = 0;

function typeEffect() {
    if (charIndex < texts[textIndex].length) {
        heroSubtitle.innerHTML = texts[textIndex].substring(0, charIndex + 1);
        charIndex++;
        setTimeout(typeEffect, 100);
    } else {
        setTimeout(eraseEffect, 2000);
    }
}

function eraseEffect() {
    if (charIndex > 0) {
        heroSubtitle.innerHTML = texts[textIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(eraseEffect, 50);
    } else {
        textIndex = (textIndex + 1) % texts.length;
        setTimeout(typeEffect, 500);
    }
}

// Start typing effect
if (heroSubtitle) {
    setTimeout(typeEffect, 2000);
}

// ===== Particle Effect for Hero Section =====
function createParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 5}px;
            height: ${Math.random() * 5}px;
            background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: floatParticle ${5 + Math.random() * 10}s linear infinite;
            opacity: ${Math.random() * 0.5};
        `;
        hero.appendChild(particle);
    }
}

const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes floatParticle {
        0% {
            transform: translateY(0) translateX(0);
        }
        25% {
            transform: translateY(-20px) translateX(10px);
        }
        50% {
            transform: translateY(-40px) translateX(-10px);
        }
        75% {
            transform: translateY(-20px) translateX(20px);
        }
        100% {
            transform: translateY(0) translateX(0);
        }
    }
`;
document.head.appendChild(particleStyle);
createParticles();

// ===== Prevent Right Click (Optional) =====
document.addEventListener('contextmenu', (e) => {
    // e.preventDefault(); // Uncomment to disable right click
});

// ===== Console Welcome Message =====
console.log('%c مرحباً بك في موقعي الشخصي! ', 'background: linear-gradient(45deg, #6c5ce7, #a363d9); color: white; font-size: 16px; padding: 10px; border-radius: 5px;');
console.log('%c أحمد محمد - مهندس برمجيات ', 'color: #6c5ce7; font-size: 14px; font-weight: bold;');

// ===== Service Worker for PWA (Optional) =====
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
    }).catch(error => {
        console.log('Service Worker registration failed:', error);
    });
}