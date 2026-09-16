/**
 * DiplomaStudy - Semester Dropdown Component
 * Home page এ semester selector
 */

import { semesters } from "../../data/semesterStructure.js";
import { router } from "../core/router.js";

export const SemesterDropdown = {
  render(currentSemesterId = 1) {
    const currentSem = semesters.find((s) => s.id === currentSemesterId);

    return `
      <div class="semester-dropdown-wrap" id="semester-dropdown">
        <button 
          class="semester-dropdown-trigger" 
          id="semester-trigger"
          aria-expanded="false"
          aria-haspopup="listbox"
        >
          <div class="sdt-left">
            <span class="sdt-icon">📚</span>
            <div class="sdt-text">
              <span class="sdt-label">সেমিস্টার</span>
              <span class="sdt-value">${currentSem ? currentSem.banglaName : "১ম পর্ব"}</span>
            </div>
          </div>
          <div class="sdt-chevron">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </button>

        <div class="semester-dropdown-menu" id="semester-menu" role="listbox">
          <div class="sdm-header">
            <span class="sdm-title">সেমিস্টার নির্বাচন করুন</span>
            <span class="sdm-hint">ট্যাপ করুন</span>
          </div>

          ${semesters.map((sem) => `
            <button 
              class="sdm-item ${sem.id === currentSemesterId ? "active" : ""}"
              data-semester-id="${sem.id}"
              role="option"
              aria-selected="${sem.id === currentSemesterId}"
            >
              <div class="sdm-item-icon">${sem.icon}</div>
              <div class="sdm-item-body">
                <div class="sdm-item-top">
                  <span class="sdm-item-name">${sem.banglaName}</span>
                  <span class="sdm-item-roman">${sem.roman}</span>
                </div>
                <span class="sdm-item-sub">${sem.name} • ${sem.subtitle}</span>
              </div>
              <div class="sdm-item-status">
                ${sem.isActive && sem.totalBooks > 0 
                  ? `<span class="sdm-badge sdm-badge-ready">${sem.totalBooks}টি বই</span>`
                  : `<span class="sdm-badge sdm-badge-soon">🔒</span>`
                }
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

    // Click on item
    menu.querySelectorAll(".sdm-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        e.stopPropagation();
        const semId = Number(item.getAttribute("data-semester-id"));
        wrap.classList.remove("open");
        trigger.setAttribute("aria-expanded", "false");
        if (onSelect) onSelect(semId);
      });
    });

    // Click outside to close
    document.addEventListener("click", (e) => {
      if (!wrap.contains(e.target)) {
        wrap.classList.remove("open");
        trigger.setAttribute("aria-expanded", "false");
      }
    });
  }
};