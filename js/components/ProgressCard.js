/**
 * ProgressCard — Reusable progress display
 */

export const ProgressCard = {
  render({ title, subtitle = "", current = 0, total = 100, percent = null, color = "#10B981" } = {}) {
    const p = percent !== null ? percent : (total > 0 ? Math.round((current / total) * 100) : 0);

    return `
      <div class="progress-card" style="padding:16px;background:#FFFFFF;border:1.5px solid #E1E8E1;border-radius:16px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;gap:8px;">
          <div style="flex:1;min-width:0;">
            <div style="font-size:13.5px;font-weight:800;color:#1C3E2C;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(title)}</div>
            ${subtitle ? `<div style="font-size:11px;color:#84968B;font-weight:600;margin-top:2px;">${escapeHtml(subtitle)}</div>` : ""}
          </div>
          <div style="font-size:16px;font-weight:900;color:${color};flex-shrink:0;">${p}%</div>
        </div>
        <div style="height:6px;background:#E8EFE8;border-radius:999px;overflow:hidden;">
          <div style="height:100%;width:${p}%;background:linear-gradient(90deg, ${color}, ${adjustColor(color, -20)});border-radius:999px;transition:width 0.6s cubic-bezier(0.34,1.56,0.64,1);"></div>
        </div>
        ${total > 0 ? `<div style="font-size:10.5px;color:#84968B;font-weight:600;margin-top:6px;">${current} / ${total}</div>` : ""}
      </div>
    `;
  }
};

function adjustColor(hex, amount) {
  try {
    const num = parseInt(hex.replace("#", ""), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
    const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
    return "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");
  } catch (e) { return hex; }
}

function escapeHtml(str) {
  if (str == null) return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}