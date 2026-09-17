/**
 * DiplomaStudy - Subject Detail Page
 * Supabase থেকে chapters load করে
 */

import { AppShell } from "../components/AppShell.js";
import { CIVIL_DEPARTMENT } from "../../data/civilSubjects.js";
import { EmptyState } from "../components/EmptyState.js";
import { router } from "../core/router.js";
import { getSubjectById, getChaptersBySubject } from "../services/api.js";

export async function renderSubjectDetail(params = {}) {
  const subjectId = params.subjectId;

  AppShell.updateHeader({
    title: "Loading...",
    showBack: true
  });

  const main = AppShell.getMainView();
  if (!main) return;

  main.innerHTML = `
    <div style="text-align: center; padding: 60px 20px;">
      <div class="spinner"></div>
      <p style="margin-top: 12px; color: var(--color-text-muted); font-size: 13px;">Loading chapters...</p>
    </div>
  `;

  let subject = null;
  let chapters = [];

  try {
    subject = await getSubjectById(subjectId);
    if (subject) {
      chapters = await getChaptersBySubject(subjectId);
    }
  } catch (err) {
    console.error('[SubjectDetail] Load error:', err);
  }

  if (!subject) {
    AppShell.updateHeader({
      title: "Subject Not Found",
      showBack: true
    });
    main.innerHTML = EmptyState.render({
      icon: "❓",
      title: "Subject Not Found",
      banglaTitle: "বিষয় পাওয়া যায়নি",
      message: "আপনি যে বিষয়ে খুঁজছেন সেটি এই semester এ নেই।",
      showBadge: false
    });
    return;
  }

  AppShell.updateHeader({
    title: subject.name,
    subtitle: `${CIVIL_DEPARTMENT.shortName} • 1st Semester`,
    showBack: true
  });

  const hasChapters = chapters.length > 0;

  main.innerHTML = `
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
          <div class="chapter-item" data-chapter-id="${ch.id}" data-chapter-name="${ch.name}">
            <button class="chapter-header" aria-expanded="false" aria-controls="chapter-body-${ch.id}" data-chapter-toggle="${ch.id}">
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

            <div class="chapter-body" id="chapter-body-${ch.id}" data-chapter-body="${ch.id}" style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease;">
              <div class="ch-body-inner">
                <div class="ch-body-heading">
                  <span class="cbh-icon">📝</span>
                  <span class="cbh-text">Content দেখতে ট্যাপ করুন</span>
                </div>

                <div class="ch-actions-grid">
                  <button class="ch-action-btn ch-action-pdf" data-content="pdf" data-chapter-id="${ch.id}" data-chapter-number="${ch.number}" data-subject-id="${subjectId}">
                    <span class="cha-icon">📄</span>
                    <span class="cha-label">PDF</span>
                    <span class="cha-sub">বই/নোট</span>
                  </button>

                  <button class="ch-action-btn ch-action-creative" data-content="creative" data-chapter-id="${ch.id}" data-chapter-number="${ch.number}" data-subject-id="${subjectId}">
                    <span class="cha-icon">📝</span>
                    <span class="cha-label">রচনামূলক</span>
                    <span class="cha-sub">বড় প্রশ্ন</span>
                  </button>

                  <button class="ch-action-btn ch-action-short" data-content="short" data-chapter-id="${ch.id}" data-chapter-number="${ch.number}" data-subject-id="${subjectId}">
                    <span class="cha-icon">📄</span>
                    <span class="cha-label">সংক্ষিপ্ত</span>
                    <span class="cha-sub">ছোট প্রশ্ন</span>
                  </button>

                  <button class="ch-action-btn ch-action-mcq" data-content="mcq" data-chapter-id="${ch.id}" data-chapter-number="${ch.number}" data-subject-id="${subjectId}">
                    <span class="cha-icon">⚡</span>
                    <span class="cha-label">অতি সংক্ষিপ্ত</span>
                    <span class="cha-sub">MCQ</span>
                  </button>

                  <button class="ch-action-btn ch-action-suggestion" data-content="suggestion" data-chapter-id="${ch.id}" data-chapter-number="${ch.number}" data-subject-id="${subjectId}">
                    <span class="cha-icon">💡</span>
                    <span class="cha-label">সাজেশন</span>
                    <span class="cha-sub">গুরুত্বপূর্ণ</span>
                  </button>

                  <button class="ch-action-btn ch-action-formula" data-content="formula" data-chapter-id="${ch.id}" data-chapter-number="${ch.number}" data-subject-id="${subjectId}">
                    <span class="cha-icon">📐</span>
                    <span class="cha-label">সূত্রাবলী</span>
                    <span class="cha-sub">Formulas</span>
                  </button>
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

    <div style="height: 20px;"></div>
  `;

  main.querySelectorAll("[data-chapter-toggle]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const chapterId = btn.getAttribute("data-chapter-toggle");
      const body = main.querySelector(`[data-chapter-body="${chapterId}"]`);
      const isExpanded = btn.getAttribute("aria-expanded") === "true";

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

      if (isExpanded) {
        btn.setAttribute("aria-expanded", "false");
        body.style.maxHeight = "0";
        body.classList.remove("open");
        btn.closest(".chapter-item")?.classList.remove("expanded");
      } else {
        btn.setAttribute("aria-expanded", "true");
        body.classList.add("open");
        body.style.maxHeight = body.scrollHeight + "px";
        btn.closest(".chapter-item")?.classList.add("expanded");
      }
    });
  });

  main.querySelectorAll("[data-content]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const content = btn.getAttribute("data-content");
      const chapterId = btn.getAttribute("data-chapter-id");
      const chapterNumber = btn.getAttribute("data-chapter-number");
      const subId = btn.getAttribute("data-subject-id");

      router.navigate(`#/content?type=${content}&subjectId=${subId}&chapterId=${chapterId}&chapterNumber=${chapterNumber}`);
    });
  });
}