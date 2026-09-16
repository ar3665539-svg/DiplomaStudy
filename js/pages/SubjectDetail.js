/**
 * DiplomaStudy - Subject Detail Page
 * Chapter dropdown এ ৬টা button:
 * 📝 রচনামূলক | 📄 সংক্ষিপ্ত | ⚡ অতি সংক্ষিপ্ত | 💡 সাজেশন | 🎯 কুইজ
 */

import { AppShell } from "../components/AppShell.js";
import { CIVIL_DEPARTMENT, getCivilSubjectById } from "../../data/civilSubjects.js";
import { subjectFeatures } from "../../data/comingSoonFeatures.js";
import { getChaptersBySubject } from "../../data/chapters.js";
import { EmptyState } from "../components/EmptyState.js";
import { showComingSoon } from "../core/comingSoonHelper.js";

export function renderSubjectDetail(params = {}) {
  const subjectId = params.subjectId;
  const subject = getCivilSubjectById(subjectId);

  // ─── Subject not found ───
  if (!subject) {
    AppShell.updateHeader({
      title: "Subject Not Found",
      showBack: true
    });
    const main = AppShell.getMainView();
    if (main) {
      main.innerHTML = EmptyState.render({
        icon: "❓",
        title: "Subject Not Found",
        banglaTitle: "বিষয় পাওয়া যায়নি",
        message: "আপনি যে বিষয়ে খুঁজছেন সেটি এই semester এ নেই।",
        showBadge: false
      });
    }
    return;
  }

  AppShell.updateHeader({
    title: subject.name,
    subtitle: `${CIVIL_DEPARTMENT.shortName} • ${CIVIL_DEPARTMENT.semesterName}`,
    showBack: true
  });

  const main = AppShell.getMainView();
  if (!main) return;

  const chapters = getChaptersBySubject(subjectId);
  const hasChapters = chapters.length > 0;

  main.innerHTML = `
    <!-- ═══════════════════════════════════
         COMPACT SUBJECT HERO
         ═══════════════════════════════════ -->
    <div class="subject-hero-compact">
      <div class="shc-icon">${subject.icon}</div>
      <div class="shc-info">
        <h2 class="shc-name">${subject.name}</h2>
        <p class="shc-bangla">${subject.banglaName}</p>
        <div class="shc-meta">
          <span class="shc-chip">${subject.code}</span>
          <span class="shc-chip shc-chip-type">${subject.type}</span>
          <span class="shc-chip shc-chip-credit">${subject.credits} cr</span>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════
         FEATURES (HORIZONTAL SCROLL) - UP TOP
         ═══════════════════════════════════ -->
    <div class="compact-section-header">
      <span class="csh-icon">⚡</span>
      <span class="csh-title">Features</span>
      <span class="csh-chip-lock">🔒 শীঘ্রই আসছে</span>
    </div>

    <div class="features-horizontal-scroll">
      ${subjectFeatures.map((f) => `
        <div 
          class="feature-chip-card" 
          data-coming-soon="${subject.name} - ${f.title}"
          role="button"
          tabindex="0"
          aria-label="${f.title}"
        >
          <div class="fcc-icon">${f.icon}</div>
          <span class="fcc-title">${f.title}</span>
          <span class="fcc-bangla">${f.banglaTitle || ""}</span>
          <span class="fcc-lock">🔒</span>
        </div>
      `).join("")}
    </div>

    <!-- ═══════════════════════════════════
         CHAPTERS (ACCORDION) - NO HEADING
         ═══════════════════════════════════ -->
    ${hasChapters ? `
      <div class="chapters-meta-bar">
        <div class="cmb-left">
          <span class="cmb-icon">📚</span>
          <span class="cmb-text">মোট <strong>${chapters.length}টি</strong> অধ্যায়</span>
        </div>
        <div class="cmb-right">
          <span class="cmb-hint">ট্যাপ করে খুলুন</span>
        </div>
      </div>

      <div class="chapters-accordion" id="chapters-accordion">
        ${chapters.map((ch) => `
          <div 
            class="chapter-item" 
            data-chapter-id="${ch.id}"
            data-chapter-name="${ch.name}"
          >
            <button 
              class="chapter-header" 
              aria-expanded="false"
              aria-controls="chapter-body-${ch.id}"
              data-chapter-toggle="${ch.id}"
            >
              <div class="ch-number-pill">${ch.number}</div>
              <div class="ch-header-text">
                <span class="ch-title-bn">${ch.name}</span>
                <span class="ch-title-en">${ch.nameEn}</span>
              </div>
              <div class="ch-chevron">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </button>

            <div 
              class="chapter-body" 
              id="chapter-body-${ch.id}"
              data-chapter-body="${ch.id}"
              style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease;"
            >
              <div class="ch-body-inner">
                <div class="ch-body-heading">
                  <span class="cbh-icon">📝</span>
                  <span class="cbh-text">প্রশ্নের ধরন নির্বাচন করুন</span>
                </div>

                <!-- 6 buttons: 3 question types + suggestion + quiz + mcq -->
                <div class="ch-actions-grid">
                  <!-- Row 1: Question types -->
                  <button 
                    class="ch-action-btn ch-action-creative" 
                    data-coming-soon="অধ্যায় ${ch.number} - রচনামূলক প্রশ্ন"
                  >
                    <span class="cha-icon">📝</span>
                    <span class="cha-label">রচনামূলক</span>
                    <span class="cha-sub">বড় প্রশ্ন</span>
                  </button>

                  <button 
                    class="ch-action-btn ch-action-short" 
                    data-coming-soon="অধ্যায় ${ch.number} - সংক্ষিপ্ত প্রশ্ন"
                  >
                    <span class="cha-icon">📄</span>
                    <span class="cha-label">সংক্ষিপ্ত</span>
                    <span class="cha-sub">ছোট প্রশ্ন</span>
                  </button>

                  <button 
                    class="ch-action-btn ch-action-mcq" 
                    data-coming-soon="অধ্যায় ${ch.number} - অতি সংক্ষিপ্ত প্রশ্ন"
                  >
                    <span class="cha-icon">⚡</span>
                    <span class="cha-label">অতি সংক্ষিপ্ত</span>
                    <span class="cha-sub">MCQ</span>
                  </button>

                  <!-- Row 2: Suggestion + Quiz -->
                  <button 
                    class="ch-action-btn ch-action-suggestion" 
                    data-coming-soon="অধ্যায় ${ch.number} - সাজেশন"
                  >
                    <span class="cha-icon">💡</span>
                    <span class="cha-label">সাজেশন</span>
                    <span class="cha-sub">গুরুত্বপূর্ণ</span>
                  </button>

                  <button 
                    class="ch-action-btn ch-action-quiz" 
                    data-coming-soon="অধ্যায় ${ch.number} - কুইজ"
                  >
                    <span class="cha-icon">🎯</span>
                    <span class="cha-label">কুইজ</span>
                    <span class="cha-sub">প্র্যাকটিস</span>
                  </button>

                  <button 
                    class="ch-action-btn ch-action-formula" 
                    data-coming-soon="অধ্যায় ${ch.number} - সূত্রাবলী"
                  >
                    <span class="cha-icon">📐</span>
                    <span class="cha-label">সূত্রাবলী</span>
                    <span class="cha-sub">Formulas</span>
                  </button>
                </div>

                <div class="ch-body-footer">
                  <span class="cbf-lock">🔒</span>
                  <span class="cbf-text">সব প্রশ্ন শীঘ্রই server থেকে যুক্ত হবে</span>
                </div>
              </div>
            </div>
          </div>
        `).join("")}
      </div>

    ` : `
      ${EmptyState.render({
        icon: "📚",
        title: "Chapters Coming Soon",
        banglaTitle: "চ্যাপ্টার শীঘ্রই আসছে",
        message: "Server থেকে এই বিষয়ের chapter content যুক্ত করা হলে এখানে দেখা যাবে।"
      })}
    `}

    <!-- Bottom spacing -->
    <div style="height: 20px;"></div>
  `;

  // ═══════════════════════════════════════════
  // ACCORDION TOGGLE LOGIC
  // ═══════════════════════════════════════════
  main.querySelectorAll("[data-chapter-toggle]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const chapterId = btn.getAttribute("data-chapter-toggle");
      const body = main.querySelector(`[data-chapter-body="${chapterId}"]`);
      const isExpanded = btn.getAttribute("aria-expanded") === "true";

      // Close all others (accordion behavior)
      main.querySelectorAll("[data-chapter-toggle]").forEach((otherBtn) => {
        if (otherBtn !== btn) {
          otherBtn.setAttribute("aria-expanded", "false");
          const otherId = otherBtn.getAttribute("data-chapter-toggle");
          const otherBody = main.querySelector(`[data-chapter-body="${otherId}"]`);
          if (otherBody) {
            otherBody.style.maxHeight = "0";
            otherBody.classList.remove("open");
          }
          otherBtn.closest(".chapter-item")?.classList.remove("expanded");
        }
      });

      // Toggle current
      if (isExpanded) {
        btn.setAttribute("aria-expanded", "false");
        body.style.maxHeight = "0";
        body.classList.remove("open");
        btn.closest(".chapter-item")?.classList.remove("expanded");
      } else {
        btn.setAttribute("aria-expanded", "true");
        body.classList.add("open");
        // Increased max-height to fit 6 buttons (2 rows)
        body.style.maxHeight = body.scrollHeight + "px";
        btn.closest(".chapter-item")?.classList.add("expanded");
      }
    });
  });

  // ═══════════════════════════════════════════
  // COMING SOON HANDLERS
  // ═══════════════════════════════════════════
  main.querySelectorAll("[data-coming-soon]").forEach((el) => {
    const handle = (e) => {
      if (e) e.stopPropagation();
      const name = el.getAttribute("data-coming-soon");
      showComingSoon(name);
    };
    el.addEventListener("click", handle);
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handle();
      }
    });
  });
}