/**
 * ContentView v7 - Prevents pull-to-refresh and accidental reload
 */

import { AppShell } from "../components/AppShell.js";
import {
  getSubjectById,
  getChapterById,
  getQuestionsByChapter,
  getSuggestionsByChapter,
  getFormulasByChapter,
  getPdfsByChapter
} from "../services/api.js";
import { contentSkeleton } from "../utils/skeleton.js";
import { errorState, emptyState } from "../utils/errorState.js";

// ═══════════════════════════════════════════
// INJECT STYLES: prevent pull-to-refresh + overscroll
// ═══════════════════════════════════════════
function ensureNoRefreshStyles() {
  if (document.getElementById("ds-no-refresh-style")) return;
  var style = document.createElement("style");
  style.id = "ds-no-refresh-style";
  style.textContent =
    "html, body { overscroll-behavior-y: contain; overscroll-behavior-x: none; }" +
    ".no-refresh-zone { overscroll-behavior: contain; touch-action: pan-y; }" +
    ".no-refresh-zone * { -webkit-tap-highlight-color: transparent; }" +
    "@media (display-mode: standalone) { html, body { overscroll-behavior: none; } }";
  document.head.appendChild(style);
}

// Also disable the browser's default pull-to-refresh during content view
function disablePullRefresh() {
  try {
    if (!document.body.dataset.dsNoPull) {
      document.body.dataset.dsNoPull = "1";
      document.body.style.overscrollBehaviorY = "contain";
      document.documentElement.style.overscrollBehaviorY = "contain";
    }
  } catch (e) {}
}

function enablePullRefreshOnOtherPages() {
  try {
    delete document.body.dataset.dsNoPull;
    document.body.style.overscrollBehaviorY = "";
    document.documentElement.style.overscrollBehaviorY = "";
  } catch (e) {}
}

var TABS = [
  { id: "pdf",        icon: "\uD83D\uDCC4", label: "PDF" },
  { id: "creative",   icon: "\uD83D\uDCDD", label: "\u09B0\u099A\u09A8\u09BE" },
  { id: "short",      icon: "\uD83D\uDCC4", label: "\u09B8\u0982\u0995\u09CD\u09B7\u09BF\u09AA\u09CD\u09A4" },
  { id: "mcq",        icon: "\u26A1",        label: "MCQ" },
  { id: "suggestion", icon: "\uD83D\uDCA1", label: "\u09B8\u09BE\u099C\u09C7\u09B6\u09A8" },
  { id: "formula",    icon: "\uD83E\uDDEE", label: "\u09B8\u09C2\u09A4\u09CD\u09B0" }
];

var _lastChapterId = null;
var _qIndex = { creative: 0, short: 0, mcq: 0 };
var _lastTab = "pdf";

export async function renderContentView(params = {}) {
  ensureNoRefreshStyles();
  disablePullRefresh();

  var MY_HASH = "#/content";

  AppShell.updateHeader({
    title: "Content",
    subtitle: "Loading...",
    showBack: true,
    showSearch: false,
    showTheme: true,
    showSettings: false,
    expectedHash: MY_HASH
  });

  var main = AppShell.getMainView();
  if (!main) return;

  main.innerHTML = contentSkeleton();

  var urlParams = new URLSearchParams(window.location.hash.split("?")[1] || "");
  var subjectId = params.subjectId || urlParams.get("subjectId") || "";
  var chapterId = params.chapterId || urlParams.get("chapterId") || "";
  var initialTab = urlParams.get("type") || _lastTab || "pdf";

  if (!chapterId) {
    main.innerHTML = errorState({ type: "notFound", customBangla: "\u099A\u09CD\u09AF\u09BE\u09AA\u09CD\u099F\u09BE\u09B0 \u09B8\u09BF\u09B2\u09C7\u0995\u09CD\u099F \u0995\u09B0\u09BE \u09B9\u09AF\u09BC\u09A8\u09BF" });
    return;
  }

  var subject = null, chapter = null;
  var questions = [], suggestions = [], formulas = [], pdfs = [];
  var loadError = null;

  try {
    var results = await Promise.all([
      subjectId ? getSubjectById(subjectId) : Promise.resolve(null),
      getChapterById(chapterId),
      getQuestionsByChapter(chapterId),
      getSuggestionsByChapter(chapterId),
      getFormulasByChapter(chapterId),
      getPdfsByChapter(chapterId)
    ]);
    subject = results[0];
    chapter = results[1];
    questions = results[2];
    suggestions = results[3];
    formulas = results[4];
    pdfs = results[5];
  } catch (e) { loadError = e; }

  if ((window.location.hash || "").split("?")[0] !== MY_HASH) return;

  if (!chapter) {
    main.innerHTML = errorState({
      type: loadError ? "server" : "notFound",
      message: loadError ? loadError.message : "",
      retryFn: function () { renderContentView(params); }
    });
    return;
  }

  AppShell.updateHeader({
    title: chapter.name,
    subtitle: subject ? subject.name : "",
    showBack: true,
    showSearch: false,
    showTheme: true,
    showSettings: false,
    expectedHash: MY_HASH
  });

  if (_lastChapterId !== chapterId) {
    _qIndex = { creative: 0, short: 0, mcq: 0 };
    _lastChapterId = chapterId;
  }
  _lastTab = initialTab;

  var creative = questions.filter(function (q) { return q.type === "creative"; });
  var short = questions.filter(function (q) { return q.type === "short"; });
  var mcq = questions.filter(function (q) { return q.type === "mcq"; });

  var counts = {
    pdf: pdfs.length,
    creative: creative.length,
    short: short.length,
    mcq: mcq.length,
    suggestion: suggestions.length,
    formula: formulas.length
  };

  var data = { pdfs: pdfs, creative: creative, short: short, mcq: mcq, suggestions: suggestions, formulas: formulas };

  var headerHtml =
    '<div style="padding:12px 14px;background:linear-gradient(135deg,rgba(28,62,44,0.08),transparent);border-left:4px solid #1C3E2C;border-radius:12px;margin-bottom:10px;">' +
      '<div style="display:flex;align-items:center;gap:8px;margin-bottom:3px;">' +
        '<span style="padding:2px 8px;background:#1C3E2C;color:#FFFFFF;font-size:10px;font-weight:800;border-radius:999px;">Ch. ' + chapter.number + '</span>' +
        (subject ? '<span style="font-size:10.5px;color:#84968B;font-weight:700;">' + (subject.icon || "\uD83D\uDCD8") + ' ' + escapeHtml(subject.name) + '</span>' : "") +
      '</div>' +
      '<h2 style="font-size:16px;font-weight:900;color:#1C3E2C;letter-spacing:-0.2px;margin:0;line-height:1.3;">' + escapeHtml(chapter.name) + '</h2>' +
    '</div>';

  var tabsHtml = TABS.map(function (tab) {
    var isActive = tab.id === initialTab;
    return '<button class="content-tab' + (isActive ? ' active' : '') + '" data-tab="' + tab.id + '" type="button" style="' +
      'flex:0 0 auto;display:inline-flex;align-items:center;gap:4px;' +
      'padding:6px 10px;' +
      'background:' + (isActive ? '#1C3E2C' : '#FFFFFF') + ';' +
      'color:' + (isActive ? '#FFFFFF' : '#57675D') + ';' +
      'border:1px solid ' + (isActive ? '#1C3E2C' : '#E1E8E1') + ';' +
      'border-radius:999px;font-size:11px;font-weight:700;font-family:inherit;cursor:pointer;white-space:nowrap;' +
      'line-height:1;touch-action:manipulation;">' +
        '<span style="font-size:12px;">' + tab.icon + '</span>' +
        '<span>' + tab.label + '</span>' +
        (counts[tab.id] > 0
          ? '<span style="font-size:9.5px;font-weight:800;opacity:' + (isActive ? '0.85' : '0.7') + ';">' + counts[tab.id] + '</span>'
          : '') +
    '</button>';
  }).join("");

  main.classList.add("no-refresh-zone");

  main.innerHTML = headerHtml +
    '<div class="tabs-row" style="display:flex;gap:6px;overflow-x:auto;padding:2px 0 10px;margin-bottom:6px;scrollbar-width:none;-webkit-overflow-scrolling:touch;overscroll-behavior-x:contain;">' + tabsHtml + '</div>' +
    '<div id="content-area">' + renderTab(initialTab, data) + '</div>' +
    '<div style="height:16px;"></div>';

  bindForTab(main, initialTab, data);

  main.querySelectorAll(".content-tab").forEach(function (tab) {
    tab.addEventListener("click", function () {
      var tabId = tab.getAttribute("data-tab");
      if (tabId === _lastTab && tab.classList.contains("active")) return;
      _lastTab = tabId;

      main.querySelectorAll(".content-tab").forEach(function (t) {
        var isActive = t === tab;
        t.style.background = isActive ? "#1C3E2C" : "#FFFFFF";
        t.style.color = isActive ? "#FFFFFF" : "#57675D";
        t.style.borderColor = isActive ? "#1C3E2C" : "#E1E8E1";
        t.classList.toggle("active", isActive);
      });

      var area = main.querySelector("#content-area");
      area.style.opacity = "0";
      setTimeout(function () {
        area.innerHTML = renderTab(tabId, data);
        area.style.transition = "opacity 0.2s ease";
        area.style.opacity = "1";
        bindForTab(main, tabId, data);
      }, 100);
    });
  });
}

function bindForTab(main, tabId, data) {
  if (tabId === "creative") bindQuestionViewer(main, data.creative, "creative");
  else if (tabId === "short") bindQuestionViewer(main, data.short, "short");
  else if (tabId === "mcq") bindQuestionViewer(main, data.mcq, "mcq");
}

function renderTab(tabId, data) {
  if (tabId === "pdf") return renderPdfs(data.pdfs);
  if (tabId === "creative") return renderQuestions(data.creative, "creative");
  if (tabId === "short") return renderQuestions(data.short, "short");
  if (tabId === "mcq") return renderQuestions(data.mcq, "mcq");
  if (tabId === "suggestion") return renderSuggestions(data.suggestions);
  if (tabId === "formula") return renderFormulas(data.formulas);
  return "";
}

function renderPdfs(pdfs) {
  if (!pdfs || pdfs.length === 0) {
    return emptyState({ icon: "\uD83D\uDCC4", title: "\u0995\u09CB\u09A8\u09CB PDF \u09A8\u09C7\u0987", message: "\u098F\u0987 chapter-\u098F \u098F\u0996\u09A8\u09CB PDF \u09AF\u09CB\u0997 \u0995\u09B0\u09BE \u09B9\u09AF\u09BC\u09A8\u09BF\u0964" });
  }
  return '<div style="display:flex;flex-direction:column;gap:8px;">' +
    pdfs.map(function (pdf) {
      var href = pdf.fileUrl || "#";
      var clickAttr = pdf.fileUrl ? "" : 'onclick="event.preventDefault(); alert(\'File not available\');"';
      return '<a href="' + href + '" target="_blank" rel="noopener" ' + clickAttr + ' style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:#FFFFFF;border:1px solid #E1E8E1;border-radius:12px;text-decoration:none;cursor:pointer;">' +
        '<div style="width:38px;height:38px;border-radius:10px;background:#FEE2E2;color:#991B1B;display:flex;align-items:center;justify-content:center;font-size:19px;flex-shrink:0;">\uD83D\uDCC4</div>' +
        '<div style="flex:1;min-width:0;">' +
          '<div style="font-size:13px;font-weight:700;color:#1C3E2C;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + escapeHtml(pdf.title || "Untitled") + '</div>' +
          (pdf.fileName ? '<div style="font-size:10.5px;color:#84968B;font-weight:600;margin-top:2px;">' + escapeHtml(pdf.fileName) + '</div>' : "") +
        '</div>' +
      '</a>';
    }).join("") +
  '</div>';
}

function renderQuestions(questions, type) {
  if (!questions || questions.length === 0) {
    return emptyState({ icon: "\u2753", title: "\u0995\u09CB\u09A8\u09CB \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8 \u09A8\u09C7\u0987", message: "\u098F\u0987 \u09A7\u09B0\u09A8\u09C7\u09B0 \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8 \u098F\u0996\u09A8\u09CB \u09AF\u09CB\u0997 \u0995\u09B0\u09BE \u09B9\u09AF\u09BC\u09A8\u09BF\u0964" });
  }

  var total = questions.length;
  var idx = _qIndex[type] || 0;
  if (idx >= total) idx = 0;
  _qIndex[type] = idx;

  var slidesHtml = questions.map(function (q, i) {
    return '<div class="q-slide" data-qindex="' + i + '" style="flex:0 0 100%;width:100%;min-width:0;box-sizing:border-box;align-self:flex-start;">' +
      renderSingleQuestion(q, i, type) +
    '</div>';
  }).join("");

  return '<div class="q-viewer" data-qtype="' + type + '" data-total="' + total + '">' +

    '<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 10px;background:#FFFFFF;border:1px solid #E1E8E1;border-radius:12px;margin-bottom:10px;">' +
      '<button class="q-prev" type="button" style="width:34px;height:34px;border-radius:9px;background:#F8FBF8;border:1px solid #E1E8E1;color:#1C3E2C;display:flex;align-items:center;justify-content:center;cursor:pointer;font-family:inherit;padding:0;touch-action:manipulation;">' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>' +
      '</button>' +
      '<div style="flex:1;text-align:center;">' +
        '<span style="font-size:13px;font-weight:900;color:#1C3E2C;font-family:ui-monospace,monospace;">' +
          '<span class="q-current">' + (idx + 1) + '</span>' +
          '<span style="color:#84968B;font-weight:700;"> / ' + total + '</span>' +
        '</span>' +
      '</div>' +
      '<button class="q-next" type="button" style="width:34px;height:34px;border-radius:9px;background:#F8FBF8;border:1px solid #E1E8E1;color:#1C3E2C;display:flex;align-items:center;justify-content:center;cursor:pointer;font-family:inherit;padding:0;touch-action:manipulation;">' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>' +
      '</button>' +
      '<button class="q-nav-btn" type="button" title="All questions" style="width:34px;height:34px;margin-left:6px;border-radius:9px;background:#1C3E2C;border:none;color:#FFFFFF;display:flex;align-items:center;justify-content:center;cursor:pointer;font-family:inherit;padding:0;flex-shrink:0;touch-action:manipulation;">' +
        '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>' +
      '</button>' +
    '</div>' +

    '<div class="q-slide-wrap" style="position:relative;overflow:hidden;transition:height 0.28s cubic-bezier(0.34,1.2,0.64,1);">' +
      '<div class="q-track" style="display:flex;align-items:flex-start;transition:transform 0.3s cubic-bezier(0.34,1.2,0.64,1);transform:translateX(-' + (idx * 100) + '%);">' +
        slidesHtml +
      '</div>' +
    '</div>' +

  '</div>';
}

function renderSingleQuestion(q, idx, type) {
  var html = '<div style="padding:0;">';

  html += '<div style="padding:12px 14px;background:#F8FBF8;border:1px solid #E1E8E1;border-left:3px solid #1C3E2C;border-radius:10px;margin-bottom:10px;">';
  html += '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px;">';
  html += '<div style="display:flex;align-items:center;gap:6px;">';
  html += '<span style="width:24px;height:24px;border-radius:7px;background:#1C3E2C;color:#FFFFFF;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;font-family:ui-monospace,monospace;flex-shrink:0;">' + (idx + 1) + '</span>';
  if (q.board) html += '<span style="font-size:9.5px;font-weight:800;color:#065F46;background:#DCFCE7;padding:2px 7px;border-radius:5px;">' + escapeHtml(q.board) + '</span>';
  html += '</div>';
  if (q.marks) html += '<span style="font-size:9.5px;font-weight:800;color:#92400E;background:#FEF3C7;padding:2px 7px;border-radius:5px;">\uD83C\uDFAF ' + escapeHtml(q.marks) + '</span>';
  html += '</div>';
  html += '<div style="font-size:14px;font-weight:700;color:#1C3E2C;line-height:1.55;white-space:pre-wrap;">' + escapeHtml(q.question || "") + '</div>';
  html += '</div>';

  if (type === "mcq" && q.options && q.options.length > 0) {
    html += '<div style="display:flex;flex-direction:column;gap:6px;">';
    q.options.forEach(function (opt, i) {
      var letter = String.fromCharCode(65 + i);
      var isCorrect = opt === q.answer;
      html += '<div style="display:flex;align-items:center;gap:10px;padding:9px 12px;background:' + (isCorrect ? "#DCFCE7" : "#FFFFFF") + ';border:1px solid ' + (isCorrect ? "#10B981" : "#E1E8E1") + ';border-radius:10px;">' +
        '<span style="width:22px;height:22px;border-radius:7px;background:' + (isCorrect ? "#10B981" : "#F2F5F2") + ';color:' + (isCorrect ? "#FFFFFF" : "#57675D") + ';font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;font-family:ui-monospace,monospace;flex-shrink:0;">' + letter + '</span>' +
        '<span style="flex:1;font-size:13px;font-weight:600;color:#1C3E2C;line-height:1.5;">' + escapeHtml(opt) + '</span>' +
        (isCorrect ? '<span style="color:#10B981;font-size:15px;font-weight:800;">\u2713</span>' : "") +
      '</div>';
    });
    html += '</div>';
  } else {
    html += '<div style="padding:10px 12px;border:1px solid #E1E8E1;border-radius:10px;">';
    html += '<div style="font-size:10px;font-weight:800;color:#84968B;text-transform:uppercase;letter-spacing:0.7px;margin-bottom:5px;">\u0989\u09A4\u09CD\u09A4\u09B0</div>';
    html += '<div style="font-size:14px;font-weight:500;color:#1C3E2C;line-height:1.7;white-space:pre-wrap;">' + escapeHtml(q.answer || "") + '</div>';
    html += '</div>';
  }

  html += '</div>';
  return html;
}

function bindQuestionViewer(main, questions, type) {
  var viewer = main.querySelector('.q-viewer[data-qtype="' + type + '"]');
  if (!viewer) return;

  var track = viewer.querySelector(".q-track");
  var wrap = viewer.querySelector(".q-slide-wrap");
  var currentLabel = viewer.querySelector(".q-current");
  var total = questions.length;
  var idx = _qIndex[type] || 0;
  if (idx >= total) idx = 0;

  function syncHeight(animate) {
    var slides = track.querySelectorAll(".q-slide");
    var current = slides[idx];
    if (!current) return;
    var h = current.offsetHeight;
    if (animate === false) {
      var prev = wrap.style.transition;
      wrap.style.transition = "none";
      wrap.style.height = h + "px";
      void wrap.offsetHeight;
      wrap.style.transition = prev || "height 0.28s cubic-bezier(0.34,1.2,0.64,1)";
    } else {
      wrap.style.height = h + "px";
    }
  }

  function updateUI() {
    if (currentLabel) currentLabel.textContent = String(idx + 1);
  }

  function goTo(newIdx) {
    if (newIdx < 0) newIdx = 0;
    if (newIdx >= total) newIdx = total - 1;
    idx = newIdx;
    _qIndex[type] = idx;
    track.style.transition = "transform 0.3s cubic-bezier(0.34,1.2,0.64,1)";
    track.style.transform = "translateX(-" + (idx * 100) + "%)";
    updateUI();
    syncHeight(true);
  }

  var prevBtn = viewer.querySelector(".q-prev");
  var nextBtn = viewer.querySelector(".q-next");
  if (prevBtn) prevBtn.addEventListener("click", function () { goTo(idx - 1); });
  if (nextBtn) nextBtn.addEventListener("click", function () { goTo(idx + 1); });

  var navBtn = viewer.querySelector(".q-nav-btn");
  if (navBtn) {
    navBtn.addEventListener("click", function () {
      showQNavigator(questions, idx, type, goTo);
    });
  }

  var startX = 0, startY = 0, isDragging = false;
  wrap.addEventListener("touchstart", function (e) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    isDragging = true;
    track.style.transition = "none";
  }, { passive: true });

  wrap.addEventListener("touchmove", function (e) {
    if (!isDragging) return;
    var dx = e.touches[0].clientX - startX;
    var dy = e.touches[0].clientY - startY;
    if (Math.abs(dy) > Math.abs(dx) + 5) {
      isDragging = false;
      track.style.transition = "transform 0.3s cubic-bezier(0.34,1.2,0.64,1)";
      track.style.transform = "translateX(-" + (idx * 100) + "%)";
      return;
    }
    var base = -idx * wrap.offsetWidth;
    track.style.transform = "translateX(" + (base + dx) + "px)";
  }, { passive: true });

  wrap.addEventListener("touchend", function (e) {
    if (!isDragging) return;
    isDragging = false;
    var dx = e.changedTouches[0].clientX - startX;
    var threshold = Math.max(40, wrap.offsetWidth * 0.15);
    if (dx < -threshold) goTo(idx + 1);
    else if (dx > threshold) goTo(idx - 1);
    else goTo(idx);
  }, { passive: true });

  function keyHandler(e) {
    var hash = (window.location.hash || "").split("?")[0];
    if (hash !== "#/content") {
      document.removeEventListener("keydown", keyHandler);
      return;
    }
    if (e.key === "ArrowLeft") goTo(idx - 1);
    else if (e.key === "ArrowRight") goTo(idx + 1);
  }
  document.addEventListener("keydown", keyHandler);

  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      syncHeight(false);
      updateUI();
    });
  });

  var resizeTimer = null;
  function resizeHandler() {
    var hash = (window.location.hash || "").split("?")[0];
    if (hash !== "#/content") {
      window.removeEventListener("resize", resizeHandler);
      return;
    }
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { syncHeight(false); }, 150);
  }
  window.addEventListener("resize", resizeHandler);
}

function showQNavigator(questions, currentIdx, type, goTo) {
  var old = document.getElementById("ds-q-navigator");
  if (old) old.remove();

  var overlay = document.createElement("div");
  overlay.id = "ds-q-navigator";
  overlay.style.cssText = "position:fixed;inset:0;background:rgba(15,23,42,0.7);backdrop-filter:blur(8px);z-index:9999;display:flex;align-items:flex-end;justify-content:center;";

  var gridItems = "";
  for (var i = 0; i < questions.length; i++) {
    var q = questions[i];
    var num = i + 1;
    var isActive = i === currentIdx;
    var marks = q.marks ? q.marks : "";
    gridItems += '<button class="q-nav-item" data-idx="' + i + '" type="button" style="padding:10px 4px;background:' + (isActive ? "#1C3E2C" : "#F8FBF8") + ';color:' + (isActive ? "#FFFFFF" : "#1C3E2C") + ';border:1px solid ' + (isActive ? "#1C3E2C" : "#E1E8E1") + ';border-radius:10px;font-family:inherit;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;min-height:54px;touch-action:manipulation;">' +
      '<span style="font-size:15px;font-weight:900;font-family:ui-monospace,monospace;">' + num + '</span>' +
      (marks ? '<span style="font-size:8.5px;font-weight:800;opacity:0.75;">' + escapeHtml(marks) + '</span>' : "") +
    '</button>';
  }

  overlay.innerHTML =
    '<div style="background:#FFFFFF;width:100%;max-width:520px;border-radius:24px 24px 0 0;padding:18px;max-height:80vh;overflow-y:auto;box-shadow:0 -12px 40px rgba(0,0,0,0.3);overscroll-behavior:contain;">' +
      '<div style="width:40px;height:4px;background:#E1E8E1;border-radius:999px;margin:0 auto 14px;"></div>' +
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">' +
        '<div>' +
          '<h3 style="font-size:15px;font-weight:900;color:#1C3E2C;margin:0 0 2px;">\u09B8\u09AC \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8</h3>' +
          '<div style="font-size:10.5px;color:#84968B;font-weight:700;">' + questions.length + ' questions</div>' +
        '</div>' +
        '<button data-close type="button" style="width:32px;height:32px;border-radius:9px;background:#F2F5F2;border:none;color:#57675D;font-size:15px;cursor:pointer;font-family:inherit;touch-action:manipulation;">\u2715</button>' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:7px;">' + gridItems + '</div>' +
    '</div>';

  document.body.appendChild(overlay);
  var close = function () { overlay.remove(); };
  overlay.querySelector("[data-close]").onclick = close;
  overlay.addEventListener("click", function (e) { if (e.target === overlay) close(); });

  overlay.querySelectorAll(".q-nav-item").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var i = parseInt(btn.getAttribute("data-idx"), 10);
      if (!isNaN(i)) { goTo(i); close(); }
    });
  });
}

function renderSuggestions(suggestions) {
  if (!suggestions || suggestions.length === 0) {
    return emptyState({ icon: "\uD83D\uDCA1", title: "\u0995\u09CB\u09A8\u09CB \u09B8\u09BE\u099C\u09C7\u09B6\u09A8 \u09A8\u09C7\u0987", message: "\u098F\u0987 chapter-\u098F \u098F\u0996\u09A8\u09CB \u09B8\u09BE\u099C\u09C7\u09B6\u09A8 \u09AF\u09CB\u0997 \u0995\u09B0\u09BE \u09B9\u09AF\u09BC\u09A8\u09BF\u0964" });
  }
  var catEmoji = { "Most Important": "\uD83D\uDD25", "Very Important": "\u2B50", "Board Top": "\uD83C\uDFC6", "Last Minute": "\u23F0" };
  return '<div style="display:flex;flex-direction:column;gap:10px;">' +
    suggestions.map(function (s) {
      return '<div style="padding:12px 14px;background:#FFFFFF;border:1px solid #E1E8E1;border-left:3px solid #F59E0B;border-radius:10px;">' +
        '<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">' +
          '<span style="font-size:13px;">' + (catEmoji[s.category] || "\uD83D\uDCA1") + '</span>' +
          '<span style="font-size:9.5px;font-weight:800;color:#92400E;background:#FEF3C7;padding:2px 7px;border-radius:5px;">' + escapeHtml(s.category || "") + '</span>' +
        '</div>' +
        '<h3 style="font-size:14px;font-weight:800;color:#1C3E2C;margin:0 0 6px;line-height:1.35;white-space:pre-wrap;">' + escapeHtml(s.title || "") + '</h3>' +
        '<div style="font-size:13px;color:#1C3E2C;line-height:1.65;white-space:pre-wrap;">' + escapeHtml(s.summary || "") + '</div>' +
        (s.examTip ? '<div style="margin-top:8px;font-size:12px;color:#92400E;font-weight:600;white-space:pre-wrap;">\uD83C\uDFAF ' + escapeHtml(s.examTip) + '</div>' : "") +
      '</div>';
    }).join("") +
  '</div>';
}

function renderFormulas(formulas) {
  if (!formulas || formulas.length === 0) {
    return emptyState({ icon: "\uD83E\uDDEE", title: "\u0995\u09CB\u09A8\u09CB \u09B8\u09C2\u09A4\u09CD\u09B0 \u09A8\u09C7\u0987", message: "\u098F\u0987 chapter-\u098F \u098F\u0996\u09A8\u09CB \u09B8\u09C2\u09A4\u09CD\u09B0 \u09AF\u09CB\u0997 \u0995\u09B0\u09BE \u09B9\u09AF\u09BC\u09A8\u09BF\u0964" });
  }
  return '<div style="display:flex;flex-direction:column;gap:10px;">' +
    formulas.map(function (f) {
      return '<div style="padding:12px 14px;background:#FFFFFF;border:1px solid #E1E8E1;border-left:3px solid #0891B2;border-radius:10px;">' +
        '<h3 style="font-size:14px;font-weight:800;color:#0E7490;margin:0 0 10px;white-space:pre-wrap;">' + escapeHtml(f.name || "") + '</h3>' +
        (f.equation ? '<div style="padding:10px 12px;background:#CFFAFE;border-radius:8px;text-align:center;margin-bottom:10px;"><code style="font-family:ui-monospace,monospace;font-size:15px;font-weight:800;color:#0E7490;white-space:pre-wrap;">' + escapeHtml(f.equation) + '</code></div>' : '') +
        (f.explanation ? '<div style="font-size:13px;color:#1C3E2C;line-height:1.65;margin-bottom:8px;white-space:pre-wrap;">' + escapeHtml(f.explanation) + '</div>' : '') +
        (f.example ? '<div style="font-size:12px;color:#57675D;line-height:1.6;padding:8px 10px;background:#F8FBF8;border-radius:8px;white-space:pre-wrap;"><strong>\u0989\u09A6\u09BE\u09B9\u09B0\u09A3:</strong> ' + escapeHtml(f.example) + '</div>' : '') +
      '</div>';
    }).join("") +
  '</div>';
}

function escapeHtml(str) {
  if (str == null) return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}