// js/pages/More.js
// v3 - No imports. Pure function. ASCII only.
// Exports renderMore. Header set by router via main.js reg().

console.log("[More.js] v3 loaded");

export function renderMore(container, params) {
  var html = [
    '<div style="padding:8px 0;">',

    '  <div style="padding:12px;border-radius:12px;background:#1C3E2C;color:#FFFFFF;margin-bottom:16px;text-align:center;">',
    '    <div style="font-size:14px;font-weight:800;">MORE v3 LOADED</div>',
    '    <div style="font-size:11px;opacity:0.8;margin-top:4px;">If you see this, More.js is working.</div>',
    '  </div>',

    '  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">',

    '    <a href="#/bookmarks" style="display:block;padding:14px;border-radius:12px;background:#F3F7F3;color:#1C3E2C;text-decoration:none;font-weight:700;font-size:14px;">Bookmarks</a>',
    '    <a href="#/notes" style="display:block;padding:14px;border-radius:12px;background:#F3F7F3;color:#1C3E2C;text-decoration:none;font-weight:700;font-size:14px;">Notes</a>',
    '    <a href="#/progress" style="display:block;padding:14px;border-radius:12px;background:#F3F7F3;color:#1C3E2C;text-decoration:none;font-weight:700;font-size:14px;">Progress</a>',
    '    <a href="#/planner" style="display:block;padding:14px;border-radius:12px;background:#F3F7F3;color:#1C3E2C;text-decoration:none;font-weight:700;font-size:14px;">Planner</a>',
    '    <a href="#/timer" style="display:block;padding:14px;border-radius:12px;background:#F3F7F3;color:#1C3E2C;text-decoration:none;font-weight:700;font-size:14px;">Timer</a>',
    '    <a href="#/tools" style="display:block;padding:14px;border-radius:12px;background:#F3F7F3;color:#1C3E2C;text-decoration:none;font-weight:700;font-size:14px;">Tools</a>',
    '    <a href="#/pdfs" style="display:block;padding:14px;border-radius:12px;background:#F3F7F3;color:#1C3E2C;text-decoration:none;font-weight:700;font-size:14px;">PDF Library</a>',
    '    <a href="#/formulas" style="display:block;padding:14px;border-radius:12px;background:#F3F7F3;color:#1C3E2C;text-decoration:none;font-weight:700;font-size:14px;">Formulas</a>',
    '    <a href="#/jobs" style="display:block;padding:14px;border-radius:12px;background:#F3F7F3;color:#1C3E2C;text-decoration:none;font-weight:700;font-size:14px;">Jobs</a>',
    '    <a href="#/ai" style="display:block;padding:14px;border-radius:12px;background:#F3F7F3;color:#1C3E2C;text-decoration:none;font-weight:700;font-size:14px;">AI Assistant</a>',
    '    <a href="#/notices" style="display:block;padding:14px;border-radius:12px;background:#F3F7F3;color:#1C3E2C;text-decoration:none;font-weight:700;font-size:14px;">Notices</a>',
    '    <a href="#/settings" style="display:block;padding:14px;border-radius:12px;background:#F3F7F3;color:#1C3E2C;text-decoration:none;font-weight:700;font-size:14px;">Settings</a>',

    '  </div>',

    '  <p style="margin-top:18px;font-size:12px;color:#84968B;text-align:center;">',
    '    More page working (v3).',
    '  </p>',

    '</div>'
  ].join("");

  if (container && typeof container.innerHTML !== "undefined") {
    container.innerHTML = html;
  }

  return html;
}

export default renderMore;