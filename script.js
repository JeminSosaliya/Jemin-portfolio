document.addEventListener('DOMContentLoaded', () => {
    // Custom Cursor Optimization with Throttling
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (!cursorDot || !cursorOutline) return; // Safety check

    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;
    let isMoving = false;

    // Throttle mousemove for better performance
    let lastMoveTime = 0;
    const moveThrottle = 10; // Faster response

    window.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastMoveTime < moveThrottle) return;
        lastMoveTime = now;

        mouseX = e.clientX;
        mouseY = e.clientY;

        // Dot follows instantly with transform (GPU accelerated)
        cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;

        // Make cursors visible once mouse moves
        if (!isMoving) {
            cursorOutline.style.opacity = '1';
            cursorDot.style.opacity = '1';
            isMoving = true;
        }
    }, { passive: true });

    // Smooth animation loop for the outline
    const animateCursor = () => {
        const speed = 0.25; // Faster speed for more responsive cursor

        outlineX += (mouseX - outlineX) * speed;
        outlineY += (mouseY - outlineY) * speed;

        cursorOutline.style.transform = `translate(${outlineX}px, ${outlineY}px)`;

        requestAnimationFrame(animateCursor);
    };
    animateCursor();

    // Cursor Hover Effects - Optimized selectors
    const hoverElements = document.querySelectorAll('a, button, .project-card, .service-card, .contact-item, .testimonial-card');

    const handleMouseEnter = () => {
        cursorOutline.style.transform = `translate(${outlineX}px, ${outlineY}px) scale(1.5)`;
        cursorOutline.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        cursorOutline.style.borderColor = 'transparent';
    };

    const handleMouseLeave = () => {
        cursorOutline.style.transform = `translate(${outlineX}px, ${outlineY}px) scale(1)`;
        cursorOutline.style.backgroundColor = 'transparent';
        cursorOutline.style.borderColor = 'rgba(255, 255, 255, 0.5)';
    };

    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', handleMouseEnter, { passive: true });
        el.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    });

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links li a');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close menu when clicking a link
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }

    // Navbar Scroll Effect - Throttled
    const navbar = document.querySelector('.navbar');
    let ticking = false;

    const handleScroll = () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                ticking = false;
            });
            ticking = true;
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Scroll Animations (Intersection Observer) - Optimized
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in-up');
    animatedElements.forEach(el => observer.observe(el));

    // Smooth Scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();

                // Close mobile menu if open
                if (navLinks) {
                    navLinks.classList.remove('active');
                    hamburger.classList.remove('active');
                }

                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Handle contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        // Check if form was just submitted (coming back from FormSubmit)
        if (sessionStorage.getItem('formSubmitted') === 'true') {
            sessionStorage.removeItem('formSubmitted');
            const statusDiv = document.getElementById('formStatus');
            if (statusDiv) {
                statusDiv.innerHTML = '✅ <strong>Thank you!</strong> Your message has been sent successfully. I\'ll get back to you within the next few hours!';
                statusDiv.style.display = 'block';
                statusDiv.style.backgroundColor = 'rgba(59, 130, 246, 0.2)';
                statusDiv.style.border = '1px solid var(--accent-color)';
                statusDiv.style.color = 'var(--text-primary)';
                statusDiv.style.animation = 'fadeIn 0.5s ease-in';

                // Scroll to contact section
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                    setTimeout(() => {
                        contactSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 300);
                }

                // Hide message after 10 seconds
                setTimeout(() => {
                    statusDiv.style.display = 'none';
                }, 10000);
            }
        }

        // Set flag when form is submitted
        contactForm.addEventListener('submit', function () {
            sessionStorage.setItem('formSubmitted', 'true');
        });
    }
});

