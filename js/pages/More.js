/**
 * DiplomaStudy - More Menu Hub Page View
 * Quick directory for all supplementary utilities and resources
 */

import { AppShell } from "../components/AppShell.js";
import { router } from "../core/router.js";

export function renderMore() {
  AppShell.updateHeader({
    title: "More Features & Utilities",
    subtitle: "Study tools, planner & career hub",
    showBack: false,
    showSearch: false
  });

  const main = AppShell.getMainView();
  if (!main) return;

  const moreItems = [
    {
      title: "Personal Study Notes",
      desc: "Create, pin, and favorite revision notes & summaries",
      icon: "📝",
      route: "#/notes",
      color: "var(--color-sage-dark)",
      bg: "var(--color-sage-light)"
    },
    {
      title: "Study Planner & Routine",
      desc: "Daily task schedule, exam priorities and duration timer",
      icon: "📅",
      route: "#/planner",
      color: "#7C3AED",
      bg: "#EDE9FE"
    },
    {
      title: "Focus Pomodoro Timer",
      desc: "25/5 interval timer with gentle synthesized chime",
      icon: "⏱️",
      route: "#/timer",
      color: "#D97706",
      bg: "#FEF3C7"
    },
    {
      title: "Study Progress & Analytics",
      desc: "Track daily streak, quiz accuracy & syllabus completion",
      icon: "📊",
      route: "#/progress",
      color: "var(--color-forest)",
      bg: "var(--color-forest-soft)"
    },
    {
      title: "Engineering Formula Bank",
      desc: "Formulas for Electrical, Civil, Mech, Math, and Physics",
      icon: "📐",
      route: "#/formula",
      color: "#4338CA",
      bg: "#E0E7FF"
    },
    {
      title: "Student Calculators & Tools",
      desc: "BTEB CGPA Calculator, 75% Attendance Check, Unit Converter",
      icon: "🧮",
      route: "#/tools",
      color: "#0F766E",
      bg: "#CCFBF1"
    },
    {
      title: "Diploma Jobs & Internships",
      desc: "Sub-Assistant Engineer circulars & 8th sem attachments",
      icon: "💼",
      route: "#/jobs",
      color: "#B45309",
      bg: "#FEF3C7"
    },
    {
      title: "BTEB Notice Center",
      desc: "Exam routines, re-scrutiny results & official circulars",
      icon: "📢",
      route: "#/notices",
      color: "var(--color-danger)",
      bg: "var(--color-danger-bg)"
    },
    {
      title: "AI Study Assistant",
      desc: "Ask engineering questions, formulas & exam prep tips",
      icon: "🤖",
      route: "#/ai",
      color: "#0891B2",
      bg: "#CFFAFE"
    },
    {
      title: "Settings & Backups",
      desc: "Dark mode, preferences, JSON export & import data",
      icon: "⚙️",
      route: "#/settings",
      color: "var(--color-text)",
      bg: "var(--color-surface-hover)"
    }
  ];

  main.innerHTML = `
    <div class="flex flex-col gap-sm mb-xl" id="more-menu-items">
      ${moreItems.map((item) => `
        <div class="card card-interactive p-md more-nav-card" data-route="${item.route}" style="cursor: pointer;">
          <div class="flex items-center gap-sm">
            <div style="width: 44px; height: 44px; border-radius: var(--radius-sm); background-color: ${item.bg}; color: ${item.color}; display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0;">
              ${item.icon}
            </div>
            <div class="flex-1">
              <h3 class="text-sm font-bold text-forest">${item.title}</h3>
              <p class="text-xs text-muted" style="line-height: 1.3;">${item.desc}</p>
            </div>
            <span class="text-xs text-dim">➔</span>
          </div>
        </div>
      `).join("")}
    </div>
  `;

  main.querySelectorAll(".more-nav-card").forEach((card) => {
    card.addEventListener("click", () => {
      const route = card.getAttribute("data-route");
      if (route) router.navigate(route);
    });
  });
}
