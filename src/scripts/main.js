// Initialize AOS animation library
AOS.init({
    duration: 1000,
    once: true,
    offset: 200
});

// cookie 
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

function toggleLanguageMenu() {
    document.querySelector(".language-menu").classList.toggle("active");
}

document.addEventListener("click", (event) => {
    const dropdown = document.querySelector(".lang-btn");
    if (!dropdown.contains(event.target)) {
        document.querySelector(".language-menu").classList.remove("active");
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

    // upd text and flag on button
    document.getElementById("current-lang").textContent = langData[lang].name;
    document.getElementById("current-flag").src = langData[lang].flag;

    // update text if us
    document.querySelectorAll("[data-lang]").forEach((element) => {
        const key = element.getAttribute("data-lang");
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });

    document.querySelector(".language-menu").classList.remove("active");
}

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

// active section highlighting
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');

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

window.onload = function() {
    window.scrollTo(0, 0);
};
// Initialize with saved language preference
changeLanguage(currentLang);