

document.addEventListener('DOMContentLoaded', function() {
    
    initNavigation();
    initSmoothScroll();
    initScrollAnimations();
    initStatCounters();
    initVideoGallery();
    initContactForm();
    initMobileMenu();
    initDNAHelix();
});

function initDNAHelix() {
    const canvas = document.getElementById('dnaCanvas');
    if (!canvas) return;

    
    const W = 180;
    const H = 420;
    canvas.width  = W * 2;
    canvas.height = H * 2;

    const ctx = canvas.getContext('2d');
    ctx.scale(2, 2);

    const cx        = W / 2;
    const amplitude = W * 0.38;
    const cycles    = 3;           
    const numBases  = cycles * 10; 
    let   phase     = 0;

    
    const COL_A = { r: 66,  g: 220, b: 213 }; 
    const COL_B = { r: 43,  g: 143, b: 142 }; 

    function rgba(col, a) {
        return `rgba(${col.r},${col.g},${col.b},${a})`;
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);

        
        const bases = [];
        for (let i = 0; i <= numBases; i++) {
            const t     = i / numBases;
            const y     = t * H;
            const angle = t * Math.PI * 2 * cycles + phase;
            const cosA  = Math.cos(angle);
            const sinA  = Math.sin(angle);        
            const x1    = cx + cosA * amplitude;  
            const x2    = cx - cosA * amplitude;  
            bases.push({ y, x1, x2, depth: sinA, angle });
        }

        
        const sorted = [...bases].sort((a, b) => a.depth - b.depth);

        
        sorted.forEach(({ y, x1, x2, depth }) => {
            const alpha   = 0.15 + 0.55 * ((depth + 1) / 2);
            const thick   = 0.8 + 1.2 * ((depth + 1) / 2);
            
            const midX    = (x1 + x2) / 2;

            
            const grad = ctx.createLinearGradient(x1, y, x2, y);
            grad.addColorStop(0,    rgba(COL_A, alpha));
            grad.addColorStop(0.5,  rgba(COL_A, alpha * 0.6));
            grad.addColorStop(0.5,  rgba(COL_B, alpha * 0.6));
            grad.addColorStop(1,    rgba(COL_B, alpha));

            ctx.beginPath();
            ctx.moveTo(x1, y);
            ctx.lineTo(x2, y);
            ctx.strokeStyle = grad;
            ctx.lineWidth   = thick;
            ctx.stroke();

            
            const dotR = 2.5 + 1.5 * ((depth + 1) / 2);
            ctx.beginPath();
            ctx.arc(x1, y, dotR, 0, Math.PI * 2);
            ctx.fillStyle = rgba(COL_A, alpha + 0.2);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(x2, y, dotR, 0, Math.PI * 2);
            ctx.fillStyle = rgba(COL_B, alpha + 0.2);
            ctx.fill();
        });

        
        ['A', 'B'].forEach((strand) => {
            const col    = strand === 'A' ? COL_A : COL_B;
            const offset = strand === 'A' ? 0 : Math.PI;

            ctx.beginPath();
            for (let py = 0; py <= H; py += 2) {
                const t     = py / H;
                const angle = t * Math.PI * 2 * cycles + phase + offset;
                const x     = cx + Math.cos(angle) * amplitude;
                const depth = Math.sin(angle); 
                const alpha = 0.45 + 0.55 * ((depth + 1) / 2);

                if (py === 0) {
                    ctx.moveTo(x, py);
                } else {
                    ctx.lineTo(x, py);
                }
            }
            
            
            ctx.strokeStyle = rgba(col, 0.85);
            ctx.lineWidth   = 2.5;
            ctx.lineJoin    = 'round';
            ctx.stroke();
        });

        phase += 0.012;
        requestAnimationFrame(draw);
    }

    draw();
}

function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        
        updateActiveNavLink();
    });
    
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    
    document.querySelectorAll('.team-card, .feature, .social-card, .contact-item').forEach(el => {
        el.classList.add('animate-ready');
        observer.observe(el);
    });
    
    
    const style = document.createElement('style');
    style.textContent = `
        .animate-ready {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        .navbar.scrolled {
            background: rgba(0, 0, 0, 0.98);
            box-shadow: 0 5px 30px rgba(0, 0, 0, 0.5);
        }
    `;
    document.head.appendChild(style);
}

function initStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const targetNumber = parseInt(target.getAttribute('data-target'));
                animateCounter(target, targetNumber);
                observer.unobserve(target);
            }
        });
    }, observerOptions);
    
    statNumbers.forEach(stat => observer.observe(stat));
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const duration = 2000;
    const stepTime = duration / 50;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, stepTime);
}

async function initVideoGallery() {
    const featuredVideo = document.getElementById('featuredVideo');
    const videoTitle = document.getElementById('videoTitle');
    const videoDescription = document.getElementById('videoDescription');
    const videoGallery = document.getElementById('videoGallery');
    
    if (!featuredVideo || !videoGallery) return;
    
    
    if (typeof VideoManager === 'undefined' || !VideoManager.getAll) {
        console.warn('VideoManager not loaded yet, retrying...');
        setTimeout(initVideoGallery, 100);
        return;
    }
    
    try {
        
        const videos = await VideoManager.getAll();
        const featuredVideoData = await VideoManager.getFeatured();
        
        
        if (featuredVideoData) {
            featuredVideo.src = `https://www.youtube.com/embed/${featuredVideoData.youtube_id}`;
            videoTitle.textContent = featuredVideoData.title;
            videoDescription.textContent = featuredVideoData.description;
        }
        
        
        if (videos.length > 0) {
            videoGallery.innerHTML = videos.map(video => `
                <div class="gallery-item" data-video-id="${video.youtube_id}" data-title="${video.title}" data-description="${video.description}">
                    <div class="thumbnail">
                        <img src="https://img.youtube.com/vi/${video.youtube_id}/mqdefault.jpg" alt="${video.title}">
                        <div class="play-overlay"><i class="fas fa-play"></i></div>
                    </div>
                    <span>${video.title}</span>
                </div>
            `).join('');
        } else {
            videoGallery.innerHTML = `
                <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 40px; color: rgba(255,255,255,0.5);">
                    <i class="fas fa-video-slash" style="font-size: 32px; margin-bottom: 15px; display: block;"></i>
                    <p>No videos available yet.</p>
                </div>
            `;
        }
        
        
        videoGallery.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', () => {
                const videoId = item.getAttribute('data-video-id');
                const title = item.getAttribute('data-title');
                const description = item.getAttribute('data-description');
                
                if (videoId && featuredVideo) {
                    featuredVideo.src = `https://www.youtube.com/embed/${videoId}`;
                    videoTitle.textContent = title;
                    videoDescription.textContent = description;
                    
                    
                    document.querySelector('.featured-video').scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }
            });
        });
    } catch (error) {
        console.error('Error loading videos:', error);
    }
}

function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            
            const subject = encodeURIComponent(`Contact from ${name} via BIOND Website`);
            const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
            const mailtoLink = `mailto:biologyandbeyondclub.giis@gmail.com?subject=${subject}&body=${body}`;
            
            window.location.href = mailtoLink;
            
            
            showNotification('Opening your email client...', 'success');
        });
    }
}

function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                bottom: 30px;
                right: 30px;
                padding: 15px 25px;
                background: #1a1a1a;
                border: 1px solid rgba(255, 255, 255, 0.1);
                color: white;
                display: flex;
                align-items: center;
                gap: 15px;
                z-index: 10000;
                animation: slideIn 0.3s ease;
            }
            .notification-success {
                border-color: #2B8F8E;
            }
            .notification-error {
                border-color: #dc3545;
            }
            .notification button {
                background: none;
                border: none;
                color: #888;
                font-size: 20px;
                cursor: pointer;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

window.showNotification = showNotification;
