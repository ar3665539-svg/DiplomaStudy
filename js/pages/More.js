/**
 * DiplomaStudy - More Features Directory
 */

import { AppShell } from "../components/AppShell.js";
import { comingSoonFeatures } from "../../data/comingSoonFeatures.js";
import { showComingSoon } from "../core/comingSoonHelper.js";

export function renderMore() {
  AppShell.updateHeader({
    title: "More Features",
    subtitle: "সব feature এক জায়গায়",
    showBack: false
  });

  const main = AppShell.getMainView();
  if (!main) return;

  main.innerHTML = `
    <div class="page-intro">
      <p class="page-intro-text">
        নিচের সব feature শীঘ্রই যোগ করা হবে। যেকোনো একটা ট্যাপ করলে জানতে পারবেন।
      </p>
    </div>

    <div class="more-grid">
      ${comingSoonFeatures.map((f) => `
        <div 
          class="more-card" 
          data-coming-soon="${f.title} (${f.banglaTitle})"
          role="button"
          tabindex="0"
        >
          <div class="more-icon">${f.icon}</div>
          <div class="more-body">
            <h3 class="more-title">${f.title}</h3>
            <p class="more-bangla">${f.banglaTitle}</p>
            <p class="more-desc">${f.description}</p>
          </div>
          <span class="more-lock">🔒</span>
        </div>
      `).join("")}
    </div>

    <div class="info-box-civil mt-md">
      <div class="info-icon">ℹ️</div>
      <div>
        <p class="info-text">Civil 1st Semester এ ফোকাস</p>
        <p class="info-sub">এই version টি শুধু Civil Engineering 1st Semester এর জন্য। বাকি সব feature শীঘ্রই আসছে।</p>
      </div>
    </div>
  `;

  main.querySelectorAll("[data-coming-soon]").forEach((el) => {
    const handle = () => {
      const name = el.getAttribute("data-coming-soon");
      showComingSoon(name);
    };
    el.addEventListener("click", handle);
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handle();
      }
    });
  });
}