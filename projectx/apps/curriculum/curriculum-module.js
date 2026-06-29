const ProjectXCurriculum = {
  data: {
    units: [],
    lessons: [],
    resources: [],
    delivery: [],
    assessments: []
  },

  loaded: false,

  async load() {
    if (this.loaded) return this.data;

    const base = "/rolandocvaldeshernandez/projectx/data";

    const [units, lessons, resources, delivery, assessments] = await Promise.all([
      fetch(`${base}/curriculum/units.json`, { cache: "no-store" }).then(r => r.json()),
      fetch(`${base}/curriculum/lessons.json`, { cache: "no-store" }).then(r => r.json()),
      fetch(`${base}/curriculum/resources.json`, { cache: "no-store" }).then(r => r.json()),
      fetch(`${base}/delivery/2025-2026.json`, { cache: "no-store" }).then(r => r.json()),
      fetch(`${base}/assessment/2025-2026.json`, { cache: "no-store" }).then(r => r.json())
    ]);

    this.data.units = units.units || [];
    this.data.lessons = lessons.lessons || [];
    this.data.resources = resources.resources || [];
    this.data.delivery = delivery.delivery || [];
    this.data.assessments = assessments.assessments || [];

    this.loaded = true;
    return this.data;
  },

  escape(value) {
    return String(value || "").replace(/[&<>"']/g, function(char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      }[char];
    });
  },

  yearOptions() {
    const years = [...new Set(this.data.units.map(unit => unit.yearGroup))].sort((a, b) => {
      return Number(a.replace("Y", "")) - Number(b.replace("Y", ""));
    });

    return `<option value="">All years</option>` + years.map(year =>
      `<option value="${this.escape(year)}">${this.escape(year)}</option>`
    ).join("");
  },

  unitTitle(unitId) {
    const unit = this.data.units.find(item => item.id === unitId);
    return unit ? unit.title : "Unknown unit";
  },

  kpis() {
    const units = this.data.units.length;
    const lessons = this.data.lessons.length;
    const resources = this.data.resources.length;
    const completed = this.data.delivery.filter(item => item.completed).length;
    const deliveryTotal = this.data.delivery.length;
    const coverage = deliveryTotal ? Math.round((completed / deliveryTotal) * 100) : 0;

    return `
      <section class="curriculum-kpis">
        <div class="curriculum-kpi"><span>Reusable Units</span><strong>${units}</strong></div>
        <div class="curriculum-kpi"><span>Reusable Lessons</span><strong>${lessons}</strong></div>
        <div class="curriculum-kpi"><span>Resources</span><strong>${resources}</strong></div>
        <div class="curriculum-kpi"><span>2025–26 Coverage</span><strong>${coverage}%</strong></div>
      </section>
    `;
  },

  dashboardTemplate() {
    const unitsByYear = this.data.units.reduce((acc, unit) => {
      acc[unit.yearGroup] = (acc[unit.yearGroup] || 0) + 1;
      return acc;
    }, {});

    const lessonsByYear = this.data.lessons.reduce((acc, lesson) => {
      acc[lesson.yearGroup] = (acc[lesson.yearGroup] || 0) + 1;
      return acc;
    }, {});

    const years = Object.keys({ ...unitsByYear, ...lessonsByYear }).sort((a, b) =>
      Number(a.replace("Y", "")) - Number(b.replace("Y", ""))
    );

    return `
      ${this.kpis()}

      <div class="curriculum-panel-grid">
        <div class="projectx-card">
          <span class="projectx-status">Reusable Curriculum</span>
          <h3>Curriculum by Year Group</h3>
          <table class="curriculum-table">
            <thead>
              <tr><th>Year</th><th>Units</th><th>Lessons</th></tr>
            </thead>
            <tbody>
              ${years.map(year => `
                <tr>
                  <td><strong>${this.escape(year)}</strong></td>
                  <td>${unitsByYear[year] || 0}</td>
                  <td>${lessonsByYear[year] || 0}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>

        <div class="projectx-card">
          <span class="projectx-status">2025–2026 Delivery Layer</span>
          <h3>Reuse Model</h3>
          <p>
            Units and lessons are stored as reusable curriculum assets. Dates, completion status,
            assessments and marks sit in separate academic-year files. This means the same curriculum
            can be copied into 2026–2027 without overwriting the 2025–2026 teaching record.
          </p>
          <p>
            Current delivery records: <strong>${this.data.delivery.length}</strong><br>
            Assessment records: <strong>${this.data.assessments.length}</strong>
          </p>
        </div>
      </div>
    `;
  },

  unitsTemplate() {
    return `
      ${this.kpis()}
      <div class="projectx-card">
        <div class="curriculum-toolbar">
          <input id="unitSearch" class="curriculum-input" type="search" placeholder="Search units..." />
          <select id="unitYearFilter" class="curriculum-select">${this.yearOptions()}</select>
        </div>
        <div id="unitsTable"></div>
      </div>
    `;
  },

  renderUnitsTable(filter = "", year = "") {
    const target = document.getElementById("unitsTable");
    if (!target) return;

    const q = filter.toLowerCase().trim();

    const rows = this.data.units
      .filter(unit => !year || unit.yearGroup === year)
      .filter(unit =>
        unit.title.toLowerCase().includes(q) ||
        unit.yearGroup.toLowerCase().includes(q) ||
        unit.keyStage.toLowerCase().includes(q)
      )
      .sort((a, b) => {
        const yearA = Number(a.yearGroup.replace("Y", ""));
        const yearB = Number(b.yearGroup.replace("Y", ""));
        if (yearA !== yearB) return yearA - yearB;
        return a.title.localeCompare(b.title);
      });

    if (!rows.length) {
      target.innerHTML = `<div class="curriculum-empty">No units found.</div>`;
      return;
    }

    target.innerHTML = `
      <table class="curriculum-table">
        <thead>
          <tr>
            <th>Unit</th>
            <th>Year</th>
            <th>Key Stage</th>
            <th>Lessons</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map(unit => {
            const lessonCount = this.data.lessons.filter(lesson => lesson.unitId === unit.id).length;
            return `
              <tr>
                <td><strong>${this.escape(unit.title)}</strong><br><small>${this.escape(unit.id)}</small></td>
                <td>${this.escape(unit.yearGroup)}</td>
                <td>${this.escape(unit.keyStage)}</td>
                <td>${lessonCount}</td>
                <td><span class="curriculum-status">${this.escape(unit.status)}</span></td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    `;
  },

  lessonsTemplate() {
    return `
      ${this.kpis()}
      <div class="projectx-card">
        <div class="curriculum-toolbar">
          <input id="lessonSearch" class="curriculum-input" type="search" placeholder="Search lessons..." />
          <select id="lessonYearFilter" class="curriculum-select">${this.yearOptions()}</select>
        </div>
        <div id="lessonsTable"></div>
      </div>
    `;
  },

  renderLessonsTable(filter = "", year = "") {
    const target = document.getElementById("lessonsTable");
    if (!target) return;

    const q = filter.toLowerCase().trim();

    const rows = this.data.lessons
      .filter(lesson => !year || lesson.yearGroup === year)
      .filter(lesson =>
        lesson.title.toLowerCase().includes(q) ||
        this.unitTitle(lesson.unitId).toLowerCase().includes(q) ||
        lesson.yearGroup.toLowerCase().includes(q)
      )
      .sort((a, b) => {
        const yearA = Number(a.yearGroup.replace("Y", ""));
        const yearB = Number(b.yearGroup.replace("Y", ""));
        if (yearA !== yearB) return yearA - yearB;
        if (a.unitId !== b.unitId) return a.unitId.localeCompare(b.unitId);
        return a.sequence - b.sequence;
      })
      .slice(0, 120);

    if (!rows.length) {
      target.innerHTML = `<div class="curriculum-empty">No lessons found.</div>`;
      return;
    }

    target.innerHTML = `
      <table class="curriculum-table">
        <thead>
          <tr>
            <th>Lesson</th>
            <th>Unit</th>
            <th>Year</th>
            <th>Type</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map(lesson => `
            <tr>
              <td><strong>${this.escape(lesson.title)}</strong><br><small>Sequence ${lesson.sequence}</small></td>
              <td>${this.escape(this.unitTitle(lesson.unitId))}</td>
              <td>${this.escape(lesson.yearGroup)}</td>
              <td>${this.escape(lesson.type)}</td>
              <td><span class="curriculum-status">${this.escape(lesson.status)}</span></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
      <p style="color: var(--px-muted); margin-top: 12px;">Showing up to 120 lessons. Use search or year filtering to narrow results.</p>
    `;
  },

  resourcesTemplate() {
    if (!this.data.resources.length) {
      return `
        ${this.kpis()}
        <div class="curriculum-empty">
          No web resources were found in the extracted lesson tracker.
        </div>
      `;
    }

    return `
      ${this.kpis()}
      <div class="projectx-card">
        <h3>Resource Library</h3>
        <table class="curriculum-table">
          <thead>
            <tr><th>Resource</th><th>Year</th><th>Unit</th><th>Link</th></tr>
          </thead>
          <tbody>
            ${this.data.resources.map(resource => `
              <tr>
                <td>${this.escape(resource.title)}</td>
                <td>${this.escape(resource.yearGroup)}</td>
                <td>${this.escape(this.unitTitle(resource.unitId))}</td>
                <td><a href="${this.escape(resource.url)}" target="_blank" rel="noopener">Open</a></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
  },

  placeholderTemplate(title, description) {
    return `
      ${this.kpis()}
      <div class="projectx-card">
        <span class="projectx-status">Curriculum Centre</span>
        <h3>${this.escape(title)}</h3>
        <p>${this.escape(description)}</p>
        <p>
          This view will use the same reusable curriculum data layer. The 2025–2026 delivery records
          have already been separated from the unit and lesson definitions.
        </p>
      </div>
    `;
  },

  bindUnitsEvents() {
    const search = document.getElementById("unitSearch");
    const year = document.getElementById("unitYearFilter");
    const refresh = () => this.renderUnitsTable(search.value, year.value);
    if (search) search.addEventListener("input", refresh);
    if (year) year.addEventListener("change", refresh);
    refresh();
  },

  bindLessonsEvents() {
    const search = document.getElementById("lessonSearch");
    const year = document.getElementById("lessonYearFilter");
    const refresh = () => this.renderLessonsTable(search.value, year.value);
    if (search) search.addEventListener("input", refresh);
    if (year) year.addEventListener("change", refresh);
    refresh();
  }
};

window.ProjectXViews = window.ProjectXViews || {};

window.ProjectXViews.curriculum_dashboard = function() {
  ProjectXCurriculum.load().then(() => {
    const workspace = document.getElementById("moduleWorkspace");
    if (workspace) workspace.innerHTML = ProjectXCurriculum.dashboardTemplate();
  });

  return `<div class="curriculum-empty">Loading curriculum database...</div>`;
};

window.ProjectXViews.curriculum_units = function() {
  ProjectXCurriculum.load().then(() => {
    const workspace = document.getElementById("moduleWorkspace");
    if (workspace) {
      workspace.innerHTML = ProjectXCurriculum.unitsTemplate();
      ProjectXCurriculum.bindUnitsEvents();
    }
  });

  return `<div class="curriculum-empty">Loading units...</div>`;
};

window.ProjectXViews.curriculum_lessons = function() {
  ProjectXCurriculum.load().then(() => {
    const workspace = document.getElementById("moduleWorkspace");
    if (workspace) {
      workspace.innerHTML = ProjectXCurriculum.lessonsTemplate();
      ProjectXCurriculum.bindLessonsEvents();
    }
  });

  return `<div class="curriculum-empty">Loading lessons...</div>`;
};

window.ProjectXViews.curriculum_resources = function() {
  ProjectXCurriculum.load().then(() => {
    const workspace = document.getElementById("moduleWorkspace");
    if (workspace) workspace.innerHTML = ProjectXCurriculum.resourcesTemplate();
  });

  return `<div class="curriculum-empty">Loading resources...</div>`;
};

window.ProjectXViews.curriculum_schemes = function() {
  return ProjectXCurriculum.placeholderTemplate(
    "Schemes of Work",
    "This view will group reusable units and lessons into year-specific schemes of work."
  );
};

window.ProjectXViews.curriculum_planner = function() {
  return ProjectXCurriculum.placeholderTemplate(
    "Planner",
    "This view will create future yearly delivery plans from the reusable curriculum database."
  );
};

window.ProjectXViews.curriculum_settings = function() {
  return ProjectXCurriculum.placeholderTemplate(
    "Settings",
    "This view will manage curriculum configuration, academic-year copies and import/export options."
  );
};
