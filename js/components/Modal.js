/**
 * Modal — Reusable modal dialog
 */

export const Modal = {
  _current: null,

  show({ title = "", bodyHtml = "", confirmText = "OK", cancelText = "Cancel", onConfirm, onCancel, showCancel = true, showConfirm = true }) {
    this.close();

    const overlay = document.createElement("div");
    overlay.style.cssText = `
      position:fixed;inset:0;background:rgba(15,23,42,0.7);
      backdrop-filter:blur(6px);z-index:9999;
      display:flex;align-items:flex-end;justify-content:center;
      animation:fadeIn 0.2s ease;
    `;

    overlay.innerHTML = `
      <div style="
        background:#FFFFFF;width:100%;max-width:520px;
        border-radius:24px 24px 0 0;padding:24px;
        box-shadow:0 -12px 40px rgba(0,0,0,0.3);
        max-height:85vh;overflow-y:auto;
      ">
        <div style="width:40px;height:4px;background:#E1E8E1;border-radius:999px;margin:0 auto 16px;"></div>
        ${title ? `<h3 style="font-size:17px;font-weight:900;color:#1C3E2C;margin:0 0 16px;letter-spacing:-0.3px;">${escapeHtml(title)}</h3>` : ""}
        <div id="ds-modal-body">${bodyHtml}</div>
        ${(showCancel || showConfirm) ? `
          <div style="display:flex;gap:10px;margin-top:20px;">
            ${showCancel ? `<button data-action="cancel" style="flex:1;padding:14px;background:transparent;border:1.5px solid #E1E8E1;color:#57675D;border-radius:12px;font-weight:800;font-size:13.5px;cursor:pointer;font-family:inherit;">${escapeHtml(cancelText)}</button>` : ""}
            ${showConfirm ? `<button data-action="confirm" style="flex:2;padding:14px;background:linear-gradient(135deg,#1C3E2C,#2A5540);color:#FFFFFF;border:none;border-radius:12px;font-weight:800;font-size:13.5px;cursor:pointer;font-family:inherit;">${escapeHtml(confirmText)}</button>` : ""}
          </div>
        ` : ""}
      </div>
    `;

    document.body.appendChild(overlay);
    this._current = overlay;

    const close = () => this.close();

    overlay.querySelector('[data-action="cancel"]')?.addEventListener("click", () => {
      if (onCancel) onCancel();
      close();
    });
    overlay.querySelector('[data-action="confirm"]')?.addEventListener("click", () => {
      if (onConfirm) onConfirm();
      close();
    });
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        if (onCancel) onCancel();
        close();
      }
    });

    // ESC to close
    this._escHandler = (e) => {
      if (e.key === "Escape") {
        if (onCancel) onCancel();
        close();
      }
    };
    document.addEventListener("keydown", this._escHandler);

    return {
      close,
      get body() { return overlay.querySelector("#ds-modal-body"); }
    };
  },

  close() {
    if (this._current) {
      this._current.remove();
      this._current = null;
    }
    if (this._escHandler) {
      document.removeEventListener("keydown", this._escHandler);
      this._escHandler = null;
    }
  }
};

function escapeHtml(str) {
  if (str == null) return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}