/**
 * DiplomaStudy - Department PDF Viewer Page
 * Department select করার পর এই page এ PDF দেখাবে
 */

import { AppShell } from "../components/AppShell.js";
import { getDepartmentById } from "../../data/departments.js";
import { civilSubjects } from "../../data/civilSubjects.js";
import { showComingSoon } from "../core/comingSoonHelper.js";
import { EmptyState } from "../components/EmptyState.js";

export function renderDepartmentPDF(params = {}) {
  const deptId = params.deptId || "civil";
  const dept = getDepartmentById(deptId);

  AppShell.updateHeader({
    title: dept.name,
    subtitle: dept.banglaName,
    showBack: true
  });

  const main = AppShell.getMainView();
  if (!main) return;

  // Civil হলে subjects এর PDF list, নাহলে empty
  const hasPdfs = dept.hasPdf && dept.id === "civil";
  const books = hasPdfs ? civilSubjects : [];

  main.innerHTML = `
    <!-- ═══════════════════════════════════
         DEPARTMENT HERO
         ═══════════════════════════════════ -->
    <div class="dept-pdf-hero" style="border-left-color: ${dept.color};">
      <div class="dph-icon" style="background: ${dept.color}15; color: ${dept.color};">
        ${dept.icon}
      </div>
      <div class="dph-info">
        <h1 class="dph-name">${dept.name}</h1>
        <p class="dph-bangla">${dept.banglaName}</p>
        ${hasPdfs 
          ? `<span class="dph-count">📚 ${books.length}টি PDF বই</span>`
          : `<span class="dph-count dph-count-soon">🔒 PDF শীঘ্রই আসছে</span>`
        }
      </div>
    </div>

    <!-- ═══════════════════════════════════
         PDF LIST OR EMPTY STATE
         ═══════════════════════════════════ -->
    ${hasPdfs ? `
      <div class="compact-section-header">
        <span class="csh-icon">📄</span>
        <span class="csh-title">PDF Books (${books.length}টি)</span>
        <span class="csh-hint">ট্যাপ করুন</span>
      </div>

      <div class="pdf-books-grid">
        ${books.map((book, idx) => `
          <div 
            class="pdf-book-card" 
            data-pdf-id="${book.id}"
            data-pdf-name="${book.name}"
            role="button"
            tabindex="0"
          >
            <div class="pbc-top">
              <div class="pbc-icon">${book.icon}</div>
              <div class="pbc-pdf-badge">PDF</div>
            </div>
            <div class="pbc-body">
              <h3 class="pbc-name">${book.name}</h3>
              <p class="pbc-bangla">${book.banglaName}</p>
            </div>
            <div class="pbc-footer">
              <span class="pbc-code">${book.code}</span>
              <span class="pbc-open">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </span>
            </div>
          </div>
        `).join("")}
      </div>

      <div class="info-box-civil mt-md">
        <div class="info-icon">💡</div>
        <div>
          <p class="info-text">PDF শীঘ্রই server থেকে যুক্ত হবে</p>
          <p class="info-sub">প্রতিটা বই tap করলে PDF viewer খুলবে যেখানে পড়তে পারবেন।</p>
        </div>
      </div>
    ` : `
      <div class="dept-empty-pdf">
        <div class="dep-icon">📄</div>
        <h3 class="dep-title">PDF এখনো আসেনি</h3>
        <p class="dep-bangla">
          <strong>${dept.banglaName}</strong> এর বইয়ের PDF শীঘ্রই server থেকে যুক্ত করা হবে।
        </p>
        <div class="dep-features">
          <span class="dep-chip">📄 PDF Books</span>
          <span class="dep-chip">📚 All Subjects</span>
          <span class="dep-chip">🔒 Coming Soon</span>
        </div>
      </div>
    `}

    <!-- Bottom spacing -->
    <div style="height: 20px;"></div>
  `;

  // Bind PDF book clicks → show coming soon
  main.querySelectorAll(".pdf-book-card").forEach((card) => {
    const handle = () => {
      const name = card.getAttribute("data-pdf-name");
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
}