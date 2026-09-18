/**
 * SubjectCard — Reusable subject card
 */

export const SubjectCard = {
  render(subject, { compact = false, onClick = null } = {}) {
    const id = subject.id;
    const icon = subject.icon || "📘";
    const name = subject.name || "Untitled";
    const bangla = subject.banglaName || "";
    const code = subject.code || "";
    const type = subject.type || "Theory";
    const credits = subject.credits || 3;

    if (compact) {
      return `
        <button class="subject-card" data-subject-id="${id}" style="
          display:flex;align-items:center;gap:12px;padding:14px;
          background:#FFFFFF;border:1.5px solid #E1E8E1;border-radius:16px;
          cursor:pointer;font-family:inherit;text-align:left;width:100%;
          box-shadow:0 2px 8px rgba(28,62,44,0.04);
        ">
          <div style="width:46px;height:46px;border-radius:13px;background:linear-gradient(135deg,#DCFCE7,#BBF7D0);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;">${icon}</div>
          <div style="flex:1;min-width:0;">
            <div style="font-size:13.5px;font-weight:800;color:#1C3E2C;margin-bottom:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(name)}</div>
            ${bangla ? `<div style="font-size:11px;color:#84968B;font-weight:600;">${escapeHtml(bangla)}</div>` : ""}
          </div>
        </button>
      `;
    }

    return `
      <button class="subject-card" data-subject-id="${id}" style="
        display:flex;flex-direction:column;gap:10px;padding:14px;
        background:#FFFFFF;border:1.5px solid #E1E8E1;border-radius:18px;
        cursor:pointer;font-family:inherit;text-align:left;width:100%;
        box-shadow:0 2px 8px rgba(28,62,44,0.04);
      ">
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,#DCFCE7,#BBF7D0);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;">${icon}</div>
          ${code ? `<div style="font-size:10px;font-weight:800;color:#84968B;font-family:ui-monospace,monospace;">${escapeHtml(code)}</div>` : ""}
        </div>
        <div>
          <div style="font-size:13.5px;font-weight:800;color:#1C3E2C;margin-bottom:2px;">${escapeHtml(name)}</div>
          ${bangla ? `<div style="font-size:11px;color:#84968B;font-weight:600;">${escapeHtml(bangla)}</div>` : ""}
        </div>
        <div style="display:flex;gap:4px;">
          <span style="font-size:9px;font-weight:800;color:#57675D;background:#F2F5F2;padding:2px 7px;border-radius:5px;text-transform:uppercase;">${escapeHtml(type)}</span>
          <span style="font-size:9px;font-weight:800;color:#C87A1E;background:#FEF3C7;padding:2px 7px;border-radius:5px;">${credits} CR</span>
        </div>
      </button>
    `;
  },

  bindEvents(container, onSelect) {
    container.querySelectorAll(".subject-card").forEach((card) => {
      card.addEventListener("click", () => {
        const id = card.getAttribute("data-subject-id");
        if (onSelect) onSelect(id);
        else if (id) window.location.hash = `#/subject?subjectId=${id}`;
      });
    });
  }
};

function escapeHtml(str) {
  if (str == null) return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}