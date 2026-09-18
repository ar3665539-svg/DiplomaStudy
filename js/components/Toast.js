/**
 * DiplomaStudy - Modern Toast Notification
 */

const CONTAINER_ID = "ds-toast-container";

function ensureContainer() {
  let container = document.getElementById(CONTAINER_ID);
  if (container) return container;

  container = document.createElement("div");
  container.id = CONTAINER_ID;
  container.style.cssText = `
    position: fixed;
    bottom: calc(90px + env(safe-area-inset-bottom, 0px));
    left: 50%;
    transform: translateX(-50%);
    width: calc(100% - 32px);
    max-width: 400px;
    z-index: 99999;
    display: flex;
    flex-direction: column;
    gap: 8px;
    pointer-events: none;
  `;
  document.body.appendChild(container);
  return container;
}

const VARIANTS = {
  success: { bg: "#10B981", icon: "✓" },
  error:   { bg: "#EF4444", icon: "✕" },
  warning: { bg: "#F59E0B", icon: "!" },
  info:    { bg: "#3B82F6", icon: "i" }
};

export const Toast = {
  /**
   * Show a toast
   * @param {string} message
   * @param {string} type - success | error | warning | info
   * @param {number} duration - ms
   */
  show(message, type = "info", duration = 3000) {
    const container = ensureContainer();
    const variant = VARIANTS[type] || VARIANTS.info;

    const toast = document.createElement("div");
    toast.style.cssText = `
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      background: #FFFFFF;
      border-radius: 14px;
      box-shadow: 0 12px 28px -6px rgba(28,62,44,0.25), 0 4px 10px rgba(28,62,44,0.1);
      border-left: 4px solid ${variant.bg};
      font-family: inherit;
      font-size: 13.5px;
      font-weight: 600;
      color: #1C3E2C;
      pointer-events: auto;
      opacity: 0;
      transform: translateY(20px) scale(0.96);
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      overflow: hidden;
      position: relative;
    `;

    toast.innerHTML = `
      <div style="
        width: 24px; height: 24px;
        border-radius: 50%;
        background: ${variant.bg};
        color: #FFFFFF;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 900;
        font-size: 12px;
        flex-shrink: 0;
      ">${variant.icon}</div>
      <div style="flex: 1; min-width: 0; line-height: 1.4;">${escapeHtml(message)}</div>
    `;

    // Dark mode override
    if (document.documentElement.getAttribute("data-theme") === "dark") {
      toast.style.background = "#1E2E24";
      toast.style.color = "#EDF3EE";
    }

    container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        toast.style.opacity = "1";
        toast.style.transform = "translateY(0) scale(1)";
      });
    });

    // Auto dismiss
    const timeout = setTimeout(() => {
      dismiss(toast);
    }, duration);

    // Click to dismiss
    toast.addEventListener("click", () => {
      clearTimeout(timeout);
      dismiss(toast);
    });

    return toast;
  },

  success(msg, duration) { return this.show(msg, "success", duration); },
  error(msg, duration) { return this.show(msg, "error", duration); },
  warning(msg, duration) { return this.show(msg, "warning", duration); },
  info(msg, duration) { return this.show(msg, "info", duration); }
};

function dismiss(toast) {
  if (!toast.parentNode) return;
  toast.style.opacity = "0";
  toast.style.transform = "translateY(20px) scale(0.96)";
  setTimeout(() => {
    if (toast.parentNode) toast.parentNode.removeChild(toast);
  }, 300);
}

function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}