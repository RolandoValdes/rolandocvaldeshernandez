function getCurrentAppKey() {
  const path = window.location.pathname;

  if (path.includes("/apps/curriculum/")) return "curriculum";
  if (path.includes("/apps/assessment/")) return "assessment";
  if (path.includes("/apps/revision/")) return "revision";
  if (path.includes("/apps/question-banks/")) return "question-banks";
  if (path.includes("/apps/tools/")) return "tools";
  if (path.includes("/apps/ai-lab/")) return "ai-lab";
  if (path.includes("/apps/analytics/")) return "analytics";
  if (path.includes("/apps/admin/")) return "admin";

  return "dashboard";
}

function initialiseNavigation() {
  const currentApp = getCurrentAppKey();
  const links = document.querySelectorAll("#projectxNav a");

  links.forEach(link => {
    if (link.dataset.app === currentApp) {
      link.classList.add("active");
    }
  });
}