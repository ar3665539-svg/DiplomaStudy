/**
 * DiplomaStudy - Coming Soon Helper
 */

import { showComingSoon as showModal } from "../components/ComingSoonModal.js";

export function showComingSoon(featureName = "এই feature") {
  try {
    showModal(featureName);
  } catch (e) {
    // Fallback
    console.warn("[ComingSoon] Modal failed, using alert:", e);
    alert(`${featureName} শীঘ্রই আসছে!`);
  }
}

export function isComingSoon(feature) {
  const list = ["jobs", "ai", "discussion", "video-lessons"];
  return list.includes(feature);
}