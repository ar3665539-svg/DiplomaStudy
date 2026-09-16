/**
 * DiplomaStudy - Coming Soon Page (fallback route)
 */

import { AppShell } from "../components/AppShell.js";
import { comingSoonFeatures } from "../../data/comingSoonFeatures.js";
import { router } from "../core/router.js";
import { showComingSoon } from "../core/comingSoonHelper.js";

export function renderComingSoon(params = {}) {
  const featureId = params.featureId;
  const feature = comingSoonFeatures.find((f) => f.id === featureId);

  AppShell.updateHeader({
    title: feature ? feature.title : "Coming Soon",
    subtitle: feature ? feature.banglaTitle : "শীঘ্রই আসছে",
    showBack: true
  });

  const main = AppShell.getMainView();
  if (!main) return;

  main.innerHTML = `
    <div class="coming-soon-page">
      <div class="csp-icon">${feature ? feature.icon : "🔒"}</div>
      <h2 class="csp-title">${feature ? feature.title : "Coming Soon"}</h2>
      <p class="csp-bangla">${feature ? feature.banglaTitle : "শীঘ্রই আসছে"}</p>
      <p class="csp-desc">
        এই feature টি এখনো তৈরি হয়নি। Civil 1st Semester এর content
        server থেকে যুক্ত হওয়ার পর এটি সক্রিয় হবে।
      </p>

      <div class="csp-actions">
        <button class="btn btn-primary btn-block" id="csp-home-btn">
          Home এ ফিরে যান
        </button>
        <button class="btn btn-secondary btn-block" id="csp-subjects-btn">
          Subjects দেখুন
        </button>
      </div>
    </div>
  `;

  main.querySelector("#csp-home-btn")?.addEventListener("click", () => {
    router.navigate("#/home");
  });
  main.querySelector("#csp-subjects-btn")?.addEventListener("click", () => {
    router.navigate("#/subjects");
  });
}