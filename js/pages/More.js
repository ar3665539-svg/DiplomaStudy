/**
 * More — Hub page v3
 * Zero awaits blocking render. 100% instant.
 */

console.log("[More] 📥 More.js v3 LOADED");

import { AppShell } from "../components/AppShell.js";
import { getSubjects, getNotices } from "../services/api.js";

// ═══════════════════════════════════════════
// TIMEOUT WRAPPER
// ═══════════════════════════════════════════
function withTimeout(promise, ms = 5000, fallback = null) {
  return Promise.race([
    promise,
    new Promise((resolve) => setTimeout(() => resolve(fallback), ms))
  ]).catch(() => fallback);
}

// ═══════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════
export function renderMore() {
  // ⚠️ NOT async — SYNCHRONOUS render only!
  const MY_HASH = "#/more";

  console.log("[More] 🎨 Rendering page (sync)...");

  try {
    AppShell.updateHeader({
      title: "More",
      subtitle: "সব feature এক জায়গায়",
      showBack: false,
      showSettings: true,
      showTheme: true,
      expectedHash: MY_HASH
    });
  } catch (e) {
    console.warn("[More] Header update failed:", e);
  }

  const main = AppShell.getMainView();
  if (!main) {
    console.error("[More] ❌ main view not found");
    return;
  }

  // ═══ RENDER UI INSTANTLY (no await!) ═══
  main.innerHTML = buildHTML();

  // ═══ BIND ═══
  bindEvents(main);

  console.log("[More] ✅ Page rendered");

  // ═══ Load counts in BACKGROUND (fire and forget) ═══
  loadCountsAsync(main, MY_HASH);
}

// ═══════════════════════════════════════════
// BUILD HTML (pure sync — no async inside)
// ═══════════════════════════════════════════
function buildHTML() {
  const sections = [
    {
      title: "Study",
      items: [
        { icon: "📚", label: "All Subjects", bangla: "সব বিষয়", route: "#/subjects", bg: "#DCFCE7", color: "#065F46", countKey: "subjects" }
      ]
    },
    {
      title: "Content",
      items: [
        { icon: "📢", label: "Notices", bangla: "নোটিশ দেখুন", route: "#/notices", bg: "#FFE4E6", color: "#9F1239", countKey: "notices" },
        { icon: "🧮", label: "Formulas", bangla: "সূত্রাবলী", route: "#/formulas", bg: "#CFFAFE", color: "#155E75" },
        { icon: "💡", label: "Suggestions", bangla: "সাজেশন", route: "#/suggestions", bg: "#FEF3C7", color: "#92400E" },
        { icon: "❓", label: "Questions", bangla: "প্রশ্ন", route: "#/questions", bg: "#EDE9FE", color: "#5B21B6" }
      ]
    },
    {
      title: "Personal",
      items: [
        { icon: "⭐", label: "Bookmarks", bangla: "সেভ করা", route: "#/bookmarks", bg: "#FFE4E6", color: "#9F1239" },
        { icon: "📊", label: "Progress", bangla: "অগ্রগতি", route: "#/progress", bg: "#DBEAFE", color: "#1E40AF" },
        { icon: "📝", label: "Notes", bangla: "নোট", route: "#/notes", bg: "#F3E8FF", color: "#6B21A8" },
        { icon: "📅", label: "Planner", bangla: "প্ল্যানার", route: "#/planner", bg: "#E0E7FF", color: "#3730A3" },
        { icon: "⏱️", label: "Timer", bangla: "পোমোডোরো", route: "#/timer", bg: "#FEF3C7", color: "#92400E" }
      ]
    },
    {
      title: "Tools",
      items: [
        { icon: "🔍", label: "Search", bangla: "Content খুঁজুন", route: "#/search", bg: "#E0E7FF", color: "#3730A3" },
        { icon: "🛠️", label: "Student Tools", bangla: "টুলস", route: "#/tools", bg: "#F2F5F2", color: "#57675D" }
      ]
    },
    {
      title: "System",
      items: [
        { icon: "⚙️", label: "Settings", bangla: "সেটিংস", route: "#/settings", bg: "#F2F5F2", color: "#57675D" }
      ]
    }
  ];

  return `
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
      <div style="position:absolute;bottom:-30px;left:-30px;width:120px;height:120px;border-radius:50%;background:radial-gradient(circle,rgba(122,155,122,0.2),transparent 70%);"></div>

      <div style="position:relative;z-index:2;">
        <div style="font-size:11px;font-weight:800;color:rgba(255,255,255,0.7);letter-spacing:1.2px;text-transform:uppercase;margin-bottom:6px;">
          EXPLORE
        </div>
        <div style="font-size:26px;font-weight:900;color:#FFFFFF;letter-spacing:-0.5px;line-height:1.15;margin:0 0 8px;">
          সব কিছু<br>এক জায়গায়
        </div>
        <div style="font-size:12.5px;color:rgba(255,255,255,0.7);font-weight:600;">
          Study • Tools • Personal • System
        </div>
      </div>
    </div>

    <!-- Sections -->
    ${sections.map((section) => `
      <div style="margin-bottom:22px;">
        <h2 style="
          font-size:11px;
          font-weight:800;
          color:#84968B;
          text-transform:uppercase;
          letter-spacing:1px;
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
                display:flex;
                align-items:center;
                gap:14px;
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
                <div style="
                  font-size:13.5px;
                  font-weight:800;
                  color:#1C3E2C;
                  letter-spacing:-0.2px;
                  margin-bottom:2px;
                ">${item.label}</div>
                <div 
                  ${item.countKey ? `data-count-${item.countKey}` : ""}
                  style="font-size:11px;color:#84968B;font-weight:600;"
                >${item.bangla}</div>
              </div>

              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#84968B" stroke-width="2.5" stroke-linecap="round" style="flex-shrink:0;">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          `).join("")}
        </div>
      </div>
    `).join("")}

    <!-- Footer -->
    <div style="text-align:center;padding:20px 0 30px;">
      <div style="font-size:28px;margin-bottom:8px;">🎓</div>
      <div style="font-size:13px;font-weight:800;color:#1C3E2C;margin-bottom:3px;">DiplomaStudy</div>
      <div style="font-size:11px;color:#84968B;">Version 2.0</div>
    </div>

    <div style="height:20px;"></div>
  `;
}

// ═══════════════════════════════════════════
// BIND
// ═══════════════════════════════════════════
function bindEvents(main) {
  main.querySelectorAll(".more-item").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const route = item.getAttribute("data-route");
      if (route) {
        console.log("[More] Navigating to:", route);
        window.location.hash = route;
      }
    });

    item.addEventListener("mouseenter", () => { item.style.background = "#F7FAF7"; });
    item.addEventListener("mouseleave", () => { item.style.background = "transparent"; });
    item.addEventListener("touchstart", () => { item.style.background = "#F7FAF7"; }, { passive: true });
    item.addEventListener("touchend", () => {
      setTimeout(() => { item.style.background = "transparent"; }, 150);
    });
  });
}

// ═══════════════════════════════════════════
// LOAD COUNTS (fire and forget — background)
// ═══════════════════════════════════════════
async function loadCountsAsync(main, MY_HASH) {
  let subjectsCount = 0;
  let noticesCount = 0;

  try {
    console.log("[More] 🔄 Loading counts in background...");

    const results = await Promise.all([
      withTimeout(getSubjects(), 6000, []),
      withTimeout(getNotices(), 6000, [])
    ]);

    const subs = results[0] || [];
    const notices = results[1] || [];

    subjectsCount = Array.isArray(subs) ? subs.length : 0;
    noticesCount = Array.isArray(notices) ? notices.length : 0;

    console.log("[More] ✅ Counts loaded:", { subjectsCount, noticesCount });
  } catch (e) {
    console.warn("[More] Counts load failed:", e);
  }

  // Guard: route changed?
  if ((window.location.hash || "").split("?")[0] !== MY_HASH) {
    console.log("[More] Route changed, skipping count update");
    return;
  }

  // Update count texts (no full re-render)
  const subEl = main.querySelector("[data-count-subjects]");
  const notEl = main.querySelector("[data-count-notices]");

  if (subEl) {
    subEl.textContent = subjectsCount > 0 ? `${subjectsCount}টি বিষয়` : "সব বিষয়";
  }
  if (notEl) {
    notEl.textContent = noticesCount > 0 ? `${noticesCount}টি নোটিশ` : "নোটিশ দেখুন";
  }
}