const ProjectXCurriculumService = (() => {
  const dataBaseUrl = "/rolandocvaldeshernandez/projectx/data";
  const storageKey = "projectx.curriculum.unified.v1";
  const legacyStorageKey = "projectx.curriculum.data.v1";
  const repositoryVersion = "ADR-0005-unified-curriculum-repository";
  let state = null;

  async function fetchJson(path) {
    const response = await fetch(`${dataBaseUrl}/${path}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`Curriculum data request failed: ${path} (${response.status})`);
    return response.json();
  }

  function normaliseRepository(raw) {
    const units = (raw.units?.units || raw.units || []).map(unit => ({
      ...unit,
      status: unit.status || "Imported",
      subject: unit.subject || "Computer Science",
      examBoard: unit.examBoard || unit.programme || "Internal",
      notes: unit.notes || "Reusable curriculum unit imported from the Lesson Tracker.",
      lessonCount: 0
    }));

    const lessons = (raw.lessons?.lessons || raw.lessons || []).map(lesson => ({
      ...lesson,
      lessonNumber: Number(lesson.lessonNumber || lesson.sequence || 0),
      duration: lesson.duration || 45,
      status: lesson.status || "Imported",
      type: lesson.type || "lesson",
      objectives: lesson.objectives || [],
      vocabulary: lesson.vocabulary || [],
      misconceptions: lesson.misconceptions || [],
      reusable: lesson.reusable !== false
    }));

    const resources = (raw.resources?.resources || raw.resources || []).map(resource => ({
      ...resource,
      type: resource.type || "Resource",
      notes: resource.notes || "Imported teaching asset."
    }));

    const delivery = raw.delivery?.delivery || raw.delivery || [];
    const assessments = raw.assessments?.assessments || raw.assessments || [];

    const lessonCounts = lessons.reduce((acc, lesson) => {
      acc[lesson.unitId] = (acc[lesson.unitId] || 0) + 1;
      return acc;
    }, {});

    units.forEach(unit => {
      unit.lessonCount = lessonCounts[unit.id] || 0;
    });

    return {
      meta: {
        repositoryVersion,
        source: "Unified Curriculum Repository",
        philosophy: "One lesson object. One storage location. Multiple views.",
        academicYear: raw.delivery?.metadata?.academicYear || "2025-2026",
        generatedFrom: "Lesson Tracker 2025-2026 import"
      },
      units,
      lessons,
      resources,
      delivery,
      assessments
    };
  }

  async function initialise() {
    const saved = localStorage.getItem(storageKey);

    if (saved) {
      try {
        state = JSON.parse(saved);
        if (state?.meta?.repositoryVersion === repositoryVersion) return state;
      } catch (error) {
        console.warn("Project X Curriculum: saved data could not be parsed. Loading repository files.", error);
      }
    }

    const [units, lessons, resources, delivery, assessments] = await Promise.all([
      fetchJson("curriculum/units.json"),
      fetchJson("curriculum/lessons.json"),
      fetchJson("curriculum/resources.json"),
      fetchJson("delivery/2025-2026.json"),
      fetchJson("assessment/2025-2026.json")
    ]);

    state = normaliseRepository({ units, lessons, resources, delivery, assessments });
    localStorage.removeItem(legacyStorageKey);
    save();
    return state;
  }

  function getState() {
    return state;
  }

  function save() {
    if (!state) return;
    localStorage.setItem(storageKey, JSON.stringify(state));
  }

  function reset() {
    localStorage.removeItem(storageKey);
    localStorage.removeItem(legacyStorageKey);
    window.location.reload();
  }

  function slug(value) {
    return String(value || "item")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  function getUnits() {
    return state?.units || [];
  }

  function getLessons() {
    return state?.lessons || [];
  }

  function getResources() {
    return state?.resources || [];
  }

  function getDelivery() {
    return state?.delivery || [];
  }

  function getAssessments() {
    return state?.assessments || [];
  }

  function getSettings() {
    return state?.settings || {};
  }

  function addUnit(formData) {
    const title = formData.get("title");
    const unit = {
      id: `unit-${slug(formData.get("yearGroup"))}-${slug(title)}-${Date.now()}`,
      yearGroup: formData.get("yearGroup") || "Unassigned",
      keyStage: formData.get("keyStage") || "",
      title: title || "Untitled Unit",
      strand: formData.get("strand") || "",
      status: formData.get("status") || "Draft",
      lessons: Number(formData.get("lessons") || 0),
      intent: formData.get("intent") || "",
      coverage: String(formData.get("coverage") || "")
        .split(",")
        .map(item => item.trim())
        .filter(Boolean)
    };

    state.units.unshift(unit);
    save();
    return unit;
  }

  function addLesson(formData) {
    const title = formData.get("title");
    const lesson = {
      id: `lesson-${slug(formData.get("yearGroup"))}-${slug(title)}-${Date.now()}`,
      unitId: formData.get("unitId") || "",
      title: title || "Untitled Lesson",
      yearGroup: formData.get("yearGroup") || "Unassigned",
      duration: Number(formData.get("duration") || 45),
      status: formData.get("status") || "Draft",
      objective: formData.get("objective") || "",
      resources: String(formData.get("resources") || "")
        .split(",")
        .map(item => item.trim())
        .filter(Boolean)
    };

    state.lessons.unshift(lesson);
    save();
    return lesson;
  }

  function updateSettings(formData) {
    state.settings = {
      school: formData.get("school") || "",
      subject: formData.get("subject") || "",
      defaultExamBoard: formData.get("defaultExamBoard") || "",
      academicYear: formData.get("academicYear") || ""
    };
    save();
    return state.settings;
  }

  return {
    initialise,
    getState,
    getUnits,
    getLessons,
    getResources,
    getDelivery,
    getAssessments,
    getSettings,
    addUnit,
    addLesson,
    updateSettings,
    reset
  };
})();

window.ProjectXCurriculumService = ProjectXCurriculumService;
