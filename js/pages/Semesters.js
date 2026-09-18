/**
 * Semesters — with hash guard
 */

import { AppShell } from "../components/AppShell.js";
import { getSemestersByDepartment, getDepartments } from "../services/api.js";
import { storage, STORAGE_KEYS } from "../core/storage.js";
import { listSkeleton } from "../utils/skeleton.js";
import { errorState, emptyState } from "../utils/errorState.js";

export async function renderSemesters() {
  const MY_HASH = "#/semesters";

  AppShell.updateHeader({
    title: "Select Semester",
    subtitle: "Loading...",
    showBack: true,
    showSearch: false,
    showTheme: true,
    showSettings: false,
    expectedHash: MY_HASH
  });

  const main = AppShell.getMainView();
  if (!main) return;

  main.innerHTML = listSkeleton(4, "80px");

  const settings = storage.get(STORAGE_KEYS.SETTINGS, {});
  const deptId = settings.departmentId || settings.department || "";

  if (!deptId) {
    main.innerHTML = errorState({
      type: "notFound",
      customBangla: "Department select করা হয়নি",
      retryFn: () => window.location.hash = "#/departments"
    });
    return;
  }

  let departments = [], semesters = [];
  try { departments = await getDepartments(); } catch (e) {}
  try { semesters = await getSemestersByDepartment(deptId); } catch (e) {}

  // Guard
  if ((window.location.hash || "").split("?")[0] !== MY_HASH) {
    console.log("[Semesters] Route changed — abort");
    return;
  }

  const currentDept = departments.find((d) => d.id === deptId);

  if (semesters.length === 0) {
    main.innerHTML = emptyState({
      icon: "📅",
      title: "কোনো Semester নেই",
      message: `${currentDept ? currentDept.name : "এই"} department-এ এখনো semester যোগ করা হয়নি।`,
      actionFn: () => window.location.hash = "#/departments",
      actionLabel: "← অন্য Department"
    });
    return;
  }

  AppShell.updateHeader({
    title: "Select Semester",
    subtitle: currentDept ? currentDept.name : "",
    showBack: true,
    showSearch: false,
    showTheme: true,
    showSettings: false,
    expectedHash: MY_HASH
  });

  const currentSemId = settings.semesterId || settings.semester || "";

  main.innerHTML = `
    ${currentDept ? `
      <div style="display:flex;align-items:center;gap:12px;padding:14px 16px;background:linear-gradient(135deg, #DCFCE7, #BBF7D0);border:1px solid #10B981;border-radius:16px;margin-bottom:18px;">
        <div style="width:44px;height:44px;border-radius:13px;background:#FFFFFF;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;">${currentDept.icon || "🏛️"}</div>
        <div style="flex:1;min-width:0;">
          <div style="font-size:13.5px;font-weight:800;color:#065F46;margin-bottom:2px;">${escapeHtml(currentDept.name)}</div>
          <div style="font-size:11px;color:#047857;font-weight:600;">${semesters.length}টি semester available</div>
        </div>
        <button id="change-dept" style="padding:7px 12px;border-radius:10px;background:#FFFFFF;border:1px solid #10B981;color:#065F46;font-weight:800;font-size:11px;cursor:pointer;font-family:inherit;">Change</button>
      </div>
    ` : ""}

    <div style="display:flex;flex-direction:column;gap:10px;">
      ${semesters.map((sem) => {
        const isSelected = sem.id === currentSemId;
        return `
          <button class="sem-card" data-id="${sem.id}" data-number="${sem.number}" style="
            display:flex;align-items:center;gap:14px;padding:16px;
            background:${isSelected ? "linear-gradient(135deg, #FEF3C7, #FDE68A)" : "#FFFFFF"};
            border:1.5px solid ${isSelected ? "#F59E0B" : "#E1E8E1"};
            border-radius:16px;cursor:pointer;font-family:inherit;text-align:left;
            box-shadow:${isSelected ? "0 6px 16px rgba(245,158,11,0.15)" : "0 2px 8px rgba(28,62,44,0.04)"};
            width:100%;
          ">
            <div style="width:52px;height:52px;border-radius:15px;background:${isSelected ? "#FFFFFF" : "linear-gradient(135deg, #FEF3C7, #FDE68A)"};display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0;">${sem.icon || "📅"}</div>
            <div style="flex:1;min-width:0;">
              <div style="font-size:14.5px;font-weight:800;color:${isSelected ? "#78350F" : "#1C3E2C"};margin-bottom:3px;">${escapeHtml(sem.name)}</div>
              <div style="font-size:11px;font-weight:600;color:${isSelected ? "#92400E" : "#84968B"};">Semester ${sem.number}</div>
            </div>
            ${isSelected ? `<div style="width:28px;height:28px;border-radius:50%;background:#F59E0B;color:#FFFFFF;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:900;flex-shrink:0;">✓</div>` : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#84968B" stroke-width="2.5" stroke-linecap="round" style="flex-shrink:0;"><polyline points="9 18 15 12 9 6"></polyline></svg>`}
          </button>
        `;
      }).join("")}
    </div>

    <div style="height:20px;"></div>
  `;

  main.querySelector("#change-dept")?.addEventListener("click", () => {
    window.location.hash = "#/departments";
  });

  main.querySelectorAll(".sem-card").forEach((card) => {
    card.addEventListener("click", () => {
      const id = card.getAttribute("data-id");
      const number = parseInt(card.getAttribute("data-number"), 10);
      if (!id) return;

      const ns = storage.get(STORAGE_KEYS.SETTINGS, {});
      ns.semester = id;
      ns.semesterId = id;
      ns.semesterNumber = number;
      storage.set(STORAGE_KEYS.SETTINGS, ns);

      card.style.transform = "scale(0.97)";
      setTimeout(() => { window.location.hash = "#/home"; }, 200);
    });
  });
}

function escapeHtml(str) {
  if (str == null) return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}