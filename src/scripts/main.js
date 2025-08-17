// Initialize AOS animation library
AOS.init({
    duration: 1000,
    once: true,
    offset: 200
});

// cookie functions
function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

let currentLang = getCookie('language') || 'en';

//
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

function changeLanguage(lang) {
    document.documentElement.lang = lang;
    setCookie("language", lang, 30);

    const langData = {
        en: { name: "English", flag: "https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg" },
        uk: { name: "Українська", flag: "https://upload.wikimedia.org/wikipedia/commons/4/49/Flag_of_Ukraine.svg" },
        ru: { name: "Русский", flag: "https://upload.wikimedia.org/wikipedia/en/f/f3/Flag_of_Russia.svg" }
    };

    document.getElementById("current-lang").textContent = langData[lang].name;
    document.getElementById("current-flag").src = langData[lang].flag;
    document.getElementById("current-lang-mobile").textContent = langData[lang].name;
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

    document.querySelectorAll(".language-menu.active").forEach(menu => {
        menu.classList.remove("active");
    });
}

// 
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// 
const hamburgerButton = document.getElementById('hamburger-button');
const mobileMenu = document.getElementById('mobile-menu');

// 
function closeMobileMenu() {
    hamburgerButton.classList.remove('is-active');
    mobileMenu.classList.remove('is-active');
    document.body.style.overflow = '';
}

// 
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

// 
mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        closeMobileMenu();
    });
});

// 
mobileMenu.addEventListener('click', (event) => {
    if (event.target === mobileMenu) {
        closeMobileMenu();
    }
});
//
document.getElementById("year").textContent = new Date().getFullYear();

//
document.addEventListener('mousemove', e => {
    document.documentElement.style.setProperty('--cursor-x', e.clientX + 'px');
    document.documentElement.style.setProperty('--cursor-y', e.clientY + 'px');
});

//
particlesJS("particles-js", {
    "particles": { "number": { "value": 80, "density": { "enable": true, "value_area": 800 } }, "color": { "value": "#ffffff" }, "shape": { "type": "circle", }, "opacity": { "value": 0.5, "random": false, "anim": { "enable": false, } }, "size": { "value": 3, "random": true, "anim": { "enable": false, } }, "line_linked": { "enable": true, "distance": 150, "color": "#ffffff", "opacity": 0.4, "width": 1 }, "move": { "enable": true, "speed": 2, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false, } }, "interactivity": { "detect_on": "canvas", "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": true, "mode": "push" }, "resize": true }, "modes": { "grab": { "distance": 140, "line_linked": { "opacity": 1 } }, "bubble": { "distance": 400, "size": 40, "duration": 2, "opacity": 8, "speed": 3 }, "repulse": { "distance": 200, "duration": 0.4 }, "push": { "particles_nb": 4 }, "remove": { "particles_nb": 2 } } }, "retina_detect": true
});

// 
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.desktop-nav .nav-links a');

window.addEventListener('scroll', () => {
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
});

// 
window.onload = function() {
    window.scrollTo(0, 0);
    changeLanguage(currentLang);

    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('hidden');
    }
};