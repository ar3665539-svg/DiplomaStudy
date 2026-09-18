/**
 * SelectionModal — Department + Semester combined picker
 */

import { getDepartments, getSemestersByDepartment } from "../services/api.js";
import { storage, STORAGE_KEYS } from "../core/storage.js";

export const SelectionModal = {
  async show(onComplete) {
    document.getElementById("ds-selection-modal")?.remove();

    const overlay = document.createElement("div");
    overlay.id = "ds-selection-modal";
    overlay.style.cssText = `
      position:fixed;inset:0;background:rgba(15,23,42,0.75);
      backdrop-filter:blur(8px);z-index:9999;
      display:flex;align-items:flex-end;justify-content:center;
      animation:fadeIn 0.2s ease;
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

    // Load
    let departments = [];
    try { departments = await getDepartments(); } catch (e) {}

    if (departments.length === 0) {
      overlay.querySelector("div").innerHTML = `
        <div style="text-align:center;padding:40px 20px;">
          <div style="font-size:56px;margin-bottom:12px;">🏛️</div>
          <h3 style="font-size:16px;font-weight:800;color:#1C3E2C;margin:0 0 8px;">কোনো Department নেই</h3>
          <p style="font-size:12.5px;color:#84968B;">Admin Panel থেকে department যোগ করুন।</p>
        </div>
      `;
      return;
    }

    const settings = storage.get(STORAGE_KEYS.SETTINGS, {});
    let selectedDeptId = settings.departmentId || settings.department || departments[0].id;
    let selectedSemId = settings.semesterId || settings.semester || "";
    let semesters = [];

    const modal = overlay.querySelector("div");
    modal.innerHTML = `
      <div style="width:40px;height:4px;background:#E1E8E1;border-radius:999px;margin:0 auto 16px;"></div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
        <h3 style="font-size:17px;font-weight:900;color:#1C3E2C;margin:0;letter-spacing:-0.3px;">Department & Semester</h3>
        <button data-close style="width:32px;height:32px;border-radius:10px;background:#F2F5F2;border:none;color:#57675D;font-size:14px;cursor:pointer;font-family:inherit;">✕</button>
      </div>
      <div id="step-dept">
        <div style="font-size:11px;font-weight:800;color:#84968B;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:10px;">১. Department নির্বাচন করুন</div>
        <div id="dept-list" style="display:flex;flex-direction:column;gap:8px;margin-bottom:20px;"></div>
      </div>
      <div id="step-sem" style="display:none;">
        <div style="font-size:11px;font-weight:800;color:#84968B;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:10px;">২. Semester নির্বাচন করুন</div>
        <div id="sem-list" style="display:flex;flex-direction:column;gap:8px;"></div>
      </div>
    `;

    modal.querySelector("[data-close]").onclick = close;

    const deptList = modal.querySelector("#dept-list");
    const stepSem = modal.querySelector("#step-sem");
    const semList = modal.querySelector("#sem-list");

    deptList.innerHTML = departments.map((d) => `
      <button class="dept-pick" data-id="${d.id}" style="
        display:flex;align-items:center;gap:12px;padding:14px;
        background:${d.id === selectedDeptId ? "#DCFCE7" : "#F8FBF8"};
        border:1.5px solid ${d.id === selectedDeptId ? "#10B981" : "#E1E8E1"};
        border-radius:14px;cursor:pointer;font-family:inherit;text-align:left;width:100%;
      ">
        <div style="width:44px;height:44px;border-radius:13px;background:#FFFFFF;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;">${d.icon || "🏛️"}</div>
        <div style="flex:1;min-width:0;">
          <div style="font-size:13.5px;font-weight:800;color:#1C3E2C;">${escapeHtml(d.name)}</div>
          ${d.banglaName ? `<div style="font-size:11px;color:#84968B;font-weight:600;">${escapeHtml(d.banglaName)}</div>` : ""}
        </div>
      </button>
    `).join("");

    async function loadSemesters(deptId) {
      stepSem.style.display = "block";
      semList.innerHTML = `<div style="text-align:center;padding:20px;"><div class="spinner" style="margin:0 auto;"></div></div>`;

      try {
        semesters = await getSemestersByDepartment(deptId);
      } catch (e) { semesters = []; }

      if (semesters.length === 0) {
        semList.innerHTML = `<div style="padding:20px;text-align:center;background:#FEF3C7;border:1.5px dashed #FCD34D;border-radius:14px;">
          <div style="font-size:13px;font-weight:800;color:#92400E;">কোনো Semester নেই</div>
        </div>`;
        return;
      }

      semList.innerHTML = semesters.map((s) => `
        <button class="sem-pick" data-id="${s.id}" data-number="${s.number}" style="
          display:flex;align-items:center;gap:12px;padding:14px;
          background:${s.id === selectedSemId ? "#DCFCE7" : "#F8FBF8"};
          border:1.5px solid ${s.id === selectedSemId ? "#10B981" : "#E1E8E1"};
          border-radius:14px;cursor:pointer;font-family:inherit;text-align:left;width:100%;
        ">
          <div style="width:44px;height:44px;border-radius:13px;background:#FFFFFF;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;">${s.icon || "📅"}</div>
          <div style="flex:1;min-width:0;">
            <div style="font-size:13.5px;font-weight:800;color:#1C3E2C;">${escapeHtml(s.name)}</div>
            <div style="font-size:11px;color:#84968B;font-weight:600;">Semester ${s.number}</div>
          </div>
        </button>
      `).join("");

      semList.querySelectorAll(".sem-pick").forEach((btn) => {
        btn.addEventListener("click", () => {
          const semId = btn.getAttribute("data-id");
          const semNum = parseInt(btn.getAttribute("data-number"), 10);
          const ns = storage.get(STORAGE_KEYS.SETTINGS, {});
          ns.department = selectedDeptId;
          ns.departmentId = selectedDeptId;
          ns.semester = semId;
          ns.semesterId = semId;
          ns.semesterNumber = semNum;
          storage.set(STORAGE_KEYS.SETTINGS, ns);
          close();
          if (onComplete) onComplete(selectedDeptId, semId);
          else setTimeout(() => window.location.reload(), 100);
        });
      });
    }

    deptList.querySelectorAll(".dept-pick").forEach((btn) => {
      btn.addEventListener("click", () => {
        selectedDeptId = btn.getAttribute("data-id");
        selectedSemId = "";
        deptList.querySelectorAll(".dept-pick").forEach((b) => {
          const isThis = b.getAttribute("data-id") === selectedDeptId;
          b.style.background = isThis ? "#DCFCE7" : "#F8FBF8";
          b.style.borderColor = isThis ? "#10B981" : "#E1E8E1";
        });
        loadSemesters(selectedDeptId);
      });
    });

    if (selectedDeptId) loadSemesters(selectedDeptId);
  }
};

function escapeHtml(str) {
  if (str == null) return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}