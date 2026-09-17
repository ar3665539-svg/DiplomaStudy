/**
 * DiplomaStudy - Main Bootstrap
 * User App (Civil 1st Semester)
 */

import { AppShell } from "./components/AppShell.js";
import { router } from "./core/router.js";

// ═══════════════════════════════════════════
// Import Pages
// ═══════════════════════════════════════════
import { renderOnboarding } from "./pages/Onboarding.js";
import { renderHome } from "./pages/Home.js";
import { renderSubjects } from "./pages/Subjects.js";
import { renderSubjectDetail } from "./pages/SubjectDetail.js";
import { renderContentView } from "./pages/ContentView.js";
import { renderPdfViewer } from "./pages/PdfViewer.js";
import { renderDepartmentPDF } from "./pages/DepartmentPDF.js";
import { renderComingSoon } from "./pages/ComingSoon.js";
import { renderMore } from "./pages/More.js";

import { storage, STORAGE_KEYS } from "./core/storage.js";

// ═══════════════════════════════════════════
// Service Worker Registration
// ═══════════════════════════════════════════
function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch((err) => {
      console.warn("[SW] Registration failed:", err);
    });
  }
}

// ═══════════════════════════════════════════
// Check Onboarding Status
// ═══════════════════════════════════════════
function hasCompletedOnboarding() {
  const settings = storage.get(STORAGE_KEYS.SETTINGS, {});
  return !!(settings.department && settings.semester);
}

// ═══════════════════════════════════════════
// Bootstrap
// ═══════════════════════════════════════════
document.addEventListener("DOMContentLoaded", () => {
  // 1. Init AppShell (mounts HTML frame)
  AppShell.init();

  // 2. Register Routes
  router.register("#/onboarding", renderOnboarding);
  router.register("#/home", renderHome);
  router.register("#/subjects", renderSubjects);
  router.register("#/subject", renderSubjectDetail);
  router.register("#/content", renderContentView);
  router.register("#/pdf-viewer", renderPdfViewer);
  router.register("#/dept-pdf", renderDepartmentPDF);
  router.register("#/coming-soon", renderComingSoon);
  router.register("#/more", renderMore);

  // 3. Entry point logic
  // If no hash: check onboarding → home or onboarding
  if (!window.location.hash) {
    if (hasCompletedOnboarding()) {
      window.location.hash = "#/home";
    } else {
      window.location.hash = "#/onboarding";
    }
  }

  // 4. Init Router (fires first route)
  router.init();

  // 5. Register Service Worker
  registerServiceWorker();
});