const canvas = document.getElementById('snow-canvas');
const ctx = canvas.getContext('2d');
const menuToggle = document.querySelector('.menu-toggle');
const navGroup = document.querySelector('.nav-group');
const navLinks = document.querySelectorAll('.topbar nav a');
const revealElements = document.querySelectorAll('.reveal');
const tiltElements = document.querySelectorAll('.tilt-card');
const typingText = document.querySelector('.typing-text');

let w = canvas.width = window.innerWidth;
let h = canvas.height = window.innerHeight;
let flakes = [];

const meaningfulQuotes = [
    'Học tập mỗi ngày là cách tốt nhất để trưởng thành.',
    'Đừng sợ bắt đầu, chỉ cần bắt đầu là đủ.',
    'Kiên trì sẽ đưa bạn đến nơi bạn muốn.',
    'Một trang web đẹp không chỉ nhìn tốt, mà còn phải dễ dùng.',
    'Sự cố gắng nhỏ hôm nay sẽ tạo nên thành công ngày mai.'
];

let quoteIndex = 0;
let charIndex = 0;
let isDeleting = false;

function runTypingEffect() {
    if (!typingText) return;

    const currentQuote = meaningfulQuotes[quoteIndex];

    if (!isDeleting) {
        typingText.textContent = currentQuote.slice(0, charIndex + 1);
        charIndex += 1;

        if (charIndex === currentQuote.length) {
            isDeleting = true;
            setTimeout(runTypingEffect, 1800);
            return;
        }
    } else {
        typingText.textContent = currentQuote.slice(0, charIndex);
        charIndex -= 1;

        if (charIndex === 0) {
            isDeleting = false;
            quoteIndex = (quoteIndex + 1) % meaningfulQuotes.length;
            setTimeout(runTypingEffect, 400);
            return;
        }
    }

    setTimeout(runTypingEffect, isDeleting ? 35 : 60);
}

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function createSnow() {
    flakes = [];
    const count = Math.floor(window.innerWidth / 3);

    for (let i = 0; i < count; i++) {
        flakes.push({
            x: Math.random() * w,
            y: Math.random() * h,
            r: random(1, 3),
            speed: random(0.5, 2),
            drift: random(-0.5, 0.5)
        });
    }
}

function drawSnow() {
    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < flakes.length; i++) {
        const f = flakes[i];
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();

        f.y += f.speed;
        f.x += f.drift;

        if (f.y > h) {
            f.y = -5;
            f.x = Math.random() * w;
        }
        if (f.x > w) f.x = 0;
        if (f.x < 0) f.x = w;
    }

    requestAnimationFrame(drawSnow);
}

if (menuToggle && navGroup) {
    menuToggle.addEventListener('click', () => {
        const isOpen = navGroup.classList.toggle('open');
        menuToggle.classList.toggle('active', isOpen);
    });

    navGroup.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            navGroup.classList.remove('open');
            menuToggle.classList.remove('active');
        });
    });
}

if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15 }
    );

    revealElements.forEach((element) => observer.observe(element));
}

function updateActiveNav() {
    const scrollPosition = window.scrollY + 120;

    navLinks.forEach((link) => {
        const section = document.querySelector(link.getAttribute('href'));
        if (!section) return;

        const isActive =
            section.offsetTop <= scrollPosition &&
            section.offsetTop + section.offsetHeight > scrollPosition;

        link.classList.toggle('active', isActive);
    });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav();
runTypingEffect();

tiltElements.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateY = ((x / rect.width) - 0.5) * 10;
        const rotateX = ((0.5 - y / rect.height) * 10);

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        card.style.setProperty('--glow-x', `${(x / rect.width) * 100}%`);
        card.style.setProperty('--glow-y', `${(y / rect.height) * 100}%`);
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

window.addEventListener('resize', () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    createSnow();

    if (window.innerWidth > 768) {
        navGroup?.classList.remove('open');
        menuToggle?.classList.remove('active');
    }
});

createSnow();
drawSnow();
