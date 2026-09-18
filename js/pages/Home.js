/**
 * DiplomaStudy - Home Page v7 (Professional)
 * + Skeleton loader
 * + Error state with retry
 * + Pull to refresh
 * + Modern toast
 * + Offline detection
 */

import { AppShell } from "../components/AppShell.js";
import { storage, STORAGE_KEYS } from "../core/storage.js";
import {
  getDepartments,
  getSemestersByDepartment,
  getSubjects,
  getNotices
} from "../services/api.js";
import { homeSkeleton } from "../utils/skeleton.js";
import { errorState, emptyState } from "../utils/errorState.js";
import { attachPullToRefresh } from "../utils/pullToRefresh.js";
import { Toast } from "../components/Toast.js";
import { isOnline, onConnectionChange } from "../utils/apiWrapper.js";

// ═══════════════════════════════════════════
// CLEANUP TRACKER
// ═══════════════════════════════════════════
let currentCleanup = null;

// ═══════════════════════════════════════════
// STUDY GOAL
// ═══════════════════════════════════════════
function getStudyProgress() {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const raw = localStorage.getItem("diplomastudy_goal");
    const goal = raw ? JSON.parse(raw) : { date: today, minutes: 0, target: 45 };
    if (goal.date !== today) { goal.date = today; goal.minutes = 0; }
    return goal;
  } catch (e) {
    return { date: "", minutes: 0, target: 45 };
  }
}

// ═══════════════════════════════════════════
// STREAK
// ═══════════════════════════════════════════
function updateStreak() {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const raw = localStorage.getItem("diplomastudy_streak");
    const streak = raw ? JSON.parse(raw) : { dates: [], best: 0 };
    if (!streak.dates.includes(today)) {
      streak.dates.push(today);
      if (streak.dates.length > 60) streak.dates = streak.dates.slice(-60);
    }
    let current = 0;
    const dateSet = new Set(streak.dates);
    const d = new Date(today);
    while (dateSet.has(d.toISOString().slice(0, 10))) {
      current++;
      d.setDate(d.getDate() - 1);
    }
    if (current > streak.best) streak.best = current;
    localStorage.setItem("diplomastudy_streak", JSON.stringify(streak));
    return { current, best: streak.best };
  } catch (e) {
    return { current: 1, best: 1 };
  }
}

// ═══════════════════════════════════════════
// INLINE MODAL
// ═══════════════════════════════════════════
function showInlineModal(title, message) {
  document.getElementById("ds-inline-modal")?.remove();

  const overlay = document.createElement("div");
  overlay.id = "ds-inline-modal";
  overlay.style.cssText = `
    position:fixed;inset:0;background:rgba(15,23,42,0.7);
    backdrop-filter:blur(6px);z-index:9999;
    display:flex;align-items:center;justify-content:center;padding:20px;
  `;
  overlay.innerHTML = `
    <div style="
      background:#FFFFFF;border-radius:20px;padding:24px;
      max-width:340px;width:100%;text-align:center;
      box-shadow:0 20px 60px rgba(0,0,0,0.3);
    ">
      <div style="font-size:52px;margin-bottom:12px;">🚧</div>
      <h3 style="font-size:17px;font-weight:800;color:#1C3E2C;margin:0 0 8px;">
        ${escapeHtml(title || "Coming Soon")}
      </h3>
      <p style="font-size:13px;color:#84968B;line-height:1.5;margin:0 0 18px;">
        ${escapeHtml(message || "এই feature শীঘ্রই আসছে।")}
      </p>
      <button data-close style="
        width:100%;padding:12px;border-radius:12px;border:none;
        background:linear-gradient(135deg,#1C3E2C,#2A5540);
        color:#FFFFFF;font-weight:800;font-size:14px;
        cursor:pointer;font-family:inherit;
      ">ঠিক আছে</button>
    </div>
  `;
  document.body.appendChild(overlay);

  const close = () => overlay.remove();
  overlay.querySelector("[data-close]").onclick = close;
  overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
}

// ═══════════════════════════════════════════
// DEPARTMENT PICKER
// ═══════════════════════════════════════════
async function showDeptSemPicker(currentDeptId, currentSemId) {
  document.getElementById("ds-picker")?.remove();

  const overlay = document.createElement("div");
  overlay.id = "ds-picker";
  overlay.style.cssText = `
    position:fixed;inset:0;background:rgba(15,23,42,0.75);
    backdrop-filter:blur(8px);z-index:9999;
    display:flex;align-items:flex-end;justify-content:center;
  `;

  overlay.innerHTML = `
    <div style="
      background:#FFFFFF;width:100%;max-width:520px;
      border-radius:24px 24px 0 0;padding:24px;
      max-height:85vh;overflow-y:auto;
      box-shadow:0 -12px 40px rgba(0,0,0,0.3);
    ">
      <div style="width:40px;height:4px;background:#E1E8E1;border-radius:999px;margin:0 auto 20px;"></div>
      <div style="text-align:center;padding:40px 20px;">
        <div class="spinner"></div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  const close = () => overlay.remove();
  overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });

  let departments = [];
  try { departments = await getDepartments(); } catch (e) {}

  if (departments.length === 0) {
    overlay.querySelector("div").innerHTML = `
      <div style="text-align:center;padding:40px 20px;">
        <div style="font-size:56px;margin-bottom:12px;">🏛️</div>
        <h3 style="font-size:16px;font-weight:800;color:#1C3E2C;margin:0 0 8px;">কোনো Department নেই</h3>
        <p style="font-size:12.5px;color:#84968B;line-height:1.5;">Admin Panel থেকে department যোগ করুন।</p>
      </div>
    `;
    return;
  }

  const modal = overlay.querySelector("div");
  modal.innerHTML = `
    <div style="width:40px;height:4px;background:#E1E8E1;border-radius:999px;margin:0 auto 16px;"></div>

    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
      <h3 style="font-size:17px;font-weight:900;color:#1C3E2C;margin:0;letter-spacing:-0.3px;">
        Department & Semester
      </h3>
      <button data-close style="
        width:32px;height:32px;border-radius:10px;
        background:#F2F5F2;border:none;
        color:#57675D;font-size:14px;cursor:pointer;font-family:inherit;
      ">✕</button>
    </div>

    <div id="step-dept">
      <div style="display:flex;align-items:center;gap:6px;font-size:11px;font-weight:800;color:#84968B;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:10px;">
        <span style="display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:50%;background:#1C3E2C;color:#FFFFFF;font-size:11px;">1</span>
        <span>Department নির্বাচন করুন</span>
      </div>
      <div id="dept-list" style="display:flex;flex-direction:column;gap:8px;margin-bottom:20px;"></div>
    </div>

    <div id="step-sem" style="display:none;">
      <div style="display:flex;align-items:center;gap:6px;font-size:11px;font-weight:800;color:#84968B;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:10px;">
        <span style="display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:50%;background:#1C3E2C;color:#FFFFFF;font-size:11px;">2</span>
        <span>Semester নির্বাচন করুন</span>
      </div>
      <div id="sem-list" style="display:flex;flex-direction:column;gap:8px;"></div>
    </div>
  `;

  modal.querySelector("[data-close]").onclick = close;

  const deptList = modal.querySelector("#dept-list");

  function renderDepartments() {
    deptList.innerHTML = departments.map((d) => `
      <button class="dept-opt" data-dept-id="${d.id}" style="
        display:flex;align-items:center;gap:12px;padding:14px;
        background:${d.id === currentDeptId ? "#DCFCE7" : "#F8FBF8"};
        border:1.5px solid ${d.id === currentDeptId ? "#10B981" : "#E1E8E1"};
        border-radius:14px;cursor:pointer;font-family:inherit;
        text-align:left;width:100%;
      ">
        <div style="width:44px;height:44px;border-radius:13px;background:#FFFFFF;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;">${d.icon || "🏛️"}</div>
        <div style="flex:1;min-width:0;">
          <div style="font-size:13.5px;font-weight:800;color:#1C3E2C;letter-spacing:-0.2px;margin-bottom:2px;">${escapeHtml(d.name)}</div>
          ${d.banglaName ? `<div style="font-size:11px;color:#84968B;font-weight:600;">${escapeHtml(d.banglaName)}</div>` : ""}
        </div>
        ${d.id === currentDeptId ? `<span style="color:#10B981;font-size:16px;font-weight:900;">✓</span>` : ""}
      </button>
    `).join("");

    deptList.querySelectorAll(".dept-opt").forEach((btn) => {
      btn.addEventListener("click", () => {
        const deptId = btn.getAttribute("data-dept-id");
        loadSemesters(deptId);
      });
    });
  }

  async function loadSemesters(deptId) {
    const stepSem = modal.querySelector("#step-sem");
    const semList = modal.querySelector("#sem-list");

    deptList.querySelectorAll(".dept-opt").forEach((btn) => {
      const isThis = btn.getAttribute("data-dept-id") === deptId;
      btn.style.background = isThis ? "#DCFCE7" : "#F8FBF8";
      btn.style.borderColor = isThis ? "#10B981" : "#E1E8E1";
    });

    stepSem.style.display = "block";
    semList.innerHTML = `<div style="text-align:center;padding:24px;"><div class="spinner" style="margin:0 auto;"></div></div>`;

    let semesters = [];
    try { semesters = await getSemestersByDepartment(deptId); } catch (e) {}

    if (semesters.length === 0) {
      semList.innerHTML = `
        <div style="padding:24px 16px;text-align:center;background:#FEF3C7;border:1.5px dashed #FCD34D;border-radius:14px;">
          <div style="font-size:36px;margin-bottom:8px;">📅</div>
          <div style="font-size:13px;font-weight:800;color:#92400E;margin-bottom:4px;">কোনো Semester নেই</div>
        </div>
      `;
      return;
    }

    semList.innerHTML = semesters.map((s) => `
      <button class="sem-opt" data-sem-id="${s.id}" data-sem-num="${s.number}" style="
        display:flex;align-items:center;gap:12px;padding:14px;
        background:${s.id === currentSemId ? "#DCFCE7" : "#F8FBF8"};
        border:1.5px solid ${s.id === currentSemId ? "#10B981" : "#E1E8E1"};
        border-radius:14px;cursor:pointer;font-family:inherit;
        text-align:left;width:100%;
      ">
        <div style="width:44px;height:44px;border-radius:13px;background:#FFFFFF;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;">${s.icon || "📅"}</div>
        <div style="flex:1;min-width:0;">
          <div style="font-size:13.5px;font-weight:800;color:#1C3E2C;letter-spacing:-0.2px;margin-bottom:2px;">${escapeHtml(s.name)}</div>
          <div style="font-size:11px;color:#84968B;font-weight:600;">Semester ${s.number}</div>
        </div>
        ${s.id === currentSemId ? `<span style="color:#10B981;font-size:16px;font-weight:900;">✓</span>` : ""}
      </button>
    `).join("");

    semList.querySelectorAll(".sem-opt").forEach((btn) => {
      btn.addEventListener("click", () => {
        const semId = btn.getAttribute("data-sem-id");
        const semNum = parseInt(btn.getAttribute("data-sem-num"), 10);

        const ns = storage.get(STORAGE_KEYS.SETTINGS, {});
        ns.department = deptId;
        ns.departmentId = deptId;
        ns.semester = semId;
        ns.semesterId = semId;
        ns.semesterNumber = semNum;
        storage.set(STORAGE_KEYS.SETTINGS, ns);

        Toast.success("✅ Selection saved");
        close();
        setTimeout(() => window.location.reload(), 300);
      });
    });

    setTimeout(() => stepSem.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  }

  renderDepartments();
  if (currentDeptId) loadSemesters(currentDeptId);
}

// ═══════════════════════════════════════════
// MAIN RENDER
// ═══════════════════════════════════════════
export async function renderHome() {
  // Cleanup previous listeners
  if (currentCleanup) {
    try { currentCleanup(); } catch (e) {}
    currentCleanup = null;
  }

  AppShell.updateHeader({ showBack: false, showSettings: true, showSearch: true });

  const main = AppShell.getMainView();
  if (!main) return;

  // ═══ Show skeleton (not spinner!) ═══
  main.innerHTML = homeSkeleton();

  // ═══ Offline check ═══
  if (!isOnline()) {
    main.innerHTML = errorState({
      type: "network",
      customBangla: "Internet connection নেই। Data load করা যাবে না।",
      retryFn: () => renderHome()
    });
    return;
  }

  // ═══ Load data with error handling ═══
  let departments = [], subjects = [], notices = [];
  let loadError = null;

  try {
    const results = await Promise.all([
      getDepartments().catch((e) => { loadError = e; return []; }),
      getSubjects().catch((e) => { loadError = e; return []; }),
      getNotices().catch((e) => { loadError = e; return []; })
    ]);
    [departments, subjects, notices] = results;
  } catch (err) {
    loadError = err;
  }

  // If everything failed
  if (departments.length === 0 && subjects.length === 0 && notices.length === 0 && loadError) {
    main.innerHTML = errorState({
      type: "server",
      message: loadError.message,
      retryFn: () => renderHome()
    });
    return;
  }

  // If no departments
  if (departments.length === 0) {
    main.innerHTML = emptyState({
      icon: "🏛️",
      title: "কোনো Department নেই",
      message: "Admin Panel থেকে department যোগ করুন।",
      actionFn: () => window.location.reload(),
      actionLabel: "🔄 আবার চেষ্টা করুন"
    });
    return;
  }

  // ═══ Prepare data ═══
  const settings = storage.get(STORAGE_KEYS.SETTINGS, {});
  const userName = settings.userName || "Student";

  let currentDept = null;
  const curDeptKey = settings.department || settings.departmentId || "";
  if (curDeptKey) {
    currentDept = departments.find((d) =>
      d.id === curDeptKey ||
      (d.code && d.code.toLowerCase() === String(curDeptKey).toLowerCase())
    );
  }
  if (!currentDept) {
    currentDept = departments[0];
    settings.department = currentDept.id;
    settings.departmentId = currentDept.id;
    storage.set(STORAGE_KEYS.SETTINGS, settings);
  }

  let currentSemesters = [];
  try { currentSemesters = await getSemestersByDepartment(currentDept.id); } catch (e) {}

  let currentSem = null;
  const curSemKey = settings.semesterId || settings.semester || "";
  if (curSemKey) {
    currentSem = currentSemesters.find((s) =>
      s.id === curSemKey || String(s.number) === String(curSemKey)
    );
  }
  if (!currentSem && currentSemesters.length > 0) {
    currentSem = currentSemesters[0];
    settings.semester = currentSem.id;
    settings.semesterId = currentSem.id;
    settings.semesterNumber = currentSem.number;
    storage.set(STORAGE_KEYS.SETTINGS, settings);
  }

  const currentSemName = currentSem ? currentSem.name : "No Semester";
  const streak = updateStreak();
  const goal = getStudyProgress();
  const goalPercent = Math.min(Math.round((goal.minutes / goal.target) * 100), 100);

  const hour = new Date().getHours();
  let greeting = "শুভ সকাল";
  let greetingEmoji = "🌅";
  if (hour >= 12 && hour < 17) { greeting = "শুভ দুপুর"; greetingEmoji = "☀️"; }
  else if (hour >= 17 && hour < 20) { greeting = "শুভ সন্ধ্যা"; greetingEmoji = "🌆"; }
  else if (hour >= 20 || hour < 5) { greeting = "শুভ রাত্রি"; greetingEmoji = "🌙"; }

  const latestNotice = notices.length > 0 ? notices[0] : null;
  const firstSubject = subjects.length > 0 ? subjects[0] : null;

  // ═══ RENDER CONTENT ═══
  main.innerHTML = `
    <!-- HERO -->
    <div style="
      position:relative;border-radius:24px;padding:22px 20px 20px;
      margin-bottom:20px;overflow:hidden;
      background:linear-gradient(135deg, #142E1F 0%, #1F4A32 50%, #2A5540 100%);
      box-shadow:0 16px 40px -12px rgba(28,62,44,0.45);
    ">
      <div style="position:absolute;top:-60px;right:-60px;width:200px;height:200px;border-radius:50%;background:radial-gradient(circle,rgba(200,122,30,0.25) 0%,transparent 70%);"></div>
      <div style="position:absolute;bottom:-50px;left:-40px;width:160px;height:160px;border-radius:50%;background:radial-gradient(circle,rgba(122,155,122,0.2) 0%,transparent 70%);"></div>

      <div style="position:relative;z-index:2;">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:16px;gap:12px;">
          <div style="flex:1;min-width:0;">
            <div style="font-size:11px;font-weight:700;color:rgba(255,255,255,0.7);letter-spacing:1.2px;text-transform:uppercase;margin-bottom:4px;">
              ${greeting} ${greetingEmoji}
            </div>
            <div style="font-size:22px;font-weight:900;color:#FFFFFF;letter-spacing:-0.5px;line-height:1.15;">
              ${escapeHtml(userName)}
            </div>
          </div>

          ${streak.current > 0 ? `
            <div style="display:flex;align-items:center;gap:5px;padding:7px 12px;background:linear-gradient(135deg,rgba(245,158,11,0.4),rgba(245,158,11,0.15));border:1px solid rgba(245,158,11,0.5);border-radius:999px;font-size:11.5px;font-weight:800;color:#FEF3C7;flex-shrink:0;">
              <span style="font-size:13px;">🔥</span>
              <span>${streak.current} day${streak.current > 1 ? "s" : ""}</span>
            </div>
          ` : ""}
        </div>

        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;">
          <button id="hero-dept-btn" style="display:inline-flex;align-items:center;gap:6px;padding:7px 13px;background:rgba(255,255,255,0.15);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.2);border-radius:999px;color:#FFFFFF;font-size:12px;font-weight:700;font-family:inherit;cursor:pointer;">
            <span style="font-size:13px;">${currentDept.icon || "🏛️"}</span>
            <span>${escapeHtml(currentDept.name)}</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>

          <button id="hero-sem-btn" style="display:inline-flex;align-items:center;gap:6px;padding:7px 13px;background:rgba(255,255,255,0.15);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.2);border-radius:999px;color:#FFFFFF;font-size:12px;font-weight:700;font-family:inherit;cursor:pointer;">
            <span style="font-size:13px;">📅</span>
            <span>${escapeHtml(currentSemName)}</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
        </div>

        <div style="background:rgba(255,255,255,0.1);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.12);border-radius:14px;padding:12px 14px;">
          <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
            <span style="font-size:11px;font-weight:700;color:rgba(255,255,255,0.75);">Today's Study Goal</span>
            <span style="font-size:11.5px;font-weight:800;color:#FFFFFF;">${goal.minutes} / ${goal.target} min</span>
          </div>
          <div style="height:6px;background:rgba(255,255,255,0.15);border-radius:999px;overflow:hidden;">
            <div style="height:100%;width:${goalPercent}%;background:linear-gradient(90deg,#F59E0B,#FBBF24);border-radius:999px;"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- QUICK ACTIONS -->
    <div style="display:flex;justify-content:space-between;margin:0 0 12px;">
      <h2 style="font-size:15px;font-weight:800;color:#1C3E2C;margin:0;">Quick Actions</h2>
      <button id="home-all-subjects" style="font-size:11.5px;font-weight:800;color:#1C3E2C;background:transparent;border:none;font-family:inherit;cursor:pointer;padding:0;">All Subjects →</button>
    </div>

    <div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:10px;margin-bottom:24px;">
      ${quickBtn("📚", "Study", "#DCFCE7", "#065F46", "#/subjects")}
      ${quickBtn("🎯", "Quiz", "#FEF3C7", "#92400E", null, true)}
      ${quickBtn("📝", "Notes", "#DBEAFE", "#1E40AF", null, true)}
      ${quickBtn("⭐", "Saved", "#FFE4E6", "#9F1239", null, true)}
      ${quickBtn("📄", "PDFs", "#E0E7FF", "#3730A3", "#/pdfs")}
      ${quickBtn("🧮", "Formula", "#CFFAFE", "#155E75", "#/formulas")}
      ${quickBtn("📅", "Planner", "#F3E8FF", "#6B21A8", null, true)}
      ${quickBtn("🤖", "AI", "#FCE7F3", "#9D174D", null, true)}
    </div>

    <!-- CONTINUE LEARNING -->
    ${firstSubject ? `
      <div style="display:flex;justify-content:space-between;margin:0 0 12px;">
        <h2 style="font-size:15px;font-weight:800;color:#1C3E2C;margin:0;">Continue Learning</h2>
        <button id="home-view-all" style="font-size:11.5px;font-weight:800;color:#1C3E2C;background:transparent;border:none;font-family:inherit;cursor:pointer;padding:0;">View All (${subjects.length}) →</button>
      </div>

      <button class="continue-card" data-subject-id="${firstSubject.id}" style="
        width:100%;display:flex;align-items:center;gap:14px;
        padding:16px;background:linear-gradient(135deg, #FFFFFF, #F8FBF8);
        border:1.5px solid #E1E8E1;border-radius:18px;cursor:pointer;
        font-family:inherit;text-align:left;
        box-shadow:0 4px 14px rgba(28,62,44,0.06);margin-bottom:24px;
        position:relative;overflow:hidden;
      ">
        <div style="position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#10B981,#3B82F6,#8B5CF6);"></div>
        <div style="width:56px;height:56px;border-radius:16px;background:linear-gradient(135deg,#DCFCE7,#BBF7D0);display:flex;align-items:center;justify-content:center;font-size:28px;flex-shrink:0;">${firstSubject.icon || "📘"}</div>
        <div style="flex:1;min-width:0;">
          <div style="font-size:10px;font-weight:800;color:#84968B;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:4px;">📖 Pick up where you left</div>
          <div style="font-size:15px;font-weight:800;color:#1C3E2C;margin-bottom:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(firstSubject.name)}</div>
          <div style="font-size:11.5px;color:#84968B;font-weight:600;">${escapeHtml(firstSubject.code || "")} ${firstSubject.credits ? `• ${firstSubject.credits} credits` : ""}</div>
        </div>
        <div style="width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#10B981,#059669);color:#FFFFFF;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polygon points="5 3 19 12 5 21 5 3" fill="currentColor"></polygon></svg>
        </div>
      </button>
    ` : ""}

    <!-- LATEST NOTICE -->
    ${latestNotice ? `
      <div style="display:flex;justify-content:space-between;margin:0 0 12px;">
        <h2 style="font-size:15px;font-weight:800;color:#1C3E2C;margin:0;">Latest Notice</h2>
        <button id="home-all-notices" style="font-size:11.5px;font-weight:800;color:#1C3E2C;background:transparent;border:none;font-family:inherit;cursor:pointer;padding:0;">All Notices →</button>
      </div>

      <div id="home-notice-card" style="padding:16px;background:linear-gradient(135deg, #FFFBEB, #FEF3C7);border:1.5px solid #FCD34D;border-radius:18px;box-shadow:0 4px 14px rgba(200,122,30,0.1);margin-bottom:20px;cursor:pointer;position:relative;overflow:hidden;">
        <div style="position:absolute;top:0;left:0;width:4px;height:100%;background:linear-gradient(180deg,#F59E0B,#D97706);"></div>
        <div style="display:flex;justify-content:space-between;margin-bottom:8px;padding-left:8px;">
          <span style="font-size:9.5px;font-weight:800;color:#92400E;background:rgba(255,255,255,0.7);padding:3px 9px;border-radius:6px;text-transform:uppercase;">${escapeHtml(latestNotice.audience || "Notice")}</span>
          <span style="font-size:10.5px;color:#92400E;font-weight:600;">${formatDate(latestNotice.publishedAt || latestNotice.createdAt)}</span>
        </div>
        <h3 style="font-size:14px;font-weight:800;color:#78350F;margin:0 0 6px;padding-left:8px;">${escapeHtml(latestNotice.title || "")}</h3>
        <p style="font-size:12px;color:#92400E;line-height:1.5;margin:0 0 10px;padding-left:8px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">${escapeHtml(stripMarkdown(latestNotice.content || "").substring(0, 120))}</p>
        <div style="display:flex;align-items:center;gap:4px;font-size:11.5px;font-weight:800;color:#78350F;padding-left:8px;">Read full notice →</div>
      </div>
    ` : ""}

    <div style="height:20px;"></div>
  `;

  // ═══════════════════════════════════════════
  // BIND EVENTS
  // ═══════════════════════════════════════════

  const openPicker = () => showDeptSemPicker(currentDept.id, currentSem?.id || null);

  main.querySelector("#hero-dept-btn")?.addEventListener("click", openPicker);
  main.querySelector("#hero-sem-btn")?.addEventListener("click", openPicker);

  main.querySelector("#home-all-subjects")?.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.hash = "#/subjects";
  });
  main.querySelector("#home-view-all")?.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.hash = "#/subjects";
  });

  main.querySelectorAll("[data-quick]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const route = btn.getAttribute("data-route");
      const locked = btn.getAttribute("data-locked") === "true";
      const label = btn.getAttribute("data-quick");

      if (locked || !route) {
        showInlineModal(label, "এই feature শীঘ্রই আসছে।");
      } else {
        window.location.hash = route;
      }
    });
  });

  main.querySelectorAll(".continue-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      e.preventDefault();
      const id = card.getAttribute("data-subject-id");
      if (id) window.location.hash = `#/subject?subjectId=${id}`;
    });
  });

  main.querySelector("#home-notice-card")?.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.hash = "#/notices";
  });
  main.querySelector("#home-all-notices")?.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.hash = "#/notices";
  });

  // ═══ Pull to Refresh ═══
  const cleanupPull = attachPullToRefresh(main, async () => {
    Toast.info("🔄 Refreshing...");
    await renderHome();
    Toast.success("✅ Updated");
  });

  // ═══ Connection monitoring ═══
  const cleanupConn = onConnectionChange((online) => {
    if (!online) {
      Toast.warning("📡 Internet নেই");
    } else {
      Toast.success("✅ Internet ফিরে এসেছে");
    }
  });

  // ═══ Save cleanup ═══
  currentCleanup = () => {
    try { cleanupPull && cleanupPull(); } catch (e) {}
    try { cleanupConn && cleanupConn(); } catch (e) {}
  };
}

// ═══════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════
function quickBtn(icon, label, bg, color, route, locked = false) {
  return `
    <button 
      data-quick="${label}"
      data-route="${route || ""}"
      data-locked="${locked ? "true" : "false"}"
      style="position:relative;display:flex;flex-direction:column;align-items:center;gap:6px;padding:12px 4px 10px;background:#FFFFFF;border:1px solid #E1E8E1;border-radius:16px;cursor:pointer;font-family:inherit;box-shadow:0 2px 6px rgba(28,62,44,0.04);"
    >
      <div style="width:42px;height:42px;border-radius:13px;background:${bg};color:${color};display:flex;align-items:center;justify-content:center;font-size:21px;">${icon}</div>
      <span style="font-size:10.5px;font-weight:800;color:#1C3E2C;">${label}</span>
      ${locked ? `<span style="position:absolute;top:6px;right:6px;font-size:9px;opacity:0.5;">🔒</span>` : ""}
    </button>
  `;
}

function escapeHtml(str) {
  if (str == null) return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function stripMarkdown(text) {
  return String(text || "").replace(/[#*_`>]/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\n+/g, " ").trim();
}

function formatDate(iso) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    const now = new Date();
    const diff = Math.floor((now - d) / 86400000);
    if (diff === 0) return "আজ";
    if (diff === 1) return "গতকাল";
    if (diff < 7) return `${diff} দিন আগে`;
    return d.toLocaleDateString("bn-BD", { day: "numeric", month: "short" });
  } catch (e) { return ""; }
}