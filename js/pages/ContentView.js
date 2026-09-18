/**
 * ContentView - Chapter content hub
 * Shows all content types: PDF, Questions, Suggestions, Formulas
 * Modern glass tabs
 */

import { AppShell } from "../components/AppShell.js";
import { router } from "../core/router.js";
import { showComingSoon } from "../core/comingSoonHelper.js";
import {
  getSubjectById,
  getChapterById,
  getQuestionsByChapter,
  getSuggestionsByChapter,
  getFormulasByChapter,
  getPdfsByChapter
} from "../services/api.js";

const TABS = [
  { id: "pdf", icon: "📄", label: "PDF", color: "rose" },
  { id: "creative", icon: "📝", label: "রচনামূলক", color: "forest" },
  { id: "short", icon: "📄", label: "সংক্ষিপ্ত", color: "accent" },
  { id: "mcq", icon: "⚡", label: "MCQ", color: "indigo" },
  { id: "suggestion", icon: "💡", label: "সাজেশন", color: "purple" },
  { id: "formula", icon: "🧮", label: "সূত্রাবলী", color: "cyan" }
];

export async function renderContentView(params = {}) {
  const urlParams = new URLSearchParams(window.location.hash.split("?")[1] || "");
  const subjectId = params.subjectId || urlParams.get("subjectId") || "";
  const chapterId = params.chapterId || urlParams.get("chapterId") || "";
  const initialTab = urlParams.get("tab") || "pdf";

  AppShell.updateHeader({
    title: "Content",
    subtitle: "Loading...",
    showBack: true,
    showSettings: false
  });

  const main = AppShell.getMainView();
  if (!main) return;

  main.innerHTML = `
    <div class="skeleton skeleton-card" style="height:80px;margin-bottom:16px;"></div>
    <div class="skeleton skeleton-card" style="height:60px;margin-bottom:16px;"></div>
    <div class="skeleton skeleton-card" style="height:200px;"></div>
  `;

  if (!chapterId) {
    main.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📄</div>
        <h2 class="empty-state-title">Chapter Not Found</h2>
      </div>
    `;
    return;
  }

  // Load all data in parallel
  const [subject, chapter, questions, suggestions, formulas, pdfs] = await Promise.all([
    subjectId ? getSubjectById(subjectId) : Promise.resolve(null),
    getChapterById(chapterId),
    getQuestionsByChapter(chapterId),
    getSuggestionsByChapter(chapterId),
    getFormulasByChapter(chapterId),
    getPdfsByChapter(chapterId)
  ]);

  if (!chapter) {
    main.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">❓</div>
        <h2 class="empty-state-title">Chapter Not Found</h2>
      </div>
    `;
    return;
  }

  AppShell.updateHeader({
    title: chapter.name,
    subtitle: subject ? subject.name : "",
    showBack: true,
    showSettings: false
  });

  // Count content per tab
  const creative = questions.filter(q => q.type === "creative");
  const short = questions.filter(q => q.type === "short");
  const mcq = questions.filter(q => q.type === "mcq");

  const counts = {
    pdf: pdfs.length,
    creative: creative.length,
    short: short.length,
    mcq: mcq.length,
    suggestion: suggestions.length,
    formula: formulas.length
  };

  // Build tabs HTML with counts
  const tabsHtml = TABS.map(tab => `
    <button 
      class="content-tab ${tab.id === initialTab ? "active" : ""}" 
      data-tab="${tab.id}"
      data-color="${tab.color}"
      type="button"
    >
      <span class="content-tab-icon">${tab.icon}</span>
      <span class="content-tab-label">${tab.label}</span>
      ${counts[tab.id] > 0 ? `<span class="content-tab-count">${counts[tab.id]}</span>` : ""}
    </button>
  `).join("");

  main.innerHTML = `
    <!-- Chapter hero -->
    <div class="content-hero animate-fade-in">
      <div class="content-hero-badge">Ch. ${chapter.number}</div>
      <h1 class="content-hero-title">${chapter.name}</h1>
      ${chapter.nameEn ? `<p class="content-hero-en">${chapter.nameEn}</p>` : ""}
      ${subject ? `
        <div class="content-hero-subject">
          <span>${subject.icon || "📘"}</span>
          <span>${subject.name}</span>
        </div>
      ` : ""}
    </div>

    <!-- Modern tabs -->
    <div class="content-tabs-scroll">
      ${tabsHtml}
    </div>

    <!-- Content area -->
    <div id="content-area" class="content-area">
      ${renderTabContent(initialTab, { pdfs, creative, short, mcq, suggestions, formulas })}
    </div>
  `;

  // Bind tabs
  main.querySelectorAll(".content-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      const tabId = tab.getAttribute("data-tab");
      main.querySelectorAll(".content-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const area = main.querySelector("#content-area");
      area.style.opacity = "0";
      area.style.transform = "translateY(8px)";

      setTimeout(() => {
        area.innerHTML = renderTabContent(tabId, { pdfs, creative, short, mcq, suggestions, formulas });
        area.style.transition = "opacity 0.25s ease, transform 0.25s ease";
        area.style.opacity = "1";
        area.style.transform = "translateY(0)";
        bindTabContent(area, tabId, { subject, chapter });
      }, 150);
    });
  });

  // Initial bind
  bindTabContent(main.querySelector("#content-area"), initialTab, { subject, chapter });
}

// ═══════════════════════════════════════════
// RENDER TAB CONTENT
// ═══════════════════════════════════════════
function renderTabContent(tabId, data) {
  const { pdfs, creative, short, mcq, suggestions, formulas } = data;

  switch (tabId) {
    case "pdf":
      return renderPdfs(pdfs);
    case "creative":
      return renderQuestions(creative, "creative");
    case "short":
      return renderQuestions(short, "short");
    case "mcq":
      return renderQuestions(mcq, "mcq");
    case "suggestion":
      return renderSuggestions(suggestions);
    case "formula":
      return renderFormulas(formulas);
    default:
      return `<p style="text-align:center;color:var(--color-text-muted);padding:40px;">Coming soon...</p>`;
  }
}

// ═══════════════════════════════════════════
// PDFs
// ═══════════════════════════════════════════
function renderPdfs(pdfs) {
  if (!pdfs || pdfs.length === 0) {
    return emptyTab("📄", "কোনো PDF নেই", "এই chapter-এ এখনো PDF যোগ করা হয়নি।");
  }
  return `
    <div class="pdf-list">
      ${pdfs.map(pdf => `
        <a 
          class="pdf-card" 
          href="${pdf.fileUrl || '#'}" 
          target="_blank" 
          rel="noopener"
          onclick="${pdf.fileUrl ? '' : 'event.preventDefault();'}"
        >
          <div class="pdf-card-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
          </div>
          <div class="pdf-card-body">
            <div class="pdf-card-title">${escapeHtml(pdf.title || "Untitled")}</div>
            ${pdf.fileName ? `<div class="pdf-card-meta">${escapeHtml(pdf.fileName)} • ${pdf.fileSize || ""}</div>` : ""}
          </div>
          <div class="pdf-card-arrow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <path d="M7 17l10-10M7 7h10v10"/>
            </svg>
          </div>
        </a>
      `).join("")}
    </div>
  `;
}

// ═══════════════════════════════════════════
// Questions
// ═══════════════════════════════════════════
function renderQuestions(questions, type) {
  if (!questions || questions.length === 0) {
    return emptyTab("❓", "কোনো প্রশ্ন নেই", "এই chapter-এ এই ধরনের প্রশ্ন যোগ করা হয়নি।");
  }

  const typeLabel = type === "creative" ? "রচনামূলক" : type === "short" ? "সংক্ষিপ্ত" : "MCQ";

  return `
    <div class="question-list">
      ${questions.map((q, idx) => `
        <div class="question-card animate-slide-up" style="animation-delay:${idx * 0.03}s;">
          <div class="question-card-header">
            <div class="question-card-number">${idx + 1}</div>
            <div class="question-card-badges">
              ${q.marks ? `<span class="badge badge-accent">🎯 ${q.marks}</span>` : ""}
              ${q.board ? `<span class="badge badge-sage">${escapeHtml(q.board)}</span>` : ""}
            </div>
          </div>

          <div class="question-card-text">${escapeHtml(q.question || "")}</div>

          ${type === "mcq" && q.options && q.options.length > 0 ? `
            <div class="mcq-options">
              ${q.options.map((opt, i) => {
                const letter = String.fromCharCode(65 + i);
                const isCorrect = opt === q.answer;
                return `
                  <div class="mcq-option ${isCorrect ? "correct" : ""}">
                    <span class="mcq-letter">${letter}</span>
                    <span class="mcq-text">${escapeHtml(opt)}</span>
                    ${isCorrect ? `<span class="mcq-check">✓</span>` : ""}
                  </div>
                `;
              }).join("")}
            </div>
          ` : `
            <div class="question-answer-block">
              <div class="qab-label">উত্তর</div>
              <div class="qab-text">${escapeHtml(q.answer || "")}</div>
            </div>
          `}
        </div>
      `).join("")}
    </div>
  `;
}

// ═══════════════════════════════════════════
// Suggestions
// ═══════════════════════════════════════════
function renderSuggestions(suggestions) {
  if (!suggestions || suggestions.length === 0) {
    return emptyTab("💡", "কোনো সাজেশন নেই", "এই chapter-এ এখনো সাজেশন যোগ করা হয়নি।");
  }

  const catEmoji = {
    "Most Important": "🔥",
    "Very Important": "⭐",
    "Board Top": "🏆",
    "Last Minute": "⏰"
  };

  return `
    <div class="suggestion-list">
      ${suggestions.map((s, idx) => `
        <div class="suggestion-card animate-slide-up" style="animation-delay:${idx * 0.04}s;">
          <div class="suggestion-card-top">
            <span class="suggestion-cat">${catEmoji[s.category] || "💡"} ${escapeHtml(s.category || "")}</span>
          </div>
          <h3 class="suggestion-title">${escapeHtml(s.title || "")}</h3>
          <div class="suggestion-summary">${escapeHtml(s.summary || "")}</div>
          ${s.examTip ? `
            <div class="suggestion-tip">
              <span class="suggestion-tip-icon">🎯</span>
              <div>
                <div class="suggestion-tip-label">Exam Tip</div>
                <div class="suggestion-tip-text">${escapeHtml(s.examTip)}</div>
              </div>
            </div>
          ` : ""}
        </div>
      `).join("")}
    </div>
  `;
}

// ═══════════════════════════════════════════
// Formulas
// ═══════════════════════════════════════════
function renderFormulas(formulas) {
  if (!formulas || formulas.length === 0) {
    return emptyTab("🧮", "কোনো সূত্র নেই", "এই chapter-এ এখনো সূত্র যোগ করা হয়নি।");
  }

  return `
    <div class="formula-list">
      ${formulas.map((f, idx) => `
        <div class="formula-card animate-slide-up" style="animation-delay:${idx * 0.04}s;">
          <h3 class="formula-name">${escapeHtml(f.name || "")}</h3>
          ${f.equation ? `
            <div class="formula-equation">
              <code>${escapeHtml(f.equation)}</code>
            </div>
          ` : ""}
          ${f.explanation ? `<div class="formula-explanation">${escapeHtml(f.explanation)}</div>` : ""}
          ${f.example ? `
            <div class="formula-example">
              <div class="formula-example-label">উদাহরণ</div>
              <div class="formula-example-text">${escapeHtml(f.example)}</div>
            </div>
          ` : ""}
        </div>
      `).join("")}
    </div>
  `;
}

// ═══════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════
function emptyTab(icon, title, desc) {
  return `
    <div class="empty-state">
      <div class="empty-state-icon">${icon}</div>
      <h3 class="empty-state-title">${title}</h3>
      <p class="empty-state-desc">${desc}</p>
    </div>
  `;
}

function bindTabContent(area, tabId, ctx) {
  // Currently no special binding needed
}

function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}