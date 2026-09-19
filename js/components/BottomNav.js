/**
 * BottomNav - Modern glass navigation (unlocked)
 */

function injectNavStyles() {
  if (document.getElementById("ds-nav-override-v3")) return;
  const style = document.createElement("style");
  style.id = "ds-nav-override-v3";
  style.textContent = `
    #bottom-nav * { box-sizing: border-box; }
    #bottom-nav .nav-item { -webkit-tap-highlight-color: transparent; }
    @keyframes dsRipple { to { transform: scale(2.5); opacity: 0; } }
  `;
  document.head.appendChild(style);
}

export const BottomNav = {
  items: [
    { id: "home",  label: "Home",  icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`, route: "#/home" },
    { id: "study", label: "Study", icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`, route: "#/subjects" },
    { id: "quiz",  label: "Quiz",  icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`, route: "#/quiz" },
    { id: "saved", label: "Saved", icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>`, route: "#/bookmarks" },
    { id: "more",  label: "More",  icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1.5"></circle><circle cx="19" cy="12" r="1.5"></circle><circle cx="5" cy="12" r="1.5"></circle></svg>`, route: "#/more" }
  ],

  render() {
    injectNavStyles();

    const navStyle = `position:fixed;bottom:0;left:0;right:0;top:auto;width:100%;height:auto;z-index:50;background:#FFFFFF;border-top:1px solid #E1E8E1;box-shadow:0 -4px 20px rgba(28,62,44,0.08);padding-bottom:env(safe-area-inset-bottom,0);display:block;margin:0;font-family:inherit;`;
    const innerStyle = `display:grid;grid-template-columns:repeat(5,1fr);height:64px;max-width:680px;margin:0 auto;padding:0 8px;align-items:stretch;width:100%;`;

    return `
      <nav class="bottom-nav" id="bottom-nav" style="${navStyle}">
        <div class="bottom-nav-inner" style="${innerStyle}">
          ${this.items.map((item) => this.renderItem(item)).join("")}
        </div>
      </nav>
    `;
  },

  renderItem(item) {
    const itemStyle = `position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;padding:8px 2px;background:transparent;border:none;cursor:pointer;color:#84968B;text-decoration:none;font-family:inherit;-webkit-tap-highlight-color:transparent;transition:color 0.2s ease;overflow:visible;border-radius:10px;`;
    const iconWrapperStyle = `position:relative;display:flex;align-items:center;justify-content:center;width:40px;height:30px;border-radius:10px;transition:background 0.2s ease;`;
    const labelStyle = `display:block;font-size:10px;font-weight:700;line-height:1;letter-spacing:0.1px;text-align:center;color:inherit;`;

    return `
      <a class="nav-item" data-nav-id="${item.id}" data-route="${item.route}" href="${item.route}" aria-label="${item.label}" style="${itemStyle}">
        <div class="nav-item-icon" style="${iconWrapperStyle}">
          ${item.icon}
        </div>
        <span class="nav-item-label" style="${labelStyle}">${item.label}</span>
      </a>
    `;
  },

  bindEvents() {
    const nav = document.getElementById("bottom-nav");
    if (!nav) return;
    nav.querySelectorAll(".nav-item").forEach((item) => {
      item.addEventListener("click", (e) => createRipple(item, e));
    });
    this.updateActive();
  },

  updateActive() {
    const nav = document.getElementById("bottom-nav");
    if (!nav) return;
    const hash = window.location.hash || "#/home";
    nav.querySelectorAll(".nav-item").forEach((item) => {
      const route = item.getAttribute("data-route");
      const itemId = item.getAttribute("data-nav-id");
      const iconWrapper = item.querySelector(".nav-item-icon");
      const label = item.querySelector(".nav-item-label");

      let isActive = false;
      if (hash === route) isActive = true;
      else if (itemId === "study" && (hash.startsWith("#/subject") || hash.startsWith("#/content") || hash.startsWith("#/chapter"))) isActive = true;
      else if (itemId === "home" && (hash === "" || hash === "#/" || hash === "#/home")) isActive = true;
      else if (itemId === "saved" && (hash.startsWith("#/bookmarks") || hash.startsWith("#/notes"))) isActive = true;

      item.style.color = "#84968B";
      if (iconWrapper) iconWrapper.style.background = "transparent";

      if (isActive) {
        item.style.color = "#1C3E2C";
        if (iconWrapper) iconWrapper.style.background = "rgba(28, 62, 44, 0.08)";
        if (label) label.style.fontWeight = "800";
      } else {
        if (label) label.style.fontWeight = "700";
      }
    });
  },

  init() {
    this.bindEvents();
    window.addEventListener("hashchange", () => this.updateActive());
  }
};

function createRipple(el, e) {
  try {
    const rect = el.getBoundingClientRect();
    const ripple = document.createElement("span");
    const size = Math.max(rect.width, rect.height) * 1.5;
    const x = (e.clientX || (e.touches?.[0]?.clientX ?? rect.left + rect.width / 2)) - rect.left;
    const y = (e.clientY || (e.touches?.[0]?.clientY ?? rect.top + rect.height / 2)) - rect.top;
    ripple.style.cssText = `position:absolute;left:${x - size / 2}px;top:${y - size / 2}px;width:${size}px;height:${size}px;background:radial-gradient(circle, rgba(28, 62, 44, 0.25) 0%, transparent 70%);border-radius:50%;pointer-events:none;transform:scale(0);opacity:1;animation:dsRipple 0.6s ease-out forwards;`;
    if (getComputedStyle(el).position === "static") el.style.position = "relative";
    el.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
  } catch (err) {}
}