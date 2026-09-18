/**
 * Loader — Reusable loading spinner
 */

export const Loader = {
  render(message = "Loading...", size = "md") {
    const sizes = { sm: "24px", md: "34px", lg: "48px" };
    const s = sizes[size] || sizes.md;

    return `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 20px;text-align:center;">
        <div style="
          width:${s};height:${s};
          border:3px solid #E1E8E1;
          border-top-color:#1C3E2C;
          border-radius:50%;
          animation:ds-loader-spin 0.8s linear infinite;
        "></div>
        ${message ? `<p style="margin-top:14px;color:#84968B;font-size:13px;font-weight:600;">${escapeHtml(message)}</p>` : ""}
      </div>
    `;
  },

  renderInline(size = "16px") {
    return `<span style="
      display:inline-block;width:${size};height:${size};
      border:2px solid rgba(255,255,255,0.3);
      border-top-color:#FFFFFF;
      border-radius:50%;
      animation:ds-loader-spin 0.7s linear infinite;
      vertical-align:middle;
    "></span>`;
  }
};

function escapeHtml(str) {
  if (str == null) return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Inject keyframes
if (!document.getElementById("ds-loader-styles")) {
  const style = document.createElement("style");
  style.id = "ds-loader-styles";
  style.textContent = `@keyframes ds-loader-spin { to { transform: rotate(360deg); } }`;
  document.head.appendChild(style);
}