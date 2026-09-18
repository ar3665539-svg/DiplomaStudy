/**
 * PdfViewer — Full screen PDF viewer (iframe)
 */

import { AppShell } from "../components/AppShell.js";
import { errorState } from "../utils/errorState.js";

export function renderPdfViewer(params = {}) {
  AppShell.updateHeader({
    title: "PDF Viewer",
    subtitle: "",
    showBack: true,
    showSearch: false,
    showTheme: false,
    showSettings: false
  });

  const main = AppShell.getMainView();
  if (!main) return;

  const urlParams = new URLSearchParams(window.location.hash.split("?")[1] || "");
  const pdfUrl = urlParams.get("url") || "";
  const title = urlParams.get("title") || "PDF";

  if (!pdfUrl) {
    main.innerHTML = errorState({
      type: "notFound",
      customBangla: "PDF URL নেই",
      retryFn: () => window.location.hash = "#/home"
    });
    return;
  }

  AppShell.updateHeader({
    title: decodeURIComponent(title),
    subtitle: "",
    showBack: true,
    showSearch: false,
    showTheme: false,
    showSettings: false
  });

  main.innerHTML = `
    <div style="
      margin:-16px;
      height: calc(100vh - 56px - 90px);
      background:#F2F5F2;
      display:flex;align-items:center;justify-content:center;
    ">
      <iframe
        src="${pdfUrl}"
        style="width:100%;height:100%;border:none;background:#FFFFFF;"
        title="${escapeHtml(title)}"
      ></iframe>
    </div>

    <div style="position:fixed;bottom:calc(72px + env(safe-area-inset-bottom,0px));left:50%;transform:translateX(-50%);z-index:50;display:flex;gap:8px;">
      <a href="${pdfUrl}" download target="_blank" rel="noopener" style="
        display:inline-flex;align-items:center;gap:6px;
        padding:10px 16px;
        background:linear-gradient(135deg,#1C3E2C,#2A5540);
        color:#FFFFFF;text-decoration:none;
        border-radius:12px;font-size:12.5px;font-weight:800;
        box-shadow:0 8px 20px rgba(28,62,44,0.35);
      ">
        📥 Download
      </a>
      <button id="open-new-tab" style="
        display:inline-flex;align-items:center;gap:6px;
        padding:10px 16px;
        background:#FFFFFF;color:#1C3E2C;
        border:1.5px solid #E1E8E1;border-radius:12px;
        font-size:12.5px;font-weight:800;
        cursor:pointer;font-family:inherit;
        box-shadow:0 8px 20px rgba(28,62,44,0.1);
      ">
        🔗 নতুন ট্যাব
      </button>
    </div>
  `;

  main.querySelector("#open-new-tab")?.addEventListener("click", () => {
    window.open(pdfUrl, "_blank");
  });
}

function escapeHtml(str) {
  if (str == null) return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}