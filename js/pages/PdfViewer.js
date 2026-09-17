/**
 * DiplomaStudy - PDF Viewer Page
 * Supabase Storage থেকে PDF দেখায়
 */

import { AppShell } from "../components/AppShell.js";
import { EmptyState } from "../components/EmptyState.js";
import { getPdfsByChapter } from "../services/api.js";

export async function renderPdfViewer(params = {}) {
  const pdfId = params.pdfId;
  const chapterId = params.chapterId;

  AppShell.updateHeader({
    title: "Loading PDF...",
    showBack: true
  });

  const main = AppShell.getMainView();
  if (!main) return;

  main.innerHTML = `
    <div style="text-align: center; padding: 80px 20px;">
      <div class="spinner"></div>
      <p style="margin-top: 14px; color: #84968B; font-size: 13px; font-weight: 500;">
        PDF loading...
      </p>
    </div>
  `;

  // Load PDF info
  let pdf = null;
  try {
    const pdfs = await getPdfsByChapter(chapterId);
    pdf = pdfs.find(p => p.id === pdfId);
  } catch (err) {
    console.error('[PdfViewer] Load error:', err);
  }

  // ═══════════════════════════════════════════
  // VALIDATION
  // ═══════════════════════════════════════════
  if (!pdf) {
    AppShell.updateHeader({ title: "PDF Not Found", showBack: true });
    main.innerHTML = EmptyState.render({
      icon: "📄",
      title: "PDF Not Found",
      banglaTitle: "PDF পাওয়া যায়নি",
      message: "এই PDF এর কোনো record server এ নেই।",
      showBadge: false
    });
    return;
  }

  if (!pdf.fileUrl) {
    AppShell.updateHeader({ title: "PDF Link Missing", showBack: true });
    main.innerHTML = EmptyState.render({
      icon: "⚠️",
      title: "PDF Link Missing",
      banglaTitle: "PDF এর লিংক নেই",
      message: "এই PDF এর file path server এ সঠিকভাবে save হয়নি। Admin এর সাথে যোগাযোগ করুন।",
      showBadge: false
    });
    return;
  }

  AppShell.updateHeader({
    title: pdf.title,
    subtitle: pdf.fileName || "",
    showBack: true
  });

  const pdfUrl = pdf.fileUrl;
  // Google Docs Viewer for Android fallback
  const gdocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`;

  main.innerHTML = `
    <div class="pdf-mobile-page">
      
      <!-- PDF Info -->
      <div class="pdf-mobile-info">
        <div class="pdf-mobile-icon">📄</div>
        <div class="pdf-mobile-body">
          <h2 class="pdf-mobile-title">${escapeHtml(pdf.title)}</h2>
          <div class="pdf-mobile-meta">
            ${pdf.fileSize ? `<span>💾 ${pdf.fileSize}</span>` : ''}
            ${pdf.fileName ? `<span>📎 ${escapeHtml(pdf.fileName)}</span>` : ''}
          </div>
        </div>
      </div>

      <!-- Toolbar -->
      <div class="pdf-mobile-toolbar">
        <button class="pdf-tool-btn pdf-tool-primary" id="pdf-open-tab">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
          <span>New Tab এ খুলুন</span>
        </button>
        <a href="${pdfUrl}" download class="pdf-tool-btn pdf-tool-secondary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
        </a>
      </div>

      <!-- Viewer Tabs -->
      <div class="pdf-view-tabs">
        <button class="pdf-view-tab active" data-view="direct">
          📖 Direct
        </button>
        <button class="pdf-view-tab" data-view="gdocs">
          🔍 Google Viewer
        </button>
      </div>

      <!-- Direct Viewer -->
      <div class="pdf-viewer-frame" id="view-direct">
        <iframe 
          src="${pdfUrl}#toolbar=1&view=FitH&scrollbar=1"
          class="pdf-iframe"
          title="${escapeHtml(pdf.title)}"
          loading="lazy"
          allow="fullscreen"
        ></iframe>
      </div>

      <!-- Google Docs Viewer -->
      <div class="pdf-viewer-frame" id="view-gdocs" style="display: none;">
        <iframe 
          src="${gdocsUrl}"
          class="pdf-iframe"
          title="${escapeHtml(pdf.title)}"
          loading="lazy"
        ></iframe>
      </div>

      <!-- Hint -->
      <div class="pdf-mobile-hint">
        <span>💡</span>
        <p>PDF না দেখা গেলে উপরে <strong>"New Tab এ খুলুন"</strong> button চাপুন।</p>
      </div>

    </div>
  `;

  // ═══════════════════════════════════════════
  // Bind: Open in new tab
  // ═══════════════════════════════════════════
  main.querySelector("#pdf-open-tab")?.addEventListener("click", () => {
    window.open(pdfUrl, "_blank", "noopener,noreferrer");
  });

  // ═══════════════════════════════════════════
  // Bind: View tabs
  // ═══════════════════════════════════════════
  main.querySelectorAll(".pdf-view-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      const view = tab.getAttribute("data-view");

      main.querySelectorAll(".pdf-view-tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      main.querySelector("#view-direct").style.display = view === "direct" ? "block" : "none";
      main.querySelector("#view-gdocs").style.display = view === "gdocs" ? "block" : "none";
    });
  });
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}