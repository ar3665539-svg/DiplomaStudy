/**
 * DiplomaStudy - PDF Service (helpers)
 */

export const pdfService = {
  /**
   * Open PDF in new tab
   */
  open(url) {
    if (!url) return false;
    try { window.open(url, "_blank", "noopener"); return true; }
    catch (e) { return false; }
  },

  /**
   * Navigate to in-app PDF viewer
   */
  openInApp(url, title = "PDF") {
    if (!url) return false;
    try {
      const encoded = encodeURIComponent(url);
      const encodedTitle = encodeURIComponent(title);
      window.location.hash = `#/pdf-viewer?url=${encoded}&title=${encodedTitle}`;
      return true;
    } catch (e) { return false; }
  },

  /**
   * Download PDF
   */
  download(url, filename = null) {
    if (!url) return false;
    try {
      const a = document.createElement("a");
      a.href = url;
      if (filename) a.download = filename;
      a.target = "_blank";
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      setTimeout(() => a.remove(), 100);
      return true;
    } catch (e) { return false; }
  },

  /**
   * Format file size
   */
  formatSize(bytes) {
    if (!bytes || bytes < 0) return "0 B";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  }
};

export default pdfService;