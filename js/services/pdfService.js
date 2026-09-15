/**
 * DiplomaStudy - PDF Service
 * Handles PDF viewing, downloading, and bookmarking integration
 */

import { pdfs, getPdfsByCategory } from "../../data/pdfs.js";
import { Toast } from "../components/Toast.js";

export const pdfService = {
  getAll() {
    return pdfs;
  },

  getByCategory(category) {
    return getPdfsByCategory(category);
  },

  getById(id) {
    return pdfs.find((p) => p.id === id) || null;
  },

  openPdf(url) {
    if (!url) {
      Toast.show("PDF document not available", "error");
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  },

  downloadPdf(url, filename = "document.pdf") {
    if (!url) {
      Toast.show("Download link unavailable", "error");
      return;
    }
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    Toast.show("Downloading PDF...", "info");
  }
};
