/**
 * QuestionCard — Reusable question card
 */

export const QuestionCard = {
  render(q, index = 0) {
    const type = q.type || "short";
    const typeEmoji = type === "mcq" ? "⚡" : type === "creative" ? "📝" : "📄";
    const typeLabel = type === "mcq" ? "MCQ" : type === "creative" ? "রচনামূলক" : "সংক্ষিপ্ত";

    return `
      <div class="question-card" style="padding:16px;background:#FFFFFF;border:1.5px solid #E1E8E1;border-radius:16px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;gap:8px;">
          <div style="width:30px;height:30px;border-radius:10px;background:linear-gradient(135deg,#1C3E2C,#2A5540);color:#FFFFFF;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;flex-shrink:0;">${index + 1}</div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;">
            <span style="font-size:10px;font-weight:800;color:#065F46;background:#DCFCE7;padding:3px 8px;border-radius:6px;">${typeEmoji} ${typeLabel}</span>
            ${q.marks ? `<span style="font-size:10px;font-weight:800;color:#92400E;background:#FEF3C7;padding:3px 8px;border-radius:6px;">🎯 ${escapeHtml(String(q.marks))}</span>` : ""}
            ${q.board ? `<span style="font-size:10px;font-weight:800;color:#57675D;background:#F2F5F2;padding:3px 8px;border-radius:6px;">${escapeHtml(q.board)}</span>` : ""}
          </div>
        </div>
        <div style="font-size:14px;font-weight:700;color:#1C3E2C;line-height:1.55;margin-bottom:14px;">${escapeHtml(q.question || "")}</div>

        ${type === "mcq" && q.options && q.options.length > 0 ? `
          <div style="display:flex;flex-direction:column;gap:8px;">
            ${q.options.map((opt, i) => {
              const letter = String.fromCharCode(65 + i);
              const isCorrect = opt === q.answer;
              return `
                <div style="display:flex;align-items:center;gap:10px;padding:11px 14px;background:${isCorrect ? "linear-gradient(135deg,#DCFCE7,#BBF7D0)" : "#F8FBF8"};border:1.5px solid ${isCorrect ? "#10B981" : "#E1E8E1"};border-radius:12px;">
                  <span style="width:26px;height:26px;border-radius:8px;background:${isCorrect ? "#10B981" : "#FFFFFF"};color:${isCorrect ? "#FFFFFF" : "#57675D"};font-size:12px;font-weight:800;display:flex;align-items:center;justify-content:center;font-family:ui-monospace,monospace;">${letter}</span>
                  <span style="flex:1;font-size:13.5px;font-weight:600;color:#1C3E2C;">${escapeHtml(opt)}</span>
                  ${isCorrect ? `<span style="color:#10B981;font-size:16px;font-weight:800;">✓</span>` : ""}
                </div>
              `;
            }).join("")}
          </div>
        ` : `
          <div style="padding:14px 16px;background:linear-gradient(135deg, rgba(28,62,44,0.06), transparent);border-left:3px solid #1C3E2C;border-radius:12px;">
            <div style="font-size:10px;font-weight:800;color:#1C3E2C;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:6px;">উত্তর</div>
            <div style="font-size:13.5px;font-weight:600;color:#1C3E2C;line-height:1.6;white-space:pre-wrap;">${escapeHtml(q.answer || "")}</div>
          </div>
        `}
      </div>
    `;
  }
};

function escapeHtml(str) {
  if (str == null) return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}