/**
 * Subjects — with hash guard
 */

import { AppShell } from "../components/AppShell.js";
import { storage, STORAGE_KEYS } from "../core/storage.js";
import { getSubjects, getDepartments, getSemestersByDepartment, recordRecentSubject } from "../services/api.js";
import { listSkeleton } from "../utils/skeleton.js";
import { errorState, emptyState } from "../utils/errorState.js";
import { attachPullToRefresh } from "../utils/pullToRefresh.js";
import { Toast } from "../components/Toast.js";

let currentCleanup = null;

export async function renderSubjects() {
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
    console.log("[Subjects] Route changed — abort");
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
    subtitle: currentDept ? `${currentDept.name}${semester ? " • " + semester.name : ""}` : "",
    showBack: true,
    showSearch: false,
    showTheme: true,
    showSettings: false,
    expectedHash: MY_HASH
  });

  if (subjects.length === 0) {
    main.innerHTML = emptyState({
      icon: "📚",
      title: "কোনো Subject নেই",
      message: "এই semester-এ এখনো কোনো subject যোগ করা হয়নি।",
      actionFn: () => window.location.hash = "#/home",
      actionLabel: "🏠 Home এ যান"
    });
    return;
  }

  main.innerHTML = `
    <div style="
      padding:12px 14px;
      background:linear-gradient(135deg, rgba(28,62,44,0.06), transparent);
      border-left:3px solid #1C3E2C;
      border-radius:12px;
      margin-bottom:16px;
      font-size:12.5px;
      color:#57675D;
      line-height:1.5;
      font-weight:500;
    ">
      নিচের যেকোনো বিষয়ে ট্যাপ করুন। প্রতিটি বিষয়ের chapter ও content server থেকে load হবে।
    </div>

    <div style="display:flex;flex-direction:column;gap:10px;">
      ${subjects.map((sub, idx) => `
        <button class="subject-row" data-subject-id="${sub.id}" style="
          display:flex;align-items:center;gap:12px;
          padding:14px;background:#FFFFFF;
          border:1.5px solid #E1E8E1;border-radius:16px;
          cursor:pointer;font-family:inherit;text-align:left;width:100%;
          box-shadow:0 2px 8px rgba(28,62,44,0.04);
          transition:all 0.15s ease;
          -webkit-tap-highlight-color:transparent;
        ">
          <div style="font-size:10px;font-weight:800;color:#84968B;font-family:ui-monospace,monospace;width:24px;text-align:center;flex-shrink:0;">
            ${String(idx + 1).padStart(2, "0")}
          </div>
          <div style="width:46px;height:46px;border-radius:13px;background:linear-gradient(135deg,#DCFCE7,#BBF7D0);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;">
            ${sub.icon || "📘"}
          </div>
          <div style="flex:1;min-width:0;">
            <div style="font-size:13.5px;font-weight:800;color:#1C3E2C;margin-bottom:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
              ${escapeHtml(sub.name)}
            </div>
            ${sub.banglaName ? `<div style="font-size:11px;color:#84968B;font-weight:600;margin-bottom:5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(sub.banglaName)}</div>` : ""}
            <div style="display:flex;gap:4px;flex-wrap:wrap;">
              ${sub.code ? `<span style="font-size:9px;font-weight:800;color:#065F46;background:#DCFCE7;padding:2px 7px;border-radius:5px;text-transform:uppercase;">${escapeHtml(sub.code)}</span>` : ""}
              ${sub.type ? `<span style="font-size:9px;font-weight:800;color:#57675D;background:#F2F5F2;padding:2px 7px;border-radius:5px;text-transform:uppercase;">${escapeHtml(sub.type)}</span>` : ""}
              ${sub.credits ? `<span style="font-size:9px;font-weight:800;color:#C87A1E;background:#FEF3C7;padding:2px 7px;border-radius:5px;">${sub.credits} CR</span>` : ""}
            </div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#84968B" stroke-width="2.5" stroke-linecap="round" style="flex-shrink:0;">
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
      if (id) {
        recordRecentSubject(id).catch(function () {});
        window.location.hash = `#/subject?subjectId=${id}`;
      }
    });
    btn.addEventListener("mouseenter", () => {
      btn.style.transform = "translateY(-2px)";
      btn.style.boxShadow = "0 8px 20px rgba(28,62,44,0.1)";
      btn.style.borderColor = "#7A9B7A";
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "";
      btn.style.boxShadow = "0 2px 8px rgba(28,62,44,0.04)";
      btn.style.borderColor = "#E1E8E1";
    });
  });

  const cleanupPull = attachPullToRefresh(main, async () => {
    Toast.info("🔄 Refreshing...");
    await renderSubjects();
  });

  currentCleanup = () => { try { cleanupPull(); } catch(e){} };
}

function escapeHtml(str) {
  if (str == null) return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}