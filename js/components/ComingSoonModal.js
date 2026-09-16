/**
 * DiplomaStudy - Coming Soon Modal
 * সব locked feature এ একই modal দেখায়
 */

export const ComingSoonModal = {
  show(featureName = "এই feature") {
    // Remove existing
    document.getElementById("coming-soon-modal")?.remove();

    const overlay = document.createElement("div");
    overlay.id = "coming-soon-modal";
    overlay.className = "modal-overlay";
    overlay.style.cssText = "display: flex; align-items: center; justify-content: center; padding: 20px;";

    overlay.innerHTML = `
      <div class="coming-soon-modal-content animate-fade-in" role="dialog" aria-modal="true">
        <div class="coming-soon-icon">🔒</div>
        <h3 class="coming-soon-title">Coming Soon!</h3>
        <p class="coming-soon-desc">
          <strong>${featureName}</strong> feature টি শীঘ্রই যোগ করা হবে।
          Civil 1st Semester এর content server থেকে যুক্ত হওয়ার পর এটি সক্রিয় হবে।
        </p>
        <p class="coming-soon-hint">💡 আমাদের সাথে থাকুন</p>
        <button class="btn btn-primary btn-block" id="coming-soon-close">বুঝেছি</button>
      </div>
    `;

    document.body.appendChild(overlay);

    const close = () => overlay.remove();
    overlay.querySelector("#coming-soon-close")?.addEventListener("click", close);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });
  }
};