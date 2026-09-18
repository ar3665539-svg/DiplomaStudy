/**
 * SemesterDropdown — DB-driven, loads semesters for current dept
 */

import { getSemestersByDepartment } from "../services/api.js";
import { storage, STORAGE_KEYS } from "../core/storage.js";

export const SemesterDropdown = {
  _cache: {},

  async loadSemesters(deptId) {
    if (!deptId) return [];
    if (this._cache[deptId]) return this._cache[deptId];
    try {
      const sems = await getSemestersByDepartment(deptId);
      this._cache[deptId] = sems;
      return sems;
    } catch (e) { return []; }
  },

  async render(currentSemId = "") {
    const settings = storage.get(STORAGE_KEYS.SETTINGS, {});
    const deptId = settings.departmentId || settings.department || "";
    const semesters = await this.loadSemesters(deptId);
    const currentSem = semesters.find((s) => s.id === currentSemId) || semesters[0];

    if (!currentSem) {
      return `
        <div style="padding:14px;text-align:center;background:#FEF3C7;border-radius:14px;border:1px solid #FCD34D;">
          <div style="font-size:12.5px;font-weight:700;color:#92400E;">📅 কোনো Semester নেই</div>
        </div>
      `;
    }

    return `
      <div class="semester-dropdown-wrap" id="semester-dropdown">
        <button class="semester-dropdown-trigger" id="semester-trigger" type="button" aria-expanded="false">
          <div class="sdt-left">
            <span class="sdt-icon">📚</span>
            <div class="sdt-text">
              <span class="sdt-label">সেমিস্টার</span>
              <span class="sdt-value">${escapeHtml(currentSem.name)}</span>
            </div>
          </div>
          <div class="sdt-chevron">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </button>
        <div class="semester-dropdown-menu" id="semester-menu" role="listbox">
          <div class="sdm-header">
            <span class="sdm-title">সেমিস্টার নির্বাচন করুন</span>
            <span class="sdm-hint">ট্যাপ করুন</span>
          </div>
          ${semesters.map((s) => `
            <button class="sdm-item ${s.id === currentSemId ? "active" : ""}" data-semester-id="${s.id}" data-semester-number="${s.number}" type="button" role="option">
              <div class="sdm-item-icon">${s.icon || "📅"}</div>
              <div class="sdm-item-body">
                <div class="sdm-item-top">
                  <span class="sdm-item-name">${escapeHtml(s.name)}</span>
                  <span class="sdm-item-roman">#${s.number}</span>
                </div>
                <span class="sdm-item-sub">Semester ${s.number}</span>
              </div>
            </button>
          `).join("")}
        </div>
      </div>
    `;
  },

  bindEvents(container, onSelect) {
    const trigger = container.querySelector("#semester-trigger");
    const menu = container.querySelector("#semester-menu");
    const wrap = container.querySelector("#semester-dropdown");
    if (!trigger || !menu || !wrap) return;

    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = wrap.classList.contains("open");
      if (isOpen) {
        wrap.classList.remove("open");
        trigger.setAttribute("aria-expanded", "false");
      } else {
        wrap.classList.add("open");
        trigger.setAttribute("aria-expanded", "true");
      }
    });

    menu.querySelectorAll(".sdm-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        e.stopPropagation();
        const semId = item.getAttribute("data-semester-id");
        const semNum = parseInt(item.getAttribute("data-semester-number"), 10);
        wrap.classList.remove("open");
        trigger.setAttribute("aria-expanded", "false");

        if (onSelect) {
          onSelect(semId, semNum);
        } else {
          const ns = storage.get(STORAGE_KEYS.SETTINGS, {});
          ns.semester = semId;
          ns.semesterId = semId;
          ns.semesterNumber = semNum;
          storage.set(STORAGE_KEYS.SETTINGS, ns);
          window.location.reload();
        }
      });
    });

    document.addEventListener("click", (e) => {
      if (!wrap.contains(e.target)) {
        wrap.classList.remove("open");
        trigger.setAttribute("aria-expanded", "false");
      }
    });
  }
};

function escapeHtml(str) {
  if (str == null) return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}