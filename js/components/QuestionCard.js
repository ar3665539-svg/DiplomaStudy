/**
 * DiplomaStudy - QuestionCard Component
 */

import { Toast } from "./Toast.js";

export const QuestionCard = {
  render(question, { isBookmarked = false, isCompleted = false } = {}) {
    const diffBadge = 
      question.difficulty === "Easy" ? "badge-success" :
      question.difficulty === "Hard" ? "badge-danger" : "badge-warning";

    const hasOptions = question.options && question.options.length > 0;

    return `
      <div class="card mb-md question-card ${isCompleted ? "opacity-75" : ""}" data-id="${question.id}" id="q-card-${question.id}">
        <div class="flex items-center justify-between mb-sm flex-wrap gap-xs">
          <div class="flex items-center gap-xs">
            <span class="badge badge-forest">${question.type.toUpperCase()}</span>
            <span class="badge ${diffBadge}">${question.difficulty}</span>
            ${question.board ? `<span class="badge badge-accent">${question.board} ${question.year || ""}</span>` : ""}
            ${question.important ? `<span class="badge badge-danger">★ Important</span>` : ""}
          </div>
          <div class="flex items-center gap-xs">
            <button class="header-icon-btn btn-bookmark-q" data-id="${question.id}" aria-label="Bookmark Question" title="Bookmark">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="${isBookmarked ? "var(--color-accent)" : "none"}" stroke="${isBookmarked ? "var(--color-accent)" : "currentColor"}" stroke-width="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
            </button>
            <button class="header-icon-btn btn-copy-q" data-id="${question.id}" aria-label="Copy Question" title="Copy">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </button>
          </div>
        </div>

        <div class="mb-sm">
          <p class="text-sm font-semibold text-forest mb-xs" style="line-height: 1.4;">${question.question}</p>
          ${question.questionBangla ? `<p class="text-xs text-muted" style="line-height: 1.4;">${question.questionBangla}</p>` : ""}
        </div>

        ${hasOptions ? `
          <div class="flex flex-col gap-xs mb-sm">
            ${question.options.map((opt, i) => `
              <div class="p-xs text-xs" style="background-color: var(--color-surface-hover); border-radius: var(--radius-xs); padding: 6px 10px;">
                <span class="font-bold text-muted">${String.fromCharCode(65 + i)}.</span> ${opt}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <div class="answer-container" id="answer-box-${question.id}" style="display: none; margin-top: 10px; padding: 12px; background-color: var(--color-surface-hover); border-radius: var(--radius-sm); border-left: 3px solid var(--color-forest);">
          <div class="flex items-center gap-xs mb-xs">
            <span class="text-xs font-bold text-forest">Answer:</span>
            <span class="text-xs font-semibold text-text">${question.answer}</span>
          </div>
          ${question.explanation ? `
            <p class="text-xs text-muted" style="line-height: 1.5; white-space: pre-line;">${question.explanation}</p>
          ` : ""}
        </div>

        <div class="flex items-center justify-between mt-sm pt-xs" style="border-top: 1px dashed var(--color-border);">
          <button class="btn btn-secondary btn-sm btn-toggle-ans" data-id="${question.id}">
            <span>Show Answer</span>
          </button>
          <label class="flex items-center gap-xs text-xs text-muted cursor-pointer" style="user-select: none;">
            <input type="checkbox" class="chk-completed-q" data-id="${question.id}" ${isCompleted ? "checked" : ""} />
            <span>Marked Complete</span>
          </label>
        </div>
      </div>
    `;
  },

  bindEvents(container, { onBookmark, onToggleComplete }) {
    // Toggle answer view
    container.querySelectorAll(".btn-toggle-ans").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const box = container.querySelector(`#answer-box-${id}`);
        if (box) {
          const isHidden = box.style.display === "none";
          box.style.display = isHidden ? "block" : "none";
          btn.querySelector("span").textContent = isHidden ? "Hide Answer" : "Show Answer";
        }
      });
    });

    // Copy question to clipboard
    container.querySelectorAll(".btn-copy-q").forEach((btn) => {
      btn.addEventListener("click", () => {
        const card = btn.closest(".question-card");
        const text = card?.querySelector("p")?.textContent || "";
        navigator.clipboard.writeText(text).then(() => {
          Toast.show("Question copied to clipboard", "success");
        }).catch(() => {
          Toast.show("Copied text", "info");
        });
      });
    });

    // Bookmark toggle
    container.querySelectorAll(".btn-bookmark-q").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        if (onBookmark) onBookmark(id, btn);
      });
    });

    // Complete checkbox toggle
    container.querySelectorAll(".chk-completed-q").forEach((chk) => {
      chk.addEventListener("change", (e) => {
        const id = chk.getAttribute("data-id");
        if (onToggleComplete) onToggleComplete(id, e.target.checked);
      });
    });
  }
};
