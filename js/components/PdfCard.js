/**
 * PdfCard — Reusable PDF card
 */

export const PdfCard = {
  render(pdf) {
    const url = pdf.fileUrl || "#";
    const hasUrl = !!pdf.fileUrl;
    const title = pdf.title || "Untitled";
    const fileName = pdf.fileName || "";
    const fileSize = pdf.fileSize || "";

    return `
      <a class="pdf-card" href="${hasUrl ? url : '#'}" target="_blank" rel="noopener" ${hasUrl ? "" : 'onclick="event.preventDefault();"' } style="
        display:flex;align-items:center;gap:12px;
        padding:14px;background:#FFFFFF;
        border:1.5px solid #E1E8E1;border-radius:14px;
        text-decoration:none;cursor:pointer;
        box-shadow:0 2px 6px rgba(28,62,44,0.04);
      ">
        <div style="width:48px;height:48px;border-radius:14px;background:linear-gradient(135deg,#FEE2E2,#FECACA);color:#991B1B;display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0;">📄</div>
        <div style="flex:1;min-width:0;">
          <div style="font-size:13.5px;font-weight:800;color:#1C3E2C;margin-bottom:3px;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">${escapeHtml(title)}</div>
          ${fileName ? `<div style="font-size:11px;color:#84968B;font-weight:600;">${escapeHtml(fileName)} ${fileSize ? "• " + escapeHtml(fileSize) : ""}</div>` : ""}
        </div>
        <div style="width:32px;height:32px;border-radius:50%;background:#DCFCE7;color:#065F46;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M7 17l10-10M7 7h10v10"/></svg>
        </div>
      </a>
    `;
  }
};

function escapeHtml(str) {
  if (str == null) return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}