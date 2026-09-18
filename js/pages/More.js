/**
 * More Page - Real features only
 */

import { AppShell } from "../components/AppShell.js";
import { showComingSoon } from "../core/comingSoonHelper.js";
import { getSubjects, getNotices, getPdfsBySubject } from "../services/api.js";
import { storage, STORAGE_KEYS } from "../core/storage.js";

export async function renderMore() {
  AppShell.updateHeader({
    title: "More",
    subtitle: "সব feature এক জায়গায়",
    showBack: false,
    showSettings: true,
    showTheme: true
  });

  const main = AppShell.getMainView();
  if (!main) return;

  main.innerHTML = `
    <div style="text-align:center;padding:40px 20px;">
      <div class="spinner"></div>
    </div>
  `;

  // Load real counts
  let subjectsCount = 0;
  let noticesCount = 0;

  try {
    const subs = await getSubjects();
    subjectsCount = subs.length;
  } catch (e) {}

  try {
    const notices = await getNotices();
    noticesCount = notices.length;
  } catch (e) {}

  const settings = storage.get(STORAGE_KEYS.SETTINGS, {});

  // ═══ Only real routes (that actually exist) ═══
  const sections = [
    {
      title: "Study",
      items: [
        {
          icon: "📚",
          label: "All Subjects",
          bangla: `${subjectsCount}টি বিষয়`,
          route: "#/subjects",
          bg: "#DCFCE7",
          color: "#065F46"
        }
      ]
    },
    {
      title: "Content",
      items: [
        {
          icon: "📢",
          label: "Notices",
          bangla: noticesCount > 0 ? `${noticesCount}টি নোটিশ` : "নোটিশ দেখুন",
          route: "#/notices",
          bg: "#FFE4E6",
          color: "#9F1239"
        }
      ]
    },
    {
      title: "Tools",
      items: [
        {
          icon: "🔍",
          label: "Search",
          bangla: "Content খুঁজুন",
          route: "#/search",
          bg: "#E0E7FF",
          color: "#3730A3"
        },
        {
          icon: "⚙️",
          label: "Settings",
          bangla: "App preferences",
          route: "#/settings",
          bg: "#F2F5F2",
          color: "#57675D"
        }
      ]
    }
  ];

  main.innerHTML = `
    <!-- Hero -->
    <div style="
      padding:24px 20px;
      border-radius:24px;
      background:linear-gradient(135deg, #163524 0%, #1F4A32 50%, #2A5540 100%);
      box-shadow:0 16px 40px -12px rgba(28,62,44,0.4);
      margin-bottom:22px;
      position:relative;
      overflow:hidden;
    ">
      <div style="position:absolute;top:-40px;right:-40px;width:160px;height:160px;border-radius:50%;background:radial-gradient(circle,rgba(200,122,30,0.25),transparent 70%);"></div>

      <div style="position:relative;z-index:2;">
        <div style="font-size:11px;font-weight:800;color:rgba(255,255,255,0.7);letter-spacing:1.2px;text-transform:uppercase;margin-bottom:6px;">EXPLORE</div>
        <div style="font-size:26px;font-weight:900;color:#FFFFFF;letter-spacing:-0.5px;line-height:1.15;margin:0 0 8px;">
          সব কিছু<br>এক জায়গায়
        </div>
        <div style="font-size:12.5px;color:rgba(255,255,255,0.7);font-weight:600;">
          Study tools • Resources • Settings
        </div>
      </div>
    </div>

    <!-- Sections -->
    ${sections.map((section) => `
      <div style="margin-bottom:22px;">
        <h2 style="
          font-size:11px;font-weight:800;color:#84968B;
          text-transform:uppercase;letter-spacing:1px;
          margin:0 0 10px 4px;
        ">${section.title}</h2>

        <div style="
          background:#FFFFFF;
          border:1px solid #E1E8E1;
          border-radius:18px;
          overflow:hidden;
          box-shadow:0 2px 8px rgba(28,62,44,0.04);
        ">
          ${section.items.map((item, idx) => `
            <div 
              class="more-item"
              data-route="${item.route}"
              style="
                width:100%;
                display:flex;align-items:center;gap:14px;
                padding:14px 16px;
                background:transparent;
                cursor:pointer;
                font-family:inherit;
                text-align:left;
                transition:background 0.15s ease;
                -webkit-tap-highlight-color:transparent;
                ${idx < section.items.length - 1 ? "border-bottom:1px solid #F2F5F2;" : ""}
              "
            >
              <div style="
                width:42px;height:42px;
                border-radius:13px;
                background:${item.bg};
                color:${item.color};
                display:flex;align-items:center;justify-content:center;
                font-size:20px;
                flex-shrink:0;
              ">${item.icon}</div>

              <div style="flex:1;min-width:0;">
                <div style="font-size:13.5px;font-weight:800;color:#1C3E2C;letter-spacing:-0.2px;margin-bottom:2px;">${item.label}</div>
                <div style="font-size:11px;color:#84968B;font-weight:600;">${item.bangla}</div>
              </div>

              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#84968B" stroke-width="2.5" stroke-linecap="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          `).join("")}
        </div>
      </div>
    `).join("")}

    <!-- About -->
    <div style="
      text-align:center;
      padding:24px 20px;
      background:#FFFFFF;
      border:1px solid #E1E8E1;
      border-radius:18px;
      margin-bottom:20px;
    ">
      <div style="font-size:36px;margin-bottom:8px;">🎓</div>
      <div style="font-size:15px;font-weight:900;color:#1C3E2C;letter-spacing:-0.3px;margin-bottom:3px;">DiplomaStudy</div>
      <div style="font-size:11.5px;color:#84968B;font-weight:600;">Version 2.0.0</div>
    </div>

    <div style="height:20px;"></div>
  `;

  // ═══ Bind — use window.location.hash directly ═══
  main.querySelectorAll(".more-item").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const route = item.getAttribute("data-route");
      console.log("[More] Navigating to:", route);
      if (route) {
        window.location.hash = route;
      }
    });

    // Hover
    item.addEventListener("mouseenter", () => {
      item.style.background = "#F7FAF7";
    });
    item.addEventListener("mouseleave", () => {
      item.style.background = "transparent";
    });
  });
}