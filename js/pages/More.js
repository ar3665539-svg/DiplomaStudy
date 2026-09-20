import { AppShell } from "../components/AppShell.js";
import { storage, STORAGE_KEYS } from "../core/storage.js";

var ICONS = {
  gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.65 1.65 0 0 0-1.8-.3 1.65 1.65 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.65 1.65 0 0 0-1-1.5 1.65 1.65 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.65 1.65 0 0 0 .3-1.8 1.65 1.65 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.65 1.65 0 0 0 1.5-1 1.65 1.65 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.65 1.65 0 0 0 1.8.3H9a1.65 1.65 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.65 1.65 0 0 0 1 1.5 1.65 1.65 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.65 1.65 0 0 0-.3 1.8V9a1.65 1.65 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.65 1.65 0 0 0-1.5 1z"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',
  books: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/><path d="M8 6h8"/></svg>',
  flame: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c4.4 0 8-3.1 8-7.4 0-3.1-1.8-5.9-4.7-8.6.1 2.2-.7 3.7-2 4.7.2-3.5-1.3-6.7-4.8-8.7.2 3.7-2.5 6.2-2.5 10.1C4 17.9 7.6 22 12 22Z"/></svg>',
  target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></svg>',
  file: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h6"/></svg>',
  sigma: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 4H6l6 8-6 8h12"/></svg>',
  help: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9.4 9a2.7 2.7 0 1 1 5.2 1c0 1.8-2.6 2.2-2.6 4"/><path d="M12 17h.01"/></svg>',
  bulb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0 0 12 2Z"/></svg>',
  bookmark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z"/></svg>',
  edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
  chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 9h18M8 13h.01M12 13h.01M16 13h.01M8 17h.01"/></svg>',
  wrench: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 0 0 5 5L20 20a2 2 0 0 1-2 2l-8.7-8.7a4 4 0 0 1-5-5"/><path d="m4 4 7.3 7.3"/></svg>',
  spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3ZM19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0"/></svg>',
  share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>',
  noResults: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4M8.5 8.5l5 5M13.5 8.5l-5 5"/></svg>'
};

var ROWS = [
  { section: "LEARNING", items: [
    ["#/pdfs", "PDF Library", "All study PDFs", "file", "#DC2626", "#FEE2E2"],
    ["#/formulas", "Formulas", "Engineering equations", "sigma", "#2563EB", "#DBEAFE"],
    ["#/questions", "Questions", "All types of questions", "help", "#7C3AED", "#EDE9FE"],
    ["#/suggestions", "Suggestions", "Exam suggestions", "bulb", "#D97706", "#FEF3C7"]
  ]},
  { section: "MY STUFF", items: [
    ["#/bookmarks", "Bookmarks", "Saved items", "bookmark", "#0891B2", "#CFFAFE"],
    ["#/notes", "Notes", "Your study notes", "edit", "#D97706", "#FEF3C7"],
    ["#/progress", "Progress", "Track your learning", "chart", "#16A34A", "#DCFCE7"],
    ["#/planner", "Planner", "Plan your study", "calendar", "#DB2777", "#FCE7F3", "Soon"]
  ]},
  { section: "TOOLS", items: [
    ["#/quiz", "Quiz Mode", "Test your knowledge", "target", "#EA580C", "#FFEDD5", "New"],
    ["#/tools", "Study Tools", "Helpful utilities", "wrench", "#0D9488", "#CCFBF1"],
    ["#/ai", "AI Tutor", "Ask any question", "spark", "#2563EB", "#DBEAFE", "Soon"],
    ["#/notices", "Notices", "Latest updates", "bell", "#DC2626", "#FEE2E2"]
  ]}
];

function safeSettings() {
  return storage.get(STORAGE_KEYS.SETTINGS, {}) || {};
}

function safeStreak() {
  var value = storage.get(STORAGE_KEYS.STREAK, 0);
  if (typeof value === "number") return value;
  if (value && typeof value.current === "number") return value.current;
  if (value && typeof value.days === "number") return value.days;
  return 0;
}

function progressPercent() {
  var total = 0;
  var done = 0;
  try {
    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i) || "";
      if (key.indexOf("diplomastudy_chapter_progress_") !== 0) continue;
      var data = JSON.parse(localStorage.getItem(key) || "{}");
      Object.keys(data).forEach(function (id) {
        total++;
        if (data[id] && data[id].status === "done") done++;
      });
    }
  } catch (e) {}
  return total ? Math.round(done / total * 100) : 15;
}

function escapeHtml(value) {
  return String(value == null ? "" : value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function injectStyles() {
  if (document.getElementById("ds-more-styles")) return;
  var style = document.createElement("style");
  style.id = "ds-more-styles";
  style.textContent = `
    .ds-more-page{padding:2px 0 0;color:var(--color-text)}
    .ds-more-hero{padding:20px;margin:0 0 16px;border-radius:20px;background:linear-gradient(135deg,#163524,#1F4A32);color:#fff;box-shadow:0 12px 28px -8px rgba(28,62,44,.3)}
    .ds-more-hero-top{display:flex;align-items:center;gap:12px}.ds-more-avatar{display:flex;align-items:center;justify-content:center;width:56px;height:56px;flex-shrink:0;border-radius:50%;background:rgba(255,255,255,.15);color:#fff;font-size:21px;font-weight:900}.ds-more-identity{flex:1;min-width:0}.ds-more-identity strong{display:block;overflow:hidden;color:#fff;font-size:16px;font-weight:900;text-overflow:ellipsis;white-space:nowrap}.ds-more-identity small{display:block;overflow:hidden;margin-top:4px;color:rgba(255,255,255,.7);font-size:11px;text-overflow:ellipsis;white-space:nowrap}.ds-more-gear{display:flex;align-items:center;justify-content:center;width:38px;height:38px;flex-shrink:0;border:1px solid rgba(255,255,255,.18);border-radius:12px;background:rgba(255,255,255,.1);color:#fff}.ds-more-gear svg{width:19px;height:19px}.ds-more-hero-stats{display:flex;align-items:center;gap:9px;margin-top:18px;color:rgba(255,255,255,.74);font-size:10px;font-weight:700}.ds-more-hero-stats b{color:rgba(255,255,255,.34);font-size:12px}
    .ds-more-search{position:sticky;top:4px;z-index:3;display:flex;align-items:center;gap:9px;margin-bottom:14px;padding:5px 7px 5px 13px;border:1px solid var(--color-border);border-radius:14px;background:var(--color-surface);box-shadow:0 4px 14px rgba(28,62,44,.07)}.ds-more-search svg{width:18px;height:18px;flex-shrink:0;color:var(--color-text-dim)}.ds-more-search input{min-width:0;flex:1;padding:8px 0;border:0;outline:0;background:transparent;color:var(--color-text);font:inherit;font-size:12.5px}.ds-more-clear{display:none;align-items:center;justify-content:center;width:28px;height:28px;border:0;border-radius:8px;background:var(--color-surface-hover);color:var(--color-text-muted)}.ds-more-clear svg{width:15px;height:15px}.ds-more-clear.visible{display:flex}
    .ds-more-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:24px}.ds-more-stat{display:flex;align-items:center;padding:12px 6px;flex-direction:column;border:1px solid var(--color-border);border-radius:14px;background:var(--color-surface);box-shadow:0 2px 8px rgba(28,62,44,.04)}.ds-more-stat-icon{display:flex;align-items:center;justify-content:center;width:30px;height:30px;margin-bottom:6px;border-radius:9px;color:var(--stat-fg);background:var(--stat-bg)}.ds-more-stat-icon svg{width:17px;height:17px}.ds-more-stat strong{color:var(--color-text);font-size:17px;line-height:1.1}.ds-more-stat small{margin-top:3px;color:var(--color-text-dim);font-size:9px;font-weight:800;white-space:nowrap}
    .ds-more-section{margin-bottom:24px}.ds-more-section-title{margin:0 4px 8px;color:var(--color-text-dim);font-size:11px;font-weight:900;letter-spacing:1px}.ds-more-card{overflow:hidden;border:1px solid var(--color-border);border-radius:17px;background:var(--color-surface);box-shadow:0 2px 8px rgba(28,62,44,.04)}.ds-more-row{display:flex;align-items:center;gap:13px;width:100%;min-height:68px;padding:14px 16px;border:0;border-bottom:1px solid var(--color-border-subtle);background:transparent;color:var(--color-text);font:inherit;text-align:left;text-decoration:none;transition:background .18s ease,transform .18s ease}.ds-more-row:last-child{border-bottom:0}.ds-more-row:hover{background:#F8FBF8}.ds-more-row:active{background:var(--color-surface-hover);transform:scale(.995)}.ds-more-icon{display:flex;align-items:center;justify-content:center;width:40px;height:40px;flex-shrink:0;border-radius:12px;color:var(--icon-fg);background:var(--icon-bg)}.ds-more-icon svg{width:20px;height:20px}.ds-more-copy{display:flex;flex:1;min-width:0;flex-direction:column;gap:3px}.ds-more-copy strong{overflow:hidden;color:var(--color-text);font-size:13.5px;font-weight:800;text-overflow:ellipsis;white-space:nowrap}.ds-more-copy small{overflow:hidden;color:var(--color-text-dim);font-size:10.5px;text-overflow:ellipsis;white-space:nowrap}.ds-more-end{display:flex;align-items:center;gap:8px;flex-shrink:0;color:#CBD5E1}.ds-more-end svg{width:16px;height:16px}.ds-more-badge{padding:3px 8px;border-radius:5px;color:#166534;background:#DCFCE7;font-size:9px;font-weight:800;letter-spacing:.3px;text-transform:uppercase}.ds-more-badge.soon{color:#92400E;background:#FEF3C7}
    .ds-more-help button{font:inherit}.ds-more-empty{display:none;padding:34px 20px;color:var(--color-text-dim);text-align:center}.ds-more-empty svg{width:28px;height:28px;margin:0 auto 8px}.ds-more-empty span{display:block;font-size:12px;font-weight:700}.ds-more-footer{display:flex;align-items:center;padding:32px 20px 8px;flex-direction:column;gap:5px;text-align:center}.ds-more-logo{display:flex;align-items:center;justify-content:center;width:40px;height:40px;margin-bottom:3px;border-radius:12px;background:var(--grad-forest);color:#fff;font-size:13px;font-weight:900}.ds-more-footer strong{color:var(--color-text);font-size:14px;font-weight:900}.ds-more-footer span{color:var(--color-text-dim);font-size:11px}.ds-more-footer i{font-style:italic}
    .ds-more-modal-wrap{position:fixed;inset:0;z-index:999;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(5,12,9,.68);backdrop-filter:blur(5px)}.ds-more-modal{position:relative;width:100%;max-width:320px;padding:25px 20px 20px;border:1px solid var(--color-border);border-radius:20px;background:var(--color-surface);color:var(--color-text);box-shadow:0 20px 50px rgba(0,0,0,.3);text-align:center}.ds-more-modal-close{position:absolute;top:10px;right:10px;display:flex;align-items:center;justify-content:center;width:30px;height:30px;border:0;border-radius:8px;background:var(--color-surface-hover);color:var(--color-text-muted)}.ds-more-modal-close svg{width:15px;height:15px}.ds-more-modal-logo{display:flex;align-items:center;justify-content:center;width:52px;height:52px;margin:0 auto 12px;border-radius:16px;background:var(--grad-forest);color:#fff;font-size:17px;font-weight:900}.ds-more-modal h2{margin:0;color:var(--color-text);font-size:18px}.ds-more-modal p{margin:7px auto 16px;max-width:260px;color:var(--color-text-muted);font-size:12px;line-height:1.55}.ds-more-modal small{display:block;margin-bottom:17px;color:var(--color-text-dim);font-size:10px}.ds-more-modal-done{width:100%;padding:12px;border:0;border-radius:11px;background:var(--grad-forest);color:#fff;font:inherit;font-size:12px;font-weight:800}
    [data-theme="dark"] .ds-more-search,[data-theme="dark"] .ds-more-card,[data-theme="dark"] .ds-more-stat{box-shadow:var(--shadow-md)}[data-theme="dark"] .ds-more-row:hover{background:var(--color-surface-hover)}
    @media (min-width:481px){.ds-more-row{cursor:pointer}.ds-more-page{padding-left:2px;padding-right:2px}}@media (max-width:360px){.ds-more-hero{padding:17px}.ds-more-row{padding-left:12px;padding-right:12px;gap:10px}.ds-more-copy strong{font-size:12.5px}}
  `;
  document.head.appendChild(style);
}

function showToast(message) {
  var toast = document.createElement("div");
  toast.textContent = message;
  toast.style.cssText = "position:fixed;left:50%;bottom:90px;z-index:1000;transform:translateX(-50%);padding:11px 15px;border-radius:11px;background:#1C3E2C;color:#fff;font:600 12px inherit;box-shadow:0 10px 25px rgba(0,0,0,.22);";
  document.body.appendChild(toast);
  setTimeout(function () { toast.remove(); }, 2400);
}

function openAbout() {
  var wrap = document.createElement("div");
  wrap.className = "ds-more-modal-wrap";
  wrap.innerHTML = '<div class="ds-more-modal" role="dialog" aria-modal="true"><button class="ds-more-modal-close" type="button" aria-label="Close">' + ICONS.close + '</button><div class="ds-more-modal-logo">DS</div><h2>DiplomaStudy</h2><p>A focused study companion for Diploma Engineering students in Bangladesh.</p><small>Version 2.5.0<br>Made in Bangladesh \uD83C\DDE7\uD83C\DDE9</small><button class="ds-more-modal-done" type="button">Close</button></div>';
  document.body.appendChild(wrap);
  var close = function () { wrap.remove(); };
  wrap.querySelector(".ds-more-modal-close").addEventListener("click", close);
  wrap.querySelector(".ds-more-modal-done").addEventListener("click", close);
  wrap.addEventListener("click", function (event) { if (event.target === wrap) close(); });
}

function shareApp() {
  var data = { title: "DiplomaStudy", text: "A smart study companion for Diploma Engineering students.", url: window.location.origin + window.location.pathname };
  if (navigator.share) { navigator.share(data).catch(function () {}); return; }
  try { navigator.clipboard.writeText(data.url); showToast("App link copied"); }
  catch (e) { showToast("Share is not available"); }
}

function makeIcon(key, fg, bg) {
  return '<span class="ds-more-icon" style="--icon-fg:' + fg + ';--icon-bg:' + bg + ';">' + ICONS[key] + '</span>';
}

function makeRow(item, index, sectionIndex) {
  var badge = item[6] ? '<span class="ds-more-badge' + (item[6] === "Soon" ? " soon" : "") + '">' + item[6] + '</span>' : "";
  return '<a class="ds-more-row" data-more-row="' + sectionIndex + '-' + index + '" data-search="' + escapeHtml((item[1] + " " + item[2]).toLowerCase()) + '" href="' + item[0] + '">' + makeIcon(item[3], item[4], item[5]) + '<span class="ds-more-copy"><strong>' + item[1] + '</strong><small>' + item[2] + '</small></span><span class="ds-more-end">' + badge + ICONS.chevron + '</span></a>';
}

export function renderMore(container, params) {
  injectStyles();
  AppShell.updateHeader({ title: "More", subtitle: "All features", showBack: false, showSearch: false, showTheme: true, showSettings: false });
  if (!container || typeof container.innerHTML === "undefined") return "";

  var settings = safeSettings();
  var userName = settings.userName || "Student";
  var department = settings.departmentName || settings.department || "Civil Engineering";
  var semester = settings.semesterNumber || settings.semester || "1st Semester";
  var streak = safeStreak();
  var done = progressPercent();
  var initial = String(userName).trim().charAt(0).toUpperCase() || "S";

  var sectionsHtml = ROWS.map(function (group, sectionIndex) {
    return '<section class="ds-more-section" data-more-section="' + sectionIndex + '"><h2 class="ds-more-section-title">' + group.section + '</h2><div class="ds-more-card">' + group.items.map(function (item, index) { return makeRow(item, index, sectionIndex); }).join("") + '</div></section>';
  }).join("");

  container.innerHTML = '<div class="ds-more-page">' +
    '<section class="ds-more-hero"><div class="ds-more-hero-top"><div class="ds-more-avatar">' + escapeHtml(initial) + '</div><div class="ds-more-identity"><strong>' + escapeHtml(userName) + '</strong><small>' + escapeHtml(department) + ' \\u2022 ' + escapeHtml(String(semester)) + '</small></div><a class="ds-more-gear" href="#/settings" aria-label="Settings">' + ICONS.gear + '</a></div><div class="ds-more-hero-stats"><span>8 Subjects</span><b>\\u2022</b><span>' + streak + ' Day Streak</span><b>\\u2022</b><span>' + done + '% Done</span></div></section>' +
    '<div class="ds-more-search"><span>' + ICONS.search + '</span><input id="ds-more-search-input" type="search" autocomplete="off" placeholder="Search features... / \u09AB\u09BF\u099A\u09BE\u09B0 \u0996\u09C1\u0981\u099C\u09C1\u09A8..."><button class="ds-more-clear" id="ds-more-clear" type="button" aria-label="Clear">' + ICONS.close + '</button></div>' +
    '<div class="ds-more-stats"><div class="ds-more-stat"><span class="ds-more-stat-icon" style="--stat-fg:#16A34A;--stat-bg:#DCFCE7">' + ICONS.books + '</span><strong>8</strong><small>Subjects</small></div><div class="ds-more-stat"><span class="ds-more-stat-icon" style="--stat-fg:#EA580C;--stat-bg:#FFEDD5">' + ICONS.flame + '</span><strong>' + streak + '</strong><small>Day Streak</small></div><div class="ds-more-stat"><span class="ds-more-stat-icon" style="--stat-fg:#2563EB;--stat-bg:#DBEAFE">' + ICONS.target + '</span><strong>' + done + '%</strong><small>Target</small></div></div>' +
    sectionsHtml +
    '<section class="ds-more-section ds-more-help"><h2 class="ds-more-section-title">HELP &amp; ABOUT</h2><div class="ds-more-card"><button class="ds-more-row" id="ds-more-share" type="button">' + makeIcon("share", "#16A34A", "#DCFCE7") + '<span class="ds-more-copy"><strong>Share App</strong><small>Tell your friends</small></span><span class="ds-more-end">' + ICONS.chevron + '</span></button><a class="ds-more-row" href="mailto:ar3665539@gmail.com">' + makeIcon("mail", "#2563EB", "#DBEAFE") + '<span class="ds-more-copy"><strong>Contact Us</strong><small>Send feedback</small></span><span class="ds-more-end">' + ICONS.chevron + '</span></a><button class="ds-more-row" id="ds-more-about" type="button">' + makeIcon("info", "#475569", "#E2E8F0") + '<span class="ds-more-copy"><strong>About</strong><small>App info &amp; version</small></span><span class="ds-more-end">' + ICONS.chevron + '</span></button></div></section>' +
    '<footer class="ds-more-footer"><div class="ds-more-logo">DS</div><strong>DiplomaStudy</strong><span>Version 2.5.0</span><span><i>Made with \u2764\uFE0F in Bangladesh</i></span></footer></div>';

  var input = container.querySelector("#ds-more-search-input");
  var clear = container.querySelector("#ds-more-clear");
  var empty = document.createElement("div");
  empty.className = "ds-more-empty";
  empty.innerHTML = ICONS.noResults + '<span>No results</span>';
  container.querySelector(".ds-more-page").appendChild(empty);

  function filterRows() {
    var query = input.value.trim().toLowerCase();
    var visibleCount = 0;
    container.querySelectorAll("[data-more-section]").forEach(function (section) {
      var rows = section.querySelectorAll("[data-search]");
      var shown = 0;
      rows.forEach(function (row) {
        var visible = !query || row.getAttribute("data-search").indexOf(query) !== -1;
        row.style.display = visible ? "flex" : "none";
        if (visible) { shown++; visibleCount++; }
      });
      section.style.display = shown ? "block" : "none";
    });
    clear.classList.toggle("visible", !!query);
    empty.style.display = visibleCount ? "none" : "block";
  }

  input.addEventListener("input", filterRows);
  clear.addEventListener("click", function () { input.value = ""; input.focus(); filterRows(); });
  container.querySelector("#ds-more-share").addEventListener("click", shareApp);
  container.querySelector("#ds-more-about").addEventListener("click", openAbout);
  return container.innerHTML;
}

export default renderMore;
