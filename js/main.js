/**
 * DiplomaStudy - Main Bootstrap
 */

import { AppShell } from "./components/AppShell.js";
import { router } from "./core/router.js";

// Import Pages
import { renderHome } from "./pages/Home.js";
import { renderSubjects } from "./pages/Subjects.js";
import { renderSubjectDetail } from "./pages/SubjectDetail.js";
import { renderDepartmentPDF } from "./pages/DepartmentPDF.js";
import { renderComingSoon } from "./pages/ComingSoon.js";
import { renderMore } from "./pages/More.js";

// Service Worker
function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch((err) => {
      console.warn("[SW] Registration failed:", err);
    });
  }
}

// Bootstrap
document.addEventListener("DOMContentLoaded", () => {
  // 1. Init AppShell
  AppShell.init();

  // 2. Register Routes
  router.register("#/home", renderHome);
  router.register("#/subjects", renderSubjects);
  router.register("#/subject", renderSubjectDetail);
  router.register("#/dept-pdf", renderDepartmentPDF);
  router.register("#/coming-soon", renderComingSoon);
  router.register("#/more", renderMore);

  // 3. Init Router
  router.init();

  // 4. Register SW
  registerServiceWorker();
});