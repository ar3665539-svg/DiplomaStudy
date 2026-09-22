/**
 * Subjects v2 - Dual theme (Day: Fresh Sky, Dark: Deep Cosmos)
 */

import { AppShell } from "../components/AppShell.js";
import { storage, STORAGE_KEYS } from "../core/storage.js";
import { getSubjects, getDepartments, getSemestersByDepartment } from "../services/api.js";
import { listSkeleton } from "../utils/skeleton.js";
import { errorState, emptyState } from "../utils/errorState.js";
import { attachPullToRefresh } from "../utils/pullToRefresh.js";
import { Toast } from "../components/Toast.js";

let currentCleanup = null;

// ═══════════════════════════════════════════
// THEME VARIABLES
// ☀️ Day = Fresh Sky    🌙 Dark = Deep Cosmos
// ═══════════════════════════════════════════
function injectStudyTheme() {
  if (document.getElementById("ds-study-theme-v2")) return;
  var st = document.createElement("style");
  st.id = "ds-study-theme-v2";
  st.textContent = [
    // ☀️ LIGHT — Fresh Sky
    ":root, html:not([data-theme='dark']) {",
    "  --sp-bg: #F0F7FA;",
    "  --sp-surface: #FFFFFF;",
    "  --sp-surface-soft: #E8F4F9;",
    "  --sp-border: #DCEAF2;",
    "  --sp-text: #0C2A3D;",
    "  --sp-text-muted: #527A94;",
    "  --sp-text-dim: #8DA9BC;",
    "  --sp-accent: #0EA5E9;",
    "  --sp-accent-soft: #E0F2FE;",
    "  --sp-accent-glow: rgba(14, 165, 233, 0.25);",
    "  --sp-icon-bg-1: #E0F2FE; --sp-icon-fg-1: #0369A1;",
    "  --sp-icon-bg-2: #DBEAFE; --sp-icon-fg-2: #1D4ED8;",
    "  --sp-icon-bg-3: #CFFAFE; --sp-icon-fg-3: #0E7490;",
    "  --sp-code-bg: #E0F2FE; --sp-code-fg: #0369A1;",
    "  --sp-type-bg: #DBEAFE; --sp-type-fg: #1E40AF;",
    "  --sp-credit-bg: #FEF3C7; --sp-credit-fg: #92400E;",
    "  --sp-shimmer-1: #E8F4F9;",
    "  --sp-shimmer-2: #DCEAF2;",
    "  --sp-header-bg: #F0F7FA;",
    "}",

    // 🌙 DARK — Deep Cosmos
    "[data-theme='dark'] {",
    "  --sp-bg: #0A0E1F;",
    "  --sp-surface: #121831;",
    "  --sp-surface-soft: #1A2140;",
    "  --sp-border: #1F2747;",
    "  --sp-text: #E0E7FF;",
    "  --sp-text-muted: #A5B4FC;",
    "  --sp-text-dim: #7C8AC4;",
    "  --sp-accent: #818CF8;",
    "  --sp-accent-soft: #1E1B4B;",
    "  --sp-accent-glow: rgba(129, 140, 248, 0.4);",
    "  --sp-icon-bg-1: #1E1B4B; --sp-icon-fg-1: #A5B4FC;",
    "  --sp-icon-bg-2: #172554; --sp-icon-fg-2: #93C5FD;",
    "  --sp-icon-bg-3: #164E63; --sp-icon-fg-3: #67E8F9;",
    "  --sp-code-bg: #1E1B4B; --sp-code-fg: #C7D2FE;",
    "  --sp-type-bg: #1E3A5F; --sp-type-fg: #BFDBFE;",
    "  --sp-credit-bg: #422006; --sp-credit-fg: #FCD34D;",
    "  --sp-shimmer-1: #1A2140;",
    "  --sp-shimmer-2: #121831;",
    "  --sp-header-bg: #0A0E1F;",
    "}",

    // Header match when on study route
    "body.ds-route-study #header-mount {",
    "  background: var(--sp-bg) !important;",
    "  transition: background 0.25s ease;",
    "}",
    "body.ds-route-study #header-mount .app-header {",
    "  border-bottom: 1px solid var(--sp-border) !important;",
    "}"
  ].join("\n");
  document.head.appendChild(st);
}

export async function renderSubjects() {
  injectStudyTheme();
  try { document.body.classList.add("ds-route-study"); } catch (e) {}

  if (currentCleanup) { try { currentCleanup(); } catch(e){} currentCleanup = null; }

  const MY_HASH = "#/subjects";

  AppShell.updateHeader({
    title: "Subjects",
    subtitle: "Loading...",
    showBack: true,
    showSearch: false,
    showTheme: true,
    showSettings: false,
    expectedHash: MY_HASH
  });

  const main = AppShell.getMainView();
  if (!main) return;

  main.innerHTML = listSkeleton(6, "96px");

  let subjects = [], departments = [], semester = null;
  let loadError = null;

  try {
    const settings = storage.get(STORAGE_KEYS.SETTINGS, {});
    const deptId = settings.departmentId || settings.department || "";

    [subjects, departments] = await Promise.all([
      getSubjects().catch((e) => { loadError = e; return []; }),
      getDepartments().catch(() => [])
    ]);

    if (deptId) {
      const sems = await getSemestersByDepartment(deptId).catch(() => []);
      const semId = settings.semesterId || settings.semester;
      semester = sems.find((s) => s.id === semId);
    }
  } catch (err) {
    loadError = err;
  }

  // Guard
  if ((window.location.hash || "").split("?")[0] !== MY_HASH) {
    try { document.body.classList.remove("ds-route-study"); } catch (e) {}
    return;
  }

  if (subjects.length === 0 && loadError) {
    main.innerHTML = errorState({
      type: "server",
      message: loadError.message,
      retryFn: () => renderSubjects()
    });
    return;
  }

  const settings = storage.get(STORAGE_KEYS.SETTINGS, {});
  const currentDept = departments.find((d) => d.id === (settings.departmentId || settings.department));

  AppShell.updateHeader({
    title: "Subjects",
    subtitle: currentDept ? `${currentDept.name}${semester ? " \u2022 " + semester.name : ""}` : "",
    showBack: true,
    showSearch: false,
    showTheme: true,
    showSettings: false,
    expectedHash: MY_HASH
  });

  if (subjects.length === 0) {
    main.innerHTML = emptyState({
      icon: "\uD83D\uDCDA",
      title: "\u0995\u09CB\u09A8\u09CB Subject \u09A8\u09C7\u0987",
      message: "\u098F\u0987 semester-\u098F \u098F\u0996\u09A8\u09CB \u0995\u09CB\u09A8\u09CB subject \u09AF\u09CB\u0997 \u0995\u09B0\u09BE \u09B9\u09AF\u09BC\u09A8\u09BF\u0964",
      actionFn: () => window.location.hash = "#/home",
      actionLabel: "\uD83C\uDFE0 Home"
    });
    return;
  }

  main.innerHTML = `
    <div style="
      padding:14px 16px;
      background:linear-gradient(135deg, var(--sp-accent-soft), transparent);
      border-left:4px solid var(--sp-accent);
      border-radius:12px;
      margin-bottom:16px;
      font-size:12.5px;
      color:var(--sp-text-muted);
      line-height:1.55;
      font-weight:600;
    ">
      \u09A8\u09BF\u099A\u09C7\u09B0 \u09AF\u09C7\u0995\u09CB\u09A8\u09CB \u09AC\u09BF\u09B7\u09AF\u09BC\u09C7 \u099F\u09CD\u09AF\u09BE\u09AA \u0995\u09B0\u09C1\u09A8\u0964 \u09AA\u09CD\u09B0\u09A4\u09BF\u099F\u09BF \u09AC\u09BF\u09B7\u09AF\u09BC\u09C7\u09B0 chapter \u0993 content server \u09A5\u09C7\u0995\u09C7 load \u09B9\u09AC\u09C7\u0964
    </div>

    <div style="display:flex;flex-direction:column;gap:10px;">
      ${subjects.map((sub, idx) => `
        <button class="subject-row" data-subject-id="${sub.id}" style="
          display:flex;align-items:center;gap:12px;
          padding:14px;background:var(--sp-surface);
          border:1.5px solid var(--sp-border);border-radius:16px;
          cursor:pointer;font-family:inherit;text-align:left;width:100%;
          box-shadow:0 2px 8px rgba(0,0,0,0.06);
          transition:all 0.18s ease;
          -webkit-tap-highlight-color:transparent;
        ">
          <div style="font-size:10px;font-weight:800;color:var(--sp-text-dim);font-family:ui-monospace,monospace;width:24px;text-align:center;flex-shrink:0;">
            ${String(idx + 1).padStart(2, "0")}
          </div>
          <div style="width:46px;height:46px;border-radius:13px;background:var(--sp-icon-bg-1);color:var(--sp-icon-fg-1);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;">
            ${sub.icon || "\uD83D\uDCD8"}
          </div>
          <div style="flex:1;min-width:0;">
            <div style="font-size:13.5px;font-weight:800;color:var(--sp-text);margin-bottom:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
              ${escapeHtml(sub.name)}
            </div>
            ${sub.banglaName ? `<div style="font-size:11px;color:var(--sp-text-muted);font-weight:600;margin-bottom:5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(sub.banglaName)}</div>` : ""}
            <div style="display:flex;gap:4px;flex-wrap:wrap;">
              ${sub.code ? `<span style="font-size:9px;font-weight:800;color:var(--sp-code-fg);background:var(--sp-code-bg);padding:2px 7px;border-radius:5px;text-transform:uppercase;">${escapeHtml(sub.code)}</span>` : ""}
              ${sub.type ? `<span style="font-size:9px;font-weight:800;color:var(--sp-type-fg);background:var(--sp-type-bg);padding:2px 7px;border-radius:5px;text-transform:uppercase;">${escapeHtml(sub.type)}</span>` : ""}
              ${sub.credits ? `<span style="font-size:9px;font-weight:800;color:var(--sp-credit-fg);background:var(--sp-credit-bg);padding:2px 7px;border-radius:5px;">${sub.credits} CR</span>` : ""}
            </div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--sp-text-dim)" stroke-width="2.5" stroke-linecap="round" style="flex-shrink:0;">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      `).join("")}
    </div>

    <div style="height:20px;"></div>
  `;

  main.querySelectorAll(".subject-row").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const id = btn.getAttribute("data-subject-id");
      if (id) window.location.hash = `#/subject?subjectId=${id}`;
    });
    btn.addEventListener("mouseenter", () => {
      btn.style.transform = "translateY(-2px)";
      btn.style.boxShadow = "0 8px 20px var(--sp-accent-glow)";
      btn.style.borderColor = "var(--sp-accent)";
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "";
      btn.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
      btn.style.borderColor = "var(--sp-border)";
    });
  });

  const cleanupPull = attachPullToRefresh(main, async () => {
    Toast.info("\uD83D\uDD04 Refreshing...");
    await renderSubjects();
  });

  currentCleanup = () => {
    try { document.body.classList.remove("ds-route-study"); } catch (e) {}
    try { cleanupPull(); } catch(e){}
  };
}

function escapeHtml(str) {
  if (str == null) return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}