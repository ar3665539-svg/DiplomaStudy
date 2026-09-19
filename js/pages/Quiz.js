/**
 * Quiz v2 - Professional quiz with setup + LaTeX + navigation
 */

import { AppShell } from "../components/AppShell.js";
import { getSubjects, getChaptersBySubject, getQuestionsByChapter } from "../services/api.js";
import { emptyState } from "../utils/errorState.js";
import { Toast } from "../components/Toast.js";

// ═══════════════════════════════════════════
// LATEX PARSER (compact)
// ═══════════════════════════════════════════
function parseLatex(input) {
  if (!input) return "";
  var s = String(input);
  s = s.replace(/\\text\s*\{([^{}]+)\}/g, '$1');
  s = s.replace(/\\mathrm\s*\{([^{}]+)\}/g, '$1');
  s = s.replace(/\\mathbf\s*\{([^{}]+)\}/g, '<strong>$1</strong>');
  s = s.replace(/\\mathit\s*\{([^{}]+)\}/g, '<em>$1</em>');
  s = s.replace(/\\dfrac/g, '\\frac');
  s = s.replace(/\\tfrac/g, '\\frac');
  var fracRegex = /\\frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}/;
  var guard = 0;
  while (fracRegex.test(s) && guard < 20) {
    s = s.replace(fracRegex, function (m, num, den) {
      return '<span class="ds-frac"><span class="ds-frac-num">' + num + '</span><span class="ds-frac-den">' + den + '</span></span>';
    });
    guard++;
  }
  s = s.replace(/\\sqrt\s*\[([^\]]+)\]\s*\{([^{}]+)\}/g, '<span class="ds-sqrt"><sup style="font-size:0.6em;">$1</sup>&radic;<span class="ds-sqrt-body">$2</span></span>');
  s = s.replace(/\\sqrt\s*\{([^{}]+)\}/g, '<span class="ds-sqrt">&radic;<span class="ds-sqrt-body">$1</span></span>');
  var greek = { alpha:'&alpha;', beta:'&beta;', gamma:'&gamma;', delta:'&delta;', theta:'&theta;', lambda:'&lambda;', mu:'&mu;', pi:'&pi;', sigma:'&sigma;', phi:'&phi;', psi:'&psi;', omega:'&omega;', Delta:'&Delta;', Sigma:'&Sigma;', Omega:'&Omega;' };
  Object.keys(greek).forEach(function (k) {
    s = s.replace(new RegExp('\\\\' + k + '(?![a-zA-Z])', 'g'), greek[k]);
  });
  var ops = { times:'&times;', div:'&divide;', pm:'&plusmn;', cdot:'&middot;', leq:'&le;', geq:'&ge;', neq:'&ne;', approx:'&asymp;', infty:'&infin;', sum:'&sum;', int:'&int;', to:'&rarr;', rightarrow:'&rarr;', in:'&isin;', forall:'&forall;', exists:'&exist;', therefore:'&there4;', degree:'&deg;' };
  Object.keys(ops).forEach(function (k) {
    s = s.replace(new RegExp('\\\\' + k + '(?![a-zA-Z])', 'g'), ops[k]);
  });
  var funcs = ['sin','cos','tan','log','ln','exp','lim','max','min'];
  funcs.forEach(function (f) {
    s = s.replace(new RegExp('\\\\' + f + '(?![a-zA-Z])', 'g'), f);
  });
  s = s.replace(/\\left/g, '').replace(/\\right/g, '');
  s = s.replace(/\^\{([^{}]+)\}/g, '<sup class="ds-sup">$1</sup>');
  s = s.replace(/\^([0-9a-zA-Z+\-])/g, '<sup class="ds-sup">$1</sup>');
  s = s.replace(/_\{([^{}]+)\}/g, '<sub class="ds-sub">$1</sub>');
  s = s.replace(/_([0-9a-zA-Z+\-])/g, '<sub class="ds-sub">$1</sub>');
  s = s.replace(/\\\\/g, '<br>');
  s = s.replace(/\\([a-zA-Z]+)/g, '$1');
  return s;
}
function formatLatex(input) {
  if (input == null) return "";
  var s = String(input);
  s = s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  s = s.replace(/\r\n/g, '\n').replace(/\n/g, '<br>');
  if (/\\[a-zA-Z]/.test(s) || /\^\{|_\{/.test(s)) s = parseLatex(s);
  return s;
}
function ensureStyles() {
  if (document.getElementById("ds-quiz-style")) return;
  var st = document.createElement("style");
  st.id = "ds-quiz-style";
  st.textContent =
    ".ds-frac{display:inline-flex;flex-direction:column;vertical-align:middle;text-align:center;margin:0 4px;line-height:1.15;}" +
    ".ds-frac-num{border-bottom:1.5px solid currentColor;padding:0 6px 2px;}" +
    ".ds-frac-den{padding:2px 6px 0;}" +
    ".ds-sqrt{white-space:nowrap;display:inline-block;}" +
    ".ds-sqrt-body{border-top:1.5px solid currentColor;padding:2px 4px 0;margin-left:-2px;}" +
    ".ds-sup{font-size:0.72em;vertical-align:super;line-height:0;}" +
    ".ds-sub{font-size:0.72em;vertical-align:sub;line-height:0;}";
  document.head.appendChild(st);
}

// ═══════════════════════════════════════════
// BEST SCORE STORAGE
// ═══════════════════════════════════════════
function getBestScore() {
  try {
    var raw = localStorage.getItem("diplomastudy_quiz_best");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) { return null; }
}
function saveBestScore(score, total) {
  try {
    var prev = getBestScore();
    if (!prev || (score / total) > (prev.score / prev.total)) {
      localStorage.setItem("diplomastudy_quiz_best", JSON.stringify({
        score: score, total: total, at: Date.now()
      }));
    }
  } catch (e) {}
}

// ═══════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════
var quizState = null;
var allMcqs = [];
var allSubjects = [];
var setupOptions = { count: 10, subjectId: "all" };

function escapeHtml(str) {
  if (str == null) return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

// ═══════════════════════════════════════════
// MAIN RENDER
// ═══════════════════════════════════════════
export async function renderQuiz() {
  ensureStyles();

  AppShell.updateHeader({
    title: "Quiz Mode",
    subtitle: "Test your knowledge",
    showBack: true,
    showSearch: false,
    showTheme: true,
    showSettings: false
  });

  var main = AppShell.getMainView();
  if (!main) return;

  main.innerHTML = '<div style="text-align:center;padding:60px 20px;"><div class="spinner"></div><p style="margin-top:12px;color:#84968B;font-size:13px;">Loading questions...</p></div>';

  // Load all MCQs
  allMcqs = [];
  allSubjects = [];
  try {
    allSubjects = await getSubjects();
    for (var i = 0; i < allSubjects.length; i++) {
      var sub = allSubjects[i];
      var chapters = await getChaptersBySubject(sub.id);
      for (var j = 0; j < chapters.length; j++) {
        var ch = chapters[j];
        var qs = await getQuestionsByChapter(ch.id, "mcq");
        for (var k = 0; k < qs.length; k++) {
          var q = qs[k];
          if (q.options && q.options.length > 0 && q.answer) {
            allMcqs.push({
              id: q.id,
              question: q.question,
              options: q.options,
              answer: q.answer,
              explanation: q.explanation || "",
              marks: q.marks || "",
              subjectId: sub.id,
              subjectName: sub.name,
              chapterName: ch.name,
              chapterNumber: ch.number
            });
          }
        }
      }
    }
  } catch (e) {}

  if (allMcqs.length === 0) {
    main.innerHTML = emptyState({
      icon: "\uD83C\uDFAF",
      title: "\u0995\u09CB\u09A8\u09CB \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8 \u09A8\u09C7\u0987",
      message: "Admin Panel \u09A5\u09C7\u0995\u09C7 MCQ \u09AF\u09CB\u0997 \u0995\u09B0\u09B2\u09C7 quiz \u0996\u09C7\u09B2\u09BE \u09AF\u09BE\u09AC\u09C7\u0964",
      actionFn: function () { window.location.hash = "#/home"; },
      actionLabel: "\uD83C\uDFE0 Home"
    });
    return;
  }

  renderSetup(main);
}

// ═══════════════════════════════════════════
// SETUP SCREEN
// ═══════════════════════════════════════════
function renderSetup(main) {
  var best = getBestScore();

  // Filter MCQs by selected subject
  var filtered = setupOptions.subjectId === "all"
    ? allMcqs
    : allMcqs.filter(function (q) { return q.subjectId === setupOptions.subjectId; });

  var available = filtered.length;
  var counts = [5, 10, 15, 20];
  // Show only counts <= available (plus always show available count if smaller)
  var shownCounts = counts.filter(function (c) { return c <= available; });
  if (shownCounts.length === 0 && available > 0) shownCounts = [available];
  if (available > 20 && shownCounts.indexOf(20) === -1) shownCounts.push(20);

  if (setupOptions.count > available) setupOptions.count = available;
  if (shownCounts.indexOf(setupOptions.count) === -1 && shownCounts.length > 0) {
    setupOptions.count = shownCounts[0];
  }

  var bestHtml = "";
  if (best) {
    var pct = Math.round((best.score / best.total) * 100);
    bestHtml = '<div style="display:flex;align-items:center;gap:12px;padding:14px;background:linear-gradient(135deg,#FEF3C7,#FDE68A);border-radius:14px;margin-bottom:20px;">' +
      '<div style="font-size:26px;">\uD83C\uDFC6</div>' +
      '<div style="flex:1;">' +
        '<div style="font-size:10.5px;font-weight:800;color:#92400E;text-transform:uppercase;letter-spacing:0.5px;">Best Score</div>' +
        '<div style="font-size:15px;font-weight:900;color:#78350F;margin-top:2px;">' + best.score + '/' + best.total + ' (' + pct + '%)</div>' +
      '</div>' +
    '</div>';
  }

  var countBtns = shownCounts.map(function (c) {
    var active = setupOptions.count === c;
    return '<button data-count="' + c + '" type="button" style="flex:1;min-width:70px;padding:14px 8px;border-radius:14px;border:1.5px solid ' + (active ? "#1C3E2C" : "#E1E8E1") + ';background:' + (active ? "#1C3E2C" : "#FFFFFF") + ';color:' + (active ? "#FFFFFF" : "#1C3E2C") + ';font-family:inherit;cursor:pointer;transition:all 0.2s;">' +
      '<div style="font-size:20px;font-weight:900;font-family:ui-monospace,monospace;">' + c + '</div>' +
      '<div style="font-size:10px;font-weight:800;margin-top:2px;opacity:0.75;">questions</div>' +
    '</button>';
  }).join("");

  var subjBtns = '<button data-subj="all" type="button" style="width:100%;display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:12px;border:1.5px solid ' + (setupOptions.subjectId === "all" ? "#1C3E2C" : "#E1E8E1") + ';background:' + (setupOptions.subjectId === "all" ? "#DCFCE7" : "#FFFFFF") + ';color:#1C3E2C;font-family:inherit;cursor:pointer;text-align:left;margin-bottom:8px;">' +
    '<div style="width:36px;height:36px;border-radius:11px;background:linear-gradient(135deg,#1C3E2C,#2A5540);color:#FFFFFF;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;">\uD83D\uDCDA</div>' +
    '<div style="flex:1;min-width:0;">' +
      '<div style="font-size:13.5px;font-weight:800;">All Subjects</div>' +
      '<div style="font-size:10.5px;color:#84968B;font-weight:600;margin-top:2px;">' + allMcqs.length + ' MCQs</div>' +
    '</div>' +
    (setupOptions.subjectId === "all" ? '<span style="color:#10B981;font-size:16px;font-weight:900;">\u2713</span>' : "") +
  '</button>' +
  allSubjects.map(function (sub) {
    var count = allMcqs.filter(function (q) { return q.subjectId === sub.id; }).length;
    if (count === 0) return "";
    var active = setupOptions.subjectId === sub.id;
    return '<button data-subj="' + sub.id + '" type="button" style="width:100%;display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:12px;border:1.5px solid ' + (active ? "#1C3E2C" : "#E1E8E1") + ';background:' + (active ? "#DCFCE7" : "#FFFFFF") + ';color:#1C3E2C;font-family:inherit;cursor:pointer;text-align:left;margin-bottom:8px;">' +
      '<div style="width:36px;height:36px;border-radius:11px;background:#F2F5F2;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;">' + (sub.icon || "\uD83D\uDCD8") + '</div>' +
      '<div style="flex:1;min-width:0;">' +
        '<div style="font-size:13.5px;font-weight:800;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + escapeHtml(sub.name) + '</div>' +
        '<div style="font-size:10.5px;color:#84968B;font-weight:600;margin-top:2px;">' + count + ' MCQs</div>' +
      '</div>' +
      (active ? '<span style="color:#10B981;font-size:16px;font-weight:900;">\u2713</span>' : "") +
    '</button>';
  }).join("");

  main.innerHTML =
    bestHtml +
    '<div style="margin-bottom:20px;">' +
      '<div style="font-size:12px;font-weight:800;color:#1C3E2C;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:10px;">How many questions?</div>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap;">' + countBtns + '</div>' +
    '</div>' +

    '<div style="margin-bottom:24px;">' +
      '<div style="font-size:12px;font-weight:800;color:#1C3E2C;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:10px;">Subject</div>' +
      subjBtns +
    '</div>' +

    '<button id="start-quiz" type="button" style="width:100%;padding:16px;background:linear-gradient(135deg,#1C3E2C,#2A5540);color:#FFFFFF;border:none;border-radius:16px;font-size:15px;font-weight:800;font-family:inherit;cursor:pointer;box-shadow:0 12px 28px -6px rgba(28,62,44,0.45);display:flex;align-items:center;justify-content:center;gap:10px;">' +
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>' +
      '<span>Start Quiz</span>' +
    '</button>' +

    '<div style="text-align:center;margin-top:14px;font-size:11.5px;color:#84968B;font-weight:600;">' +
      'Selected: ' + setupOptions.count + ' questions \u2022 ' + available + ' available' +
    '</div>' +

    '<div style="height:20px;"></div>';

  // Bind count buttons
  main.querySelectorAll("[data-count]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setupOptions.count = parseInt(btn.getAttribute("data-count"), 10);
      renderSetup(main);
    });
  });

  // Bind subject buttons
  main.querySelectorAll("[data-subj]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setupOptions.subjectId = btn.getAttribute("data-subj");
      renderSetup(main);
    });
  });

  // Start
  main.querySelector("#start-quiz").addEventListener("click", function () {
    startQuiz(main);
  });
}

// ═══════════════════════════════════════════
// START QUIZ
// ═══════════════════════════════════════════
function startQuiz(main) {
  var filtered = setupOptions.subjectId === "all"
    ? allMcqs
    : allMcqs.filter(function (q) { return q.subjectId === setupOptions.subjectId; });

  var shuffled = filtered.slice();
  // Fisher-Yates
  for (var i = shuffled.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = shuffled[i]; shuffled[i] = shuffled[j]; shuffled[j] = tmp;
  }
  var take = Math.min(setupOptions.count, shuffled.length);

  var questions = shuffled.slice(0, take);
  // Shuffle each question's options too
  questions = questions.map(function (q) {
    var opts = q.options.slice();
    for (var i = opts.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = opts[i]; opts[i] = opts[j]; opts[j] = tmp;
    }
    return Object.assign({}, q, { options: opts });
  });

  quizState = {
    questions: questions,
    current: 0,
    answers: new Array(take), // { selected, correct, isCorrect } | null
    total: take
  };

  renderQuestion(main);
}

// ═══════════════════════════════════════════
// QUESTION SCREEN
// ═══════════════════════════════════════════
function renderQuestion(main) {
  var s = quizState;
  if (!s) return;

  var q = s.questions[s.current];
  var currentAnswer = s.answers[s.current];
  var answered = !!currentAnswer;

  // Count correct so far
  var correctSoFar = 0;
  for (var i = 0; i < s.answers.length; i++) {
    if (s.answers[i] && s.answers[i].isCorrect) correctSoFar++;
  }

  var progressPct = Math.round(((s.current) / s.total) * 100);

  // Progress dots
  var dotsHtml = '<div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:14px;">' +
    s.questions.map(function (_, i) {
      var a = s.answers[i];
      var bg, fg;
      if (a) {
        if (a.isCorrect) { bg = "#10B981"; fg = "#FFFFFF"; }
        else { bg = "#DC2626"; fg = "#FFFFFF"; }
      } else if (i === s.current) {
        bg = "#1C3E2C"; fg = "#FFFFFF";
      } else {
        bg = "#E8EFE8"; fg = "#84968B";
      }
      return '<div style="flex:1;min-width:16px;max-width:32px;height:6px;border-radius:3px;background:' + bg + ';"></div>';
    }).join("") +
  '</div>';

  // Options HTML
  var optionsHtml = q.options.map(function (opt, i) {
    var letter = String.fromCharCode(65 + i);
    var isCorrect = opt === q.answer;
    var isSelected = currentAnswer && currentAnswer.selected === opt;

    var bg = "#FFFFFF";
    var borderColor = "#E1E8E1";
    var letterBg = "#F2F5F2";
    var letterFg = "#57675D";
    var trailing = "";

    if (answered) {
      if (isCorrect) {
        bg = "linear-gradient(135deg,#DCFCE7,#BBF7D0)";
        borderColor = "#10B981";
        letterBg = "#10B981";
        letterFg = "#FFFFFF";
        trailing = '<span style="color:#10B981;font-size:18px;font-weight:900;">\u2713</span>';
      } else if (isSelected) {
        bg = "linear-gradient(135deg,#FEE2E2,#FECACA)";
        borderColor = "#DC2626";
        letterBg = "#DC2626";
        letterFg = "#FFFFFF";
        trailing = '<span style="color:#DC2626;font-size:18px;font-weight:900;">\u2717</span>';
      }
    }

    return '<button class="opt-btn" data-opt="' + escapeHtml(opt) + '" type="button" ' + (answered ? "disabled" : "") + ' style="display:flex;align-items:center;gap:14px;padding:16px;background:' + bg + ';border:1.5px solid ' + borderColor + ';border-radius:14px;cursor:' + (answered ? "default" : "pointer") + ';font-family:inherit;text-align:left;width:100%;transition:all 0.2s ease;">' +
      '<div style="width:34px;height:34px;border-radius:10px;background:' + letterBg + ';color:' + letterFg + ';display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px;flex-shrink:0;font-family:ui-monospace,monospace;">' + letter + '</div>' +
      '<span style="flex:1;font-size:14px;font-weight:600;color:#1C3E2C;line-height:1.5;">' + formatLatex(opt) + '</span>' +
      trailing +
    '</button>';
  }).join("");

  // Explanation (only after answer)
  var explanationHtml = "";
  if (answered && q.explanation) {
    explanationHtml = '<div style="margin-top:16px;padding:14px 16px;background:linear-gradient(135deg,#EFF6FF,#DBEAFE);border:1.5px solid #BFDBFE;border-radius:14px;">' +
      '<div style="font-size:10.5px;font-weight:800;color:#1E40AF;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:6px;">\uD83D\uDCA1 \u09AC\u09CD\u09AF\u09BE\u0996\u09CD\u09AF\u09BE</div>' +
      '<div style="font-size:13px;color:#1E3A8A;line-height:1.7;font-weight:500;">' + formatLatex(q.explanation) + '</div>' +
    '</div>';
  }

  // Navigation buttons
  var navHtml = "";
  if (answered) {
    if (s.current < s.total - 1) {
      navHtml = '<button id="next-btn" type="button" style="width:100%;margin-top:16px;padding:15px;background:linear-gradient(135deg,#1C3E2C,#2A5540);color:#FFFFFF;border:none;border-radius:14px;font-size:14px;font-weight:800;font-family:inherit;cursor:pointer;box-shadow:0 8px 20px -4px rgba(28,62,44,0.4);">Next Question \u2192</button>';
    } else {
      navHtml = '<button id="finish-btn" type="button" style="width:100%;margin-top:16px;padding:15px;background:linear-gradient(135deg,#10B981,#059669);color:#FFFFFF;border:none;border-radius:14px;font-size:14px;font-weight:800;font-family:inherit;cursor:pointer;box-shadow:0 8px 20px -4px rgba(16,185,129,0.4);">See Results \u2192</button>';
    }
  } else {
    navHtml = '<div style="display:flex;gap:10px;margin-top:16px;">' +
      (s.current > 0 ? '<button id="prev-btn" type="button" style="flex:1;padding:14px;background:#FFFFFF;color:#1C3E2C;border:1.5px solid #E1E8E1;border-radius:14px;font-size:13.5px;font-weight:800;font-family:inherit;cursor:pointer;">\u2190 Previous</button>' : "") +
      (s.current < s.total - 1 ? '<button id="skip-btn" type="button" style="flex:1;padding:14px;background:#FFFFFF;color:#57675D;border:1.5px solid #E1E8E1;border-radius:14px;font-size:13.5px;font-weight:800;font-family:inherit;cursor:pointer;">Skip \u2192</button>' : "") +
    '</div>';
  }

  main.innerHTML =
    '<div style="margin-bottom:14px;">' +
      '<div style="display:flex;justify-content:space-between;font-size:12px;font-weight:800;color:#57675D;margin-bottom:8px;">' +
        '<span>Question ' + (s.current + 1) + ' / ' + s.total + '</span>' +
        '<span>\u2705 ' + correctSoFar + ' correct</span>' +
      '</div>' +
      '<div style="height:6px;background:#E8EFE8;border-radius:999px;overflow:hidden;">' +
        '<div style="height:100%;width:' + progressPct + '%;background:linear-gradient(90deg,#10B981,#059669);border-radius:999px;transition:width 0.4s;"></div>' +
      '</div>' +
    '</div>' +

    dotsHtml +

    '<div style="padding:18px;background:linear-gradient(135deg,rgba(28,62,44,0.06),transparent);border-left:4px solid #1C3E2C;border-radius:16px;margin-bottom:20px;">' +
      '<div style="font-size:11px;font-weight:800;color:#84968B;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:8px;">' + escapeHtml(q.subjectName) + ' \u2022 Ch.' + q.chapterNumber + ' \u2022 \u0985\u09A4\u09BF \u09B8\u0982\u0995\u09CD\u09B7\u09BF\u09AA\u09CD\u09A4</div>' +
      '<div style="font-size:15.5px;font-weight:700;color:#1C3E2C;line-height:1.55;">' + formatLatex(q.question) + '</div>' +
    '</div>' +

    '<div style="display:flex;flex-direction:column;gap:10px;">' + optionsHtml + '</div>' +

    explanationHtml +
    navHtml +

    '<button id="quit-quiz" type="button" style="width:100%;margin-top:14px;padding:11px;background:transparent;border:none;color:#84968B;font-size:12px;font-weight:700;font-family:inherit;cursor:pointer;">\u23F9 Quit Quiz</button>' +

    '<div style="height:20px;"></div>';

  // ── BIND: Option click ──
  main.querySelectorAll(".opt-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (s.answers[s.current]) return; // already answered
      var selected = btn.getAttribute("data-opt");
      var isCorrect = selected === q.answer;
      s.answers[s.current] = { selected: selected, correct: q.answer, isCorrect: isCorrect };
      // Vibrate feedback
      try { if (navigator.vibrate) navigator.vibrate(isCorrect ? 30 : [40, 40, 40]); } catch (e) {}
      renderQuestion(main);
    });
  });

  // ── BIND: Next / Finish ──
  var nextBtn = main.querySelector("#next-btn");
  if (nextBtn) nextBtn.addEventListener("click", function () { s.current++; renderQuestion(main); });

  var finishBtn = main.querySelector("#finish-btn");
  if (finishBtn) finishBtn.addEventListener("click", function () { renderResult(main); });

  // ── BIND: Prev / Skip ──
  var prevBtn = main.querySelector("#prev-btn");
  if (prevBtn) prevBtn.addEventListener("click", function () { s.current--; renderQuestion(main); });

  var skipBtn = main.querySelector("#skip-btn");
  if (skipBtn) skipBtn.addEventListener("click", function () { s.current++; renderQuestion(main); });

  // ── BIND: Quit ──
  var quitBtn = main.querySelector("#quit-quiz");
  if (quitBtn) quitBtn.addEventListener("click", function () {
    if (confirm("Quit quiz? Progress will be lost.")) {
      quizState = null;
      window.location.hash = "#/home";
    }
  });

  // Scroll to top on each new question
  try { window.scrollTo({ top: 0, behavior: "instant" }); } catch (e) {}
}

// ═══════════════════════════════════════════
// RESULT SCREEN
// ═══════════════════════════════════════════
function renderResult(main) {
  var s = quizState;
  if (!s) return;

  // Count correct (skip unanswered)
  var correct = 0, wrong = 0, skipped = 0;
  var bySubject = {};
  for (var i = 0; i < s.questions.length; i++) {
    var q = s.questions[i];
    var a = s.answers[i];
    var subName = q.subjectName || "Unknown";
    if (!bySubject[subName]) bySubject[subName] = { correct: 0, total: 0 };
    bySubject[subName].total++;
    if (!a) { skipped++; }
    else if (a.isCorrect) { correct++; bySubject[subName].correct++; }
    else { wrong++; }
  }

  var attempted = correct + wrong;
  var percent = attempted > 0 ? Math.round((correct / s.total) * 100) : 0;
  var emoji = percent >= 80 ? "\uD83C\uDFC6" : percent >= 60 ? "\uD83C\uDFAF" : percent >= 40 ? "\uD83D\uDCAA" : "\uD83D\uDCDA";
  var msg = percent >= 80 ? "\u0985\u09B8\u09BE\u09A7\u09BE\u09B0\u09A3!" : percent >= 60 ? "\u09AD\u09BE\u09B2\u09CB \u0995\u09B0\u09C7\u099B!" : percent >= 40 ? "\u0986\u09B0\u09CB practice \u09A6\u09B0\u0995\u09BE\u09B0" : "\u099A\u09BE\u09B2\u09BF\u09AF\u09BC\u09C7 \u09AF\u09BE\u0993!";

  // Save best score
  saveBestScore(correct, s.total);
  var best = getBestScore();
  var isNewBest = best && best.score === correct && best.total === s.total;

  // Subject breakdown
  var breakdownHtml = Object.keys(bySubject).map(function (name) {
    var d = bySubject[name];
    var pct = Math.round((d.correct / d.total) * 100);
    var barColor = pct >= 80 ? "#10B981" : pct >= 60 ? "#F59E0B" : "#DC2626";
    return '<div style="padding:12px 14px;background:#F8FBF8;border-radius:12px;margin-bottom:8px;">' +
      '<div style="display:flex;justify-content:space-between;margin-bottom:6px;">' +
        '<span style="font-size:12.5px;font-weight:800;color:#1C3E2C;">' + escapeHtml(name) + '</span>' +
        '<span style="font-size:12px;font-weight:800;color:#57675D;">' + d.correct + '/' + d.total + '</span>' +
      '</div>' +
      '<div style="height:5px;background:#E8EFE8;border-radius:999px;overflow:hidden;">' +
        '<div style="height:100%;width:' + pct + '%;background:' + barColor + ';border-radius:999px;"></div>' +
      '</div>' +
    '</div>';
  }).join("");

  // Review list
  var reviewHtml = s.questions.map(function (q, i) {
    var a = s.answers[i];
    var status = !a ? "skip" : (a.isCorrect ? "correct" : "wrong");
    var borderColor = status === "correct" ? "#10B981" : status === "wrong" ? "#DC2626" : "#84968B";
    var icon = status === "correct" ? "\u2705" : status === "wrong" ? "\u274C" : "\u23ED\uFE0F";

    return '<div style="padding:14px;background:#FFFFFF;border:1.5px solid ' + borderColor + ';border-radius:14px;margin-bottom:10px;">' +
      '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">' +
        '<span style="font-size:16px;">' + icon + '</span>' +
        '<span style="font-size:11px;font-weight:800;color:#84968B;">Q' + (i + 1) + '</span>' +
      '</div>' +
      '<div style="font-size:13px;font-weight:700;color:#1C3E2C;margin-bottom:10px;line-height:1.5;">' + formatLatex(q.question) + '</div>' +
      (status === "wrong" ? '<div style="font-size:12px;color:#57675D;line-height:1.6;margin-bottom:4px;">Your answer: <span style="color:#DC2626;font-weight:700;">' + formatLatex(a.selected) + '</span></div>' : "") +
      '<div style="font-size:12px;color:#57675D;line-height:1.6;">Correct: <span style="color:#10B981;font-weight:700;">' + formatLatex(q.answer) + '</span></div>' +
      (q.explanation ? '<div style="margin-top:8px;padding:8px 10px;background:#F8FBF8;border-left:2px solid #1C3E2C;border-radius:6px;font-size:11.5px;color:#57675D;line-height:1.6;">' + formatLatex(q.explanation) + '</div>' : "") +
    '</div>';
  }).join("");

  main.innerHTML =
    '<div style="text-align:center;padding:32px 20px;">' +
      '<div style="font-size:72px;margin-bottom:12px;">' + emoji + '</div>' +
      '<h2 style="font-size:22px;font-weight:900;color:#1C3E2C;margin:0 0 6px;">' + msg + '</h2>' +
      '<p style="font-size:13.5px;color:#84968B;font-weight:600;margin:0 0 20px;">' + s.total + '\u099F\u09BF\u09B0 \u09AE\u09A7\u09CD\u09AF\u09C7 ' + correct + '\u099F\u09BF \u09B8\u09A0\u09BF\u0995</p>' +

      '<div style="display:inline-block;padding:16px 28px;background:linear-gradient(135deg,#DCFCE7,#BBF7D0);border-radius:20px;margin-bottom:8px;">' +
        '<div style="font-size:42px;font-weight:900;color:#065F46;line-height:1;">' + percent + '%</div>' +
      '</div>' +

      (isNewBest ? '<div style="font-size:12px;font-weight:800;color:#92400E;background:#FEF3C7;display:inline-block;padding:5px 12px;border-radius:999px;margin-top:8px;">\uD83C\uDF89 New Best!</div>' : "") +
    '</div>' +

    '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:24px;">' +
      '<div style="padding:12px;background:#DCFCE7;border-radius:14px;text-align:center;">' +
        '<div style="font-size:22px;font-weight:900;color:#065F46;line-height:1;">' + correct + '</div>' +
        '<div style="font-size:10px;font-weight:800;color:#065F46;text-transform:uppercase;letter-spacing:0.5px;margin-top:4px;">Correct</div>' +
      '</div>' +
      '<div style="padding:12px;background:#FEE2E2;border-radius:14px;text-align:center;">' +
        '<div style="font-size:22px;font-weight:900;color:#991B1B;line-height:1;">' + wrong + '</div>' +
        '<div style="font-size:10px;font-weight:800;color:#991B1B;text-transform:uppercase;letter-spacing:0.5px;margin-top:4px;">Wrong</div>' +
      '</div>' +
      '<div style="padding:12px;background:#FEF3C7;border-radius:14px;text-align:center;">' +
        '<div style="font-size:22px;font-weight:900;color:#92400E;line-height:1;">' + skipped + '</div>' +
        '<div style="font-size:10px;font-weight:800;color:#92400E;text-transform:uppercase;letter-spacing:0.5px;margin-top:4px;">Skipped</div>' +
      '</div>' +
    '</div>' +

    (breakdownHtml ? '<div style="margin-bottom:24px;"><div style="font-size:12px;font-weight:800;color:#1C3E2C;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:10px;">\uD83D\uDCCA By Subject</div>' + breakdownHtml + '</div>' : "") +

    '<div style="display:flex;flex-direction:column;gap:10px;margin-bottom:24px;">' +
      '<button id="retry-quiz" type="button" style="padding:15px;background:linear-gradient(135deg,#1C3E2C,#2A5540);color:#FFFFFF;border:none;border-radius:14px;font-size:14px;font-weight:800;font-family:inherit;cursor:pointer;box-shadow:0 8px 20px -4px rgba(28,62,44,0.4);">' +
        '\uD83D\uDD04 Play Again' +
      '</button>' +
      '<button id="new-setup" type="button" style="padding:14px;background:#FFFFFF;color:#1C3E2C;border:1.5px solid #E1E8E1;border-radius:14px;font-size:13.5px;font-weight:800;font-family:inherit;cursor:pointer;">' +
        '\u2699\uFE0F Change Settings' +
      '</button>' +
      '<button id="go-home" type="button" style="padding:14px;background:#FFFFFF;color:#57675D;border:1.5px solid #E1E8E1;border-radius:14px;font-size:13.5px;font-weight:800;font-family:inherit;cursor:pointer;">' +
        '\uD83C\uDFE0 Home' +
      '</button>' +
    '</div>' +

    '<div style="font-size:12px;font-weight:800;color:#1C3E2C;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px;">\uD83D\uDCDD Review Answers</div>' +
    reviewHtml +

    '<div style="height:20px;"></div>';

  main.querySelector("#retry-quiz")?.addEventListener("click", function () {
    quizState = null;
    renderQuiz();
  });
  main.querySelector("#new-setup")?.addEventListener("click", function () {
    quizState = null;
    renderSetup(main);
  });
  main.querySelector("#go-home")?.addEventListener("click", function () {
    quizState = null;
    window.location.hash = "#/home";
  });

  try { window.scrollTo({ top: 0, behavior: "instant" }); } catch (e) {}
}