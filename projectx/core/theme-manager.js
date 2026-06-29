function initialiseTheme(){const saved=localStorage.getItem('projectx-theme');if(saved)document.documentElement.setAttribute('data-theme',saved)}
function setProjectXTheme(themeName){document.documentElement.setAttribute('data-theme',themeName);localStorage.setItem('projectx-theme',themeName)}
