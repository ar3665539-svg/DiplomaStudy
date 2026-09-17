/**
 * DiplomaStudy - Content View Page
 * ৬টা content type handle করে:
 * pdf | creative | short | mcq | suggestion | formula
 */

import { AppShell } from "../components/AppShell.js";
import { EmptyState } from "../components/EmptyState.js";
import { router } from "../core/router.js";
import { showComingSoon } from "../core/comingSoonHelper.js";
import {
  getSubjectById,
  getChapterById,
  getPdfsByChapter,
  getQuestionsByChapter,
  getSuggestionsByChapter,
  getFormulasByChapter
} from "../services/api.js";

// ═══════════════════════════════════════════
// TYPE CONFIG
// ═══════════════════════════════════════════
const TYPE_CONFIG = {
  pdf: {
    icon: "📄",
    title: "PDF Files",
    bangla: "বই / নোট",
    color: "#B91C1C",
    bg: "rgba(185, 28, 28, 0.1)"
  },
  creative: {
    icon: "📝",
    title: "রচনামূলক প্রশ্ন",
    bangla: "বড় প্রশ্ন",
    color: "#1C3E2C",
    bg: "rgba(28, 62, 44, 0.1)"
  },
  short: {
    icon: "📄",
    title: "সংক্ষিপ্ত প্রশ্ন",
    bangla: "ছোট প্রশ্ন",
    color: "#B45309",
    bg: "rgba(180, 83, 9, 0.1)"
  },
  mcq: {
    icon: "⚡",
    title: "অতি সংক্ষিপ্ত",
    bangla: "MCQ",
    color: "#4338CA",
    bg: "rgba(67, 56, 202, 0.1)"
  },
  suggestion: {
    icon: "💡",
    title: "সাজেশন",
    bangla: "গুরুত্বপূর্ণ",
    color: "#7E22CE",
    bg: "rgba(126, 34, 206, 0.1)"
  },
  formula: {
    icon: "📐",
    title: "সূত্রাবলী",
    bangla: "Formulas",
    color: "#0F766E",
    bg: "rgba(15, 118, 110, 0.1)"
  }
};

export async function renderContentView(params = {}) {
  const type = params.type || "pdf";
  const subjectId = params.subjectId;
  const chapterId = params.chapterId;
  const chapterNumber = params.chapterNumber || "";

  const config = TYPE_CONFIG[type] || TYPE_CONFIG.pdf;

  // ═══════════════════════════════════════════
  // LOADING
  // ═══════════════════════════════════════════
  AppShell.updateHeader({
    title: config.title,
    subtitle: "Loading...",
    showBack: true
  });

  const main = AppShell.getMainView();
  if (!main) return;

  main.innerHTML = `
    <div style="text-align: center; padding: 80px 20px;">
      <div class="spinner"></div>
      <p style="margin-top: 14px; color: #84968B; font-size: 13px; font-weight: 500;">
        Loading...
      </p>
    </div>
  `;

  // ═══════════════════════════════════════════
  // LOAD DATA
  // ═══════════════════════════════════════════
  let subject = null;
  let chapter = null;
  let items = [];

  try {
    subject = await getSubjectById(subjectId);
    chapter = await getChapterById(chapterId);

    if (type === "pdf") {
      items = await getPdfsByChapter(chapterId);
    } else if (type === "creative") {
      items = await getQuestionsByChapter(chapterId, "creative");
    } else if (type === "short") {
      items = await getQuestionsByChapter(chapterId, "short");
    } else if (type === "mcq") {
      items = await getQuestionsByChapter(chapterId, "mcq");
    } else if (type === "suggestion") {
      items = await getSuggestionsByChapter(chapterId);
    } else if (type === "formula") {
      items = await getFormulasByChapter(chapterId);
    }
  } catch (err) {
    console.error('[ContentView] Load error:', err);
  }

  // ═══════════════════════════════════════════
  // UPDATE HEADER
  // ═══════════════════════════════════════════
  AppShell.updateHeader({
    title: config.title,
    subtitle: subject ? `${subject.name} • অধ্যায় ${chapterNumber}` : "",
    showBack: true
  });

  // ═══════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════
  main.innerHTML = `
    <!-- Content Hero -->
    <div class="content-hero" style="border-left-color: ${config.color};">
      <div class="content-hero-icon" style="background-color: ${config.bg}; color: ${config.color};">
        ${config.icon}
      </div>
      <div class="content-hero-info">
        <h2 class="content-hero-title">${config.title}</h2>
        <p class="content-hero-bangla">${config.bangla}</p>
        ${subject ? `
          <div class="content-hero-meta">
            <span class="content-hero-chip">${subject.icon} ${subject.name}</span>
            ${chapter ? `<span class="content-hero-chip">অধ্যায় ${chapter.number}: ${chapter.name}</span>` : ''}
          </div>
        ` : ''}
      </div>
      <div class="content-hero-count" style="background-color: ${config.color};">
        ${items.length}
      </div>
    </div>

    <!-- Content List -->
    ${items.length > 0 ? `
      <div class="content-list" id="content-list">
        ${items.map((item, idx) => renderItem(item, type, idx, config)).join("")}
      </div>
    ` : `
      <div class="empty-state" style="margin-top: 20px;">
        <div class="empty-state-icon">${config.icon}</div>
        <h2 class="empty-state-title">${config.title} Coming Soon</h2>
        <p class="empty-state-desc">
          এই অধ্যায়ে এখনো কোনো ${config.bangla} যোগ করা হয়নি।
          Admin Panel থেকে যোগ করা হবে।
        </p>
      </div>
    `}

    <div style="height: 30px;"></div>
  `;

  // ═══════════════════════════════════════════
  // BIND INTERACTIONS
  // ═══════════════════════════════════════════

  // Question toggle (creative, short)
  main.querySelectorAll(".content-toggle-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const answerEl = main.querySelector(`#${id}`);
      if (!answerEl) return;
      const isHidden = answerEl.style.display === "none" || !answerEl.style.display;
      answerEl.style.display = isHidden ? "block" : "none";
      const label = btn.querySelector(".toggle-label");
      if (label) label.textContent = isHidden ? "Hide Answer" : "Show Answer";
      btn.classList.toggle("active", isHidden);
    });
  });

  // MCQ option select
  main.querySelectorAll(".mcq-option").forEach((optEl) => {
    optEl.addEventListener("click", () => {
      const card = optEl.closest(".mcq-card");
      if (!card) return;

      const correctAnswer = card.getAttribute("data-answer");
      const options = card.querySelectorAll(".mcq-option");
      const explanation = card.querySelector(".mcq-explanation");

      // Disable all options
      options.forEach((o) => o.classList.add("disabled"));

      // Mark selected and correct
      optEl.classList.add("selected");
      options.forEach((o) => {
        const opt = o.getAttribute("data-option");
        if (opt === correctAnswer) o.classList.add("correct");
      });

      // Show explanation if available
      if (explanation) explanation.style.display = "block";
    });
  });

  // PDF View button → navigate to viewer page
  main.querySelectorAll(".pdf-view-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const pdfId = btn.getAttribute("data-pdf-id");
      const card = btn.closest(".pdf-card-view");
      const pdfUrl = card?.getAttribute("data-pdf-url");

      if (!pdfUrl) {
        showComingSoon("PDF");
        return;
      }

      router.navigate(`#/pdf-viewer?pdfId=${pdfId}&chapterId=${chapterId}&subjectId=${subjectId}`);
    });
  });
}

// ═══════════════════════════════════════════
// RENDER ITEM
// ═══════════════════════════════════════════
function renderItem(item, type, idx, config) {
  if (type === "pdf") return renderPdf(item, idx);
  if (type === "creative" || type === "short") return renderQuestion(item, idx, config);
  if (type === "mcq") return renderMcq(item, idx, config);
  if (type === "suggestion") return renderSuggestion(item, idx, config);
  if (type === "formula") return renderFormula(item, idx, config);
  return "";
}

// ─── PDF ───
function renderPdf(pdf, idx) {
  return `
    <div class="content-card pdf-card-view" data-pdf-id="${pdf.id}" data-pdf-url="${pdf.fileUrl || ''}">
      <div class="content-card-header">
        <div class="content-card-num">${String(idx + 1).padStart(2, "0")}</div>
        <div class="content-card-tags">
          <span class="content-tag" style="background: rgba(185, 28, 28, 0.1); color: #B91C1C;">
            📄 PDF
          </span>
          ${pdf.fileSize ? `<span class="content-tag content-tag-ghost">${pdf.fileSize}</span>` : ''}
        </div>
      </div>

      <div class="pdf-preview-row">
        <div class="pdf-preview-icon">📄</div>
        <div class="pdf-preview-body">
          <h3 class="content-card-title" style="margin-bottom: 3px;">${escapeHtml(pdf.title)}</h3>
          ${pdf.fileName ? `<p class="content-card-sub" style="margin: 0;">${escapeHtml(pdf.fileName)}</p>` : ''}
        </div>
      </div>

      <div class="content-card-actions">
        ${pdf.fileUrl ? `
          <button class="btn btn-primary btn-sm flex-1 pdf-view-btn" data-pdf-id="${pdf.id}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <span>পড়ুন</span>
          </button>
          <a href="${pdf.fileUrl}" download class="btn btn-secondary btn-sm" title="Download">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </button>
        ` : `
          <button class="btn btn-secondary btn-sm flex-1" disabled>
            <span>PDF Coming Soon</span>
          </button>
        `}
      </div>
    </div>
  `;
}

// ─── Question (Creative / Short) ───
function renderQuestion(q, idx, config) {
  const marks = q.marks ? `<span class="content-tag" style="background: rgba(34,197,94,0.1); color: #15803D;">🎯 ${q.marks} নম্বর</span>` : "";
  const board = q.board ? `<span class="content-tag content-tag-ghost">📝 ${escapeHtml(q.board)}</span>` : "";
  const answerId = `answer-${q.id}-${idx}`;

  return `
    <div class="content-card">
      <div class="content-card-header">
        <div class="content-card-num">${String(idx + 1).padStart(2, "0")}</div>
        <div class="content-card-tags">
          ${marks}
          ${board}
        </div>
      </div>

      <div class="content-card-label">
        <span>❓</span>
        <span>প্রশ্ন</span>
      </div>
      <div class="content-card-question">
        ${escapeHtml(q.question || "")}
      </div>
      ${q.questionEn ? `
        <div class="content-card-question-en">
          ${escapeHtml(q.questionEn)}
        </div>
      ` : ''}

      <button class="content-toggle-btn" data-id="${answerId}">
        <span class="toggle-label">Show Answer</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      <div class="content-answer" id="${answerId}" style="display: none;">
        <div class="content-card-label content-label-answer">
          <span>✅</span>
          <span>উত্তর</span>
        </div>
        <div class="content-answer-text">
          ${escapeHtml(q.answer || "")}
        </div>
        ${q.explanation ? `
          <div class="content-explanation">
            <strong>📘 ব্যাখ্যা:</strong>
            <div>${escapeHtml(q.explanation)}</div>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

// ─── MCQ ───
function renderMcq(q, idx, config) {
  const options = q.options || [];
  const correctAnswer = q.answer || "";
  const answerId = `mcq-answer-${q.id}-${idx}`;

  return `
    <div class="content-card mcq-card" data-answer="${escapeHtml(correctAnswer)}">
      <div class="content-card-header">
        <div class="content-card-num">${String(idx + 1).padStart(2, "0")}</div>
        <div class="content-card-tags">
          <span class="content-tag" style="background: rgba(67, 56, 202, 0.1); color: #4338CA;">
            ⚡ MCQ
          </span>
        </div>
      </div>

      <div class="content-card-label">
        <span>❓</span>
        <span>প্রশ্ন</span>
      </div>
      <div class="content-card-question">
        ${escapeHtml(q.question || "")}
      </div>
      ${q.questionEn ? `
        <div class="content-card-question-en">
          ${escapeHtml(q.questionEn)}
        </div>
      ` : ''}

      <div class="mcq-options">
        ${options.map((opt, i) => `
          <button class="mcq-option" data-qid="${q.id}" data-option="${escapeHtml(opt)}">
            <span class="mcq-option-letter">${String.fromCharCode(65 + i)}</span>
            <span class="mcq-option-text">${escapeHtml(opt)}</span>
            <span class="mcq-option-mark"></span>
          </button>
        `).join("")}
      </div>

      <div class="mcq-explanation" id="${answerId}" style="display: none;">
        <div class="content-card-label content-label-answer">
          <span>✅</span>
          <span>সঠিক উত্তর</span>
        </div>
        <div class="content-answer-text" style="font-weight: 800;">
          ${escapeHtml(correctAnswer)}
        </div>
        ${q.explanation ? `
          <div class="content-explanation">
            <strong>📘 ব্যাখ্যা:</strong>
            <div>${escapeHtml(q.explanation)}</div>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

// ─── Suggestion ───
function renderSuggestion(s, idx, config) {
  return `
    <div class="content-card">
      <div class="content-card-header">
        <div class="content-card-num">${String(idx + 1).padStart(2, "0")}</div>
        <div class="content-card-tags">
          <span class="content-tag" style="background: rgba(126, 34, 206, 0.1); color: #7E22CE;">
            💡 ${escapeHtml(s.category || "Most Important")}
          </span>
        </div>
      </div>

      <h3 class="content-card-title">
        ${escapeHtml(s.title || "")}
      </h3>

      <div class="content-card-label">
        <span>📝</span>
        <span>সারসংক্ষেপ</span>
      </div>
      <div class="content-answer-text">
        ${escapeHtml(s.summary || "")}
      </div>

      ${s.examTip ? `
        <div class="content-explanation content-tip">
          <strong>🎯 Exam Tip:</strong>
          <div>${escapeHtml(s.examTip)}</div>
        </div>
      ` : ''}
    </div>
  `;
}

// ─── Formula ───
function renderFormula(f, idx, config) {
  return `
    <div class="content-card">
      <div class="content-card-header">
        <div class="content-card-num">${String(idx + 1).padStart(2, "0")}</div>
        <div class="content-card-tags">
          <span class="content-tag" style="background: rgba(15, 118, 110, 0.1); color: #0F766E;">
            📐 Formula
          </span>
        </div>
      </div>

      <h3 class="content-card-title">
        ${escapeHtml(f.name || "")}
      </h3>

      <div class="content-formula-box">
        <code>${escapeHtml(f.equation || "")}</code>
      </div>

      ${f.explanation ? `
        <div class="content-card-label">
          <span>📘</span>
          <span>ব্যাখ্যা</span>
        </div>
        <div class="content-answer-text">
          ${escapeHtml(f.explanation)}
        </div>
      ` : ''}

      ${f.example ? `
        <div class="content-explanation">
          <strong>💡 উদাহরণ:</strong>
          <div>${escapeHtml(f.example)}</div>
        </div>
      ` : ''}
    </div>
  `;
}

// ═══════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════
function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}