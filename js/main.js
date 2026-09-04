document.addEventListener('DOMContentLoaded', () => {
    // Render Lucide Icons
    lucide.createIcons();

    // DOM Elements
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const menuIcon = document.getElementById('menuIcon');
    const backToTopBtn = document.getElementById('backToTop');
    const contactForm = document.getElementById('contactForm');

    // Mobile Menu Toggle
    let isMenuOpen = false;
    menuToggle.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        navMenu.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', isMenuOpen);
        
        // Dynamic Icon Switch
        menuToggle.innerHTML = isMenuOpen 
            ? '<i data-lucide="x"></i>' 
            : '<i data-lucide="menu"></i>';
        lucide.createIcons();
    });

    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                isMenuOpen = false;
                menuToggle.setAttribute('aria-expanded', false);
                menuToggle.innerHTML = '<i data-lucide="menu"></i>';
                lucide.createIcons();
            }
        });
    });

    // Scroll Effects (Navbar & Back to Top)
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (window.scrollY > 400) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    // Intersection Observer for Scroll Reveal Animations
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => revealObserver.observe(el));

    // Intersection Observer for Counter Animation
    const statsSection = document.getElementById('stats');
    const statNumbers = document.querySelectorAll('.stat-number');
    let animated = false;

    const countUp = (targetEl) => {
        const target = +targetEl.getAttribute('data-target');
        const duration = 1500;
        const stepTime = 20;
        const steps = duration / stepTime;
        const increment = target / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                targetEl.textContent = target;
                clearInterval(timer);
            } else {
                targetEl.textContent = Math.ceil(current);
            }
        }, stepTime);
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                statNumbers.forEach(num => countUp(num));
                animated = true; // Jalankan animasi hanya sekali
            }
        });
    }, { threshold: 0.3 });

    if (statsSection) statsObserver.observe(statsSection);

    // Active Navigation Highlight on Scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute('id');
            const targetLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

            if (targetLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    targetLink.classList.add('active');
                } else {
                    targetLink.classList.remove('active');
                }
            }
        });
    });

    // Form Validation Logic
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            const statusDiv = document.getElementById('formStatus');

            // Reset Errors
            document.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));

            // Name Validation
            if (!nameInput.value.trim()) {
                nameInput.parentElement.classList.add('error');
                isValid = false;
            }

            // Email Validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value.trim())) {
                emailInput.parentElement.classList.add('error');
                isValid = false;
            }

            // Message Validation
            if (!messageInput.value.trim()) {
                messageInput.parentElement.classList.add('error');
                isValid = false;
            }

            if (isValid) {
                // Simulasi pengiriman via WhatsApp / Direct Link
                const mailToUrl = `mailto:ndanathar@gmail.com?subject=Contact from ${encodeURIComponent(nameInput.value)}&body=${encodeURIComponent(messageInput.value)}`;
                
                statusDiv.style.color = '#10B981';
                statusDiv.textContent = 'Mengarahkan ke aplikasi email...';
                
                setTimeout(() => {
                    window.location.href = mailToUrl;
                    contactForm.reset();
                    statusDiv.textContent = '';
                }, 1000);
            }
        });
    }
});
