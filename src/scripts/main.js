// ===== Cookie helpers =====
function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

let currentLang = getCookie('language') || 'en';

// ===== Language menu toggle =====
function toggleLanguageMenu(buttonElement) {
    const menu = buttonElement.nextElementSibling;
    if (menu && menu.classList.contains('language-menu')) {
        menu.classList.toggle('active');
    }
}

document.addEventListener("click", (event) => {
    if (!event.target.closest('.language-dropdown')) {
        document.querySelectorAll(".language-menu.active").forEach(menu => {
            menu.classList.remove("active");
        });
    }
});

// ===== Language switching =====
function changeLanguage(lang) {
    document.documentElement.lang = lang;
    currentLang = lang;
    setCookie("language", lang, 30);

    const langData = {
        en: { name: "EN", nameFull: "English", flag: "https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg" },
        uk: { name: "UK", nameFull: "Українська", flag: "https://upload.wikimedia.org/wikipedia/commons/4/49/Flag_of_Ukraine.svg" },
        ru: { name: "RU", nameFull: "Русский", flag: "https://upload.wikimedia.org/wikipedia/en/f/f3/Flag_of_Russia.svg" }
    };

    document.getElementById("current-lang").textContent = langData[lang].name;
    document.getElementById("current-flag").src = langData[lang].flag;
    document.getElementById("current-lang-mobile").textContent = langData[lang].nameFull;
    document.getElementById("current-flag-mobile").src = langData[lang].flag;

    document.querySelectorAll("[data-lang]").forEach((element) => {
        const key = element.getAttribute("data-lang");
        if (translations[lang] && translations[lang][key]) {
            const icon = element.querySelector('i');
            if (icon && element.hasAttribute('data-lang')) {
                element.innerHTML = `${icon.outerHTML} ${translations[lang][key]}`;
            } else {
                element.textContent = translations[lang][key];
            }
        }
    });

    document.querySelectorAll("[data-lang-text]").forEach((element) => {
        const key = element.getAttribute("data-lang-text");
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });

    document.querySelectorAll(".language-menu.active").forEach(menu => {
        menu.classList.remove("active");
    });

    if (typeof activeProjectId !== 'undefined' && activeProjectId) {
        renderProjectModal(activeProjectId);
    }

    typeTerminalLine();
}

// ===== Smooth anchor scrolling =====
document.querySelectorAll('a[href^="#"]:not(#modal-download):not(#modal-github)').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const hash = this.getAttribute('href');
        if (!hash || hash === '#') return;
        const target = document.querySelector(hash);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ===== Mobile menu =====
const hamburgerButton = document.getElementById('hamburger-button');
const mobileMenu = document.getElementById('mobile-menu');

function closeMobileMenu() {
    hamburgerButton.classList.remove('is-active');
    mobileMenu.classList.remove('is-active');
    document.body.style.overflow = '';
}

hamburgerButton.addEventListener('click', () => {
    const isActive = hamburgerButton.classList.contains('is-active');
    if (isActive) {
        closeMobileMenu();
    } else {
        hamburgerButton.classList.add('is-active');
        mobileMenu.classList.add('is-active');
        document.body.style.overflow = 'hidden';
    }
});

mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => closeMobileMenu());
});

mobileMenu.addEventListener('click', (event) => {
    if (event.target === mobileMenu) closeMobileMenu();
});

// ===== Footer year =====
document.getElementById("year").textContent = new Date().getFullYear();

// ===== Cursor glow (throttled to one update per animation frame) =====
(function initCursorGlow() {
    let pendingX = null, pendingY = null, ticking = false;
    document.addEventListener('mousemove', e => {
        pendingX = e.clientX;
        pendingY = e.clientY;
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(() => {
                document.documentElement.style.setProperty('--cursor-x', pendingX + 'px');
                document.documentElement.style.setProperty('--cursor-y', pendingY + 'px');
                ticking = false;
            });
        }
    });
})();

// ===== Active nav link on scroll (throttled via rAF) =====
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.desktop-nav .nav-links a');
let navScrollTicking = false;

function updateActiveNav() {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
    navScrollTicking = false;
}

window.addEventListener('scroll', () => {
    if (!navScrollTicking) {
        navScrollTicking = true;
        requestAnimationFrame(updateActiveNav);
    }
});

// ===== Live status clock in nav =====
function tickClock() {
    const el = document.getElementById('nav-clock');
    if (!el) return;
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    el.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}
setInterval(tickClock, 1000);
tickClock();

// ===== HUD grid canvas background =====
(function initGridCanvas() {
    const canvas = document.getElementById('grid-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w, h, dpr;
    const spacing = 46;
    let pulses = [];
    let rafId = null;
    let lastFrame = 0;
    const FRAME_INTERVAL = 1000 / 30;

    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        w = canvas.clientWidth = window.innerWidth;
        h = canvas.clientHeight = window.innerHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    window.addEventListener('resize', resize);
    resize();

    function spawnPulse() {
        if (reduceMotion) return;
        const cols = Math.floor(w / spacing);
        const rows = Math.floor(h / spacing);
        pulses.push({
            x: Math.floor(Math.random() * cols) * spacing,
            y: Math.floor(Math.random() * rows) * spacing,
            r: 0,
            max: 90 + Math.random() * 60,
            alpha: 0.5
        });
        if (pulses.length > 4) pulses.shift();
        if (rafId === null) {
            lastFrame = 0;
            rafId = requestAnimationFrame(draw);
        }
    }
    setInterval(spawnPulse, 2600);

    function draw(ts) {
        if (!lastFrame) lastFrame = ts;
        const elapsed = ts - lastFrame;
        if (elapsed < FRAME_INTERVAL) {
            rafId = requestAnimationFrame(draw);
            return;
        }
        lastFrame = ts;

        ctx.clearRect(0, 0, w, h);
        pulses.forEach(p => {
            p.r += 1.3;
            p.alpha = Math.max(0, 0.5 * (1 - p.r / p.max));
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(94,255,143,${p.alpha})`;
            ctx.lineWidth = 1.4;
            ctx.stroke();
        });
        pulses = pulses.filter(p => p.r < p.max);

        if (pulses.length > 0) {
            rafId = requestAnimationFrame(draw);
        } else {
            rafId = null;
        }
    }
})();

// ===== Scroll reveal (replaces AOS) =====
(function initReveal() {
    const revealEls = document.querySelectorAll('.reveal');
    const skillEls = document.querySelectorAll('.skill-item');
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => io.observe(el));
    skillEls.forEach(el => io.observe(el));
})();

// ===== Hero stat counters =====
(function initCounters() {
    const chips = document.querySelectorAll('.stat-num');
    if (!chips.length) return;
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseInt(el.getAttribute('data-count'), 10) || 0;
            let cur = 0;
            const step = Math.max(1, Math.round(target / 40));
            const timer = setInterval(() => {
                cur += step;
                if (cur >= target) { cur = target; clearInterval(timer); }
                el.textContent = cur;
            }, 30);
            io.unobserve(el);
        });
    }, { threshold: 0.4 });
    chips.forEach(el => io.observe(el));
})();

// ===== Hero terminal typing line =====
let terminalTypingTimer = null;
function typeTerminalLine() {
    const el = document.getElementById('terminal-line');
    if (!el) return;
    const lines = (typeof bootSequence !== 'undefined' && bootSequence[currentLang]) ? bootSequence[currentLang] : [];
    if (!lines.length) return;

    if (terminalTypingTimer) clearInterval(terminalTypingTimer);
    let lineIndex = 0, charIndex = 0;
    el.textContent = '';

    function typeNext() {
        if (lineIndex >= lines.length) {
            clearInterval(terminalTypingTimer);
            return;
        }
        const line = '> ' + lines[lineIndex];
        if (charIndex <= line.length) {
            el.textContent = line.slice(0, charIndex);
            charIndex++;
        } else {
            lineIndex++;
            charIndex = 0;
            if (lineIndex < lines.length) {
                setTimeout(() => {}, 400);
            }
        }
    }
    terminalTypingTimer = setInterval(typeNext, 28);
}

// ===== Preloader boot log =====
function runBootSequence() {
    const logEl = document.getElementById('boot-log');
    const barEl = document.getElementById('boot-bar-fill');
    const lines = (typeof bootLog !== 'undefined' && bootLog[currentLang]) ? bootLog[currentLang] : [];
    if (!logEl) return;

    lines.forEach((text, i) => {
        setTimeout(() => {
            const row = document.createElement('div');
            row.className = 'boot-row';
            row.innerHTML = `${text}<span class="ok">OK</span>`;
            logEl.appendChild(row);
            if (barEl) barEl.style.width = `${((i + 1) / lines.length) * 100}%`;
        }, i * 220);
    });
}

// ===== Project modal system =====
let activeProjectId = null;
const modalOverlay = document.getElementById('modal-overlay');
const modalWindow = document.getElementById('modal-window');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

function renderProjectModal(id) {
    const data = (typeof projectDetails !== 'undefined') ? projectDetails[id] : null;
    if (!data) return;
    const copy = data[currentLang] || data.en;

    modalWindow.setAttribute('data-accent', data.accent);
    document.getElementById('modal-titletext').textContent = id + '.sys';
    document.getElementById('modal-icon').innerHTML = `<i class="${data.icon}"></i>`;
    document.getElementById('modal-title').textContent = data.name || (id.charAt(0).toUpperCase() + id.slice(1));
    document.getElementById('modal-tag').textContent = copy.tag;
    document.getElementById('modal-desc').textContent = copy.desc;

    const galleryEl = document.getElementById('modal-gallery');
    galleryEl.innerHTML = '';
    if (data.gallery && data.gallery.length) {
        galleryEl.style.display = 'flex';
        data.gallery.forEach(img => {
            const imageEl = document.createElement('img');
            imageEl.src = img.src;
            imageEl.alt = img.alt || '';
            imageEl.loading = 'lazy';
            imageEl.addEventListener('click', () => openLightbox(img.src, img.alt));
            galleryEl.appendChild(imageEl);
        });
    } else {
        galleryEl.style.display = 'none';
    }

    const featuresEl = document.getElementById('modal-features');
    featuresEl.innerHTML = '';
    (copy.features || []).forEach(f => {
        const li = document.createElement('li');
        li.textContent = f;
        featuresEl.appendChild(li);
    });

    const specsEl = document.getElementById('modal-specs');
    specsEl.innerHTML = '';
    (copy.specs || []).forEach(s => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${s.label}</span><span>${s.value}</span>`;
        specsEl.appendChild(li);
    });

    document.getElementById('modal-download').href = data.download;
    document.getElementById('modal-github').href = data.github;
}

function openProjectModal(id) {
    activeProjectId = id;
    renderProjectModal(id);
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    activeProjectId = null;
}

function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.classList.add('active');
}
function closeLightbox() {
    lightbox.classList.remove('active');
}

document.querySelectorAll('.open-modal-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openProjectModal(btn.getAttribute('data-project'));
    });
});

document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => openProjectModal(card.getAttribute('data-project')));
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openProjectModal(card.getAttribute('data-project'));
        }
    });
});

document.getElementById('modal-close').addEventListener('click', closeProjectModal);
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeProjectModal();
});
lightbox.addEventListener('click', closeLightbox);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (lightbox.classList.contains('active')) closeLightbox();
        else if (modalOverlay.classList.contains('active')) closeProjectModal();
    }
});

// ===== Boot / init =====
window.onload = function () {
    window.scrollTo(0, 0);
    runBootSequence();
    changeLanguage(currentLang);

    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        if (preloader) preloader.classList.add('hidden');
    }, 1400);
};