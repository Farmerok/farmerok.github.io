
document.addEventListener('DOMContentLoaded', function() {
    const lang = localStorage.getItem('lang') || 'en';
    const texts = locales[lang];

    // Update common elements
    document.title = texts['homePage'];
    document.getElementById('homePage-text') && (document.getElementById('homePage-text').textContent = texts['homePage']);
    document.getElementById('welcome-text') && (document.getElementById('welcome-text').textContent = texts['welcome']);
    document.getElementById('partner-name') && (document.getElementById('partner-name').textContent = texts['partner-name']);
    document.getElementById('faqPage') && (document.getElementById('faqPage').textContent = texts['faqPage-text']);
    document.getElementById('partner-description') && (document.getElementById('partner-description').textContent = texts['partner-description']);
    document.getElementById('download-info') && (document.getElementById('download-info').textContent = texts['download-info']);
    document.getElementById('questions-info') && (document.getElementById('questions-info').textContent = texts['questions-info']);
    document.getElementById('button_procejts') && (document.getElementById('button_procejts').textContent = texts['button_procejts']);
    document.getElementById('selected-language') && (document.getElementById('selected-language').textContent = lang.toUpperCase());

    // For project page
    if (document.getElementById('projects-heading')) {
        document.getElementById('home-text').textContent = texts['homePage'];
        document.getElementById('faq-text').textContent = texts['faqPage-text'];
        document.getElementById('projects-heading').textContent = texts['projects-heading'];
        document.querySelectorAll('.buttonDownload').forEach(button => button.textContent = texts['download-button-text']);
        document.querySelectorAll('.information-button').forEach(button => button.textContent = texts['description-button-text']);
        document.getElementById('project-description-1') && (document.getElementById('project-description-1').innerHTML = texts['project-description-1']);
        document.getElementById('project-description-2') && (document.getElementById('project-description-2').innerHTML = texts['project-description-2']);
        document.getElementById('project-description-3') && (document.getElementById('project-description-3').innerHTML = texts['project-description-3']);

        const informationButtons = document.querySelectorAll(".information-button");
        const popups = document.querySelectorAll(".popup");

        informationButtons.forEach((button, index) => {
            button.addEventListener("click", () => {
                if (popups[index].style.display === "block") {
                    popups[index].style.display = "none";
                } else {
                    popups.forEach(popup => (popup.style.display = "none"));
                    popups[index].style.display = "block";
                }
            });
        });

        window.addEventListener("click", event => {
            if (!event.target.matches(".information-button") && !event.target.matches(".popup")) {
                popups.forEach(popup => (popup.style.display = "none"));
            }
        });
    }

    // For FAQ page
    if (document.getElementById('welcome-faq-text')) {
        document.getElementById('home-text').textContent = texts['homePage'];
        document.getElementById('projects-text').textContent = texts['button_procejts'];
        document.getElementById('welcome-faq-text').textContent = texts['welcome-faq'];
        document.getElementById('description-text').textContent = texts['description'];

        document.getElementById('question-1-text') && (document.getElementById('question-1-text').innerHTML = texts['question-1']);
        document.getElementById('question-2-text') && (document.getElementById('question-2-text').innerHTML = texts['question-2']);
        document.getElementById('answer-1-text') && (document.getElementById('answer-1-text').innerHTML = texts['answer-1']);
        document.getElementById('answer-2-text') && (document.getElementById('answer-2-text').innerHTML = texts['answer-2']);

        const expandButtons = document.querySelectorAll(".expand-button");

        expandButtons.forEach((button, index) => {
            button.textContent = texts['expand-button-text'];
            button.addEventListener("click", () => {
                const answers = document.querySelectorAll(".answer");
                if (answers[index].style.display === "block") {
                    answers[index].style.display = "none";
                    button.textContent = texts['expand-button-text'];
                } else {
                    answers.forEach(answer => answer.style.display = "none");
                    answers[index].style.display = "block";
                    button.textContent = texts['collapse-button-text'];
                }
            });
        });
    }

    // Hide select language option
    function hideSelectLanguageOption() {
        const selectLanguageOption = document.querySelector('#language option[value=""]');
        if (selectLanguageOption) {
            selectLanguageOption.style.display = 'none';
        }
    }
    hideSelectLanguageOption();

    // Change language
    window.changeLanguage = function(lang) {
        localStorage.setItem('lang', lang);
        updateTexts();
    };

    function updateTexts() {
        const lang = localStorage.getItem('lang') || 'en';
        const texts = locales[lang];

        document.getElementById('select_language') && (document.getElementById('select_language').textContent = texts['select_language']);
        document.getElementById('Language_Current') && (document.getElementById('Language_Current').textContent = texts['current_language']);
        document.getElementById('homePage-text') && (document.getElementById('homePage-text').textContent = texts['homePage']);
        document.getElementById('welcome-text') && (document.getElementById('welcome-text').textContent = texts['welcome']);
        document.getElementById('partner-name') && (document.getElementById('partner-name').textContent = texts['partner-name']);
        document.getElementById('faqPage') && (document.getElementById('faqPage').textContent = texts['faqPage-text']);
        document.getElementById('partner-description') && (document.getElementById('partner-description').textContent = texts['partner-description']);
        document.getElementById('download-info') && (document.getElementById('download-info').textContent = texts['download-info']);
        document.getElementById('questions-info') && (document.getElementById('questions-info').textContent = texts['questions-info']);
        document.getElementById('button_procejts') && (document.getElementById('button_procejts').textContent = texts['button_procejts']);

        document.getElementById('selected-language') && (document.getElementById('selected-language').textContent = lang.toUpperCase());
    }

    updateTexts();
});