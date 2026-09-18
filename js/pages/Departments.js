/**
 * Departments — with hash guard
 */

import { AppShell } from "../components/AppShell.js";
import { getDepartments, getSemestersByDepartment } from "../services/api.js";
import { storage, STORAGE_KEYS } from "../core/storage.js";
import { cardGridSkeleton } from "../utils/skeleton.js";
import { errorState, emptyState } from "../utils/errorState.js";

export async function renderDepartments() {
  const MY_HASH = "#/departments";

  AppShell.updateHeader({
    title: "Engineering Departments",
    subtitle: "Select your technology",
    showBack: true,
    showSearch: false,
    showTheme: true,
    showSettings: false,
    expectedHash: MY_HASH
  });

  const main = AppShell.getMainView();
  if (!main) return;

  main.innerHTML = cardGridSkeleton(6);

  let departments = [];
  try { departments = await getDepartments(); } catch (e) {}

  // Guard
  if ((window.location.hash || "").split("?")[0] !== MY_HASH) {
    console.log("[Departments] Route changed — abort");
    return;
  }

  const settings = storage.get(STORAGE_KEYS.SETTINGS, {});
  const currentDeptId = settings.departmentId || settings.department || "";

  if (departments.length === 0) {
    main.innerHTML = emptyState({
      icon: "🏛️",
      title: "No Departments",
      message: "Admin Panel থেকে department যোগ করুন।"
    });
    return;
  }

  main.innerHTML = `
    <div style="padding:14px 16px;background:linear-gradient(135deg, rgba(28,62,44,0.06), transparent);border-left:4px solid #1C3E2C;border-radius:14px;margin-bottom:18px;">
      <p style="font-size:12.5px;color:#57675D;line-height:1.55;font-weight:500;margin:0;">আপনার ইঞ্জিনিয়ারিং টেকনোলজি নির্বাচন করুন।</p>
    </div>

    <div style="display:grid;grid-template-columns:repeat(2, 1fr);gap:12px;">
      ${departments.map((dept) => {
        const isSelected = dept.id === currentDeptId;
        return `
          <button class="dept-card" data-id="${dept.id}" style="
            position:relative;display:flex;flex-direction:column;align-items:center;
            padding:18px 12px 16px;
            background:${isSelected ? "linear-gradient(135deg, #DCFCE7, #BBF7D0)" : "#FFFFFF"};
            border:1.5px solid ${isSelected ? "#10B981" : "#E1E8E1"};
            border-radius:18px;cursor:pointer;font-family:inherit;text-align:center;
            transition:all 0.2s cubic-bezier(0.34,1.56,0.64,1);
            box-shadow:${isSelected ? "0 8px 20px rgba(16,185,129,0.15)" : "0 2px 8px rgba(28,62,44,0.05)"};
            min-height:140px;
          ">
            ${isSelected ? `<div style="position:absolute;top:8px;right:8px;width:22px;height:22px;border-radius:50%;background:#10B981;color:#FFFFFF;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:900;">✓</div>` : ""}
            <div style="width:56px;height:56px;border-radius:16px;background:${isSelected ? "#FFFFFF" : "linear-gradient(135deg, #F2F5F2, #E8EFE8)"};display:flex;align-items:center;justify-content:center;font-size:28px;margin-bottom:10px;flex-shrink:0;">${dept.icon || "🏛️"}</div>
            <div style="font-size:13.5px;font-weight:800;color:${isSelected ? "#065F46" : "#1C3E2C"};letter-spacing:-0.2px;line-height:1.25;margin-bottom:4px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">${escapeHtml(dept.code || dept.name)}</div>
            <div style="font-size:10.5px;color:${isSelected ? "#047857" : "#84968B"};font-weight:600;line-height:1.3;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">${escapeHtml(dept.banglaName || dept.name)}</div>
          </button>
        `;
      }).join("")}
    </div>

    <div style="height:20px;"></div>
  `;

  main.querySelectorAll(".dept-card").forEach((card) => {
    card.addEventListener("click", async (e) => {
      e.preventDefault();
      const deptId = card.getAttribute("data-id");
      if (!deptId) return;

      const ns = storage.get(STORAGE_KEYS.SETTINGS, {});
      ns.department = deptId;
      ns.departmentId = deptId;
      ns.semester = "";
      ns.semesterId = "";
      ns.semesterNumber = null;
      storage.set(STORAGE_KEYS.SETTINGS, ns);

      let sems = [];
      try { sems = await getSemestersByDepartment(deptId); } catch (err) {}

      if (sems.length === 1) {
        ns.semester = sems[0].id;
        ns.semesterId = sems[0].id;
        ns.semesterNumber = sems[0].number;
        storage.set(STORAGE_KEYS.SETTINGS, ns);
        window.location.hash = "#/home";
        return;
      }
      if (sems.length > 1) {
        window.location.hash = "#/semesters";
        return;
      }
      if (sems.length === 0) {
        alert("এই department-এ এখনো কোনো semester যোগ করা হয়নি।");
      }
    });
  });
}

function escapeHtml(str) {
  if (str == null) return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}