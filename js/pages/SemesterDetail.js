/**
 * SemesterDetail — with hash guard
 */

import { AppShell } from "../components/AppShell.js";
import { getSemestersByDepartment, getDepartments, getSubjectsByAssignment } from "../services/api.js";
import { storage, STORAGE_KEYS } from "../core/storage.js";
import { listSkeleton } from "../utils/skeleton.js";
import { errorState, emptyState } from "../utils/errorState.js";

export async function renderSemesterDetail(params = {}) {
  const MY_HASH = "#/semester";

  AppShell.updateHeader({
    title: "Loading...",
    subtitle: "",
    showBack: true,
    showSearch: false,
    showTheme: true,
    showSettings: false,
    expectedHash: MY_HASH
  });

  const main = AppShell.getMainView();
  if (!main) return;

  main.innerHTML = listSkeleton(5, "84px");

  const urlParams = new URLSearchParams(window.location.hash.split("?")[1] || "");
  const semId = params.semId || urlParams.get("semId") || "";
  const settings = storage.get(STORAGE_KEYS.SETTINGS, {});
  const deptId = settings.departmentId || settings.department || "";

  if (!semId || !deptId) {
    main.innerHTML = errorState({ type: "notFound", customBangla: "Data নেই" });
    return;
  }

  let departments = [], semesters = [], subjects = [];
  try { departments = await getDepartments(); } catch (e) {}
  try { semesters = await getSemestersByDepartment(deptId); } catch (e) {}
  try { subjects = await getSubjectsByAssignment(deptId, semId); } catch (e) {}

  // Guard
  if ((window.location.hash || "").split("?")[0] !== MY_HASH) {
    console.log("[SemesterDetail] Route changed — abort");
    return;
  }

  const currentDept = departments.find((d) => d.id === deptId);
  const currentSem = semesters.find((s) => s.id === semId);

  if (!currentSem) {
    main.innerHTML = errorState({ type: "notFound", customBangla: "Semester পাওয়া যায়নি" });
    return;
  }

  AppShell.updateHeader({
    title: currentSem.name,
    subtitle: currentDept ? currentDept.name : "",
    showBack: true,
    showSearch: false,
    showTheme: true,
    showSettings: false,
    expectedHash: MY_HASH
  });

  main.innerHTML = `
    <div style="position:relative;padding:22px 20px;border-radius:22px;background:linear-gradient(135deg, #163524 0%, #1F4A32 50%, #2A5540 100%);box-shadow:0 16px 40px -12px rgba(28,62,44,0.4);margin-bottom:20px;overflow:hidden;color:#FFFFFF;">
      <div style="position:absolute;top:-50px;right:-50px;width:180px;height:180px;border-radius:50%;background:radial-gradient(circle,rgba(200,122,30,0.2),transparent 70%);"></div>
      <div style="position:relative;z-index:2;">
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:14px;">
          <div style="width:60px;height:60px;border-radius:18px;background:rgba(255,255,255,0.18);backdrop-filter:blur(10px);border:1.5px solid rgba(255,255,255,0.25);display:flex;align-items:center;justify-content:center;font-size:30px;flex-shrink:0;">${currentSem.icon || "📅"}</div>
          <div style="flex:1;min-width:0;">
            <h1 style="font-size:22px;font-weight:900;letter-spacing:-0.5px;margin:0 0 4px;">${escapeHtml(currentSem.name)}</h1>
            ${currentDept ? `<p style="font-size:12.5px;opacity:0.85;margin:0;font-weight:600;">${currentDept.icon || "🏛️"} ${escapeHtml(currentDept.name)}</p>` : ""}
          </div>
        </div>
        <div style="display:flex;gap:20px;padding-top:14px;border-top:1px solid rgba(255,255,255,0.15);">
          <div>
            <div style="font-size:22px;font-weight:900;">${subjects.length}</div>
            <div style="font-size:10px;opacity:0.7;text-transform:uppercase;letter-spacing:0.5px;font-weight:700;">Subjects</div>
          </div>
          <div>
            <div style="font-size:22px;font-weight:900;">${currentSem.number}</div>
            <div style="font-size:10px;opacity:0.7;text-transform:uppercase;letter-spacing:0.5px;font-weight:700;">Semester #</div>
          </div>
        </div>
      </div>
    </div>

    ${subjects.length > 0 ? `
      <div style="display:flex;justify-content:space-between;margin:0 0 12px;">
        <h2 style="font-size:15px;font-weight:800;color:#1C3E2C;margin:0;">Subjects</h2>
        <span style="font-size:11.5px;font-weight:700;color:#84968B;">${subjects.length}টি</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;">
        ${subjects.map((sub, idx) => `
          <button class="sem-subj" data-subject-id="${sub.id}" style="display:flex;align-items:center;gap:12px;padding:14px;background:#FFFFFF;border:1.5px solid #E1E8E1;border-radius:16px;cursor:pointer;font-family:inherit;text-align:left;width:100%;box-shadow:0 2px 8px rgba(28,62,44,0.04);">
            <div style="font-size:10px;font-weight:800;color:#84968B;font-family:ui-monospace,monospace;width:24px;text-align:center;flex-shrink:0;">${String(idx + 1).padStart(2, "0")}</div>
            <div style="width:46px;height:46px;border-radius:13px;background:linear-gradient(135deg,#DCFCE7,#BBF7D0);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;">${sub.icon || "📘"}</div>
            <div style="flex:1;min-width:0;">
              <div style="font-size:13.5px;font-weight:800;color:#1C3E2C;margin-bottom:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(sub.name)}</div>
              ${sub.banglaName ? `<div style="font-size:11px;color:#84968B;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(sub.banglaName)}</div>` : ""}
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#84968B" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        `).join("")}
      </div>
    ` : emptyState({ icon: "📚", title: "কোনো Subject নেই", message: "এই semester-এ এখনো কোনো subject যোগ করা হয়নি।" })}

    ${semesters.length > 1 ? `
      <div style="display:flex;justify-content:space-between;margin:24px 0 12px;">
        <h2 style="font-size:15px;font-weight:800;color:#1C3E2C;margin:0;">অন্য সেমিস্টার</h2>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:8px;margin-bottom:20px;">
        ${semesters.filter((s) => s.id !== semId).map((s) => `
          <button class="other-sem" data-target="${s.id}" style="display:flex;flex-direction:column;align-items:center;gap:4px;padding:12px 8px;background:#FFFFFF;border:1.5px solid #E1E8E1;border-radius:14px;cursor:pointer;font-family:inherit;">
            <span style="font-size:20px;">${s.icon || "📅"}</span>
            <span style="font-size:11px;font-weight:800;color:#1C3E2C;">${escapeHtml(s.name)}</span>
          </button>
        `).join("")}
      </div>
    ` : ""}

    <div style="height:20px;"></div>
  `;

  main.querySelectorAll(".sem-subj").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-subject-id");
      if (id) window.location.hash = `#/subject?subjectId=${id}`;
    });
  });

  main.querySelectorAll(".other-sem").forEach((btn) => {
    btn.addEventListener("click", () => {
      const t = btn.getAttribute("data-target");
      if (t) window.location.hash = `#/semester?semId=${t}`;
    });
  });
}

function escapeHtml(str) {
  if (str == null) return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}