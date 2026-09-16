/**
 * DiplomaStudy - Coming Soon Helper
 * সব locked feature এ একই behavior দেয়
 */

import { ComingSoonModal } from "../components/ComingSoonModal.js";

export function showComingSoon(featureName = "এই feature") {
  ComingSoonModal.show(featureName);
}

export function attachComingSoonHandlers(container) {
  container.querySelectorAll("[data-coming-soon]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const featureName = el.getAttribute("data-coming-soon") || "এই feature";
      showComingSoon(featureName);
    });
  });
}