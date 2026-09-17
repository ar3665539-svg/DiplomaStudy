/**
 * DiplomaStudy - Main Bootstrap
 */

import { AppShell } from "./components/AppShell.js";
import { router } from "./core/router.js";

// Import Pages
import { renderOnboarding } from "./pages/Onboarding.js";
import { renderHome } from "./pages/Home.js";
import { renderSubjects } from "./pages/Subjects.js";
import { renderSubjectDetail } from "./pages/SubjectDetail.js";
import { renderContentView } from "./pages/ContentView.js";
import { renderDepartmentPDF } from "./pages/DepartmentPDF.js";
import { renderComingSoon } from "./pages/ComingSoon.js";
import { renderMore } from "./pages/More.js";
import { storage, STORAGE_KEYS } from "./core/storage.js";

// Service Worker
function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch((err) => {
      console.warn("[SW] Registration failed:", err);
    });
  }
}

// Check if user has already selected dept+semester
function hasCompletedOnboarding() {
  const settings = storage.get(STORAGE_KEYS.SETTINGS, {});
  return !!(settings.department && settings.semester);
}

// Bootstrap
document.addEventListener("DOMContentLoaded", () => {
  // 1. Init AppShell
  AppShell.init();

  // 2. Register Routes
  router.register("#/onboarding", renderOnboarding);
  router.register("#/home", renderHome);
  router.register("#/subjects", renderSubjects);
  router.register("#/subject", renderSubjectDetail);
  router.register("#/content", renderContentView);
  router.register("#/dept-pdf", renderDepartmentPDF);
  router.register("#/coming-soon", renderComingSoon);
  router.register("#/more", renderMore);

  // 3. If no hash and not onboarded → go to onboarding
  if (!window.location.hash) {
    if (hasCompletedOnboarding()) {
      window.location.hash = "#/home";
    } else {
      window.location.hash = "#/onboarding";
    }
  }

  // 4. Init Router
  router.init();

  // 5. Register SW
  registerServiceWorker();
});