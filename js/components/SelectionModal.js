/**
 * DiplomaStudy - Selection Modal
 * Department + Semester পরিবর্তনের Modal
 */

import { storage, STORAGE_KEYS } from "../core/storage.js";
import { events } from "../core/events.js";

// ═══════════════════════════════════════════
// DEPARTMENTS
// ═══════════════════════════════════════════
const DEPARTMENTS = [
  { id: "civil",       name: "Civil Technology",       bangla: "সিভিল টেকনোলজি",          icon: "🏗️", active: true },
  { id: "computer",    name: "Computer Technology",    bangla: "কম্পিউটার টেকনোলজি",      icon: "💻", active: false },
  { id: "electrical",  name: "Electrical Technology",  bangla: "ইলেকট্রিক্যাল টেকনোলজি",   icon: "⚡", active: false },
  { id: "mechanical",  name: "Mechanical Technology",  bangla: "মেকানিক্যাল টেকনোলজি",     icon: "⚙️", active: false },
  { id: "electronics", name: "Electronics Technology", bangla: "ইলেকট্রনিক্স টেকনোলজি",   icon: "📟", active: false },
  { id: "power",       name: "Power Technology",       bangla: "পাওয়ার টেকনোলজি",         icon: "🔋", active: false },
  { id: "telecom",     name: "Telecommunication",      bangla: "টেলিকমিউনিকেশন",           icon: "📡", active: false },
  { id: "automobile",  name: "Automobile Technology",  bangla: "অটোমোবাইল টেকনোলজি",      icon: "🚗", active: false }
];

// ═══════════════════════════════════════════
// SEMESTERS
// ═══════════════════════════════════════════
const SEMESTERS = [
  { id: 1, name: "1st Semester", bangla: "১ম পর্ব",  roman: "I",    active: true },
  { id: 2, name: "2nd Semester", bangla: "২য় পর্ব",  roman: "II",   active: false },
  { id: 3, name: "3rd Semester", bangla: "৩য় পর্ব",  roman: "III",  active: false },
  { id: 4, name: "4th Semester", bangla: "৪র্থ পর্ব", roman: "IV",   active: false },
  { id: 5, name: "5th Semester", bangla: "৫ম পর্ব",   roman: "V",    active: false },
  { id: 6, name: "6th Semester", bangla: "৬ষ্ঠ পর্ব", roman: "VI",   active: false },
  { id: 7, name: "7th Semester", bangla: "৭ম পর্ব",   roman: "VII",  active: false },
  { id: 8, name: "8th Semester", bangla: "৮ম পর্ব",   roman: "VIII", active: false }
];

export const SelectionModal = {
  show(onSave) {
    // Remove existing
    document.getElementById("selection-modal")?.remove();

    // Get current
    const settings = storage.get(STORAGE_KEYS.SETTINGS, {});
    let selectedDept = settings.department || "civil";
    let selectedSem = settings.semester || 1;

    const overlay = document.createElement("div");
    overlay.id = "selection-modal";
    overlay.className = "modal-overlay";
    overlay.style.cssText = "display: flex; align-items: flex-end; justify-content: center; padding: 0;";

    const renderContent = () => {
      overlay.innerHTML = `
        <div class="selection-modal-content">
          
          <!-- Header -->
          <div class="sm-header">
            <div>
              <h2 class="sm-title">🔄 পরিবর্তন করুন</h2>
              <p class="sm-subtitle">Department এবং Semester নির্বাচন করুন</p>
            </div>
            <button class="sm-close" id="sm-close">✕</button>
          </div>

          <!-- Body -->
          <div class="sm-body">
            
            <!-- Department -->
            <div class="sm-section">
              <div class="sm-section-header">
                <span class="sm-section-num">১</span>
                <div>
                  <h3 class="sm-section-title">Department</h3>
                  <p class="sm-section-desc">আপনার Technology</p>
                </div>
              </div>
              <div class="dept-grid-onb">
                ${DEPARTMENTS.map(d => `
                  <button 
                    class="dept-card-onb ${selectedDept === d.id ? "active" : ""} ${!d.active ? "locked" : ""}" 
                    data-dept-id="${d.id}"
                  >
                    <div class="dept-onb-icon">${d.icon}</div>
                    <div class="dept-onb-name">${d.name}</div>
                    <div class="dept-onb-bangla">${d.bangla}</div>
                    ${!d.active ? '<span class="dept-onb-lock">🔒</span>' : ''}
                    ${selectedDept === d.id && d.active ? '<span class="dept-onb-check">✓</span>' : ''}
                  </button>
                `).join("")}
              </div>
            </div>

            <!-- Semester -->
            <div class="sm-section">
              <div class="sm-section-header">
                <span class="sm-section-num">২</span>
                <div>
                  <h3 class="sm-section-title">Semester</h3>
                  <p class="sm-section-desc">আপনার চলমান পর্ব</p>
                </div>
              </div>
              <div class="sem-grid-onb">
                ${SEMESTERS.map(s => `
                  <button 
                    class="sem-card-onb ${selectedSem === s.id ? "active" : ""} ${!s.active ? "locked" : ""}" 
                    data-sem-id="${s.id}"
                  >
                    <div class="sem-onb-roman">${s.roman}</div>
                    <div class="sem-onb-name">${s.name}</div>
                    <div class="sem-onb-bangla">${s.bangla}</div>
                    ${!s.active ? '<span class="sem-onb-lock">🔒</span>' : ''}
                    ${selectedSem === s.id && s.active ? '<span class="sem-onb-check">✓</span>' : ''}
                  </button>
                `).join("")}
              </div>
            </div>

          </div>

          <!-- Footer -->
          <div class="sm-footer">
            <button class="sm-btn sm-btn-cancel" id="sm-cancel">বাতিল</button>
            <button class="sm-btn sm-btn-save" id="sm-save">
              ✅ পরিবর্তন করুন
            </button>
          </div>

        </div>
      `;

      // Bind dept cards
      overlay.querySelectorAll(".dept-card-onb").forEach((card) => {
        card.addEventListener("click", () => {
          const deptId = card.getAttribute("data-dept-id");
          const dept = DEPARTMENTS.find(d => d.id === deptId);
          if (!dept || !dept.active) return;
          selectedDept = deptId;
          renderContent();
        });
      });

      // Bind sem cards
      overlay.querySelectorAll(".sem-card-onb").forEach((card) => {
        card.addEventListener("click", () => {
          const semId = parseInt(card.getAttribute("data-sem-id"), 10);
          const sem = SEMESTERS.find(s => s.id === semId);
          if (!sem || !sem.active) return;
          selectedSem = semId;
          renderContent();
        });
      });

      // Close
      overlay.querySelector("#sm-close")?.addEventListener("click", close);
      overlay.querySelector("#sm-cancel")?.addEventListener("click", close);

      // Save
      overlay.querySelector("#sm-save")?.addEventListener("click", () => {
        const newSettings = storage.get(STORAGE_KEYS.SETTINGS, {});
        newSettings.department = selectedDept;
        newSettings.semester = selectedSem;
        storage.set(STORAGE_KEYS.SETTINGS, newSettings);

        // Emit change events
        events.emit("state:departmentChange", selectedDept);
        events.emit("state:semesterChange", selectedSem);

        // Close
        close();

        // Callback
        if (onSave) onSave(selectedDept, selectedSem);
      });
    };

    const close = () => overlay.remove();

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });

    document.body.appendChild(overlay);
    renderContent();
  }
};