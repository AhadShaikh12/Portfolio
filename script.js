// ============================================================
// AHAD SHAIKH — CYBERSECURITY PORTFOLIO
// script.js
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

    // ---- PRELOADER ----
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hide');
            setTimeout(() => {
                preloader.style.display = 'none';
                initAnimations();
            }, 700);
        }, 3100);
    });

    // ---- MATRIX CANVAS ----
    const canvas = document.getElementById('matrixCanvas');
    const ctx = canvas.getContext('2d');
    let cols, drops;

    function initCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        cols = Math.floor(canvas.width / 18);
        drops = Array(cols).fill(1);
    }

    function drawMatrix() {
        ctx.fillStyle = 'rgba(7, 11, 16, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#00e5a0';
        ctx.font = '13px JetBrains Mono';
        const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ{}[]<>/\\|=+-_#@!%&';
        drops.forEach((y, i) => {
            const ch = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(ch, i * 18, y * 18);
            if (y * 18 > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        });
    }

    initCanvas();
    setInterval(drawMatrix, 60);
    window.addEventListener('resize', initCanvas);

    // ---- NAVBAR ----
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const allNavLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    });

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        navLinks.classList.toggle('open');
    });

    allNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            navLinks.classList.remove('open');
        });
    });

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY + 100;
        sections.forEach(sec => {
            if (scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight) {
                allNavLinks.forEach(l => l.classList.remove('active'));
                const active = document.querySelector(`.nav-link[href="#${sec.id}"]`);
                if (active) active.classList.add('active');
            }
        });
    });

    // ---- TYPED TEXT ----
    const typedEl = document.getElementById('typedText');
    const roles = [
        'Cybersecurity Enthusiast',
        'Ethical Hacker (Learning)',
        'Network Security Student',
        'CTF Player',
        'Bug Hunter (In Training)',
    ];
    let ri = 0, ci = 0, deleting = false;

    function type() {
        const current = roles[ri];
        if (!deleting) {
            typedEl.textContent = current.slice(0, ++ci);
            if (ci === current.length) {
                deleting = true;
                setTimeout(type, 2200);
                return;
            }
        } else {
            typedEl.textContent = current.slice(0, --ci);
            if (ci === 0) {
                deleting = false;
                ri = (ri + 1) % roles.length;
            }
        }
        setTimeout(type, deleting ? 40 : 80);
    }
    setTimeout(type, 3500);

    // ---- SCROLL TO TOP ----
    const scrollTopBtn = document.getElementById('scrollTop');
    window.addEventListener('scroll', () => {
        scrollTopBtn.classList.toggle('show', window.scrollY > 500);
    });
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ---- INTERSECTION OBSERVER ----
    function initAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                entry.target.classList.add('visible');

                // Animate skill bars
                entry.target.querySelectorAll('.skill-fill').forEach(bar => {
                    const w = bar.getAttribute('data-w');
                    setTimeout(() => { bar.style.width = w + '%'; }, 100);
                });

                // Animate study bars
                entry.target.querySelectorAll('.study-bar div').forEach(bar => {
                    const w = bar.parentElement.querySelector('.study-pct')?.textContent || '0%';
                    setTimeout(() => { bar.style.width = w; }, 100);
                });

                // Counter animation
                entry.target.querySelectorAll('[data-count]').forEach(el => {
                    const target = parseInt(el.getAttribute('data-count'));
                    let current = 0;
                    const step = Math.ceil(target / 30);
                    const timer = setInterval(() => {
                        current = Math.min(current + step, target);
                        el.textContent = current + '+';
                        if (current >= target) { el.textContent = target + '+'; clearInterval(timer); }
                    }, 50);
                });

                observer.unobserve(entry.target);
            });
        }, { threshold: 0.12 });

        document.querySelectorAll('.section, .hero').forEach(el => {
            observer.observe(el);
        });
    }

    // Also run for hero immediately
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        setTimeout(() => {
            heroSection.classList.add('visible');
        }, 3200);
    }

    // ---- 3D TILT ON CARDS ----
    document.querySelectorAll('.project-card, .cert-card, .skill-block, .highlight-item').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-4px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ---- SMOOTH NAV LINKS ----
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const id = link.getAttribute('href').slice(1);
            const target = document.getElementById(id);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ---- GLITCH EFFECT ON HERO NAME ----
    const heroName = document.querySelector('.hero-name');
    if (heroName) {
        setInterval(() => {
            if (Math.random() > 0.85) {
                heroName.style.textShadow = `${Math.random() * 6 - 3}px 0 #ff4757, ${Math.random() * -6 + 3}px 0 #00bfff`;
                setTimeout(() => { heroName.style.textShadow = ''; }, 80);
            }
        }, 3000);
    }

});