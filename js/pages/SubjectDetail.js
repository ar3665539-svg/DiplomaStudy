/**
 * SubjectDetail v6 - Theme-aware sticky header (light + dark)
 */

import { AppShell } from "../components/AppShell.js";
import { getSubjectById, getChaptersBySubject, getDepartments, recordRecentSubject } from "../services/api.js";
import { storage, STORAGE_KEYS } from "../core/storage.js";
import { chapterListSkeleton } from "../utils/skeleton.js";
import { errorState, emptyState } from "../utils/errorState.js";
import { Toast } from "../components/Toast.js";

// ═══════════════════════════════════════════
// THEME-AWARE BACKGROUND HELPER
// ═══════════════════════════════════════════
function getPageBackground() {
  try {
    var html = document.documentElement;
    var cs = window.getComputedStyle(html);
    var v = cs.getPropertyValue("--bg-base") ||
            cs.getPropertyValue("--bg-primary") ||
            cs.getPropertyValue("--background") ||
            cs.getPropertyValue("--color-bg") ||
            cs.getPropertyValue("--surface-base");
    if (v && v.trim()) return v.trim();

    var bgb = window.getComputedStyle(document.body).backgroundColor;
    if (bgb && bgb !== "rgba(0, 0, 0, 0)" && bgb !== "transparent") return bgb;

    var hbg = window.getComputedStyle(html).backgroundColor;
    if (hbg && hbg !== "rgba(0, 0, 0, 0)" && hbg !== "transparent") return hbg;

    var theme = html.getAttribute("data-theme");
    return theme === "dark" ? "#101712" : "#FAF8F3";
  } catch (e) {
    return "#FAF8F3";
  }
}

// ═══════════════════════════════════════════
// PROGRESS HELPERS
// ═══════════════════════════════════════════
function getProgress(subjectId) {
  try {
    var raw = localStorage.getItem("diplomastudy_chapter_progress_" + subjectId);
    return raw ? JSON.parse(raw) : {};
  } catch (e) { return {}; }
}
function setProgress(subjectId, chapterId, status) {
  try {
    var data = getProgress(subjectId);
    data[chapterId] = { status: status, at: Date.now() };
    localStorage.setItem("diplomastudy_chapter_progress_" + subjectId, JSON.stringify(data));
  } catch (e) {}
}
function getLastVisited(subjectId) {
  try {
    var raw = localStorage.getItem("diplomastudy_last_chapter_" + subjectId);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}
function setLastVisited(subjectId, chapterId) {
  try {
    localStorage.setItem("diplomastudy_last_chapter_" + subjectId, JSON.stringify({ chapterId: chapterId, at: Date.now() }));
  } catch (e) {}
}

// ═══════════════════════════════════════════
// RENDER
// ═══════════════════════════════════════════
export async function renderSubjectDetail(params = {}) {
  var MY_HASH = "#/subject";

  AppShell.updateHeader({
    title: "Loading...",
    subtitle: "",
    showBack: true,
    showSearch: false,
    showTheme: true,
    showSettings: false,
    expectedHash: MY_HASH
  });

  var main = AppShell.getMainView();
  if (!main) return;

  main.innerHTML = chapterListSkeleton(6);

  var urlParams = new URLSearchParams(window.location.hash.split("?")[1] || "");
  var subjectId = params.subjectId || urlParams.get("subjectId") || "";

  if (!subjectId) {
    main.innerHTML = errorState({ type: "notFound", customBangla: "\u0053\u0075\u0062\u006a\u0065\u0063\u0074 \u0073\u0065\u006c\u0065\u0063\u0074 \u0995\u09b0\u09be \u09b9\u09df\u09a8\u09bf" });
    return;
  }

  var subject = null, chapters = [], deptName = "";
  var loadError = null;

  try {
    subject = await getSubjectById(subjectId);
    if (subject) {
      recordRecentSubject(subjectId).catch(function () {});
      chapters = await getChaptersBySubject(subjectId);
      chapters = chapters.slice().sort(function (a, b) {
        const aSerial = getNumericSerial(a.number);
        const bSerial = getNumericSerial(b.number);
        if (aSerial !== bSerial) return aSerial - bSerial;

        const aSort = getNumericSerial(a.sortOrder);
        const bSort = getNumericSerial(b.sortOrder);
        if (aSort !== bSort) return aSort - bSort;
        return 0;
      });
    }
  } catch (e) { loadError = e; }

  try {
    var settings = storage.get(STORAGE_KEYS.SETTINGS, {});
    var deptId = settings.departmentId || settings.department || "";
    if (deptId) {
      var depts = await getDepartments();
      var cur = depts.filter(function (d) { return d.id === deptId; })[0];
      if (cur) deptName = cur.name;
    }
  } catch (e) {}

  if ((window.location.hash || "").split("?")[0] !== MY_HASH) return;

  if (!subject) {
    main.innerHTML = errorState({
      type: loadError ? "server" : "notFound",
      message: loadError ? loadError.message : "",
      retryFn: function () { renderSubjectDetail(params); }
    });
    return;
  }

  AppShell.updateHeader({
    title: subject.name,
    subtitle: (chapters.length ? chapters.length + " chapters" : "") + (deptName ? " \u2022 " + deptName : ""),
    showBack: true,
    showSearch: false,
    showTheme: true,
    showSettings: false,
    expectedHash: MY_HASH
  });

  var hasChapters = chapters.length > 0;

  var progress = getProgress(subjectId);
  var completed = 0;
  chapters.forEach(function (ch) {
    var p = progress[ch.id];
    if (p && p.status === "done") completed++;
  });
  var total = chapters.length;
  var progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

  var lastVisited = getLastVisited(subjectId);
  var resumeChapter = null;
  if (lastVisited) {
    resumeChapter = chapters.filter(function (c) { return c.id === lastVisited.chapterId; })[0];
  }

  var pageBg = getPageBackground();

  var html = [];

  // ═══════════════════════════════════════════
  // STICKY SUBJECT HEADER — theme aware
  // ═══════════════════════════════════════════
  html.push(
    '<div class="subject-sticky-head" style="position:sticky;top:0;z-index:4;background:' + pageBg + ';margin:-16px -16px 16px;padding:16px 16px 12px;">',

      '<div style="padding:16px 18px;background:linear-gradient(135deg,rgba(28,62,44,0.08),transparent);border-left:4px solid #1C3E2C;border-radius:16px;">',

        '<div style="display:flex;align-items:flex-start;gap:12px;">',
          '<div style="width:48px;height:48px;border-radius:14px;background:linear-gradient(135deg,#DCFCE7,#BBF7D0);display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0;box-shadow:0 4px 12px rgba(16,185,129,0.15);">' + (subject.icon || "\uD83D\uDCD8") + '</div>',
          '<div style="flex:1;min-width:0;">',
            '<h2 style="font-size:15.5px;font-weight:900;color:#1C3E2C;letter-spacing:-0.3px;margin:0 0 2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + escapeHtml(subject.name) + '</h2>',
            (subject.banglaName ? '<p style="font-size:11.5px;color:#84968B;font-weight:600;margin:0 0 5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + escapeHtml(subject.banglaName) + '</p>' : ""),
            '<div style="display:flex;gap:4px;flex-wrap:wrap;">' +
              (subject.code ? '<span style="font-size:9px;font-weight:800;color:#065F46;background:#DCFCE7;padding:2px 7px;border-radius:5px;text-transform:uppercase;">' + escapeHtml(subject.code) + '</span>' : "") +
              (subject.type ? '<span style="font-size:9px;font-weight:800;color:#57675D;background:#F2F5F2;padding:2px 7px;border-radius:5px;text-transform:uppercase;">' + escapeHtml(subject.type) + '</span>' : "") +
              (subject.credits ? '<span style="font-size:9px;font-weight:800;color:#C87A1E;background:#FEF3C7;padding:2px 7px;border-radius:5px;">' + subject.credits + ' CR</span>' : "") +
            '</div>',
          '</div>',
        '</div>'
  );

  if (hasChapters) {
    html.push(
      '<div style="margin-top:12px;padding-top:12px;border-top:1px dashed #E1E8E1;">',
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">',
          '<span style="font-size:10.5px;font-weight:800;color:#57675D;letter-spacing:0.4px;text-transform:uppercase;">Progress</span>',
          '<span style="font-size:11px;font-weight:900;color:#1C3E2C;">' + completed + ' / ' + total + ' completed</span>',
        '</div>',
        '<div style="height:7px;background:#F2F5F2;border-radius:999px;overflow:hidden;">',
          '<div style="height:100%;width:' + progressPercent + '%;background:linear-gradient(90deg,#10B981,#059669);border-radius:999px;transition:width 0.4s ease;"></div>',
        '</div>',
      '</div>'
    );
  }

  html.push('</div>');
  html.push('</div>');

  // ── Resume card ──
  if (resumeChapter) {
    var resumeProgress = progress[resumeChapter.id];
    var resumeStatus = resumeProgress ? resumeProgress.status : "not-started";
    if (resumeStatus !== "done") {
      html.push(
        '<button class="resume-btn" data-chapter-id="' + resumeChapter.id + '" data-chapter-number="' + resumeChapter.number + '" style="width:100%;display:flex;align-items:center;gap:12px;padding:14px;background:linear-gradient(135deg,#10B981,#059669);border:none;border-radius:14px;cursor:pointer;font-family:inherit;text-align:left;margin-bottom:16px;box-shadow:0 6px 18px rgba(16,185,129,0.25);">',
          '<div style="width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;color:#FFFFFF;">\u25B6</div>',
          '<div style="flex:1;min-width:0;">',
            '<div style="font-size:10px;font-weight:800;color:rgba(255,255,255,0.8);text-transform:uppercase;letter-spacing:0.6px;margin-bottom:3px;">Continue from where you left</div>',
            '<div style="font-size:13.5px;font-weight:800;color:#FFFFFF;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">Ch ' + resumeChapter.number + ' \u2022 ' + escapeHtml(resumeChapter.name) + '</div>',
          '</div>',
        '</button>'
      );
    }
  }

  // ── Chapters ──
  if (hasChapters) {
    html.push(
      '<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:#F8FBF8;border-radius:12px;margin-bottom:14px;">',
        '<span style="font-size:12px;font-weight:700;color:#57675D;">Tap a chapter to see its content</span>',
        '<span style="font-size:11px;font-weight:900;color:#1C3E2C;background:#DCFCE7;padding:3px 9px;border-radius:999px;">' + total + '</span>',
      '</div>'
    );

    html.push('<div style="display:flex;flex-direction:column;gap:8px;">');

    chapters.forEach(function (ch) {
        var p = progress[ch.id];
        var status = p ? p.status : "not-started";

        var badgeBg, badgeFg, badgeIcon;
        if (status === "done") { badgeBg = "#DCFCE7"; badgeFg = "#065F46"; badgeIcon = "\u2705"; }
        else if (status === "reading") { badgeBg = "#FEF3C7"; badgeFg = "#92400E"; badgeIcon = "\uD83D\uDCD6"; }
        else { badgeBg = "#F2F5F2"; badgeFg = "#84968B"; badgeIcon = "\u25CB"; }

        html.push(
          '<div class="chapter-item" data-chapter-id="' + ch.id + '" style="background:#FFFFFF;border:1.5px solid #E1E8E1;border-radius:14px;overflow:hidden;transition:all 0.2s ease;">',

            '<button class="chapter-header" data-toggle="' + ch.id + '" type="button" style="width:100%;display:flex;align-items:center;gap:12px;padding:14px;background:transparent;border:none;cursor:pointer;font-family:inherit;text-align:left;">',

              '<div style="min-width:42px;height:42px;padding:0 8px;border-radius:12px;background:linear-gradient(135deg,#DCFCE7,#BBF7D0);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:900;color:#065F46;font-family:ui-monospace,monospace;flex-shrink:0;">' + ch.number + '</div>',

              '<div style="flex:1;min-width:0;">',
                '<div style="font-size:13.5px;font-weight:800;color:#1C3E2C;line-height:1.3;margin-bottom:3px;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;">' + escapeHtml(ch.name) + '</div>',
                (ch.nameEn ? '<div style="font-size:10.5px;color:#84968B;font-weight:500;font-style:italic;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-bottom:4px;">' + escapeHtml(ch.nameEn) + '</div>' : ""),
                (ch.category ? '<span style="display:inline-flex;align-items:center;font-size:9.5px;font-weight:800;color:#57675D;background:#F2F5F2;padding:2px 7px;border-radius:5px;margin-bottom:4px;">' + escapeHtml(ch.category) + '</span>' : ""),
                '<div style="display:flex;align-items:center;gap:6px;">',
                  '<span style="display:inline-flex;align-items:center;gap:3px;font-size:9.5px;font-weight:800;color:' + badgeFg + ';background:' + badgeBg + ';padding:2px 7px;border-radius:5px;">' + badgeIcon + ' ' + (status === "done" ? "Done" : status === "reading" ? "Reading" : "New") + '</span>',
                '</div>',
              '</div>',

              '<div class="chevron" style="width:28px;height:28px;border-radius:50%;background:#F2F5F2;color:#57675D;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all 0.25s cubic-bezier(0.34,1.56,0.64,1);">',
                '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 12 15 18 9"></polyline></svg>',
              '</div>',

            '</button>',

            '<div class="chapter-body" data-body="' + ch.id + '" style="max-height:0;overflow:hidden;transition:max-height 0.3s cubic-bezier(0.34,1.2,0.64,1);">',
              '<div style="padding:12px 14px 14px;border-top:1px dashed #E1E8E1;">',
                '<div style="font-size:11px;font-weight:800;color:#57675D;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:10px;">Choose content type</div>',
                '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;">' +
                  contentBtn("pdf", "\uD83D\uDCC4", "PDF", "pdf", ch, subjectId) +
                  contentBtn("creative", "\uD83D\uDCDD", "\u09B0\u099A\u09A8\u09BE\u09AE\u09C2\u09B2\u0995", "creative", ch, subjectId) +
                  contentBtn("short", "\uD83D\uDCC4", "\u09B8\u0982\u0995\u09CD\u09B7\u09BF\u09AA\u09CD\u09A4", "short", ch, subjectId) +
                  contentBtn("mcq", "\u26A1", "\u0985\u09A4\u09BF \u09B8\u0982\u0995\u09CD\u09B7\u09BF\u09AA\u09CD\u09A4", "mcq", ch, subjectId) +
                  contentBtn("suggestion", "\uD83D\uDCA1", "\u09B8\u09BE\u099C\u09C7\u09B6\u09A8", "suggestion", ch, subjectId) +
                  contentBtn("formula", "\uD83E\uDDEE", "\u09B8\u09C2\u09A4\u09CD\u09B0", "formula", ch, subjectId) +
                '</div>',
              '</div>',
            '</div>',

          '</div>'
        );
    });

    html.push('</div>');
  } else {
    html.push(
      '<div style="text-align:center;padding:60px 20px;">',
        '<div style="font-size:56px;margin-bottom:12px;">\uD83D\uDCDA</div>',
        '<h3 style="font-size:15px;font-weight:800;color:#1C3E2C;margin:0 0 6px;">No chapters yet</h3>',
        '<p style="font-size:12.5px;color:#84968B;">This subject has no chapters added.</p>',
      '</div>'
    );
  }

  html.push('<div style="height:20px;"></div>');

  main.innerHTML = html.join("");

  // ═══════════════════════════════════════════
  // REAPPLY STICKY OFFSET + BACKGROUND (theme-aware)
  // ═══════════════════════════════════════════
  function applyStickyStyles() {
    var sticky = main.querySelector(".subject-sticky-head");
    if (!sticky) return;

    var hdrMount = document.getElementById("header-mount");
    var hdr = document.getElementById("app-header");
    var h = 0;
    if (hdrMount) h = hdrMount.getBoundingClientRect().height;
    else if (hdr) h = hdr.getBoundingClientRect().height;
    sticky.style.top = (h > 0 ? h : 0) + "px";
    sticky.style.background = getPageBackground();
  }

  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      applyStickyStyles();
    });
  });

  // Re-apply on theme toggle (dark/light switch)
  try {
    if (main._dsThemeObserver) main._dsThemeObserver.disconnect();
    main._dsThemeObserver = new MutationObserver(function () {
      applyStickyStyles();
    });
    main._dsThemeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "class"]
    });
  } catch (e) {}

  // ═══════════════════════════════════════════
  // BIND EVENTS
  // ═══════════════════════════════════════════

  main.querySelectorAll("[data-toggle]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      var chId = btn.getAttribute("data-toggle");
      var body = main.querySelector('[data-body="' + chId + '"]');
      var item = btn.closest(".chapter-item");
      var chevron = btn.querySelector(".chevron");
      var isOpen = body.style.maxHeight && body.style.maxHeight !== "0px";

      main.querySelectorAll(".chapter-body").forEach(function (b) {
        if (b !== body) {
          b.style.maxHeight = "0";
          var oi = b.closest(".chapter-item");
          var oc = oi ? oi.querySelector(".chevron") : null;
          if (oc) oc.style.transform = "";
          if (oi) oi.style.borderColor = "#E1E8E1";
        }
      });

      if (isOpen) {
        body.style.maxHeight = "0";
        if (chevron) chevron.style.transform = "";
        if (item) item.style.borderColor = "#E1E8E1";
      } else {
        body.style.maxHeight = body.scrollHeight + "px";
        if (chevron) chevron.style.transform = "rotate(180deg)";
        if (item) item.style.borderColor = "#1C3E2C";

        setProgress(subjectId, chId, "reading");
        setLastVisited(subjectId, chId);
      }
    });
  });

  main.querySelectorAll("[data-content]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      var type = btn.getAttribute("data-content");
      var chapterId = btn.getAttribute("data-chapter-id");
      var chapterNumber = btn.getAttribute("data-chapter-number");
      setProgress(subjectId, chapterId, "done");
      setLastVisited(subjectId, chapterId);
      window.location.hash = "#/content?type=" + type + "&subjectId=" + subjectId + "&chapterId=" + chapterId + "&chapterNumber=" + chapterNumber;
    });
  });

  main.querySelectorAll(".resume-btn").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      var chId = btn.getAttribute("data-chapter-id");
      var chNum = btn.getAttribute("data-chapter-number");
      window.location.hash = "#/content?subjectId=" + subjectId + "&chapterId=" + chId + "&chapterNumber=" + chNum;
    });
  });
}

// ═══════════════════════════════════════════
// CONTENT BUTTON
// ═══════════════════════════════════════════
function contentBtn(type, icon, label, colorSet, chapter, subjectId) {
  var colors = {
    pdf:        { bg: "#FEE2E2", fg: "#991B1B" },
    creative:   { bg: "#DCFCE7", fg: "#065F46" },
    short:      { bg: "#FEF3C7", fg: "#92400E" },
    mcq:        { bg: "#E0E7FF", fg: "#3730A3" },
    suggestion: { bg: "#F3E8FF", fg: "#6B21A8" },
    formula:    { bg: "#CFFAFE", fg: "#155E75" }
  };
  var c = colors[colorSet] || colors.pdf;

  return '<button data-content="' + type + '" data-chapter-id="' + chapter.id + '" data-chapter-number="' + chapter.number + '" data-subject-id="' + subjectId + '" type="button" style="display:flex;flex-direction:column;align-items:center;gap:4px;padding:10px 4px 8px;background:' + c.bg + ';border:1px solid ' + c.fg + '20;border-radius:11px;cursor:pointer;font-family:inherit;">' +
    '<span style="font-size:18px;line-height:1;">' + icon + '</span>' +
    '<span style="font-size:10px;font-weight:800;color:' + c.fg + ';line-height:1.15;text-align:center;">' + label + '</span>' +
  '</button>';
}

function escapeHtml(str) {
  if (str == null) return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function getNumericSerial(value) {
  if (value === null || value === undefined || value === '') return 0;
  if (typeof value === 'number' && Number.isFinite(value)) return value;

  const str = String(value).trim();
  if (!str) return 0;

  const match = str.match(/-?\d+(?:\.\d+)?/);
  if (match) return Number(match[0]);

  const num = Number(str);
  return Number.isFinite(num) ? num : 0;
}