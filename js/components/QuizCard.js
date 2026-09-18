/**
 * QuizCard — Reusable quiz card
 */

export const QuizCard = {
  render(quiz) {
    const title = quiz.title || "Quiz";
    const desc = quiz.description || "";
    const duration = quiz.durationMinutes || quiz.duration_minutes || 10;
    const total = quiz.totalMarks || quiz.total_marks || 0;
    
    return `
      <button class="quiz-card" data-quiz-id="${quiz.id || ''}" style="
        display:flex;flex-direction:column;gap:12px;padding:16px;
        background:linear-gradient(135deg, #FFFFFF, #F8FBF8);
        border:1.5px solid #E1E8E1;border-radius:18px;
        cursor:pointer;font-family:inherit;text-align:left;width:100%;
        box-shadow:0 2px 8px rgba(28,62,44,0.04);
        position:relative;overflow:hidden;
      ">
        <div style="position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#F59E0B,#D97706);"></div>
        <div style="display:flex;align-items:center;gap:12px;">
          <div style="width:48px;height:48px;border-radius:14px;background:linear-gradient(135deg,#FEF3C7,#FDE68A);display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0;">🎯</div>
          <div style="flex:1;min-width:0;">
            <div style="font-size:14px;font-weight:800;color:#1C3E2C;margin-bottom:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(title)}</div>
            ${desc ? `<div style="font-size:11.5px;color:#84968B;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(desc)}</div>` : ""}
          </div>
        </div>
        <div style="display:flex;gap:14px;padding-top:10px;border-top:1px dashed #E1E8E1;font-size:11.5px;color:#57675D;font-weight:700;">
          <span>⏱️ ${duration} min</span>
          <span>📋 ${total} marks</span>
        </div>
      </button>
    `;
  },
  
  bindEvents(container, onStart) {
    container.querySelectorAll(".quiz-card").forEach((card) => {
      card.addEventListener("click", () => {
        const id = card.getAttribute("data-quiz-id");
        if (onStart) onStart(id);
      });
    });
  }
};

function escapeHtml(str) {
  if (str == null) return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}