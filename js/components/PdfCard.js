/**
 * DiplomaStudy - PdfCard Component
 */

export const PdfCard = {
  render(pdf, { isBookmarked = false } = {}) {
    return `
      <div class="card mb-md pdf-card" data-id="${pdf.id}" id="pdf-card-${pdf.id}">
        <div class="flex items-start justify-between mb-sm">
          <div class="flex items-center gap-sm">
            <div style="width: 36px; height: 36px; background-color: var(--color-danger-bg); color: var(--color-danger); border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 11px;">
              PDF
            </div>
            <div>
              <h3 class="text-sm font-bold text-forest">${pdf.title}</h3>
              <span class="text-xs text-muted">${pdf.category} • ${pdf.pages} Pages • ${pdf.fileSize}</span>
            </div>
          </div>
          <button class="header-icon-btn btn-bookmark-pdf" data-id="${pdf.id}" aria-label="Bookmark PDF" title="Bookmark">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="${isBookmarked ? "var(--color-accent)" : "none"}" stroke="${isBookmarked ? "var(--color-accent)" : "currentColor"}" stroke-width="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
          </button>
        </div>

        ${pdf.banglaTitle ? `<p class="text-xs text-muted mb-sm" style="line-height: 1.4;">${pdf.banglaTitle}</p>` : ""}

        <div class="flex items-center justify-between text-xs text-dim mb-md">
          <span>By ${pdf.author || "Academic Board"}</span>
          <span>⬇ ${pdf.downloads || 120} reads</span>
        </div>

        <div class="flex items-center gap-sm">
          <a href="${pdf.url}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm flex-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <span>View Online</span>
          </a>
          <a href="${pdf.url}" download class="btn btn-secondary btn-sm" title="Download">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </a>
        </div>
      </div>
    `;
  },

  bindEvents(container, { onBookmark }) {
    container.querySelectorAll(".btn-bookmark-pdf").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        if (onBookmark) onBookmark(id, btn);
      });
    });
  }
};
