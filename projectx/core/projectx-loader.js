async function loadComponent(targetId, componentPath) {
  const target = document.getElementById(targetId);

  if (!target) {
    console.warn(`Project X Loader: Missing target #${targetId}`);
    return;
  }

  try {
    const response = await fetch(componentPath);

    if (!response.ok) {
      throw new Error(`Failed to load ${componentPath}`);
    }

    target.innerHTML = await response.text();
  } catch (error) {
    console.error("Project X Loader Error:", error);
  }
}

async function initialiseProjectX() {
  const basePath = "/rolandocvaldeshernandez/projectx";

  await loadComponent("projectxSidebar", `${basePath}/components/sidebar/sidebar.html`);
  await loadComponent("projectxHeader", `${basePath}/components/header/header.html`);

  if (typeof initialiseNavigation === "function") {
    initialiseNavigation();
  }

  if (typeof initialiseTheme === "function") {
    initialiseTheme();
  }
}

document.addEventListener("DOMContentLoaded", initialiseProjectX);