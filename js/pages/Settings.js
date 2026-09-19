/**
 * Settings v6 - Full featured with Install App
 */

import { AppShell } from "../components/AppShell.js";
import { storage, STORAGE_KEYS } from "../core/storage.js";

// ═══════════════════════════════════════════
// STORAGE KEYS
// ═══════════════════════════════════════════
var THEME_KEY = "diplomastudy_theme";
var FONT_KEY = "diplomastudy_font_size";
var GOAL_KEY = "diplomastudy_goal";
var REMINDER_KEY = "diplomastudy_reminder";
var STUDY_TIME_KEY = "diplomastudy_study_time";
var LANG_KEY = "diplomastudy_language";
var WEEK_START_KEY = "diplomastudy_week_start";
var NOTIF_KEY = "diplomastudy_notifications";
var APP_VERSION = "2.4.0";
var SHARE_URL = "https://diplomastudy.pages.dev";
var SHARE_TEXT = "Diploma Engineering students-\u09A6\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u09B8\u09C7\u09B0\u09BE study app! \u09AC\u09BF\u09B7\u09AF\u09BC, PDF, \u09B8\u09BE\u099C\u09C7\u09B6\u09A8, \u09B8\u09C2\u09A4\u09CD\u09B0 \u09B8\u09AC \u098F\u0995\u099C\u09BE\u09AF\u09BC\u0997\u09BE\u09AF\u09BC\u0964";

// ═══════════════════════════════════════════
// SAFE HELPERS
// ═══════════════════════════════════════════
function safeGet(key, fallback) {
  try { var v = localStorage.getItem(key); return v == null ? fallback : v; }
  catch (e) { return fallback; }
}
function safeSet(key, val) {
  try { localStorage.setItem(key, val); return true; } catch (e) { return false; }
}
function safeJSON(key, fallback) {
  try {
    var raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) { return fallback; }
}

function getTheme() { return safeGet(THEME_KEY, "light"); }
function getFontSize() { return safeGet(FONT_KEY, "medium"); }
function getReminder() { return safeJSON(REMINDER_KEY, { enabled: false, time: "20:00" }); }
function getStudyTime() { return safeGet(STUDY_TIME_KEY, "morning"); }
function getLanguage() { return safeGet(LANG_KEY, "mixed"); }
function getWeekStart() { return safeGet(WEEK_START_KEY, "saturday"); }
function getNotif() { return safeJSON(NOTIF_KEY, { notice: true, streak: true }); }

function getDailyGoal() {
  var g = safeJSON(GOAL_KEY, null);
  if (g && typeof g.target === "number") return g.target;
  return 45;
}
function setDailyGoal(minutes) {
  var today = new Date().toISOString().slice(0, 10);
  var g = safeJSON(GOAL_KEY, { date: today, minutes: 0, target: 45 });
  g.target = minutes;
  safeSet(GOAL_KEY, JSON.stringify(g));
}

function applyTheme(theme) {
  safeSet(THEME_KEY, theme);
  if (theme === "dark") document.documentElement.setAttribute("data-theme", "dark");
  else document.documentElement.removeAttribute("data-theme");
}

function applyFontSize(size) {
  safeSet(FONT_KEY, size);
  var px = size === "small" ? "14px" : (size === "large" ? "18px" : "16px");
  try { document.documentElement.style.fontSize = px; } catch (e) {}
}

try {
  var _fs = getFontSize();
  if (_fs === "small") document.documentElement.style.fontSize = "14px";
  else if (_fs === "large") document.documentElement.style.fontSize = "18px";
} catch (e) {}

function getCacheSizeKB() {
  try {
    var total = 0;
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (k && k.indexOf("diplomastudy_cache") === 0) {
        var v = localStorage.getItem(k) || "";
        total += k.length + v.length;
      }
    }
    return Math.round((total / 1024) * 10) / 10;
  } catch (e) { return 0; }
}

function isInstalled() {
  try {
    if (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) return true;
    if (window.navigator.standalone === true) return true;
  } catch (e) {}
  return false;
}

function escapeHtml(s) {
  if (s == null) return "";
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// ── Toast shim ──
var Toast = {
  _render: function (msg, bg) {
    try {
      var old = document.getElementById("ds-mini-toast");
      if (old) old.remove();
      var el = document.createElement("div");
      el.id = "ds-mini-toast";
      el.textContent = msg;
      el.style.cssText =
        "position:fixed;left:50%;bottom:90px;transform:translateX(-50%);" +
        "background:" + bg + ";color:#FFFFFF;padding:11px 18px;border-radius:12px;" +
        "font-size:13px;font-weight:700;font-family:inherit;z-index:99999;" +
        "box-shadow:0 8px 24px rgba(0,0,0,0.25);opacity:0;transition:opacity 0.2s;max-width:85%;text-align:center;";
      document.body.appendChild(el);
      requestAnimationFrame(function () { el.style.opacity = "1"; });
      setTimeout(function () {
        el.style.opacity = "0";
        setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 250);
      }, 1800);
    } catch (e) {}
  },
  success: function (m) { this._render(m, "#1C3E2C"); },
  info: function (m) { this._render(m, "#1D4ED8"); },
  warning: function (m) { this._render(m, "#B45309"); },
  error: function (m) { this._render(m, "#B91C1C"); }
};

// ═══════════════════════════════════════════
// MINI UI COMPONENTS
// ═══════════════════════════════════════════
function sectionTitle(text) {
  return '<h3 style="font-size:11px;font-weight:800;color:#84968B;text-transform:uppercase;letter-spacing:1px;margin:0 0 10px 4px;">' + text + '</h3>';
}
function card(content) {
  return '<div style="background:#FFFFFF;border:1px solid #E1E8E1;border-radius:18px;overflow:hidden;">' + content + '</div>';
}
function iconBox(emoji, bg) {
  return '<div style="width:42px;height:42px;border-radius:13px;background:' + bg + ';display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">' + emoji + '</div>';
}
function toggleSwitch(isOn) {
  return '<div style="width:44px;height:24px;border-radius:999px;background:' + (isOn ? "#1C3E2C" : "#E1E8E1") + ';position:relative;transition:background 0.25s;flex-shrink:0;">' +
    '<div style="position:absolute;top:2px;left:' + (isOn ? "22px" : "2px") + ';width:20px;height:20px;border-radius:50%;background:#FFFFFF;transition:left 0.25s;box-shadow:0 2px 4px rgba(0,0,0,0.15);"></div>' +
  '</div>';
}
function segBtn(label, value, currentValue, dataAttr) {
  var active = value === currentValue;
  return '<button data-' + dataAttr + '="' + value + '" type="button" style="flex:1;padding:9px 6px;border-radius:9px;border:none;background:' + (active ? "#1C3E2C" : "transparent") + ';color:' + (active ? "#FFFFFF" : "#57675D") + ';font-size:11.5px;font-weight:800;font-family:inherit;cursor:pointer;transition:all 0.2s ease;">' + label + '</button>';
}
function chipBtn(label, value, currentValue, dataAttr) {
  var active = value === currentValue;
  return '<button data-' + dataAttr + '="' + value + '" type="button" style="padding:8px 14px;border-radius:999px;border:1.5px solid ' + (active ? "#1C3E2C" : "#E1E8E1") + ';background:' + (active ? "#1C3E2C" : "#FFFFFF") + ';color:' + (active ? "#FFFFFF" : "#57675D") + ';font-size:12px;font-weight:800;font-family:inherit;cursor:pointer;white-space:nowrap;transition:all 0.2s ease;">' + label + '</button>';
}
function rowBtn(id, emoji, bg, title, sub, trailing, extraStyle) {
  var extra = extraStyle || "";
  return '<button class="settings-row" id="' + id + '" type="button" style="width:100%;display:flex;align-items:center;gap:14px;padding:16px;background:transparent;border:none;cursor:pointer;font-family:inherit;text-align:left;' + extra + '">' +
    iconBox(emoji, bg) +
    '<div style="flex:1;min-width:0;">' +
      '<div style="font-size:13.5px;font-weight:800;color:#1C3E2C;margin-bottom:2px;">' + title + '</div>' +
      '<div style="font-size:11px;color:#84968B;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + sub + '</div>' +
    '</div>' +
    (trailing || "") +
  '</button>';
}

// ═══════════════════════════════════════════
// SHARE MODAL
// ═══════════════════════════════════════════
function showShareModal() {
  var old = document.getElementById("ds-share-modal");
  if (old) old.remove();

  var overlay = document.createElement("div");
  overlay.id = "ds-share-modal";
  overlay.style.cssText = "position:fixed;inset:0;background:rgba(15,23,42,0.75);backdrop-filter:blur(8px);z-index:9999;display:flex;align-items:flex-end;justify-content:center;";

  var items = [
    { label: "WhatsApp", emoji: "\uD83D\uDCF1", bg: "#DCFCE7", url: "https://wa.me/?text=" + encodeURIComponent(SHARE_TEXT + " " + SHARE_URL) },
    { label: "Facebook", emoji: "\uD83D\uDCD8", bg: "#DBEAFE", url: "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(SHARE_URL) },
    { label: "Messenger", emoji: "\uD83D\uDCAC", bg: "#F3E8FF", url: "fb-messenger://share/?link=" + encodeURIComponent(SHARE_URL) },
    { label: "Telegram", emoji: "\u2708\uFE0F", bg: "#CFFAFE", url: "https://t.me/share/url?url=" + encodeURIComponent(SHARE_URL) + "&text=" + encodeURIComponent(SHARE_TEXT) },
    { label: "Twitter", emoji: "\uD83D\uDC26", bg: "#DBEAFE", url: "https://twitter.com/intent/tweet?text=" + encodeURIComponent(SHARE_TEXT) + "&url=" + encodeURIComponent(SHARE_URL) },
    { label: "Email", emoji: "\uD83D\uDCE7", bg: "#FEE2E2", url: "mailto:?subject=DiplomaStudy&body=" + encodeURIComponent(SHARE_TEXT + " " + SHARE_URL) }
  ];

  var gridHtml = items.map(function (it) {
    return '<a href="' + it.url + '" target="_blank" rel="noopener" style="display:flex;flex-direction:column;align-items:center;gap:8px;padding:14px 8px;background:#F8FBF8;border-radius:14px;text-decoration:none;font-family:inherit;">' +
      '<div style="width:48px;height:48px;border-radius:14px;background:' + it.bg + ';display:flex;align-items:center;justify-content:center;font-size:22px;">' + it.emoji + '</div>' +
      '<span style="font-size:11.5px;font-weight:800;color:#1C3E2C;">' + it.label + '</span>' +
    '</a>';
  }).join("");

  overlay.innerHTML =
    '<div style="background:#FFFFFF;width:100%;max-width:520px;border-radius:24px 24px 0 0;padding:20px;max-height:85vh;overflow-y:auto;box-shadow:0 -12px 40px rgba(0,0,0,0.3);">' +
      '<div style="width:40px;height:4px;background:#E1E8E1;border-radius:999px;margin:0 auto 16px;"></div>' +
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">' +
        '<div>' +
          '<h3 style="font-size:16px;font-weight:900;color:#1C3E2C;margin:0 0 2px;">Share DiplomaStudy</h3>' +
          '<div style="font-size:11px;color:#84968B;font-weight:600;">Choose an app</div>' +
        '</div>' +
        '<button data-close type="button" style="width:34px;height:34px;border-radius:10px;background:#F2F5F2;border:none;color:#57675D;font-size:16px;cursor:pointer;font-family:inherit;">\u2715</button>' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px;">' + gridHtml + '</div>' +
      '<button data-copy type="button" style="width:100%;padding:14px;border-radius:14px;border:1.5px solid #1C3E2C;background:#1C3E2C;color:#FFFFFF;font-weight:800;font-size:13px;font-family:inherit;cursor:pointer;">Copy link</button>' +
    '</div>';

  document.body.appendChild(overlay);

  var close = function () { overlay.remove(); };
  overlay.querySelector("[data-close]").onclick = close;
  overlay.addEventListener("click", function (e) { if (e.target === overlay) close(); });

  overlay.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () { setTimeout(close, 400); });
  });

  overlay.querySelector("[data-copy]").onclick = function () {
    var done = function () { Toast.success("Link copied"); close(); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(SHARE_TEXT + " " + SHARE_URL).then(done).catch(function () {
        fallbackCopy(SHARE_TEXT + " " + SHARE_URL);
        done();
      });
    } else {
      fallbackCopy(SHARE_TEXT + " " + SHARE_URL);
      done();
    }
  };
}

function fallbackCopy(text) {
  try {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.cssText = "position:fixed;top:-9999px;left:-9999px;";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  } catch (e) {}
}

function doShare() {
  if (navigator.share) {
    try {
      var p = navigator.share({
        title: "DiplomaStudy",
        text: SHARE_TEXT,
        url: SHARE_URL
      });
      if (p && typeof p.then === "function") {
        p.then(function () {}).catch(function (err) {
          if (err && (err.name === "AbortError" || err.name === "NotAllowedError")) return;
          showShareModal();
        });
      }
      return;
    } catch (e) {}
  }
  showShareModal();
}

// ═══════════════════════════════════════════
// INSTALL APP
// ═══════════════════════════════════════════
function doInstall() {
  // Already installed?
  if (isInstalled()) {
    Toast.info("App already installed");
    return;
  }
  // Try native prompt (Android Chrome)
  if (window.deferredInstallPrompt) {
    try {
      window.deferredInstallPrompt.prompt();
      window.deferredInstallPrompt.userChoice.then(function (choice) {
        if (choice.outcome === "accepted") {
          Toast.success("Installing...");
        }
        window.deferredInstallPrompt = null;
      }).catch(function () {
        window.deferredInstallPrompt = null;
      });
      return;
    } catch (e) {}
  }
  // Manual instructions
  var ua = navigator.userAgent || "";
  var isIOS = /iPad|iPhone|iPod/.test(ua) || (ua.indexOf("Mac") !== -1 && "ontouchend" in document);
  var isAndroid = /Android/.test(ua);

  var title = "Install DiplomaStudy";
  var steps = [];

  if (isIOS) {
    steps = [
      "1. Tap the Share icon below the page",
      "2. Scroll down and tap 'Add to Home Screen'",
      "3. Tap 'Add' at the top"
    ];
  } else if (isAndroid) {
    steps = [
      "1. Tap the 3-dot menu (top-right)",
      "2. Tap 'Install app' or 'Add to Home screen'",
      "3. Tap 'Install'"
    ];
  } else {
    steps = [
      "1. Look for the install icon in the address bar",
      "2. Or use the browser menu to add to home screen"
    ];
  }

  var old = document.getElementById("ds-install-modal");
  if (old) old.remove();
  var overlay = document.createElement("div");
  overlay.id = "ds-install-modal";
  overlay.style.cssText = "position:fixed;inset:0;background:rgba(15,23,42,0.75);backdrop-filter:blur(8px);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;";
  overlay.innerHTML =
    '<div style="background:#FFFFFF;border-radius:22px;padding:24px;max-width:360px;width:100%;box-shadow:0 24px 60px rgba(0,0,0,0.35);">' +
      '<div style="text-align:center;margin-bottom:20px;">' +
        '<div style="width:64px;height:64px;border-radius:20px;background:linear-gradient(135deg,#1C3E2C,#2A5540);color:#FFFFFF;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:900;margin:0 auto 12px;">DS</div>' +
        '<div style="font-size:16px;font-weight:900;color:#1C3E2C;margin-bottom:4px;">' + title + '</div>' +
        '<div style="font-size:12px;color:#84968B;font-weight:600;">Add to home screen for fullscreen mode</div>' +
      '</div>' +
      '<div style="display:flex;flex-direction:column;gap:10px;margin-bottom:20px;">' +
        steps.map(function (st) {
          return '<div style="display:flex;align-items:flex-start;gap:10px;padding:12px 14px;background:#F8FBF8;border-radius:12px;font-size:13px;color:#1C3E2C;font-weight:600;line-height:1.5;">' + st + '</div>';
        }).join("") +
      '</div>' +
      '<button data-close type="button" style="width:100%;padding:14px;border-radius:14px;border:none;background:linear-gradient(135deg,#1C3E2C,#2A5540);color:#FFFFFF;font-weight:800;font-size:14px;font-family:inherit;cursor:pointer;">Got it</button>' +
    '</div>';

  document.body.appendChild(overlay);
  var close = function () { overlay.remove(); };
  overlay.querySelector("[data-close]").onclick = close;
  overlay.addEventListener("click", function (e) { if (e.target === overlay) close(); });
}

// ═══════════════════════════════════════════
// MAIN RENDER
// ═══════════════════════════════════════════
export function renderSettings() {
  AppShell.updateHeader({
    title: "Settings",
    subtitle: "App preferences",
    showBack: true,
    showSearch: false,
    showTheme: false,
    showSettings: false
  });

  var main = AppShell.getMainView();
  if (!main) return;

  var settings = {};
  try { settings = storage.get(STORAGE_KEYS.SETTINGS, {}) || {}; } catch (e) {}

  var theme = getTheme();
  var fontSize = getFontSize();
  var goalMin = getDailyGoal();
  var reminder = getReminder();
  var studyTime = getStudyTime();
  var language = getLanguage();
  var weekStart = getWeekStart();
  var notif = getNotif();
  var cacheKB = getCacheSizeKB();
  var installed = isInstalled();

  var deptName = settings.departmentName || settings.department || "No department";

  // Install section — different UI based on state
  var installSectionHtml = "";
  if (!installed) {
    installSectionHtml =
      '<div style="margin-bottom:20px;">' +
        sectionTitle("Install App") +
        '<button id="setting-install" type="button" style="width:100%;display:flex;align-items:center;gap:14px;padding:16px;background:linear-gradient(135deg,#DCFCE7,#BBF7D0);border:1px solid #10B981;border-radius:18px;cursor:pointer;font-family:inherit;text-align:left;">' +
          '<div style="width:42px;height:42px;border-radius:13px;background:#FFFFFF;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">\uD83D\uDCF1</div>' +
          '<div style="flex:1;min-width:0;">' +
            '<div style="font-size:13.5px;font-weight:800;color:#065F46;margin-bottom:2px;">Install DiplomaStudy</div>' +
            '<div style="font-size:11px;color:#065F46;font-weight:600;opacity:0.85;">Add to home screen for fullscreen mode</div>' +
          '</div>' +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#065F46" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>' +
        '</button>' +
      '</div>';
  } else {
    installSectionHtml =
      '<div style="margin-bottom:20px;">' +
        sectionTitle("Install App") +
        '<div style="display:flex;align-items:center;gap:14px;padding:16px;background:#F8FBF8;border:1px solid #E1E8E1;border-radius:18px;">' +
          '<div style="width:42px;height:42px;border-radius:13px;background:#DCFCE7;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">\u2705</div>' +
          '<div style="flex:1;min-width:0;">' +
            '<div style="font-size:13.5px;font-weight:800;color:#1C3E2C;margin-bottom:2px;">App Installed</div>' +
            '<div style="font-size:11px;color:#84968B;font-weight:600;">You are using the installed version</div>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  main.innerHTML =

    // ── PROFILE ──
    '<div style="padding:20px;background:linear-gradient(135deg,#163524 0%,#1F4A32 100%);border-radius:20px;margin-bottom:20px;box-shadow:0 12px 28px -8px rgba(28,62,44,0.3);position:relative;overflow:hidden;">' +
      '<div style="position:absolute;top:-30px;right:-30px;width:120px;height:120px;border-radius:50%;background:radial-gradient(circle,rgba(200,122,30,0.2),transparent 70%);"></div>' +
      '<div style="position:relative;display:flex;align-items:center;gap:14px;">' +
        '<div style="width:60px;height:60px;border-radius:18px;background:rgba(255,255,255,0.15);border:1.5px solid rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;font-size:28px;">\uD83D\uDC64</div>' +
        '<div style="flex:1;min-width:0;">' +
          '<div style="font-size:16px;font-weight:900;color:#FFFFFF;margin-bottom:2px;">' + escapeHtml(settings.userName || "Student") + '</div>' +
          '<div style="font-size:12px;color:rgba(255,255,255,0.7);font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + escapeHtml(deptName) + '</div>' +
        '</div>' +
        '<button id="edit-profile" type="button" style="width:38px;height:38px;border-radius:12px;background:rgba(255,255,255,0.15);border:1.5px solid rgba(255,255,255,0.2);color:#FFFFFF;display:flex;align-items:center;justify-content:center;cursor:pointer;font-family:inherit;font-size:16px;flex-shrink:0;">\u270F\uFE0F</button>' +
      '</div>' +
    '</div>' +

    // ── INSTALL APP ──
    installSectionHtml +

    // ── APPEARANCE ──
    '<div style="margin-bottom:20px;">' +
      sectionTitle("Appearance") +
      card(
        rowBtn("setting-theme", theme === "dark" ? "\uD83C\uDF19" : "\u2600\uFE0F", "#F2F5F2", "Dark Mode", theme === "dark" ? "On" : "Off", toggleSwitch(theme === "dark"), "border-bottom:1px solid #F2F5F2;") +
        '<div style="padding:14px 16px;">' +
          '<div style="display:flex;align-items:center;gap:14px;margin-bottom:10px;">' +
            iconBox("\uD83D\uDD24", "#F2F5F2") +
            '<div style="flex:1;min-width:0;">' +
              '<div style="font-size:13.5px;font-weight:800;color:#1C3E2C;margin-bottom:2px;">Font Size</div>' +
              '<div style="font-size:11px;color:#84968B;font-weight:600;">' + (fontSize === "small" ? "Small" : fontSize === "large" ? "Large" : "Medium") + '</div>' +
            '</div>' +
          '</div>' +
          '<div style="display:flex;gap:4px;padding:4px;background:#F2F5F2;border-radius:12px;">' +
            segBtn("Small", "small", fontSize, "fontsize") +
            segBtn("Medium", "medium", fontSize, "fontsize") +
            segBtn("Large", "large", fontSize, "fontsize") +
          '</div>' +
        '</div>'
      ) +
    '</div>' +

    // ── STUDY ──
    '<div style="margin-bottom:20px;">' +
      sectionTitle("Study") +
      card(
        '<div style="padding:14px 16px;border-bottom:1px solid #F2F5F2;">' +
          '<div style="display:flex;align-items:center;gap:14px;margin-bottom:10px;">' +
            iconBox("\uD83C\uDFAF", "#FEF3C7") +
            '<div style="flex:1;min-width:0;">' +
              '<div style="font-size:13.5px;font-weight:800;color:#1C3E2C;margin-bottom:2px;">Daily Goal</div>' +
              '<div style="font-size:11px;color:#84968B;font-weight:600;">' + goalMin + ' minutes per day</div>' +
            '</div>' +
          '</div>' +
          '<div style="display:flex;gap:6px;flex-wrap:wrap;">' +
            chipBtn("15", "15", String(goalMin), "goal") +
            chipBtn("30", "30", String(goalMin), "goal") +
            chipBtn("45", "45", String(goalMin), "goal") +
            chipBtn("60", "60", String(goalMin), "goal") +
            chipBtn("90", "90", String(goalMin), "goal") +
          '</div>' +
        '</div>' +

        rowBtn("setting-reminder", "\u23F0", "#DBEAFE", "Study Reminder", reminder.enabled ? "Time: " + reminder.time : "Remind me daily", toggleSwitch(reminder.enabled), "border-bottom:1px solid #F2F5F2;") +

        '<div style="padding:14px 16px;">' +
          '<div style="display:flex;align-items:center;gap:14px;margin-bottom:10px;">' +
            iconBox("\uD83C\uDF05", "#DCFCE7") +
            '<div style="flex:1;min-width:0;">' +
              '<div style="font-size:13.5px;font-weight:800;color:#1C3E2C;margin-bottom:2px;">Best Study Time</div>' +
              '<div style="font-size:11px;color:#84968B;font-weight:600;">' + studyTime + '</div>' +
            '</div>' +
          '</div>' +
          '<div style="display:flex;gap:4px;padding:4px;background:#F2F5F2;border-radius:12px;">' +
            segBtn("Morning", "morning", studyTime, "studytime") +
            segBtn("Afternoon", "afternoon", studyTime, "studytime") +
            segBtn("Evening", "evening", studyTime, "studytime") +
            segBtn("Night", "night", studyTime, "studytime") +
          '</div>' +
        '</div>'
      ) +
    '</div>' +

    // ── LANGUAGE ──
    '<div style="margin-bottom:20px;">' +
      sectionTitle("Language & Region") +
      card(
        '<div style="padding:14px 16px;border-bottom:1px solid #F2F5F2;">' +
          '<div style="display:flex;align-items:center;gap:14px;margin-bottom:10px;">' +
            iconBox("\uD83C\uDF10", "#F3E8FF") +
            '<div style="flex:1;min-width:0;">' +
              '<div style="font-size:13.5px;font-weight:800;color:#1C3E2C;margin-bottom:2px;">Language</div>' +
              '<div style="font-size:11px;color:#84968B;font-weight:600;">' + language + '</div>' +
            '</div>' +
          '</div>' +
          '<div style="display:flex;gap:4px;padding:4px;background:#F2F5F2;border-radius:12px;">' +
            segBtn("\u09AC\u09BE\u0982\u09B2\u09BE", "bangla", language, "lang") +
            segBtn("English", "english", language, "lang") +
            segBtn("Mixed", "mixed", language, "lang") +
          '</div>' +
        '</div>' +

        '<div style="padding:14px 16px;">' +
          '<div style="display:flex;align-items:center;gap:14px;margin-bottom:10px;">' +
            iconBox("\uD83D\uDCC5", "#CFFAFE") +
            '<div style="flex:1;min-width:0;">' +
              '<div style="font-size:13.5px;font-weight:800;color:#1C3E2C;margin-bottom:2px;">Week Starts On</div>' +
              '<div style="font-size:11px;color:#84968B;font-weight:600;">' + weekStart + '</div>' +
            '</div>' +
          '</div>' +
          '<div style="display:flex;gap:4px;padding:4px;background:#F2F5F2;border-radius:12px;">' +
            segBtn("Sat", "saturday", weekStart, "wkstart") +
            segBtn("Sun", "sunday", weekStart, "wkstart") +
            segBtn("Mon", "monday", weekStart, "wkstart") +
          '</div>' +
        '</div>'
      ) +
    '</div>' +

    // ── NOTIFICATIONS ──
    '<div style="margin-bottom:20px;">' +
      sectionTitle("Notifications") +
      card(
        rowBtn("notif-notice", "\uD83D\uDCE2", "#FEE2E2", "Notice Alerts", "Alert on new notices", toggleSwitch(notif.notice), "border-bottom:1px solid #F2F5F2;") +
        rowBtn("notif-streak", "\uD83D\uDD25", "#FEF3C7", "Streak Reminder", "Remind if no study today", toggleSwitch(notif.streak))
      ) +
    '</div>' +

    // ── DATA ──
    '<div style="margin-bottom:20px;">' +
      sectionTitle("Data & Storage") +
      card(
        '<div style="padding:16px;display:flex;align-items:center;gap:14px;border-bottom:1px solid #F2F5F2;">' +
          iconBox("\uD83D\uDCBE", "#F3E8FF") +
          '<div style="flex:1;min-width:0;">' +
            '<div style="font-size:13.5px;font-weight:800;color:#1C3E2C;margin-bottom:2px;">Cache Size</div>' +
            '<div style="font-size:11px;color:#84968B;font-weight:600;">' + cacheKB + ' KB used</div>' +
          '</div>' +
        '</div>' +

        rowBtn("setting-refresh", "\uD83D\uDD04", "#FEF3C7", "Refresh Data", "Load fresh from server", "", "border-bottom:1px solid #F2F5F2;") +
        rowBtn("setting-clear", "\uD83D\uDDD1\uFE0F", "#FEE2E2", "Clear Cache", "Remove temporary data", "", "border-bottom:1px solid #F2F5F2;") +
        rowBtn("setting-export", "\uD83D\uDCE5", "#DCFCE7", "Export Data", "Download backup as JSON", "")
      ) +
    '</div>' +

    // ── ADVANCED ──
    '<div style="margin-bottom:20px;">' +
      sectionTitle("Advanced") +
      card(
        rowBtn("setting-restart", "\uD83D\uDD01", "#DBEAFE", "Restart Onboarding", "Set department & semester again", "", "border-bottom:1px solid #F2F5F2;") +
        rowBtn("setting-reset", "\u26A0\uFE0F", "#FEE2E2", "Clear All Data", "Delete all notes, bookmarks & settings", "")
      ) +
    '</div>' +

    // ── HELP ──
    '<div style="margin-bottom:20px;">' +
      sectionTitle("Help & Support") +
      card(
        rowBtn("setting-share", "\uD83D\uDCE4", "#DCFCE7", "Share App", "Tell your friends", "", "border-bottom:1px solid #F2F5F2;") +
        rowBtn("setting-contact", "\uD83D\uDCEC", "#DBEAFE", "Contact Us", "Send feedback or report issue", "")
      ) +
    '</div>' +

    // ── ABOUT ──
    '<div style="text-align:center;padding:24px 20px;background:#FFFFFF;border:1px solid #E1E8E1;border-radius:18px;margin-bottom:20px;">' +
      '<div style="font-size:36px;margin-bottom:8px;">\uD83C\uDF93</div>' +
      '<div style="font-size:15px;font-weight:900;color:#1C3E2C;margin-bottom:3px;">DiplomaStudy</div>' +
      '<div style="font-size:11.5px;color:#84968B;font-weight:600;margin-bottom:10px;">Version ' + APP_VERSION + '</div>' +
      '<div style="font-size:11px;color:#84968B;line-height:1.6;">Made with \u2764\uFE0F for Diploma Engineering students</div>' +
    '</div>' +

    '<div style="height:20px;"></div>';

  // ═══════════════════════════════════════════
  // BIND EVENTS
  // ═══════════════════════════════════════════
  function bind(sel, handler) {
    var el = main.querySelector(sel);
    if (el) {
      el.addEventListener("click", function (e) {
        try { handler(e); } catch (err) { console.error("[Settings]", err); }
      });
    }
  }
  function bindAll(sel, handler) {
    main.querySelectorAll(sel).forEach(function (el) {
      el.addEventListener("click", function (e) {
        try { handler(e, el); } catch (err) { console.error("[Settings]", err); }
      });
    });
  }

  bind("#edit-profile", function () {
    var name = prompt("Enter your name:", settings.userName || "Student");
    if (name && name.trim()) {
      var ns = storage.get(STORAGE_KEYS.SETTINGS, {}) || {};
      ns.userName = name.trim();
      storage.set(STORAGE_KEYS.SETTINGS, ns);
      Toast.success("Name updated");
      renderSettings();
    }
  });

  bind("#setting-install", function () {
    doInstall();
  });

  bind("#setting-theme", function () {
    var next = getTheme() === "dark" ? "light" : "dark";
    applyTheme(next);
    Toast.success(next === "dark" ? "Dark mode on" : "Light mode on");
    renderSettings();
  });

  bindAll("[data-fontsize]", function (e, el) {
    var v = el.getAttribute("data-fontsize");
    applyFontSize(v);
    Toast.success("Font: " + v);
    renderSettings();
  });

  bindAll("[data-lang]", function (e, el) {
    var v = el.getAttribute("data-lang");
    safeSet(LANG_KEY, v);
    Toast.success("Language: " + v);
    renderSettings();
  });

  bindAll("[data-wkstart]", function (e, el) {
    var v = el.getAttribute("data-wkstart");
    safeSet(WEEK_START_KEY, v);
    Toast.success("Week starts: " + v);
    renderSettings();
  });

  bindAll("[data-goal]", function (e, el) {
    var v = parseInt(el.getAttribute("data-goal"), 10);
    if (!isNaN(v)) {
      setDailyGoal(v);
      Toast.success("Daily goal: " + v + " min");
      renderSettings();
    }
  });

  bindAll("[data-studytime]", function (e, el) {
    var v = el.getAttribute("data-studytime");
    safeSet(STUDY_TIME_KEY, v);
    Toast.success("Saved");
    renderSettings();
  });

  bind("#setting-reminder", function () {
    var r = getReminder();
    if (!r.enabled) {
      var picked = prompt("Reminder time (HH:MM, 24h):", r.time || "20:00");
      if (picked === null) return;
      if (!/^\d{1,2}:\d{2}$/.test(picked.trim())) {
        Toast.warning("Format: 20:00");
        return;
      }
      r.enabled = true;
      r.time = picked.trim();
    } else {
      r.enabled = false;
    }
    safeSet(REMINDER_KEY, JSON.stringify(r));
    Toast.success(r.enabled ? "Reminder set: " + r.time : "Reminder off");
    renderSettings();
  });

  bind("#notif-notice", function () {
    var n = getNotif();
    n.notice = !n.notice;
    safeSet(NOTIF_KEY, JSON.stringify(n));
    Toast.success(n.notice ? "Notice alerts on" : "Notice alerts off");
    renderSettings();
  });
  bind("#notif-streak", function () {
    var n = getNotif();
    n.streak = !n.streak;
    safeSet(NOTIF_KEY, JSON.stringify(n));
    Toast.success(n.streak ? "Streak reminder on" : "Streak reminder off");
    renderSettings();
  });

  bind("#setting-refresh", function () {
    try {
      var toRemove = [];
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && k.indexOf("diplomastudy_cache") === 0) toRemove.push(k);
      }
      toRemove.forEach(function (k) { localStorage.removeItem(k); });
    } catch (e) {}
    Toast.info("Refreshing...");
    setTimeout(function () { window.location.reload(); }, 400);
  });

  bind("#setting-clear", function () {
    if (!confirm("Clear cached data?")) return;
    try {
      var toRemove = [];
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && k.indexOf("diplomastudy_cache") === 0) toRemove.push(k);
      }
      toRemove.forEach(function (k) { localStorage.removeItem(k); });
    } catch (e) {}
    Toast.success("Cache cleared");
    renderSettings();
  });

  bind("#setting-export", function () {
    try {
      var keys = [
        "diplomastudy_settings", "diplomastudy_goal", "diplomastudy_streak",
        "diplomastudy_weekly_minutes", "diplomastudy_recent_subjects",
        "diplomastudy_recent_activity", "diplomastudy_notes", "diplomastudy_bookmarks"
      ];
      var out = { exportedAt: new Date().toISOString(), version: APP_VERSION, data: {} };
      keys.forEach(function (k) {
        var v = localStorage.getItem(k);
        if (v) out.data[k] = v;
      });
      var blob = new Blob([JSON.stringify(out, null, 2)], { type: "application/json" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = "diplomastudy-backup-" + new Date().toISOString().slice(0, 10) + ".json";
      document.body.appendChild(a);
      a.click();
      setTimeout(function () { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
      Toast.success("Exported");
    } catch (e) {
      Toast.error("Export failed");
    }
  });

  bind("#setting-restart", function () {
    if (!confirm("Restart onboarding? Department & semester will be cleared.")) return;
    try {
      var s = storage.get(STORAGE_KEYS.SETTINGS, {}) || {};
      delete s.department;
      delete s.departmentId;
      delete s.departmentName;
      delete s.semester;
      delete s.semesterId;
      delete s.semesterNumber;
      storage.set(STORAGE_KEYS.SETTINGS, s);
    } catch (e) {}
    Toast.info("Restarting...");
    setTimeout(function () { window.location.hash = "#/onboarding"; }, 300);
  });

  bind("#setting-reset", function () {
    if (!confirm("Clear ALL data? This cannot be undone.")) return;
    if (!confirm("Are you sure? All notes, bookmarks & settings will be lost.")) return;
    try {
      var toRemove = [];
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && k.indexOf("diplomastudy") === 0) toRemove.push(k);
      }
      toRemove.forEach(function (k) { localStorage.removeItem(k); });
    } catch (e) {}
    Toast.success("All data cleared");
    setTimeout(function () {
      window.location.hash = "#/onboarding";
      window.location.reload();
    }, 500);
  });

  bind("#setting-share", function () {
    doShare();
  });

  bind("#setting-contact", function () {
    window.location.href = "mailto:ar3665539@gmail.com?subject=DiplomaStudy%20Feedback";
  });

  console.log("[Settings] v6 rendered OK");
}