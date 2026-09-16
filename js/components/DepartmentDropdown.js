/**
 * DiplomaStudy - Department Dropdown Component
 * Home page এ department selector
 */

import { departments } from "../../data/departments.js";

export const DepartmentDropdown = {
  render(currentDeptId = "civil") {
    const currentDept = departments.find((d) => d.id === currentDeptId) || departments[0];

    return `
      <div class="dept-dropdown-wrap" id="dept-dropdown">
        <button 
          class="dept-dropdown-trigger" 
          id="dept-trigger"
          aria-expanded="false"
          aria-haspopup="listbox"
        >
          <div class="ddt-left">
            <div class="ddt-icon">${currentDept.icon}</div>
            <div class="ddt-text">
              <span class="ddt-label">ডিপার্টমেন্ট নির্বাচন করুন</span>
              <span class="ddt-value">${currentDept.banglaName}</span>
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
                role="option"
                aria-selected="${dept.id === currentDeptId}"
              >
                <div class="ddm-item-icon" style="background: ${dept.color}15; color: ${dept.color};">
                  ${dept.icon}
                </div>
                <div class="ddm-item-body">
                  <span class="ddm-item-name">${dept.name}</span>
                  <span class="ddm-item-bangla">${dept.banglaName}</span>
                </div>
                <div class="ddm-item-status">
                  ${dept.id === currentDeptId 
                    ? `<span class="ddm-badge ddm-badge-current">✓ Selected</span>`
                    : dept.hasPdf
                      ? `<span class="ddm-badge ddm-badge-ready">${dept.pdfCount} PDFs</span>`
                      : `<span class="ddm-badge ddm-badge-soon">🔒 Soon</span>`
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

    if (!trigger || !menu) return;

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
    document.addEventListener("click", (e) => {
      if (!wrap.contains(e.target)) {
        wrap.classList.remove("open");
        trigger.setAttribute("aria-expanded", "false");
      }
    });
  }
};