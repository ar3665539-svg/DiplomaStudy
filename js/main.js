/**
 * DiplomaStudy - Main Bootstrap v5
 * Bulletproof — visible error reporting
 * Registers all pages dynamically
 */

console.log("[Main] 📥 Script started");

// ═══════════════════════════════════════════
// LOADING LOGGER
// ═══════════════════════════════════════════
const loadLog = [];

function showBootError(stage, err) {
  const msg = err?.message || String(err);
  loadLog.push(`❌ [${stage}] ${msg}`);
  console.error(`[Main] ❌ ${stage}:`, err);

  const loader = document.querySelector(".initial-loader");
  if (loader) {
    loader.innerHTML = `
      <div style="padding:20px;font-family:monospace;font-size:12px;text-align:left;background:#FEF3C7;color:#78350F;border-radius:12px;margin:20px;max-width:100%;">
        <h3 style="font-size:14px;margin:0 0 8px;color:#92400E;">⚠️ Boot Error: ${stage}</h3>
        <pre style="white-space:pre-wrap;word-break:break-word;font-size:11px;margin:0;">${escapeText(msg)}</pre>
        <div style="margin-top:12px;font-size:11px;">
          ${loadLog.map((l) => `<div>${escapeText(l)}</div>`).join("")}
        </div>
      </div>
    `;
  }
}

function escapeText(str) {
  return String(str || "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ═══════════════════════════════════════════
// SAFE DYNAMIC IMPORT
// ═══════════════════════════════════════════
async function safeImport(path, name) {
  try {
    const mod = await import(path);
    console.log(`[Main] ✅ Loaded: ${name}`);
    return mod;
  } catch (err) {
    loadLog.push(`❌ ${name}: ${err.message || err}`);
    console.error(`[Main] ❌ Failed to load ${name}:`, err);
    return null;
  }
}

// ═══════════════════════════════════════════
// BOOTSTRAP
// ═══════════════════════════════════════════
async function boot() {
  console.log("[Main] 🚀 Booting...");

  // 1. Load CORE (must have)
  const AppShellMod = await safeImport("./components/AppShell.js", "AppShell");
  const routerMod = await safeImport("./core/router.js", "router");
  const storageMod = await safeImport("./core/storage.js", "storage");

  if (!AppShellMod || !routerMod) {
    showBootError("Core modules", new Error("AppShell or Router missing"));
    return;
  }

  const { AppShell } = AppShellMod;
  const { router } = routerMod;
  const { storage, STORAGE_KEYS } = storageMod || {};

  // 2. Load all PAGE modules (each in try/catch)
  const [
    onboardingMod,
    homeMod,
    departmentsMod,
    semestersMod,
    semesterDetailMod,
    subjectsMod,
    subjectDetailMod,
    chaptersMod,
    contentViewMod,
    pdfViewerMod,
    deptPdfMod,
    pdfLibraryMod,
    questionsMod,
    suggestionsMod,
    formulaMod,
    noticesMod,
    quizMod,
    comingSoonMod,
    moreMod,
    searchMod,
    settingsMod
  ] = await Promise.all([
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
    safeImport("./pages/Settings.js", "Settings")
  ]);

  // 3. Init AppShell
  try {
    AppShell.init();
    console.log("[Main] ✅ AppShell ready");
  } catch (err) {
    showBootError("AppShell.init", err);
    return;
  }

  // 4. Register routes
  function reg(hash, mod, fn) {
    if (!mod || typeof mod[fn] !== "function") {
      console.warn(`[Main] ⚠️ Route ${hash} skipped (${fn} not found)`);
      return;
    }
    router.register(hash, mod[fn]);
    console.log(`[Main] ✅ Route ${hash} registered`);
  }

  reg("#/onboarding", onboardingMod, "renderOnboarding");
  reg("#/home", homeMod, "renderHome");
  reg("#/departments", departmentsMod, "renderDepartments");
  reg("#/semesters", semestersMod, "renderSemesters");
  reg("#/semester", semesterDetailMod, "renderSemesterDetail");
  reg("#/subjects", subjectsMod, "renderSubjects");
  reg("#/subject", subjectDetailMod, "renderSubjectDetail");
  reg("#/chapters", chaptersMod, "renderChapters");
  reg("#/content", contentViewMod, "renderContentView");
  reg("#/pdf-viewer", pdfViewerMod, "renderPdfViewer");
  reg("#/dept-pdf", deptPdfMod, "renderDepartmentPDF");
  reg("#/pdfs", pdfLibraryMod, "renderPdfLibrary");
  reg("#/questions", questionsMod, "renderQuestions");
  reg("#/suggestions", suggestionsMod, "renderSuggestions");
  reg("#/formulas", formulaMod, "renderFormula");
  reg("#/notices", noticesMod, "renderNotices");
  reg("#/quiz", quizMod, "renderQuiz");
  reg("#/coming-soon", comingSoonMod, "renderComingSoon");
  reg("#/more", moreMod, "renderMore");
  reg("#/search", searchMod, "renderSearch");
  reg("#/settings", settingsMod, "renderSettings");

  // 5. Entry point
  if (!window.location.hash) {
    let hasOnboarding = false;
    try {
      const settings = storage?.get(STORAGE_KEYS?.SETTINGS, {}) || {};
      hasOnboarding = !!(settings.department && settings.semester);
    } catch (e) {}

    window.location.hash = hasOnboarding ? "#/home" : "#/onboarding";
  }

  // 6. Init router
  try {
    router.init();
    console.log("[Main] ✅ Router initialized");
  } catch (err) {
    showBootError("router.init", err);
    return;
  }

  // 7. Service worker
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch((err) => {
      console.warn("[SW] Registration failed:", err);
    });
  }

  // 8. Realtime (optional)
  try {
    const realtimeMod = await safeImport("./core/realtime.js", "realtime");
    if (realtimeMod?.initRealtime) {
      realtimeMod.initRealtime();
      console.log("[Main] ✅ Realtime initialized");

      if (realtimeMod.onContentChange) {
        realtimeMod.onContentChange((event) => {
          const currentHash = (window.location.hash || "#/home").split("?")[0];
          const safeRoutes = ["#/home", "#/subjects", "#/notices", "#/departments", "#/semesters"];
          if (safeRoutes.includes(currentHash)) {
            setTimeout(() => window.dispatchEvent(new Event("hashchange")), 800);
          }
        });
      }
    }
  } catch (err) {
    console.warn("[Main] Realtime skipped:", err);
  }

  console.log("[Main] ✅ Boot complete");
}

// ═══════════════════════════════════════════
// START
// ═══════════════════════════════════════════
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}