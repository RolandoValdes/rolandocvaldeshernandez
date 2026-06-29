const PROJECTX_REGISTRY_URL =
  "/rolandocvaldeshernandez/data/projectx_registry.json";

async function loadProjectXRegistry() {
  const appGrid = document.getElementById("appGrid");
  const totalApps = document.getElementById("totalApps");
  const professionalApps = document.getElementById("professionalApps");
  const teachingApps = document.getElementById("teachingApps");

  if (!appGrid) return;

  try {
    const response = await fetch(PROJECTX_REGISTRY_URL);

    if (!response.ok) {
      throw new Error(`Registry fetch failed: ${response.status}`);
    }

    const registry = await response.json();
    const apps = registry.apps || [];

    appGrid.innerHTML = "";

    apps
      .sort((a, b) => (b.priority || 0) - (a.priority || 0))
      .forEach(app => {
        const card = document.createElement("article");
        card.className = "app-card";
        card.innerHTML = `
          <div class="app-card-icon">${app.icon || "📘"}</div>
          <div class="app-card-meta">${app.category || "Project X"}</div>
          <h3>${app.title}</h3>
          <p>${app.description || ""}</p>
          <div class="app-card-footer">
            <span class="status-pill">${app.status || "Available"}</span>
            <a href="${app.url}" class="card-link">Open</a>
          </div>
        `;
        appGrid.appendChild(card);
      });

    if (totalApps) totalApps.textContent = apps.length;

    if (professionalApps) {
      professionalApps.textContent = apps.filter(app =>
        app.category?.toLowerCase().includes("professional")
      ).length;
    }

    if (teachingApps) {
      teachingApps.textContent = apps.filter(app =>
        app.category?.toLowerCase().includes("teaching")
      ).length;
    }
  } catch (error) {
    console.error("Project X Registry Error:", error);

    appGrid.innerHTML = `
      <div class="registry-error">
        <strong>Registry not loaded.</strong>
        <p>Check that data/projectx_registry.json exists and contains valid JSON.</p>
      </div>
    `;
  }
}

document.addEventListener("DOMContentLoaded", loadProjectXRegistry);