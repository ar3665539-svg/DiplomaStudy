/**
 * DiplomaStudy - Main Bootstrap v8.1
 * Adds fallback for #/more if More.js fails to load
 */

console.log("[Main] v8.1 starting...");

// BOOT ERROR DISPLAY
function showBootError(stage, err) {
  var msg = (err && err.message) ? err.message : String(err);
  console.error("[Main] Error at " + stage + ":", err);

  var loader = document.querySelector(".initial-loader");
  if (loader) {
    loader.innerHTML =
      '<div style="padding:20px;font-family:monospace;font-size:12px;text-align:left;background:#FEF3C7;color:#78350F;border-radius:12px;margin:20px;max-width:100%;">' +
        '<h3 style="font-size:14px;margin:0 0 8px;color:#92400E;">Boot Error: ' + stage + '</h3>' +
        '<pre style="white-space:pre-wrap;word-break:break-word;font-size:11px;margin:0;">' + escapeText(msg) + '</pre>' +
        '<p style="font-size:11px;margin:12px 0 0;color:#92400E;">Screenshot pathan - fix dewa hobe.</p>' +
      '</div>';
  }
}

function escapeText(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// SAFE DYNAMIC IMPORT
async function safeImport(path, name) {
  try {
    var mod = await import(path);
    console.log("[Main] Loaded: " + name);
    return mod;
  } catch (err) {
    console.warn("[Main] Failed to load " + name + ":", err);
    return null;
  }
}

// BOOT
async function boot() {
  console.log("[Main] Booting...");

  // Core modules
  var AppShellMod = await safeImport("./components/AppShell.js", "AppShell");
  var routerMod = await safeImport("./core/router.js", "router");
  var storageMod = await safeImport("./core/storage.js", "storage");

  if (!AppShellMod || !routerMod) {
    showBootError("Core modules", new Error("AppShell or Router missing"));
    return;
  }

  var AppShell = AppShellMod.AppShell;
  var router = routerMod.router || routerMod.default;
  var storage = storageMod ? storageMod.storage : null;
  var STORAGE_KEYS = storageMod ? storageMod.STORAGE_KEYS : null;

  // Load pages (parallel)
  var mods = await Promise.all([
    safeImport("./pages/Onboarding.js", "Onboarding"),
    safeImport("./pages/Home.js", "Home"),
    safeImport("./pages/Departments.js", "Departments"),
    safeImport("./pages/Semesters.js", "Semesters"),
    safeImport("./pages/SemesterDetail.js", "SemesterDetail"),
    safeImport("./pages/Subjects.js", "Subjects"),
    safeImport("./pages/SubjectDetail.js", "SubjectDetail"),
    safeImport("./pages/Chapters.js", "Chapters"),
    safeImport("./pages/ContentView.js", "ContentView"),
    safeImport("./pages/PdfViewer.js", "PdfViewer"),
    safeImport("./pages/DepartmentPDF.js", "DepartmentPDF"),
    safeImport("./pages/PdfLibrary.js", "PdfLibrary"),
    safeImport("./pages/Questions.js", "Questions"),
    safeImport("./pages/Suggestions.js", "Suggestions"),
    safeImport("./pages/Formula.js", "Formula"),
    safeImport("./pages/Notices.js", "Notices"),
    safeImport("./pages/Quiz.js", "Quiz"),
    safeImport("./pages/ComingSoon.js", "ComingSoon"),
    safeImport("./pages/More.js", "More"),
    safeImport("./pages/Search.js", "Search"),
    safeImport("./pages/Settings.js", "Settings"),
    safeImport("./pages/Bookmarks.js", "Bookmarks"),
    safeImport("./pages/Progress.js", "Progress"),
    safeImport("./pages/Notes.js", "Notes"),
    safeImport("./pages/Planner.js", "Planner"),
    safeImport("./pages/Timer.js", "Timer"),
    safeImport("./pages/Tools.js", "Tools"),
    safeImport("./pages/Jobs.js", "Jobs"),
    safeImport("./pages/AiAssistant.js", "AiAssistant")
  ]);

  var OnboardingMod       = mods[0];
  var HomeMod             = mods[1];
  var DepartmentsMod      = mods[2];
  var SemestersMod        = mods[3];
  var SemesterDetailMod   = mods[4];
  var SubjectsMod         = mods[5];
  var SubjectDetailMod    = mods[6];
  var ChaptersMod         = mods[7];
  var ContentViewMod      = mods[8];
  var PdfViewerMod        = mods[9];
  var DeptPdfMod          = mods[10];
  var PdfLibraryMod       = mods[11];
  var QuestionsMod        = mods[12];
  var SuggestionsMod      = mods[13];
  var FormulaMod          = mods[14];
  var NoticesMod          = mods[15];
  var QuizMod             = mods[16];
  var ComingSoonMod       = mods[17];
  var MoreMod             = mods[18];
  var SearchMod           = mods[19];
  var SettingsMod         = mods[20];
  var BookmarksMod        = mods[21];
  var ProgressMod         = mods[22];
  var NotesMod            = mods[23];
  var PlannerMod          = mods[24];
  var TimerMod            = mods[25];
  var ToolsMod            = mods[26];
  var JobsMod             = mods[27];
  var AiMod               = mods[28];

  // Init AppShell
  try {
    AppShell.init();
    console.log("[Main] AppShell ready");
  } catch (err) {
    showBootError("AppShell.init", err);
    return;
  }

  // Route registration helper
  function reg(hash, mod, fn, title, subtitle) {
    if (!mod || typeof mod[fn] !== "function") {
      console.warn("[Main] Route " + hash + " skipped (" + fn + " missing)");
      return;
    }
    router.register(hash, {
      title: title || "",
      subtitle: subtitle || "",
      render: mod[fn]
    });
    console.log("[Main] Route " + hash + " registered");
  }

  // Register all routes
  reg("#/onboarding",    OnboardingMod,     "renderOnboarding",     "Welcome",     "");
  reg("#/home",          HomeMod,           "renderHome",           "Home",        "");
  reg("#/departments",   DepartmentsMod,    "renderDepartments",    "Departments", "Select your technology");
  reg("#/semesters",     SemestersMod,      "renderSemesters",      "Semesters",   "");
  reg("#/semester",      SemesterDetailMod, "renderSemesterDetail", "Semester",    "");
  reg("#/subjects",      SubjectsMod,       "renderSubjects",       "Subjects",    "");
  reg("#/subject",       SubjectDetailMod,  "renderSubjectDetail",  "Subject",     "");
  reg("#/chapters",      ChaptersMod,       "renderChapters",       "Chapters",    "");
  reg("#/content",       ContentViewMod,    "renderContentView",    "Content",     "");
  reg("#/pdf-viewer",    PdfViewerMod,      "renderPdfViewer",      "PDF Viewer",  "");
  reg("#/dept-pdf",      DeptPdfMod,        "renderDepartmentPDF",  "PDFs",        "");
  reg("#/pdfs",          PdfLibraryMod,     "renderPdfLibrary",     "PDF Library", "");
  reg("#/questions",     QuestionsMod,      "renderQuestions",      "Questions",   "");
  reg("#/suggestions",   SuggestionsMod,    "renderSuggestions",    "Suggestions", "");
  reg("#/formulas",      FormulaMod,        "renderFormula",        "Formulas",    "");
  reg("#/notices",       NoticesMod,        "renderNotices",        "Notices",     "");
  reg("#/quiz",          QuizMod,           "renderQuiz",           "Quiz",        "");
  reg("#/coming-soon",   ComingSoonMod,     "renderComingSoon",     "Coming Soon", "");
  reg("#/more",          MoreMod,           "renderMore",           "More",        "");
  reg("#/search",        SearchMod,         "renderSearch",         "Search",      "");
  reg("#/settings",      SettingsMod,       "renderSettings",       "Settings",    "");
  reg("#/bookmarks",     BookmarksMod,      "renderBookmarks",      "Bookmarks",   "");
  reg("#/progress",      ProgressMod,       "renderProgress",       "Progress",    "");
  reg("#/notes",         NotesMod,          "renderNotes",          "Notes",       "");
  reg("#/planner",       PlannerMod,        "renderPlanner",        "Planner",     "");
  reg("#/timer",         TimerMod,          "renderTimer",          "Timer",       "");
  reg("#/tools",         ToolsMod,          "renderTools",          "Tools",       "");
  reg("#/jobs",          JobsMod,           "renderJobs",           "Jobs",        "");
  reg("#/ai",            AiMod,             "renderAiAssistant",    "AI Tutor",    "");

  // ═══════════════════════════════════════════
  // BULLETPROOF FALLBACK for #/more
  // If More.js failed to load for any reason,
  // register a simple inline version so the More button always works.
  // ═══════════════════════════════════════════
  var _routeMap = router.routes || router.handlers || {};
  if (!_routeMap["#/more"]) {
    console.warn("[Main] More.js did not register. Using fallback.");
    router.register("#/more", {
      title: "More",
      subtitle: "",
      render: function (container) {
        var html =
          '<div style="padding:16px;">' +
          '  <div style="background:#1C3E2C;color:#fff;padding:14px;border-radius:12px;text-align:center;margin-bottom:16px;">' +
          '    <div style="font-weight:800;font-size:14px;">More (fallback)</div>' +
          '    <div style="font-size:11px;opacity:0.8;margin-top:4px;">More.js did not load. Using inline fallback.</div>' +
          '  </div>' +
          '  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">' +
          '    <a href="#/bookmarks" style="padding:14px;border-radius:12px;background:#F3F7F3;color:#1C3E2C;text-decoration:none;font-weight:700;font-size:14px;">Bookmarks</a>' +
          '    <a href="#/notes" style="padding:14px;border-radius:12px;background:#F3F7F3;color:#1C3E2C;text-decoration:none;font-weight:700;font-size:14px;">Notes</a>' +
          '    <a href="#/progress" style="padding:14px;border-radius:12px;background:#F3F7F3;color:#1C3E2C;text-decoration:none;font-weight:700;font-size:14px;">Progress</a>' +
          '    <a href="#/planner" style="padding:14px;border-radius:12px;background:#F3F7F3;color:#1C3E2C;text-decoration:none;font-weight:700;font-size:14px;">Planner</a>' +
          '    <a href="#/timer" style="padding:14px;border-radius:12px;background:#F3F7F3;color:#1C3E2C;text-decoration:none;font-weight:700;font-size:14px;">Timer</a>' +
          '    <a href="#/tools" style="padding:14px;border-radius:12px;background:#F3F7F3;color:#1C3E2C;text-decoration:none;font-weight:700;font-size:14px;">Tools</a>' +
          '    <a href="#/pdfs" style="padding:14px;border-radius:12px;background:#F3F7F3;color:#1C3E2C;text-decoration:none;font-weight:700;font-size:14px;">PDF Library</a>' +
          '    <a href="#/formulas" style="padding:14px;border-radius:12px;background:#F3F7F3;color:#1C3E2C;text-decoration:none;font-weight:700;font-size:14px;">Formulas</a>' +
          '    <a href="#/settings" style="padding:14px;border-radius:12px;background:#F3F7F3;color:#1C3E2C;text-decoration:none;font-weight:700;font-size:14px;">Settings</a>' +
          '  </div>' +
          '</div>';
        if (container && container.innerHTML !== undefined) container.innerHTML = html;
        return html;
      }
    });
    console.log("[Main] Fallback #/more registered");
  } else {
    console.log("[Main] #/more already registered (More.js loaded OK)");
  }

  // Entry point
  if (!window.location.hash) {
    var hasOnboarding = false;
    try {
      var settings = (storage && STORAGE_KEYS) ? storage.get(STORAGE_KEYS.SETTINGS, {}) : {};
      hasOnboarding = !!(settings.department && settings.semester);
    } catch (e) {}
    window.location.hash = hasOnboarding ? "#/home" : "#/onboarding";
  }

  // Init router
  try {
    router.init();
    console.log("[Main] Router initialized");
  } catch (err) {
    showBootError("router.init", err);
    return;
  }

  // Service worker
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").then(function(reg) {
      console.log("[SW] Registered:", reg.scope);
    }).catch(function(err) {
      console.warn("[SW] Registration failed:", err);
    });
  }

  // Realtime (optional)
  try {
    var realtimeMod = await safeImport("./core/realtime.js", "realtime");
    if (realtimeMod && realtimeMod.initRealtime) {
      realtimeMod.initRealtime();
      console.log("[Main] Realtime initialized");

      if (realtimeMod.onContentChange) {
        realtimeMod.onContentChange(function(event) {
          var currentHash = (window.location.hash || "#/home").split("?")[0];
          var safeRoutes = ["#/home", "#/subjects", "#/notices", "#/departments", "#/semesters"];
          if (safeRoutes.indexOf(currentHash) !== -1) {
            setTimeout(function() {
              window.dispatchEvent(new Event("hashchange"));
            }, 800);
          }
        });
      }
    }
  } catch (err) {
    console.warn("[Main] Realtime skipped:", err);
  }

  console.log("[Main] Boot complete");
}

// START
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}