/**
 * DiplomaStudy - Main Application Bootstrap
 * Mobile-First PWA for Diploma-in-Engineering students in Bangladesh
 */

import { AppShell } from "./components/AppShell.js";
import { router } from "./core/router.js";

// Import Views
import { renderHome } from "./pages/Home.js";
import { renderDepartments } from "./pages/Departments.js";
import { renderSemesters } from "./pages/Semesters.js";
import { renderSubjects } from "./pages/Subjects.js";
import { renderChapters } from "./pages/Chapters.js";
import { renderQuestions } from "./pages/Questions.js";
import { renderSuggestions } from "./pages/Suggestions.js";
import { renderPdfLibrary } from "./pages/PdfLibrary.js";
import { renderQuiz } from "./pages/Quiz.js";
import { renderNotes } from "./pages/Notes.js";
import { renderBookmarks } from "./pages/Bookmarks.js";
import { renderPlanner } from "./pages/Planner.js";
import { renderTimer } from "./pages/Timer.js";
import { renderProgress } from "./pages/Progress.js";
import { renderFormula } from "./pages/Formula.js";
import { renderTools } from "./pages/Tools.js";
import { renderJobs } from "./pages/Jobs.js";
import { renderNotices } from "./pages/Notices.js";
import { renderAiAssistant } from "./pages/AiAssistant.js";
import { renderSettings } from "./pages/Settings.js";
import { renderMore } from "./pages/More.js";

// Initialize PWA Service Worker
function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("[PWA] Service Worker registered with scope:", reg.scope);
          reg.onupdatefound = () => {
            const installing = reg.installing;
            if (installing) {
              installing.onstatechange = () => {
                if (installing.state === "installed" && navigator.serviceWorker.controller) {
                  console.log("[PWA] New content available; please refresh.");
                }
              };
            }
          };
        })
        .catch((err) => {
          console.warn("[PWA] Service Worker registration failed:", err);
        });
    });
  }
}

// Global PWA Install Prompt handling
window.deferredPWAInstallPrompt = null;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  window.deferredPWAInstallPrompt = e;
  console.log("[PWA] beforeinstallprompt captured");
});

window.addEventListener("appinstalled", () => {
  window.deferredPWAInstallPrompt = null;
  console.log("[PWA] DiplomaStudy installed successfully");
});

// Bootstrapping
document.addEventListener("DOMContentLoaded", () => {
  // 1. Mount Master Application Shell
  AppShell.init();

  // 2. Register Routes
  router.register("#/home", renderHome);
  router.register("#/departments", renderDepartments);
  router.register("#/semesters", renderSemesters);
  router.register("#/subjects", renderSubjects);
  router.register("#/chapters", renderChapters);
  router.register("#/questions", renderQuestions);
  router.register("#/suggestions", renderSuggestions);
  router.register("#/pdfs", renderPdfLibrary);
  router.register("#/quiz", renderQuiz);
  router.register("#/notes", renderNotes);
  router.register("#/bookmarks", renderBookmarks);
  router.register("#/planner", renderPlanner);
  router.register("#/timer", renderTimer);
  router.register("#/progress", renderProgress);
  router.register("#/formula", renderFormula);
  router.register("#/tools", renderTools);
  router.register("#/jobs", renderJobs);
  router.register("#/notices", renderNotices);
  router.register("#/ai", renderAiAssistant);
  router.register("#/settings", renderSettings);
  router.register("#/more", renderMore);

  // 3. Initialize Router
  router.init();

  // 4. Register SW
  registerServiceWorker();
});
