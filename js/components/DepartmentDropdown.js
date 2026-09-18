/**
 * DiplomaStudy - Department Dropdown (DB-driven)
 * Loads departments from server
 */

import { getDepartments } from "../services/api.js";

export const DepartmentDropdown = {
  // Cache departments in memory
  _cache: null,

  async loadDepartments() {
    if (this._cache) return this._cache;
    try {
      this._cache = await getDepartments();
      return this._cache;
    } catch (e) {
      console.warn("[DeptDropdown] Load failed:", e);
      return [];
    }
  },

  async render(currentDeptId = "") {
    const departments = await this.loadDepartments();
    const currentDept = departments.find((d) => d.id === currentDeptId) || departments[0];

    if (!currentDept) {
      return `<div style="padding:16px;text-align:center;color:#84968B;font-size:13px;">কোনো Department নেই</div>`;
    }

    return `
      <div class="dept-dropdown-wrap" id="dept-dropdown">
        <button 
          class="dept-dropdown-trigger" 
          id="dept-trigger"
          type="button"
          aria-expanded="false"
          aria-haspopup="listbox"
        >
          <div class="ddt-left">
            <div class="ddt-icon">${currentDept.icon || "🏛️"}</div>
            <div class="ddt-text">
              <span class="ddt-label">ডিপার্টমেন্ট নির্বাচন করুন</span>
              <span class="ddt-value">${escapeHtml(currentDept.banglaName || currentDept.name)}</span>
            </div>
          </div>
          <div class="ddt-chevron">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </button>

        <div class="dept-dropdown-menu" id="dept-menu" role="listbox">
          <div class="ddm-header">
            <span class="ddm-title">🎓 ডিপার্টমেন্ট নির্বাচন করুন</span>
            <span class="ddm-hint">ট্যাপ করুন</span>
          </div>

          <div class="ddm-list">
            ${departments.map((dept) => `
              <button 
                class="ddm-item ${dept.id === currentDeptId ? "active" : ""}"
                data-dept-id="${dept.id}"
                type="button"
                role="option"
                aria-selected="${dept.id === currentDeptId}"
              >
                <div class="ddm-item-icon" style="background: rgba(28,62,44,0.08); color: #1C3E2C;">
                  ${dept.icon || "🏛️"}
                </div>
                <div class="ddm-item-body">
                  <span class="ddm-item-name">${escapeHtml(dept.name)}</span>
                  <span class="ddm-item-bangla">${escapeHtml(dept.banglaName || "")}</span>
                </div>
                <div class="ddm-item-status">
                  ${dept.id === currentDeptId 
                    ? `<span class="ddm-badge ddm-badge-current">✓ Selected</span>`
                    : `<span class="ddm-badge ddm-badge-ready">Select</span>`
                  }
                </div>
              </button>
            `).join("")}
          </div>
        </div>
      </div>
    `;
  },

  bindEvents(container, onSelect) {
    const trigger = container.querySelector("#dept-trigger");
    const menu = container.querySelector("#dept-menu");
    const wrap = container.querySelector("#dept-dropdown");

    if (!trigger || !menu || !wrap) return;

    // Toggle dropdown
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

    // Item click
    menu.querySelectorAll(".ddm-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        e.stopPropagation();
        const deptId = item.getAttribute("data-dept-id");
        wrap.classList.remove("open");
        trigger.setAttribute("aria-expanded", "false");
        if (onSelect) onSelect(deptId);
      });
    });

    // Click outside
    const outsideHandler = (e) => {
      if (!wrap.contains(e.target)) {
        wrap.classList.remove("open");
        trigger.setAttribute("aria-expanded", "false");
      }
    };
    document.addEventListener("click", outsideHandler);
  }
};

function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}