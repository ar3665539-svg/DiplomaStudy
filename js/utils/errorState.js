/**
 * DiplomaStudy - Error States
 * Friendly error UI with retry
 */

// ═══════════════════════════════════════════
// PRESET ERROR TYPES
// ═══════════════════════════════════════════
const ERROR_TYPES = {
  network: {
    icon: "📡",
    title: "Internet নেই",
    bangla: "ইন্টারনেট connection check করুন",
    color: "#DC2626",
    bg: "#FEE2E2"
  },
  server: {
    icon: "⚠️",
    title: "Server সমস্যা",
    bangla: "কিছুক্ষণ পরে আবার চেষ্টা করুন",
    color: "#B45309",
    bg: "#FEF3C7"
  },
  notFound: {
    icon: "🔍",
    title: "পাওয়া যায়নি",
    bangla: "এই content আর নেই",
    color: "#0891B2",
    bg: "#CFFAFE"
  },
  empty: {
    icon: "📭",
    title: "কিছু নেই",
    bangla: "এখনো কোনো data যোগ করা হয়নি",
    color: "#84968B",
    bg: "#F2F5F2"
  },
  unknown: {
    icon: "❌",
    title: "কিছু ভুল হয়েছে",
    bangla: "আবার চেষ্টা করুন",
    color: "#DC2626",
    bg: "#FEE2E2"
  }
};

// ═══════════════════════════════════════════
// RENDER ERROR STATE
// ═══════════════════════════════════════════
export function errorState({ type = "unknown", message = "", retryFn = null, customTitle = "", customBangla = "" } = {}) {
  const cfg = ERROR_TYPES[type] || ERROR_TYPES.unknown;
  const title = customTitle || cfg.title;
  const bangla = customBangla || cfg.bangla;

  const retryId = `ds-retry-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  if (retryFn) {
    setTimeout(() => {
      document.getElementById(retryId)?.addEventListener("click", () => {
        try { retryFn(); } catch (e) { console.error(e); }
      });
    }, 0);
  }

  return `
    <div style="
      text-align:center;
      padding:56px 24px;
      background:#FFFFFF;
      border:1.5px dashed #E1E8E1;
      border-radius:20px;
      margin:20px 0;
    ">
      <div style="
        width:72px;height:72px;border-radius:50%;
        background:${cfg.bg};
        display:inline-flex;align-items:center;justify-content:center;
        font-size:36px;margin-bottom:16px;
      ">${cfg.icon}</div>

      <h3 style="
        font-size:16px;font-weight:800;color:${cfg.color};
        letter-spacing:-0.2px;margin:0 0 6px;
      ">${escapeHtml(title)}</h3>

      <p style="
        font-size:13px;color:#84968B;
        line-height:1.55;max-width:280px;
        margin:0 auto 20px;font-weight:500;
      ">${escapeHtml(bangla)}</p>

      ${message ? `
        <p style="
          font-size:11.5px;color:#84968B;
          background:#F8FBF8;padding:8px 12px;
          border-radius:8px;font-family:monospace;
          max-width:280px;margin:0 auto 20px;
          word-break:break-word;
        ">${escapeHtml(message)}</p>
      ` : ""}

      ${retryFn ? `
        <button id="${retryId}" style="
          display:inline-flex;align-items:center;gap:6px;
          padding:12px 24px;
          background:linear-gradient(135deg, #1C3E2C, #2A5540);
          color:#FFFFFF;
          border:none;border-radius:12px;
          font-size:13.5px;font-weight:800;
          font-family:inherit;cursor:pointer;
          box-shadow:0 8px 18px -4px rgba(28,62,44,0.35);
          -webkit-tap-highlight-color:transparent;
        ">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="23 4 23 10 17 10"></polyline>
            <polyline points="1 20 1 14 7 14"></polyline>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
          </svg>
          <span>আবার চেষ্টা করুন</span>
        </button>
      ` : ""}
    </div>
  `;
}

// ═══════════════════════════════════════════
// EMPTY STATE (non-error, just no data)
// ═══════════════════════════════════════════
export function emptyState({ icon = "📭", title = "কিছু নেই", message = "", actionFn = null, actionLabel = "" } = {}) {
  const actionId = `ds-action-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  if (actionFn) {
    setTimeout(() => {
      document.getElementById(actionId)?.addEventListener("click", () => {
        try { actionFn(); } catch (e) { console.error(e); }
      });
    }, 0);
  }

  return `
    <div style="
      text-align:center;
      padding:56px 24px;
      background:#FFFFFF;
      border:1.5px dashed #E1E8E1;
      border-radius:20px;
      margin:20px 0;
    ">
      <div style="font-size:64px;margin-bottom:16px;">${icon}</div>
      <h3 style="
        font-size:16px;font-weight:800;color:#1C3E2C;
        letter-spacing:-0.2px;margin:0 0 6px;
      ">${escapeHtml(title)}</h3>
      ${message ? `
        <p style="
          font-size:13px;color:#84968B;
          line-height:1.55;max-width:280px;
          margin:0 auto 20px;font-weight:500;
        ">${escapeHtml(message)}</p>
      ` : ""}
      ${actionFn && actionLabel ? `
        <button id="${actionId}" style="
          display:inline-flex;align-items:center;gap:6px;
          padding:12px 24px;
          background:linear-gradient(135deg, #1C3E2C, #2A5540);
          color:#FFFFFF;border:none;border-radius:12px;
          font-size:13.5px;font-weight:800;
          font-family:inherit;cursor:pointer;
        ">${escapeHtml(actionLabel)}</button>
      ` : ""}
    </div>
  `;
}

// ═══════════════════════════════════════════
// AUTO-DETECT ERROR TYPE
// ═══════════════════════════════════════════
export function detectErrorType(error) {
  if (!error) return "unknown";
  const msg = (error.message || String(error)).toLowerCase();

  if (msg.includes("failed to fetch") || msg.includes("network") || msg.includes("offline")) {
    return "network";
  }
  if (msg.includes("500") || msg.includes("502") || msg.includes("503") || msg.includes("server")) {
    return "server";
  }
  if (msg.includes("not found") || msg.includes("404")) {
    return "notFound";
  }
  return "unknown";
}

// ═══════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════
function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}