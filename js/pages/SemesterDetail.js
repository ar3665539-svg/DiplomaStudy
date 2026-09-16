/**
 * DiplomaStudy - Semester Detail Page
 * একটা semester এ কি কি book আছে সেটা দেখায়
 */

import { AppShell } from "../components/AppShell.js";
import { getSemesterById, semesters } from "../../data/semesterStructure.js";
import { getBooksBySemester } from "../../data/semesterBooks.js";
import { CIVIL_DEPARTMENT } from "../../data/civilSubjects.js";
import { EmptyState } from "../components/EmptyState.js";
import { showComingSoon } from "../core/comingSoonHelper.js";
import { router } from "../core/router.js";

export function renderSemesterDetail(params = {}) {
  const semesterId = Number(params.semId) || 1;
  const semester = getSemesterById(semesterId);

  if (!semester) {
    AppShell.updateHeader({
      title: "Semester Not Found",
      showBack: true
    });
    const main = AppShell.getMainView();
    if (main) {
      main.innerHTML = EmptyState.render({
        icon: "❓",
        title: "Semester Not Found",
        banglaTitle: "সেমিস্টার পাওয়া যায়নি",
        message: "এই semester টি খুঁজে পাওয়া যায়নি।",
        showBadge: false
      });
    }
    return;
  }

  AppShell.updateHeader({
    title: `${semester.banglaName} (${semester.name})`,
    subtitle: CIVIL_DEPARTMENT.name,
    showBack: true
  });

  const main = AppShell.getMainView();
  if (!main) return;

  const books = getBooksBySemester(semesterId);
  const hasBooks = books.length > 0;

  main.innerHTML = `
    <!-- ═══════════════════════════════════
         SEMESTER HERO
         ═══════════════════════════════════ -->
    <div class="semester-hero">
      <div class="semester-hero-bg"></div>
      <div class="semester-hero-content">
        <div class="semester-hero-icon">${semester.icon}</div>
        <div class="semester-hero-info">
          <h1 class="semester-hero-name">${semester.banglaName}</h1>
          <p class="semester-hero-en">${semester.name} • Semester ${semester.roman}</p>
          <p class="semester-hero-desc">${semester.description}</p>
        </div>
        <div class="semester-hero-stats">
          <div class="shs-item">
            <span class="shs-value">${books.length}</span>
            <span class="shs-label">বই</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════
         BOOKS LIST / EMPTY STATE
         ═══════════════════════════════════ -->
    ${hasBooks ? `
      <div class="compact-section-header">
        <span class="csh-icon">📚</span>
        <span class="csh-title">সব বই (${books.length}টি)</span>
        <span class="csh-hint">📄 PDF</span>
      </div>

      <div class="semester-books-list">
        ${books.map((book, idx) => `
          <div 
            class="book-card" 
            data-book-id="${book.id}"
            data-book-name="${book.name}"
            role="button"
            tabindex="0"
            aria-label="${book.name}"
          >
            <div class="book-number">${String(idx + 1).padStart(2, "0")}</div>
            
            <div class="book-icon-box">
              <span class="book-icon">${book.icon}</span>
            </div>

            <div class="book-body">
              <h3 class="book-name">${book.name}</h3>
              <p class="book-bangla">${book.banglaName}</p>
              <div class="book-meta">
                <span class="book-chip">${book.code}</span>
                <span class="book-chip">${book.type}</span>
                <span class="book-chip book-chip-credit">${book.credits} cr</span>
              </div>
            </div>

            <div class="book-pdf-icon">
              <span class="bpi-icon">📄</span>
              <span class="bpi-label">PDF</span>
            </div>
          </div>
        `).join("")}
      </div>

      <!-- Info Box -->
      <div class="info-box-civil mt-md">
        <div class="info-icon">💡</div>
        <div>
          <p class="info-text">সব বই PDF আকারে থাকবে</p>
          <p class="info-sub">Server থেকে PDF যোগ করা হলে প্রতিটা বই tap করে পড়া যাবে।</p>
        </div>
      </div>

    ` : `
      <div class="empty-semester-box">
        <div class="esb-icon">${semester.icon}</div>
        <h3 class="esb-title">${semester.banglaName} এর বই শীঘ্রই আসছে</h3>
        <p class="esb-bangla">এই semester এর সব বই server থেকে যোগ করা হবে।</p>
        <div class="esb-features">
          <span class="esb-chip">📄 PDF Books</span>
          <span class="esb-chip">📚 All Subjects</span>
          <span class="esb-chip">🔒 Coming Soon</span>
        </div>
      </div>
    `}

    <!-- ═══════════════════════════════════
         QUICK SEMESTER NAVIGATION
         ═══════════════════════════════════ -->
    <div class="compact-section-header">
      <span class="csh-icon">⚡</span>
      <span class="csh-title">অন্য সেমিস্টার</span>
    </div>

    <div class="semester-quick-nav">
      ${semesters
        .filter((s) => s.id !== semesterId)
        .map((s) => `
          <button 
            class="sqn-btn ${s.isActive ? "active" : "locked"}"
            data-target-sem="${s.id}"
          >
            <span class="sqn-icon">${s.icon}</span>
            <span class="sqn-name">${s.banglaName}</span>
            ${!s.isActive ? `<span class="sqn-lock">🔒</span>` : ""}
          </button>
        `).join("")}
    </div>
  `;

  // ═══════════════════════════════════════════
  // Bind book click → show PDF coming soon
  // ═══════════════════════════════════════════
  main.querySelectorAll(".book-card").forEach((card) => {
    const handle = () => {
      const name = card.getAttribute("data-book-name");
      showComingSoon(`📄 ${name} PDF`);
    };
    card.addEventListener("click", handle);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handle();
      }
    });
  });

  // ═══════════════════════════════════════════
  // Bind quick semester navigation
  // ═══════════════════════════════════════════
  main.querySelectorAll(".sqn-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = Number(btn.getAttribute("data-target-sem"));
      const targetSem = getSemesterById(targetId);
      if (targetSem && targetSem.isActive) {
        router.navigate(`#/semester?semId=${targetId}`);
      } else {
        showComingSoon(`${targetSem.banglaName} এর বই`);
      }
    });
  });
}