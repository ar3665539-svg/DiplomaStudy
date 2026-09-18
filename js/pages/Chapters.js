/**
 * DiplomaStudy - Chapters v2 (Modern)
 * + Category pills for quick jump
 * + Smooth stagger animation
 */

import { AppShell } from "../components/AppShell.js";
import { getSubjectById, getChaptersBySubject } from "../services/api.js";
import { router } from "../core/router.js";

const categoryEmojis = {
  "গদ্য": "📖", "পদ্য": "🎭", "উপন্যাস": "📕", "নাটক": "🎬",
  "প্রবন্ধ": "📝", "গল্প": "📗", "কবিতা": "✒️", "জীবনী": "👤",
  "অনুবাদ": "🔄", "ব্যাকরণ": "📐", "সাহিত্য": "📚",
  "Prose": "📖", "Poetry": "🎭", "Novel": "📕", "Drama": "🎬",
  "Essay": "📝", "Short Story": "📗", "Grammar": "📐",
  "বীজগণিত": "🔢", "জ্যামিতি": "📐", "ত্রিকোণমিতি": "📊",
  "ক্যালকুলাস": "∫", "পরিসংখ্যান": "📈", "সমীকরণ": "⚖️",
  "মেকানিক্স": "⚙️", "তাপ": "🌡️", "শব্দ": "🔊", "আলো": "💡",
  "বিদ্যুৎ": "⚡", "চুম্বক": "🧲",
  "থিওরি": "📖", "ড্রয়িং": "✏️", "প্র্যাকটিক্যাল": "🔧",
  "সার্ভে": "📐", "ম্যাটেরিয়াল": "🧱", "স্ট্রাকচার": "🏗️",
  "__uncategorized__": "📄"
};

export async function renderChapters(params = {}) {
  const urlParams = new URLSearchParams(window.location.hash.split("?")[1] || "");
  const subjectId = params.subjectId || urlParams.get("subjectId") || "";

  AppShell.updateHeader({
    title: "Chapters",
    subtitle: "Loading...",
    showBack: true,
    showSearch: false
  });

  const main = AppShell.getMainView();
  if (!main) return;

  main.innerHTML = `
    <div class="skeleton skeleton-card" style="height:80px;margin-bottom:16px;"></div>
    <div class="flex flex-col gap-sm">
      <div class="skeleton skeleton-card" style="height:72px;"></div>
      <div class="skeleton skeleton-card" style="height:72px;"></div>
      <div class="skeleton skeleton-card" style="height:72px;"></div>
    </div>
  `;

  if (!subjectId) {
    main.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">❓</div>
        <h2 class="empty-state-title">No Subject</h2>
      </div>
    `;
    return;
  }

  const [subject, chapters] = await Promise.all([
    getSubjectById(subjectId),
    getChaptersBySubject(subjectId)
  ]);

  if (!subject) {
    main.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">❓</div>
        <h2 class="empty-state-title">Subject Not Found</h2>
      </div>
    `;
    return;
  }

  AppShell.updateHeader({
    title: subject.name,
    subtitle: subject.code ? `Code: ${subject.code}` : "",
    showBack: true,
    showSearch: false
  });

  // Group by category
  const groups = {};
  chapters.forEach((c) => {
    const key = c.category || "__uncategorized__";
    if (!groups[key]) groups[key] = [];
    groups[key].push(c);
  });

  const categoryKeys = Object.keys(groups).sort((a, b) => {
    if (a === "__uncategorized__") return 1;
    if (b === "__uncategorized__") return -1;
    return a.localeCompare(b);
  });

  const hasCategories = categoryKeys.filter((k) => k !== "__uncategorized__").length > 0;

  // ═══ Build category pills (for jump nav) ═══
  const categoryPillsHtml = hasCategories ? `
    <div class="filter-tabs-scroll animate-slide-up">
      ${categoryKeys.map((key) => {
        const label = key === "__uncategorized__" ? "Other" : key;
        const emoji = categoryEmojis[key] || "📄";
        return `
          <button class="filter-pill" data-jump-cat="${key}" type="button">
            ${emoji} ${label} (${groups[key].length})
          </button>
        `;
      }).join("")}
    </div>
  ` : "";

  main.innerHTML = `
    <!-- Subject header -->
    <div class="subject-hero-compact animate-fade-in">
      <div class="shc-icon">${subject.icon || "📘"}</div>
      <div class="shc-info">
        <h2 class="shc-name">${subject.name}</h2>
        ${subject.banglaName ? `<p class="shc-bangla">${subject.banglaName}</p>` : ""}
        <div class="shc-meta">
          ${subject.code ? `<span class="shc-chip">${subject.code}</span>` : ""}
          <span class="shc-chip shc-chip-type">${subject.type || "Theory"}</span>
          <span class="shc-chip shc-chip-credit">${subject.credits || 3} cr</span>
        </div>
      </div>
    </div>

    <!-- Category jump pills -->
    ${categoryPillsHtml}

    <!-- Chapters meta bar -->
    <div class="chapters-meta-bar">
      <div class="cmb-left">
        <span class="cmb-icon">📖</span>
        <span class="cmb-text"><strong>${chapters.length}</strong> chapters available</span>
      </div>
      <span class="cmb-hint">ট্যাপ করুন</span>
    </div>

    <!-- Chapter list -->
    ${chapters.length > 0 ? categoryKeys.map((catKey, catIdx) => {
      const catChapters = groups[catKey];
      const catLabel = catKey === "__uncategorized__" ? "Other Chapters" : catKey;
      const catEmoji = categoryEmojis[catKey] || "📄";
      const showCategoryHeader = hasCategories;

      return `
        <div ${catKey !== "__uncategorized__" ? `id="cat-${catKey}"` : ""}>
          ${showCategoryHeader ? `
            <div class="compact-section-header" style="margin-top:${catIdx > 0 ? "24px" : "16px"};">
              <span class="csh-icon">${catEmoji}</span>
              <h3 class="csh-title">${catLabel}</h3>
              <span class="csh-count">${catChapters.length}</span>
            </div>
          ` : ""}

          <div class="chapters-accordion">
            ${catChapters.map((ch, idx) => `
              <div 
                class="chapter-item tap-effect animate-slide-up" 
                data-chapter-id="${ch.id}"
                style="animation-delay:${0.05 + idx * 0.03}s;"
              >
                <button class="chapter-header" type="button">
                  <div class="ch-number-pill">${ch.number}</div>
                  <div class="ch-header-text">
                    <span class="ch-title-bn">${ch.name}</span>
                    ${ch.nameEn ? `<span class="ch-title-en">${ch.nameEn}</span>` : ""}
                  </div>
                  <div class="ch-chevron">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                </button>
              </div>
            `).join("")}
          </div>
        </div>
      `;
    }).join("") : `
      <div class="empty-state">
        <div class="empty-state-icon">📖</div>
        <h2 class="empty-state-title">No Chapters Found</h2>
        <p class="empty-state-desc">এই subject-এ এখনো কোনো chapter যোগ করা হয়নি।</p>
      </div>
    `}
  `;

  // ═══ Category jump ═══
  main.querySelectorAll("[data-jump-cat]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.getAttribute("data-jump-cat");
      const target = document.getElementById(`cat-${key}`);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        // Highlight active pill
        main.querySelectorAll(".filter-pill").forEach((p) => p.classList.remove("active"));
        btn.classList.add("active");
      }
    });
  });

  // ═══ Chapter navigation ═══
  main.querySelectorAll(".chapter-item").forEach((item) => {
    const navigate = () => {
      const chapterId = item.getAttribute("data-chapter-id");
      if (router.routes?.["#/content"]) {
        router.navigate(`#/content?subjectId=${subjectId}&chapterId=${chapterId}`);
      } else if (router.routes?.["#/questions"]) {
        router.navigate(`#/questions?subjectId=${subjectId}&chapterId=${chapterId}`);
      }
    };
    item.querySelector(".chapter-header")?.addEventListener("click", navigate);
  });
}