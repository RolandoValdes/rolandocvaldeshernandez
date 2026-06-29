function initialiseTheme() {
  const savedTheme = localStorage.getItem("projectx-theme");

  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
  }
}

function setProjectXTheme(themeName) {
  document.documentElement.setAttribute("data-theme", themeName);
  localStorage.setItem("projectx-theme", themeName);
}