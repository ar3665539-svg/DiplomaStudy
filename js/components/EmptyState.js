/**
 * EmptyState — Reusable empty state
 */

export const EmptyState = {
  render({ icon = "📭", title = "কিছু নেই", banglaTitle = "", message = "", showBadge = false, badge = "" } = {}) {
    return `
      <div style="text-align:center;padding:56px 24px;background:#FFFFFF;border:1.5px dashed #E1E8E1;border-radius:20px;margin:20px 0;">
        ${showBadge && badge ? `<span style="display:inline-block;font-size:10px;font-weight:800;padding:3px 10px;background:#F2F5F2;color:#84968B;border-radius:999px;margin-bottom:12px;">${escapeHtml(badge)}</span>` : ""}
        <div style="font-size:56px;margin-bottom:16px;">${icon}</div>
        <h3 style="font-size:16px;font-weight:800;color:#1C3E2C;letter-spacing:-0.2px;margin:0 0 6px;">${escapeHtml(title)}</h3>
        ${banglaTitle ? `<p style="font-size:13px;font-weight:700;color:#1C3E2C;margin:0 0 8px;">${escapeHtml(banglaTitle)}</p>` : ""}
        ${message ? `<p style="font-size:12.5px;color:#84968B;line-height:1.55;max-width:300px;margin:0 auto;">${escapeHtml(message)}</p>` : ""}
      </div>
    `;
  }
};

function escapeHtml(str) {
  if (str == null) return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}