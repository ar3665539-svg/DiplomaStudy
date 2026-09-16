/**
 * DiplomaStudy - Bottom Navigation Bar Component
 * 5 primary tabs: Home, Study, Quiz, Saved, More
 */

export const BottomNav = {
  render() {
    const hash = window.location.hash || "#/home";

    const isActive = (path) => {
      if (path === "#/home") return hash === "#/home" || hash === "" || hash === "#/";
      return hash.startsWith(path);
    };

    const items = [
      {
        route: "#/home",
        label: "Home",
        locked: false,
        icon: `<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>`
      },
      {
        route: "#/subjects",
        label: "Study",
        locked: false,
        icon: `<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>`
      },
      {
        route: "#/quiz",
        label: "Quiz",
        locked: true,
        icon: `<circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon>`
      },
      {
        route: "#/bookmarks",
        label: "Saved",
        locked: true,
        icon: `<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>`
      },
      {
        route: "#/more",
        label: "More",
        locked: false,
        icon: `<circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle>`
      }
    ];

    return `
      <nav class="app-bottom-nav" aria-label="Main Navigation">
        ${items.map((item) => {
          const active = isActive(item.route);
          return `
            <a 
              href="${item.locked ? "javascript:void(0)" : item.route}" 
              class="nav-item ${active ? "active" : ""} ${item.locked ? "locked" : ""}"
              ${item.locked ? `data-coming-soon="${item.label}"` : ""}
              aria-label="${item.label}"
            >
              <div class="nav-item-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  ${item.icon}
                </svg>
                ${item.locked ? `<span class="nav-lock-badge">🔒</span>` : ""}
              </div>
              <span>${item.label}</span>
            </a>
          `;
        }).join("")}
      </nav>
    `;
  }
};