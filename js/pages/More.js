// js/pages/More.js
// v4 - Professional grouped layout. ASCII only. No imports.
// Exports renderMore. If you see grouped sections, v4 is live.

console.log("[More.js] v4 loaded");

// ─── SVG Icons (inline, ASCII only) ───
var ICONS = {
  pdf: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
  sigma: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 4H6l6 8-6 8h12"/></svg>',
  help: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  bulb: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0 0 12 2z"/></svg>',
  bookmark: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>',
  edit: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>',
  chart: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>',
  calendar: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  clock: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  wrench: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 0 0 5 5L20 20a2 2 0 0 1-2 2l-8.7-8.7a4 4 0 0 0-5-5z"/></svg>',
  briefcase: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
  sparkle: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/></svg>',
  bell: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>',
  gear: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.65 1.65 0 0 0-1.8-.3 1.65 1.65 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.65 1.65 0 0 0-1-1.5 1.65 1.65 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.65 1.65 0 0 0 .3-1.8 1.65 1.65 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.65 1.65 0 0 0 1.5-1 1.65 1.65 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.65 1.65 0 0 0 1.8.3H9a1.65 1.65 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.65 1.65 0 0 0 1 1.5 1.65 1.65 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.65 1.65 0 0 0-.3 1.8V9a1.65 1.65 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.65 1.65 0 0 0-1.5 1z"/></svg>'
};

// ─── Icon box (colored rounded square with icon inside) ───
function iconBox(key, fg, bg) {
  return '<div style="width:40px;height:40px;border-radius:12px;background:' + bg + ';color:' + fg + ';display:flex;align-items:center;justify-content:center;flex-shrink:0;">' + ICONS[key] + '</div>';
}

// ─── Single row item (icon + label + chevron) ───
function row(href, label, key, fg, bg, isLast) {
  var border = isLast ? "" : "border-bottom:1px solid #F1F5F1;";
  return '<a href="' + href + '" style="display:flex;align-items:center;gap:14px;padding:12px 16px;text-decoration:none;color:#1C3E2C;' + border + '">' +
    iconBox(key, fg, bg) +
    '<span style="flex:1;font-size:14px;font-weight:600;letter-spacing:-0.1px;">' + label + '</span>' +
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>' +
  '</a>';
}

// ─── Section (title + card containing rows) ───
function section(title, rows) {
  var body = "";
  for (var i = 0; i < rows.length; i++) {
    body += row(rows[i][0], rows[i][1], rows[i][2], rows[i][3], rows[i][4], i === rows.length - 1);
  }
  return '<div style="margin-bottom:22px;">' +
    '<div style="font-size:11px;font-weight:800;color:#84968B;letter-spacing:1.2px;padding:0 4px 8px;">' + title + '</div>' +
    '<div style="background:#FFFFFF;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(28,62,44,0.06),0 1px 2px rgba(28,62,44,0.04);">' + body + '</div>' +
  '</div>';
}

// ─── Main render ───
export function renderMore(container, params) {
  var html = [
    '<div style="padding:4px 0 24px;">',

      // Intro strip
      '<div style="margin:0 4px 20px;padding:16px 18px;border-radius:16px;background:linear-gradient(135deg,#1C3E2C,#2D5A40);color:#FFFFFF;box-shadow:0 4px 14px rgba(28,62,44,0.18);">',
        '<div style="font-size:17px;font-weight:800;letter-spacing:-0.3px;">All Features</div>',
        '<div style="font-size:12px;opacity:0.8;margin-top:3px;">Everything you need, in one place.</div>',
      '</div>',

      // Learning
      section('LEARNING', [
        ['#/pdfs',        'PDF Library',  'pdf',       '#DC2626', '#FEE2E2'],
        ['#/formulas',    'Formulas',     'sigma',     '#2563EB', '#DBEAFE'],
        ['#/questions',   'Questions',    'help',      '#7C3AED', '#EDE9FE'],
        ['#/suggestions', 'Suggestions',  'bulb',      '#D97706', '#FEF3C7']
      ]),

      // My Stuff
      section('MY STUFF', [
        ['#/bookmarks', 'Bookmarks', 'bookmark', '#0891B2', '#CFFAFE'],
        ['#/notes',     'Notes',     'edit',     '#D97706', '#FEF3C7'],
        ['#/progress',  'Progress',  'chart',    '#16A34A', '#DCFCE7'],
        ['#/planner',   'Planner',   'calendar', '#DB2777', '#FCE7F3'],
        ['#/timer',     'Timer',     'clock',    '#EA580C', '#FFEDD5']
      ]),

      // Tools
      section('TOOLS', [
        ['#/tools',    'Study Tools',  'wrench',    '#0D9488', '#CCFBF1'],
        ['#/jobs',     'Jobs',         'briefcase', '#7C3AED', '#EDE9FE'],
        ['#/ai',       'AI Assistant', 'sparkle',   '#2563EB', '#DBEAFE'],
        ['#/notices',  'Notices',      'bell',      '#DC2626', '#FEE2E2'],
        ['#/settings', 'Settings',     'gear',      '#475569', '#E2E8F0']
      ]),

    '</div>'
  ].join("");

  if (container && typeof container.innerHTML !== "undefined") {
    container.innerHTML = html;
  }
  return html;
}

export default renderMore;