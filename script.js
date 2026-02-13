// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Preloader with name animation
    const preloader = document.getElementById('preloader');
    
    // Hide preloader after animation completes
    setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 800);
    }, 3500); // Wait for name animation and progress bar to complete

    // Navbar shrink effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('shrink');
        } else {
            navbar.classList.remove('shrink');
        }
    });

    // Mobile menu
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // Active link highlighting
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
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

    // Create Radar Chart (without percentages)
    function createRadarChart() {
        const svg = document.getElementById('radarChart');
        if (!svg) return;
        
        svg.innerHTML = ''; // Clear existing
        
        const centerX = 200;
        const centerY = 200;
        const radius = 150;
        
        // Categories - values are for visual fill only (not displayed)
        const categories = [
            { name: 'SecOps', value: 85 },
            { name: 'Incident Response', value: 70 },
            { name: 'Malware Analysis', value: 60 },
            { name: 'Pen Testing', value: 75 },
            { name: 'Exploitation', value: 65 },
            { name: 'Red Teaming', value: 55 }
        ];
        
        const numCategories = categories.length;
        const angleStep = (Math.PI * 2) / numCategories;
        
        // Draw background circles
        for (let level = 1; level <= 5; level++) {
            const levelRadius = (radius / 5) * level;
            const points = [];
            
            for (let i = 0; i < numCategories; i++) {
                const angle = i * angleStep - Math.PI / 2; // Start from top
                const x = centerX + Math.cos(angle) * levelRadius;
                const y = centerY + Math.sin(angle) * levelRadius;
                points.push(`${x},${y}`);
            }
            
            // Close the polygon
            points.push(points[0]);
            
            const gridLine = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
            gridLine.setAttribute("points", points.join(' '));
            gridLine.setAttribute("class", "radar-grid-line");
            gridLine.setAttribute("fill", "none");
            svg.appendChild(gridLine);
        }
        
        // Draw axis lines
        for (let i = 0; i < numCategories; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            const axisLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
            axisLine.setAttribute("x1", centerX);
            axisLine.setAttribute("y1", centerY);
            axisLine.setAttribute("x2", x);
            axisLine.setAttribute("y2", y);
            axisLine.setAttribute("class", "radar-axis-line");
            svg.appendChild(axisLine);
            
            // Add category labels (shortened)
            const labelX = centerX + Math.cos(angle) * (radius + 25);
            const labelY = centerY + Math.sin(angle) * (radius + 20);
            
            let shortName = '';
            switch(i) {
                case 0: shortName = 'SEC'; break;
                case 1: shortName = 'IR'; break;
                case 2: shortName = 'MAL'; break;
                case 3: shortName = 'PT'; break;
                case 4: shortName = 'EXP'; break;
                case 5: shortName = 'RED'; break;
            }
            
            const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
            label.setAttribute("x", labelX);
            label.setAttribute("y", labelY);
            label.setAttribute("text-anchor", "middle");
            label.setAttribute("dominant-baseline", "middle");
            label.setAttribute("fill", "#00ff9d");
            label.setAttribute("font-size", "10");
            label.setAttribute("font-family", "Space Grotesk");
            label.textContent = shortName;
            svg.appendChild(label);
        }
        
        // Draw data polygon (visually filled but no numbers shown)
        const dataPoints = [];
        for (let i = 0; i < numCategories; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const valueRadius = (categories[i].value / 100) * radius;
            const x = centerX + Math.cos(angle) * valueRadius;
            const y = centerY + Math.sin(angle) * valueRadius;
            dataPoints.push(`${x},${y}`);
        }
        
        // Close the polygon
        dataPoints.push(dataPoints[0]);
        
        const dataPolygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        dataPolygon.setAttribute("points", dataPoints.join(' '));
        dataPolygon.setAttribute("class", "radar-polygon");
        svg.appendChild(dataPolygon);
        
        // Draw points at vertices
        for (let i = 0; i < numCategories; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const valueRadius = (categories[i].value / 100) * radius;
            const x = centerX + Math.cos(angle) * valueRadius;
            const y = centerY + Math.sin(angle) * valueRadius;
            
            const point = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            point.setAttribute("cx", x);
            point.setAttribute("cy", y);
            point.setAttribute("r", "4");
            point.setAttribute("class", "radar-point");
            svg.appendChild(point);
        }
    }

    // Scroll reveal observer
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // Create radar chart when matrix section is visible
                if (entry.target.id === 'matrix') {
                    createRadarChart();
                }
            }
        });
    }, { threshold: 0.2, rootMargin: '0px' });

    document.querySelectorAll('.section').forEach(section => {
        revealObserver.observe(section);
    });

    // Scroll to top button
    const scrollBtn = document.getElementById('scrollTop');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.classList.remove('show');
        }
    });
    
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 3D tilt effect on cards
    document.querySelectorAll('.profile-card, .matrix-card, .skill-category, .cert-card, .badge-card, .connect-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 25;
            const rotateY = (centerX - x) / 25;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            const scrollY = window.scrollY;
            heroSection.style.backgroundPositionY = scrollY * 0.5 + 'px';
        }
    });

    // Fix for initial active link
    const hash = window.location.hash;
    if (hash) {
        const targetLink = document.querySelector(`a[href="${hash}"]`);
        if (targetLink) {
            navLinks.forEach(link => link.classList.remove('active'));
            targetLink.classList.add('active');
        }
    }

    // Add animation to segmented bars on scroll
    const skillItems = document.querySelectorAll('.skill-item');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }
        });
    }, { threshold: 0.5 });

    skillItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = 'all 0.5s';
        skillObserver.observe(item);
    });

    // Ensure iframe loads properly
    const iframe = document.querySelector('.badge-iframe-container iframe');
    if (iframe) {
        iframe.onload = function() {
            console.log('TryHackMe iframe loaded successfully');
        };
    }
});