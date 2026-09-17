/**
 * DiplomaStudy - Onboarding / Welcome
 * Department + Semester Selection
 */

import { AppShell } from "../components/AppShell.js";
import { router } from "../core/router.js";
import { storage, STORAGE_KEYS } from "../core/storage.js";

// ═══════════════════════════════════════════
// DEPARTMENTS
// ═══════════════════════════════════════════
const DEPARTMENTS = [
  { id: "civil",       name: "Civil Technology",          bangla: "সিভিল টেকনোলজি",           icon: "🏗️", active: true },
  { id: "computer",    name: "Computer Technology",       bangla: "কম্পিউটার টেকনোলজি",       icon: "💻", active: false },
  { id: "electrical",  name: "Electrical Technology",     bangla: "ইলেকট্রিক্যাল টেকনোলজি",    icon: "⚡", active: false },
  { id: "mechanical",  name: "Mechanical Technology",     bangla: "মেকানিক্যাল টেকনোলজি",      icon: "⚙️", active: false },
  { id: "electronics", name: "Electronics Technology",    bangla: "ইলেকট্রনিক্স টেকনোলজি",    icon: "📟", active: false },
  { id: "power",       name: "Power Technology",          bangla: "পাওয়ার টেকনোলজি",          icon: "🔋", active: false },
  { id: "telecom",     name: "Telecommunication",         bangla: "টেলিকমিউনিকেশন",            icon: "📡", active: false },
  { id: "automobile",  name: "Automobile Technology",     bangla: "অটোমোবাইল টেকনোলজি",       icon: "🚗", active: false }
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

export function renderOnboarding() {
  AppShell.updateHeader({ showBack: false });

  const main = AppShell.getMainView();
  if (!main) return;

  // Current selection (default)
  let selectedDept = "civil";
  let selectedSem = 1;

  // Load from storage if exists
  const settings = storage.get(STORAGE_KEYS.SETTINGS, {});
  if (settings.department) selectedDept = settings.department;
  if (settings.semester) selectedSem = settings.semester;

  const renderUI = () => {
    main.innerHTML = `
      <div class="onboarding-page">
        
        <!-- Brand -->
        <div class="onb-brand">
          <div class="onb-logo">DS</div>
          <h1 class="onb-title">DiplomaStudy</h1>
          <p class="onb-subtitle">Learn Smart. Prepare Better.</p>
        </div>

        <!-- Info -->
        <div class="onb-info">
          <div class="onb-info-icon">👋</div>
          <div class="onb-info-body">
            <h3 class="onb-info-title">স্বাগতম!</h3>
            <p class="onb-info-text">আপনার Department এবং Semester নির্বাচন করুন</p>
          </div>
        </div>

        <!-- Department Selection -->
        <div class="onb-section">
          <div class="onb-section-header">
            <div class="onb-section-num">১</div>
            <div>
              <h3 class="onb-section-title">Department নির্বাচন করুন</h3>
              <p class="onb-section-desc">আপনার Technology বেছে নিন</p>
            </div>
          </div>

          <div class="dept-grid-onb">
            ${DEPARTMENTS.map(d => `
              <button 
                class="dept-card-onb ${selectedDept === d.id ? "active" : ""} ${!d.active ? "locked" : ""}" 
                data-dept-id="${d.id}"
                ${!d.active ? 'data-coming-soon="' + d.bangla + '"' : ''}
              >
                <div class="dept-onb-icon">${d.icon}</div>
                <div class="dept-onb-name">${d.name}</div>
                <div class="dept-onb-bangla">${d.bangla}</div>
                ${!d.active ? '<span class="dept-onb-lock">🔒 Soon</span>' : ''}
                ${selectedDept === d.id && d.active ? '<span class="dept-onb-check">✓</span>' : ''}
              </button>
            `).join("")}
          </div>
        </div>

        <!-- Semester Selection -->
        <div class="onb-section">
          <div class="onb-section-header">
            <div class="onb-section-num">২</div>
            <div>
              <h3 class="onb-section-title">Semester নির্বাচন করুন</h3>
              <p class="onb-section-desc">আপনার চলমান পর্ব বেছে নিন</p>
            </div>
          </div>

          <div class="sem-grid-onb">
            ${SEMESTERS.map(s => `
              <button 
                class="sem-card-onb ${selectedSem === s.id ? "active" : ""} ${!s.active ? "locked" : ""}" 
                data-sem-id="${s.id}"
                ${!s.active ? 'data-coming-soon="' + s.bangla + '"' : ''}
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

        <!-- Continue Button -->
        <div class="onb-footer">
          <button class="btn btn-primary btn-lg btn-block" id="onb-continue">
            <span>📖 পড়া শুরু করুন</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>

      </div>
    `;

    // Bind Department Cards
    main.querySelectorAll(".dept-card-onb").forEach((card) => {
      card.addEventListener("click", () => {
        const deptId = card.getAttribute("data-dept-id");
        const dept = DEPARTMENTS.find(d => d.id === deptId);
        if (!dept || !dept.active) return;
        selectedDept = deptId;
        renderUI();
      });
    });

    // Bind Semester Cards
    main.querySelectorAll(".sem-card-onb").forEach((card) => {
      card.addEventListener("click", () => {
        const semId = parseInt(card.getAttribute("data-sem-id"), 10);
        const sem = SEMESTERS.find(s => s.id === semId);
        if (!sem || !sem.active) return;
        selectedSem = semId;
        renderUI();
      });
    });

    // Continue Button
    main.querySelector("#onb-continue")?.addEventListener("click", () => {
      // Save to storage
      const newSettings = storage.get(STORAGE_KEYS.SETTINGS, {});
      newSettings.department = selectedDept;
      newSettings.semester = selectedSem;
      storage.set(STORAGE_KEYS.SETTINGS, newSettings);

      // Navigate to home
      router.navigate("#/home");
    });

    // Coming Soon handlers
    main.querySelectorAll("[data-coming-soon]").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        import("../core/comingSoonHelper.js").then(m => {
          m.showComingSoon(el.getAttribute("data-coming-soon"));
        });
      });
    });
  };

  renderUI();
}