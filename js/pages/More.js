import { storage, STORAGE_KEYS } from "../core/storage.js";
import { Toast } from "../components/Toast.js";

const ICONS = {
  settings: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.65 1.65 0 0 0-1.8-.3 1.65 1.65 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.65 1.65 0 0 0-1-1.5 1.65 1.65 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.65 1.65 0 0 0 .3-1.8 1.65 1.65 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.65 1.65 0 0 0 1.5-1 1.65 1.65 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.65 1.65 0 0 0 1.8.3H9a1.65 1.65 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.65 1.65 0 0 0 1 1.5 1.65 1.65 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.65 1.65 0 0 0-.3 1.8V9a1.65 1.65 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.65 1.65 0 0 0-1.5 1z"/></svg>',
  pdf: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
  formula: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 4H6l6 8-6 8h12"/></svg>',
  question: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 1 1 5.8 1c0 2-2.9 2.7-2.9 4"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  bulb: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0 0 12 2z"/></svg>',
  bookmark: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 0-2-2h10a2 2 0 0 1 2 2z"/></svg>',
  notes: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>',
  progress: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>',
  tools: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 0 0 5 5L20 20a2 2 0 0 1-2 2l-8.7-8.7a4 4 0 0 0-5-5z"/></svg>',
  bell: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>',
  share: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.6" y1="13.5" x2="15.4" y2="17.5"/><line x1="15.4" y1="6.5" x2="8.6" y2="10.5"/></svg>',
  mail: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><polyline points="3 7 12 13 21 7"/></svg>',
  info: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
  chevron: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>'
};

const ROWS = {
  learning: [
    ["#/pdfs", "PDF Library", "All study PDFs", "pdf", "#DC2626", "#FEE2E2"],
    ["#/formulas", "Formulas", "Engineering equations", "formula", "#2563EB", "#DBEAFE"],
    ["#/questions", "Questions", "All types of questions", "question", "#7C3AED", "#EDE9FE"],
    ["#/suggestions", "Suggestions", "Exam suggestions", "bulb", "#D97706", "#FEF3C7"]
  ],
  stuff: [
    ["#/bookmarks", "Bookmarks", "Saved items", "bookmark", "#0891B2", "#CFFAFE"],
    ["#/notes", "Notes", "Your study notes", "notes", "#D97706", "#FEF3C7"],
    ["#/progress", "Progress", "Track your learning", "progress", "#16A34A", "#DCFCE7"]
  ],
  tools: [
    ["#/tools", "Study Tools", "Calculators and utilities", "tools", "#0D9488", "#CCFBF1"],
    ["#/notices", "Notices", "Latest updates", "bell", "#DC2626", "#FEE2E2"],
    ["#/settings", "Settings", "Preferences and account", "settings", "#475569", "#E2E8F0"]
  ]
};

function getSettings() {
  return storage.get(STORAGE_KEYS.SETTINGS, {}) || {};
}

function getStreak() {
  var value = storage.get(STORAGE_KEYS.STREAK, 0);
  if (typeof value === "number") return value;
  if (value && typeof value.days === "number") return value.days;
  if (value && typeof value.current === "number") return value.current;
  return 0;
}

function getProgressPercent() {
  var completed = 0;
  var total = 0;
  try {
    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i) || "";
      if (key.indexOf("diplomastudy_chapter_progress_") !== 0) continue;
      var data = JSON.parse(localStorage.getItem(key) || "{}");
      Object.keys(data).forEach(function (chapterId) {
        total++;
        if (data[chapterId] && data[chapterId].status === "done") completed++;
      });
    }
  } catch (e) {}
  return total ? Math.round((completed / total) * 100) : 0;
}

function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function iconBox(icon, fg, bg) {
  return '<span class="more-v25-icon" style="--more-v25-fg:' + fg + ';--more-v25-bg:' + bg + ';">' + ICONS[icon] + '</span>';
}

function featureRow(item, index) {
  return '<a class="more-v25-row' + (index === 0 ? " first" : "") + '" href="' + item[0] + '">' +
    iconBox(item[3], item[4], item[5]) +
    '<span class="more-v25-row-copy"><strong>' + item[1] + '</strong><small>' + item[2] + '</small></span>' +
    '<span class="more-v25-chevron">' + ICONS.chevron + '</span>' +
  '</a>';
}

function featureSection(title, rows) {
  return '<section class="more-v25-section">' +
    '<h2 class="more-v25-section-title">' + title + '</h2>' +
    '<div class="more-v25-card">' + rows.map(featureRow).join("") + '</div>' +
  '</section>';
}

function statCard(icon, value, label) {
  return '<div class="more-v25-stat"><span class="more-v25-stat-icon">' + icon + '</span><strong>' + value + '</strong><small>' + label + '</small></div>';
}

function openAboutModal() {
  var existing = document.getElementById("more-v25-about");
  if (existing) existing.remove();
  var modal = document.createElement("div");
  modal.id = "more-v25-about";
  modal.className = "more-v25-modal-backdrop";
  modal.innerHTML = '<div class="more-v25-modal" role="dialog" aria-modal="true" aria-labelledby="more-v25-about-title">' +
    '<button class="more-v25-modal-close" type="button" aria-label="Close">&times;</button>' +
    '<div class="more-v25-modal-icon">DS</div>' +
    '<h2 id="more-v25-about-title">DiplomaStudy</h2>' +
    '<p class="more-v25-modal-version">Version 2.5.0</p>' +
    '<p class="more-v25-modal-copy">A focused study companion for Diploma Engineering students in Bangladesh.</p>' +
    '<button class="more-v25-modal-done" type="button">Done</button>' +
  '</div>';
  document.body.appendChild(modal);
  var close = function () { modal.remove(); };
  modal.querySelector(".more-v25-modal-close").addEventListener("click", close);
  modal.querySelector(".more-v25-modal-done").addEventListener("click", close);
  modal.addEventListener("click", function (event) { if (event.target === modal) close(); });
}

function shareApp() {
  var shareData = {
    title: "DiplomaStudy",
    text: "A smart study companion for Diploma Engineering students.",
    url: window.location.origin + window.location.pathname
  };
  if (navigator.share) {
    navigator.share(shareData).catch(function () {});
    return;
  }
  try {
    navigator.clipboard.writeText(shareData.url);
    Toast.show("App link copied", "success");
  } catch (e) {
    Toast.show("Share is not available on this device", "info");
  }
}

function ensureStyles() {
  if (document.getElementById("more-v25-styles")) return;
  var style = document.createElement("style");
  style.id = "more-v25-styles";
  style.textContent = `
    .more-v25-page { padding: 2px 0 28px; color: var(--color-text); }
    .more-v25-profile { display:flex; align-items:center; gap:12px; padding:13px 14px; margin-bottom:12px; border:1px solid var(--color-border); border-radius:16px; background:linear-gradient(135deg, rgba(220,252,231,.9), rgba(232,239,232,.72)); box-shadow:var(--shadow-sm); }
    .more-v25-avatar { width:42px; height:42px; display:flex; align-items:center; justify-content:center; flex-shrink:0; border-radius:50%; background:var(--color-forest); color:#fff; font-size:16px; font-weight:900; }
    .more-v25-profile-copy { display:flex; flex:1; min-width:0; flex-direction:column; gap:3px; }
    .more-v25-profile-copy strong { overflow:hidden; color:var(--color-forest); font-size:14px; text-overflow:ellipsis; white-space:nowrap; }
    .more-v25-profile-copy small { overflow:hidden; color:var(--color-text-muted); font-size:10.5px; text-overflow:ellipsis; white-space:nowrap; }
    .more-v25-settings { display:flex; align-items:center; justify-content:center; width:34px; height:34px; flex-shrink:0; border:1px solid rgba(28,62,44,.14); border-radius:10px; background:rgba(255,255,255,.55); color:var(--color-forest); }
    .more-v25-stats { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-bottom:22px; }
    .more-v25-stat { display:flex; align-items:center; min-width:0; flex-direction:column; padding:11px 5px 10px; border:1px solid var(--color-border); border-radius:14px; background:var(--color-surface); box-shadow:var(--shadow-xs); }
    .more-v25-stat-icon { height:20px; margin-bottom:4px; font-size:16px; line-height:1; }
    .more-v25-stat strong { color:var(--color-text); font-size:17px; line-height:1.1; }
    .more-v25-stat small { margin-top:3px; color:var(--color-text-dim); font-size:9px; font-weight:700; letter-spacing:.2px; }
    .more-v25-section { margin-bottom:20px; }
    .more-v25-section-title { margin:0 4px 7px; color:var(--color-text-dim); font-size:10px; font-weight:900; letter-spacing:1.35px; }
    .more-v25-card { overflow:hidden; border:1px solid var(--color-border); border-radius:16px; background:var(--color-surface); box-shadow:var(--shadow-sm); }
    .more-v25-row, .more-v25-action { display:flex; align-items:center; gap:12px; width:100%; min-height:64px; padding:10px 14px; border:0; border-bottom:1px solid var(--color-border-subtle); background:transparent; color:var(--color-text); font:inherit; text-align:left; text-decoration:none; cursor:pointer; }
    .more-v25-row:last-child, .more-v25-action.last { border-bottom:0; }
    .more-v25-row:hover, .more-v25-row:active, .more-v25-row:focus, .more-v25-action:hover, .more-v25-action:active, .more-v25-action:focus { background:var(--color-surface-hover); outline:none; }
    .more-v25-icon { display:flex; align-items:center; justify-content:center; width:40px; height:40px; flex-shrink:0; border-radius:12px; background:var(--more-v25-bg); color:var(--more-v25-fg); }
    .more-v25-row-copy { display:flex; flex:1; min-width:0; flex-direction:column; gap:3px; }
    .more-v25-row-copy strong { overflow:hidden; color:var(--color-text); font-size:13px; font-weight:800; text-overflow:ellipsis; white-space:nowrap; }
    .more-v25-row-copy small { overflow:hidden; color:var(--color-text-dim); font-size:10.5px; text-overflow:ellipsis; white-space:nowrap; }
    .more-v25-chevron, .more-v25-action-end { display:flex; align-items:center; color:var(--color-text-dim); }
    .more-v25-action > span:nth-child(2) { flex:1; color:var(--color-text); font-size:13px; font-weight:800; }
    .more-v25-footer { display:flex; align-items:center; flex-direction:column; gap:4px; padding:4px 0 8px; color:var(--color-text-dim); font-size:10px; text-align:center; }
    .more-v25-footer strong { color:var(--color-text-muted); font-size:11px; }
    .more-v25-modal-backdrop { position:fixed; inset:0; z-index:999; display:flex; align-items:center; justify-content:center; padding:20px; background:rgba(5,12,9,.68); backdrop-filter:blur(5px); }
    .more-v25-modal { position:relative; width:100%; max-width:340px; padding:26px 22px 22px; border:1px solid var(--color-border); border-radius:20px; background:var(--color-surface-elevated); color:var(--color-text); box-shadow:var(--shadow-xl); text-align:center; }
    .more-v25-modal-close { position:absolute; top:10px; right:10px; width:30px; height:30px; border:0; border-radius:9px; background:var(--color-surface-hover); color:var(--color-text-muted); font-size:20px; line-height:1; cursor:pointer; }
    .more-v25-modal-icon { display:flex; align-items:center; justify-content:center; width:56px; height:56px; margin:0 auto 12px; border-radius:17px; background:var(--grad-forest); color:#fff; font-size:18px; font-weight:900; }
    .more-v25-modal h2 { margin:0; color:var(--color-text); font-size:18px; }
    .more-v25-modal-version { margin:5px 0 12px; color:var(--color-forest); font-size:11px; font-weight:800; }
    .more-v25-modal-copy { margin:0 auto 18px; max-width:260px; color:var(--color-text-muted); font-size:12px; line-height:1.55; }
    .more-v25-modal-done { width:100%; padding:12px; border:0; border-radius:11px; background:var(--grad-forest); color:#fff; font-weight:800; cursor:pointer; }
    [data-theme="dark"] .more-v25-profile { background:linear-gradient(135deg, rgba(22,60,42,.95), rgba(24,41,34,.95)); }
    [data-theme="dark"] .more-v25-settings { border-color:var(--color-border); background:var(--color-surface); }
    @media (max-width:380px) { .more-v25-row, .more-v25-action { padding-left:11px; padding-right:11px; } .more-v25-icon { width:38px; height:38px; } }
  `;
  document.head.appendChild(style);
}

export function renderMore(container) {
  ensureStyles();
  var settings = getSettings();
  var userName = settings.userName || "Student";
  var department = settings.departmentName || settings.department || "Civil Engineering";
  var semester = settings.semesterNumber || settings.semester || "1st Semester";
  if (typeof semester === "number") semester = semester === 1 ? "1st Semester" : semester + "th Semester";
  var subtitle = department + " \u2022 " + semester;
  var progress = getProgressPercent();

  var html = '<div class="more-v25-page">' +
    '<div class="more-v25-profile">' +
      '<div class="more-v25-avatar">S</div>' +
      '<div class="more-v25-profile-copy"><strong>' + escapeHtml(userName) + '</strong><small>' + escapeHtml(subtitle) + '</small></div>' +
      '<a class="more-v25-settings" href="#/settings" aria-label="Settings">' + ICONS.settings + '</a>' +
    '</div>' +
    '<div class="more-v25-stats" aria-label="Study statistics">' +
      statCard("\uD83D\uDCDA", "12", "Subjects") +
      statCard("\uD83D\uDD25", String(getStreak()), "Day streak") +
      statCard("\uD83D\uDCC8", progress + "%", "Progress") +
    '</div>' +
    featureSection("LEARNING", ROWS.learning) +
    featureSection("MY STUFF", ROWS.stuff) +
    featureSection("TOOLS", ROWS.tools) +
    '<section class="more-v25-section more-v25-help-section"><h2 class="more-v25-section-title">HELP &amp; ABOUT</h2><div class="more-v25-card more-v25-help-card">' +
      '<button class="more-v25-action" id="more-v25-share" type="button">' + iconBox("share", "#2563EB", "#DBEAFE") + '<span>Share App</span><span class="more-v25-action-end">' + ICONS.chevron + '</span></button>' +
      '<a class="more-v25-action" href="mailto:ar3665539@gmail.com">' + iconBox("mail", "#0891B2", "#CFFAFE") + '<span>Contact Us</span><span class="more-v25-action-end">' + ICONS.chevron + '</span></a>' +
      '<button class="more-v25-action last" id="more-v25-about-btn" type="button">' + iconBox("info", "#7C3AED", "#EDE9FE") + '<span>About</span><span class="more-v25-action-end">' + ICONS.chevron + '</span></button>' +
    '</div></section>' +
    '<footer class="more-v25-footer"><strong>DiplomaStudy v2.5.0</strong><span>Made with \u2764\uFE0F in Bangladesh</span></footer>' +
  '</div>';

  if (!container || typeof container.innerHTML === "undefined") return html;
  container.innerHTML = html;
  var shareButton = container.querySelector("#more-v25-share");
  var aboutButton = container.querySelector("#more-v25-about-btn");
  if (shareButton) shareButton.addEventListener("click", shareApp);
  if (aboutButton) aboutButton.addEventListener("click", openAboutModal);
  return html;
}

export default renderMore;
