(function () {
  const DATA_URL = "/rolandocvaldeshernandez/projectx/data/documentation/documents.json";

  window.ProjectXDocumentationState = {
    documents: [],
    loaded: false
  };

  async function loadDocuments() {
    if (window.ProjectXDocumentationState.loaded) {
      return window.ProjectXDocumentationState.documents;
    }

    const response = await fetch(DATA_URL, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Documentation data could not be loaded: ${response.status}`);
    }

    const data = await response.json();
    window.ProjectXDocumentationState.documents = Array.isArray(data.documents) ? data.documents : [];
    window.ProjectXDocumentationState.loaded = true;
    return window.ProjectXDocumentationState.documents;
  }

  function escape(value) {
    return String(value || "").replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      }[char];
    });
  }

  function documentCard(document) {
    const tags = Array.isArray(document.tags) ? document.tags : [];

    return `
      <article class="projectx-card">
        <span class="projectx-status">${escape(document.status || "Document")}</span>
        <h3>${escape(document.title)}</h3>
        <p>${escape(document.summary)}</p>

        <div class="projectx-grid" style="grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); margin-top: 16px;">
          <div>
            <strong>Version</strong><br>
            <span>${escape(document.version)}</span>
          </div>
          <div>
            <strong>Category</strong><br>
            <span>${escape(document.category)}</span>
          </div>
          <div>
            <strong>Updated</strong><br>
            <span>${escape(document.updated)}</span>
          </div>
        </div>

        <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px;">
          ${tags.map(tag => `<span class="projectx-status">${escape(tag)}</span>`).join("")}
        </div>

        <div style="display: flex; flex-wrap: wrap; gap: 12px; margin-top: 20px;">
          <a class="projectx-button" href="${escape(document.pdf)}" target="_blank" rel="noopener">Open PDF</a>
          <a class="projectx-button" href="${escape(document.docx)}" download>Download DOCX</a>
        </div>
      </article>
    `;
  }

  function shell(message) {
    return `
      <div class="projectx-card">
        <span class="projectx-status">Documentation</span>
        <h2>Documentation Centre</h2>
        <p>${escape(message)}</p>
      </div>
    `;
  }

  window.ProjectXViews = window.ProjectXViews || {};

  window.ProjectXViews.documentation_dashboard = function () {
    setTimeout(async () => {
      const target = document.getElementById("moduleWorkspace");
      if (!target) return;

      try {
        const documents = await loadDocuments();
        const current = documents.filter(doc => String(doc.status).toLowerCase() === "current");
        const architecture = documents.filter(doc => String(doc.category).toLowerCase() === "architecture");

        target.innerHTML = `
          <div class="projectx-grid" style="margin-bottom: 20px;">
            <div class="projectx-card">
              <span class="projectx-status">Documents</span>
              <h3>${documents.length}</h3>
              <p>Total documentation records currently registered inside Project X.</p>
            </div>

            <div class="projectx-card">
              <span class="projectx-status">Current</span>
              <h3>${current.length}</h3>
              <p>Documents marked as current references for development.</p>
            </div>

            <div class="projectx-card">
              <span class="projectx-status">Architecture</span>
              <h3>${architecture.length}</h3>
              <p>Architecture and blueprint documents available in the OS.</p>
            </div>
          </div>

          <div class="projectx-grid">
            ${documents.map(documentCard).join("")}
          </div>
        `;
      } catch (error) {
        console.error(error);
        target.innerHTML = shell("Documentation data could not be loaded. Check projectx/data/documentation/documents.json.");
      }
    }, 0);

    return shell("Loading documentation library...");
  };

  window.ProjectXViews.documentation_architecture = function () {
    setTimeout(async () => {
      const target = document.getElementById("moduleWorkspace");
      if (!target) return;

      try {
        const documents = await loadDocuments();
        const architectureDocs = documents.filter(doc => String(doc.category).toLowerCase() === "architecture");

        target.innerHTML = `
          <div class="projectx-grid">
            ${architectureDocs.map(documentCard).join("") || shell("No architecture documents are currently registered.")}
          </div>
        `;
      } catch (error) {
        console.error(error);
        target.innerHTML = shell("Architecture documents could not be loaded.");
      }
    }, 0);

    return shell("Loading architecture documents...");
  };

  window.ProjectXViews.documentation_releases = function () {
    return `
      <div class="projectx-card">
        <span class="projectx-status">Release Management</span>
        <h2>Release Notes</h2>
        <p>
          This view is reserved for future Project X release notes, sprint changelogs,
          installation guides and test checklists. Sprint documentation can later be added
          here using the same documents.json structure.
        </p>
      </div>
    `;
  };

  window.ProjectXViews.documentation_templates = function () {
    return `
      <div class="projectx-card">
        <span class="projectx-status">Templates</span>
        <h2>Documentation Templates</h2>
        <p>
          Future templates will support architecture updates, sprint planning,
          technical decisions, module specifications and testing records.
        </p>
      </div>
    `;
  };

  window.ProjectXViews.documentation_settings = function () {
    return `
      <div class="projectx-card">
        <span class="projectx-status">Settings</span>
        <h2>Documentation Settings</h2>
        <p>
          Future settings will control document status, versioning rules, categories,
          archival behaviour and release documentation workflows.
        </p>
      </div>
    `;
  };
})();
