/**
 * DiplomaStudy - Pull to Refresh
 * Instagram-style pull gesture
 */

export function attachPullToRefresh(container, onRefresh, options = {}) {
  if (!container || typeof onRefresh !== "function") return () => {};

  const threshold = options.threshold || 70;
  const maxPull = options.maxPull || 120;

  let startY = 0;
  let currentY = 0;
  let pulling = false;
  let triggered = false;

  // Create indicator
  const indicator = document.createElement("div");
  indicator.style.cssText = `
    position: fixed;
    top: calc(56px + env(safe-area-inset-top, 0px));
    left: 50%;
    transform: translateX(-50%) translateY(-60px);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #FFFFFF;
    box-shadow: 0 4px 14px rgba(28,62,44,0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  `;

  indicator.innerHTML = `
    <div class="ptr-spinner" style="
      width: 20px; height: 20px;
      border: 2.5px solid #E1E8E1;
      border-top-color: #1C3E2C;
      border-radius: 50%;
      transition: transform 0.1s ease;
    "></div>
  `;

  document.body.appendChild(indicator);
  const spinner = indicator.querySelector(".ptr-spinner");

  function onTouchStart(e) {
    if (window.scrollY > 5) return;
    if (e.touches.length !== 1) return;
    startY = e.touches[0].clientY;
    pulling = false;
    triggered = false;
  }

  function onTouchMove(e) {
    if (window.scrollY > 5) return;
    if (e.touches.length !== 1) return;

    currentY = e.touches[0].clientY;
    const delta = currentY - startY;

    if (delta > 5 && delta < maxPull) {
      pulling = true;
      const progress = Math.min(delta / threshold, 1);

      indicator.style.opacity = String(Math.min(progress * 1.2, 1));
      indicator.style.transform = `translateX(-50%) translateY(${Math.max(-60 + delta * 0.8, -20)}px)`;

      // Rotate spinner based on progress
      spinner.style.transform = `rotate(${progress * 360}deg)`;
    }
  }

  function onTouchEnd() {
    if (!pulling) return;

    const delta = currentY - startY;

    if (delta >= threshold && !triggered) {
      triggered = true;

      // Show loading state
      spinner.style.borderTopColor = "#10B981";
      spinner.style.animation = "ptr-spin 0.8s linear infinite";
      indicator.style.opacity = "1";
      indicator.style.transform = `translateX(-50%) translateY(20px)`;

      // Trigger refresh
      Promise.resolve(onRefresh()).finally(() => {
        setTimeout(() => {
          indicator.style.opacity = "0";
          indicator.style.transform = `translateX(-50%) translateY(-60px)`;
          spinner.style.animation = "";
          spinner.style.borderTopColor = "#1C3E2C";
          spinner.style.transform = "";
        }, 400);
      });
    } else {
      // Reset
      indicator.style.opacity = "0";
      indicator.style.transform = `translateX(-50%) translateY(-60px)`;
      spinner.style.transform = "";
    }

    pulling = false;
    triggered = false;
    startY = 0;
    currentY = 0;
  }

  // Inject spinner animation
  if (!document.getElementById("ptr-styles")) {
    const style = document.createElement("style");
    style.id = "ptr-styles";
    style.textContent = `
      @keyframes ptr-spin {
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }

  container.addEventListener("touchstart", onTouchStart, { passive: true });
  container.addEventListener("touchmove", onTouchMove, { passive: true });
  container.addEventListener("touchend", onTouchEnd);
  container.addEventListener("touchcancel", onTouchEnd);

  // Return cleanup function
  return () => {
    container.removeEventListener("touchstart", onTouchStart);
    container.removeEventListener("touchmove", onTouchMove);
    container.removeEventListener("touchend", onTouchEnd);
    container.removeEventListener("touchcancel", onTouchEnd);
    if (indicator.parentNode) indicator.parentNode.removeChild(indicator);
  };
}