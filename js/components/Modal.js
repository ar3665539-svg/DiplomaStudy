/**
 * DiplomaStudy - Modal Component
 */

export const Modal = {
  show({ title, bodyHtml, confirmText = "Confirm", cancelText = "Cancel", onConfirm, onCancel }) {
    // Remove existing modals
    const existing = document.querySelector(".modal-overlay");
    if (existing) existing.remove();

    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.innerHTML = `
      <div class="modal-content animate-fade-in" role="dialog" aria-modal="true">
        <div class="modal-header">
          <h3 class="modal-title">${title}</h3>
          <button class="header-icon-btn modal-close-btn" aria-label="Close modal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="modal-body">${bodyHtml}</div>
        <div class="modal-footer">
          ${cancelText ? `<button class="btn btn-secondary flex-1 modal-cancel-btn">${cancelText}</button>` : ""}
          ${confirmText ? `<button class="btn btn-primary flex-1 modal-confirm-btn">${confirmText}</button>` : ""}
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    const close = () => overlay.remove();

    overlay.querySelector(".modal-close-btn")?.addEventListener("click", () => {
      close();
      if (onCancel) onCancel();
    });

    overlay.querySelector(".modal-cancel-btn")?.addEventListener("click", () => {
      close();
      if (onCancel) onCancel();
    });

    overlay.querySelector(".modal-confirm-btn")?.addEventListener("click", () => {
      if (onConfirm) onConfirm();
      close();
    });

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        close();
        if (onCancel) onCancel();
      }
    });
  }
};
