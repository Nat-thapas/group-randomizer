let themeButton = document.getElementById('theme-button');
let langButton = document.getElementById('lang-button');
let cssLink = document.getElementById('link-css');

if (!localStorage.getItem('theme')) {
    localStorage.setItem('theme', 'dark');
}
if (!localStorage.getItem('lang')) {
    localStorage.setItem('lang', 'EN');
}

if (localStorage.getItem('theme') === 'dark') {
    themeButton.textContent = 'Theme: dark';
    cssLink.href = 'style-dark.css';
} else {
    themeButton.textContent = 'Theme: light';
    cssLink.href = 'style-light.css';
}

if (localStorage.getItem('lang') === 'EN') {
    langButton.textContent = 'Language: EN';
    document.querySelectorAll('[lang="th"]').forEach((element) => {
        element.hidden = true;
    });
    document.querySelectorAll('[lang="en"]').forEach((element) => {
        element.hidden = false;
    });
    document.querySelector('html').style.fontFamily = 'Roboto, sans-serif';
    document.querySelector('html').hidden = false;
} else {
    langButton.textContent = 'Language: TH'
    document.querySelectorAll('[lang="en"]').forEach((element) => {
        element.hidden = true;
    });
    document.querySelectorAll('[lang="th"]').forEach((element) => {
        element.hidden = false;
    });
    document.querySelector('html').style.fontFamily = 'Sarabun, sans-serif';
    document.querySelector('html').hidden = false;
}


themeButton.addEventListener('click', () => {
    if (localStorage.getItem('theme') === 'dark') {
        localStorage.setItem('theme', 'light');
        themeButton.textContent = 'Theme: light';
        cssLink.href = 'style-light.css';
    } else {
        localStorage.setItem('theme', 'dark');
        themeButton.textContent = 'Theme: dark';
        cssLink.href = 'style-dark.css';
    }
});


langButton.addEventListener('click', () => {
    if (localStorage.getItem('lang') === 'EN') {
        localStorage.setItem('lang', 'TH');
        updateLang();
        langButton.textContent = 'Language: TH';
        document.querySelectorAll('[lang="en"]').forEach((element) => {
            element.hidden = true;
        });
        document.querySelectorAll('[lang="th"]').forEach((element) => {
            element.hidden = false;
        });
        document.querySelector('html').style.fontFamily = 'Sarabun, sans-serif';
        document.querySelector('html').hidden = false;
    } else {
        localStorage.setItem('lang', 'EN');
        updateLang();
        langButton.textContent = 'Language: EN';
        document.querySelectorAll('[lang="th"]').forEach((element) => {
            element.hidden = true;
        });
        document.querySelectorAll('[lang="en"]').forEach((element) => {
            element.hidden = false;
        });
        document.querySelector('html').style.fontFamily = 'Roboto, sans-serif';
        document.querySelector('html').hidden = false;
    }
});
