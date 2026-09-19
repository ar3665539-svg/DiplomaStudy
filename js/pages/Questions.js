/**
 * Questions v4 - Live suggestions dropdown + LaTeX + search
 */

import { AppShell } from "../components/AppShell.js";
import { getSubjects, getChaptersBySubject, getQuestionsByChapter } from "../services/api.js";
import { listSkeleton } from "../utils/skeleton.js";
import { errorState, emptyState } from "../utils/errorState.js";

// ═══════════════════════════════════════════
// LATEX PARSER
// ═══════════════════════════════════════════
function parseLatex(input) {
  if (!input) return "";
  var s = String(input);
  s = s.replace(/\\text\s*\{([^{}]+)\}/g, '$1');
  s = s.replace(/\\mathrm\s*\{([^{}]+)\}/g, '$1');
  s = s.replace(/\\mathbf\s*\{([^{}]+)\}/g, '<strong>$1</strong>');
  s = s.replace(/\\mathit\s*\{([^{}]+)\}/g, '<em>$1</em>');
  s = s.replace(/\\operatorname\s*\{([^{}]+)\}/g, '$1');
  s = s.replace(/\\dfrac/g, '\\frac');
  s = s.replace(/\\tfrac/g, '\\frac');
  var fracRegex = /\\frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}/;
  var guard = 0;
  while (fracRegex.test(s) && guard < 20) {
    s = s.replace(fracRegex, function (m, num, den) {
      return '<span class="ds-frac"><span class="ds-frac-num">' + parseLatexInline(num) + '</span><span class="ds-frac-den">' + parseLatexInline(den) + '</span></span>';
    });
    guard++;
  }
  s = s.replace(/\\sqrt\s*\[([^\]]+)\]\s*\{([^{}]+)\}/g, function (m, n, x) {
    return '<span class="ds-sqrt"><sup style="font-size:0.6em;">' + n + '</sup>&radic;<span class="ds-sqrt-body">' + x + '</span></span>';
  });
  s = s.replace(/\\sqrt\s*\{([^{}]+)\}/g, '<span class="ds-sqrt">&radic;<span class="ds-sqrt-body">$1</span></span>');
  var greek = { alpha:'&alpha;', beta:'&beta;', gamma:'&gamma;', delta:'&delta;', epsilon:'&epsilon;', varepsilon:'&epsilon;', zeta:'&zeta;', eta:'&eta;', theta:'&theta;', vartheta:'&theta;', iota:'&iota;', kappa:'&kappa;', lambda:'&lambda;', mu:'&mu;', nu:'&nu;', xi:'&xi;', pi:'&pi;', varpi:'&pi;', rho:'&rho;', sigma:'&sigma;', tau:'&tau;', upsilon:'&upsilon;', phi:'&phi;', varphi:'&phi;', chi:'&chi;', psi:'&psi;', omega:'&omega;', Gamma:'&Gamma;', Delta:'&Delta;', Theta:'&Theta;', Lambda:'&Lambda;', Xi:'&Xi;', Pi:'&Pi;', Sigma:'&Sigma;', Upsilon:'&Upsilon;', Phi:'&Phi;', Psi:'&Psi;', Omega:'&Omega;' };
  Object.keys(greek).forEach(function (k) {
    s = s.replace(new RegExp('\\\\' + k + '(?![a-zA-Z])', 'g'), greek[k]);
  });
  var ops = { times:'&times;', div:'&divide;', pm:'&plusmn;', mp:'&#8723;', cdot:'&middot;', ast:'&#8727;', leq:'&le;', geq:'&ge;', neq:'&ne;', approx:'&asymp;', equiv:'&equiv;', propto:'&prop;', infty:'&infin;', partial:'&part;', nabla:'&nabla;', sum:'&sum;', prod:'&prod;', int:'&int;', oint:'&#8750;', to:'&rarr;', rightarrow:'&rarr;', leftarrow:'&larr;', leftrightarrow:'&harr;', Rightarrow:'&rArr;', Leftarrow:'&lArr;', in:'&isin;', notin:'&notin;', subset:'&sub;', supset:'&sup;', cup:'&cup;', cap:'&cap;', emptyset:'&empty;', forall:'&forall;', exists:'&exist;', therefore:'&there4;', because:'&#8757;', circ:'&#8728;', bullet:'&bull;', degree:'&deg;', angle:'&ang;', perp:'&perp;', parallel:'&#8741;', simeq:'&#8771;', sim:'&#8764;', ll:'&laquo;', gg:'&raquo;', le:'&le;', ge:'&ge;', ne:'&ne;', doteq:'&#8784;' };
  Object.keys(ops).forEach(function (k) {
    s = s.replace(new RegExp('\\\\' + k + '(?![a-zA-Z])', 'g'), ops[k]);
  });
  var funcs = ['sin','cos','tan','cot','sec','csc','log','ln','exp','lim','max','min','arg','det','dim','mod','bmod','arcsin','arccos','arctan','sinh','cosh','tanh'];
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
  s = s.replace(/\\\{/g, '{').replace(/\\\}/g, '}');
  return s;
}
function parseLatexInline(input) {
  if (!input) return "";
  var s = String(input);
  s = s.replace(/\\alpha/g, '&alpha;').replace(/\\beta/g, '&beta;').replace(/\\gamma/g, '&gamma;').replace(/\\delta/g, '&delta;').replace(/\\pi/g, '&pi;').replace(/\\theta/g, '&theta;').replace(/\\lambda/g, '&lambda;').replace(/\\mu/g, '&mu;').replace(/\\omega/g, '&omega;');
  s = s.replace(/\^\{([^{}]+)\}/g, '<sup class="ds-sup">$1</sup>');
  s = s.replace(/\^([0-9a-zA-Z+\-])/g, '<sup class="ds-sup">$1</sup>');
  s = s.replace(/_\{([^{}]+)\}/g, '<sub class="ds-sub">$1</sub>');
  s = s.replace(/_([0-9a-zA-Z+\-])/g, '<sub class="ds-sub">$1</sub>');
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
function ensureLatexStyles() {
  if (document.getElementById("ds-latex-style")) return;
  var style = document.createElement("style");
  style.id = "ds-latex-style";
  style.textContent =
    ".ds-frac{display:inline-flex;flex-direction:column;vertical-align:middle;text-align:center;margin:0 5px;line-height:1.15;}" +
    ".ds-frac-num{border-bottom:1.5px solid currentColor;padding:0 8px 3px;}" +
    ".ds-frac-den{padding:3px 8px 0;}" +
    ".ds-sqrt{white-space:nowrap;display:inline-block;}" +
    ".ds-sqrt-body{border-top:1.5px solid currentColor;padding:3px 5px 0;margin-left:-2px;}" +
    ".ds-sup{font-size:0.72em;vertical-align:super;line-height:0;}" +
    ".ds-sub{font-size:0.72em;vertical-align:sub;line-height:0;}";
  document.head.appendChild(style);
}

// ═══════════════════════════════════════════
// SMART SEARCH HELPERS
// ═══════════════════════════════════════════
function norm(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[·•⋅×∗]/g, "*")
    .replace(/[−–—]/g, "-")
    .replace(/⁄/g, "/");
}
function smartMatch(text, query) {
  if (!text || !query) return false;
  var t = String(text).toLowerCase();
  var q = String(query).toLowerCase();
  var tc = norm(t);
  var qc = norm(q);
  if (t.indexOf(q) !== -1) return true;
  if (qc && tc.indexOf(qc) !== -1) return true;
  var words = q.split(/\s+/).filter(function (w) { return w.length > 0; });
  if (words.length > 1) {
    return words.every(function (w) { return tc.indexOf(norm(w)) !== -1; });
  }
  return false;
}

// ═══════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════
export async function renderQuestions(params = {}) {
  ensureLatexStyles();
  const MY_HASH = "#/questions";

  AppShell.updateHeader({
    title: "Questions",
    subtitle: "All questions",
    showBack: true,
    showSearch: true,
    showTheme: true,
    showSettings: false,
    expectedHash: MY_HASH
  });

  const main = AppShell.getMainView();
  if (!main) return;

  main.innerHTML = listSkeleton(5, "140px");

  const urlParams = new URLSearchParams(window.location.hash.split("?")[1] || "");
  const filterType = urlParams.get("type") || "all";

  let allQuestions = [];
  let loadError = null;

  try {
    const subjects = await getSubjects();
    const subjectChapterSets = await Promise.all(
      subjects.map(async function (sub) {
        const chapters = await getChaptersBySubject(sub.id).catch(function () { return []; });
        return { sub, chapters };
      })
    );

    const chapterResults = await Promise.all(
      subjectChapterSets.flatMap(function ({ sub, chapters }) {
        return chapters.map(async function (ch) {
          const qs = await getQuestionsByChapter(ch.id).catch(function () { return []; });
          return qs.map(function (q) {
            return {
              ...q,
              subjectName: sub.name,
              chapterName: ch.name,
              chapterNumber: ch.number,
              subjectId: sub.id
            };
          });
        });
      })
    );

    chapterResults.forEach(function (list) {
      if (Array.isArray(list)) allQuestions.push(...list);
    });
  } catch (e) { loadError = e; }

  if ((window.location.hash || "").split("?")[0] !== MY_HASH) return;

  if (allQuestions.length === 0 && loadError) {
    main.innerHTML = errorState({ type: "server", message: loadError.message, retryFn: () => renderQuestions(params) });
    return;
  }

  const typeEmoji = { creative: "📝", short: "📄", mcq: "⚡" };
  const typeLabel = { creative: "রচনামূলক", short: "সংক্ষিপ্ত", mcq: "অতি সংক্ষিপ্ত" };

  // ── Build suggestions index from existing questions only ──
  var suggestions = [];
  allQuestions.forEach(function (q) {
    var qText = (q.question || "").replace(/\s+/g, " ").trim();
    if (qText) {
      var short = qText.length > 80 ? qText.substring(0, 80) + "..." : qText;
      suggestions.push({
        label: qText,
        display: short,
        sub: (q.subjectName || "") + " • Ch." + q.chapterNumber + " • " + (typeLabel[q.type] || q.type),
        kind: q.type || "question",
        id: q.id
      });
    }
  });

  function findSuggestions(query) {
    var q = (query || "").trim();
    if (!q || q.length < 1) return [];
    var seen = {};
    var out = [];
    for (var i = 0; i < suggestions.length; i++) {
      var s = suggestions[i];
      if (smartMatch(s.label, q)) {
        var key = s.label;
        if (!seen[key]) {
          seen[key] = true;
          out.push(s);
          if (out.length >= 8) break;
        }
      }
    }
    return out;
  }

  function renderList(type, query) {
    var q = (query || "").trim();
    var filtered = allQuestions;
    if (type !== "all") filtered = filtered.filter(function (x) { return x.type === type; });
    if (q) {
      filtered = filtered.filter(function (x) {
        return smartMatch(x.question, q) ||
               smartMatch(x.answer, q) ||
               smartMatch(x.subjectName, q) ||
               smartMatch(x.chapterName, q) ||
               (Array.isArray(x.options) && x.options.some(function (o) { return smartMatch(o, q); }));
      });
    }

    if (filtered.length === 0) {
      return '<div style="text-align:center;padding:60px 20px;">' +
        '<div style="font-size:56px;margin-bottom:12px;">🔍</div>' +
        '<div style="font-size:14px;font-weight:800;color:#1C3E2C;">কিছু পাওয়া যায়নি</div>' +
        '<div style="font-size:12px;color:#84968B;margin-top:6px;">অন্য কিছু দিয়ে খুঁজুন</div>' +
      '</div>';
    }

    return '<div style="display:flex;flex-direction:column;gap:12px;">' +
      filtered.slice(0, 80).map(function (q) {
        var optionsHtml = "";
        if (q.options && q.options.length > 0) {
          optionsHtml = '<div style="display:flex;flex-direction:column;gap:6px;">' +
            q.options.map(function (opt, i) {
              var letter = String.fromCharCode(65 + i);
              var isCorrect = opt === q.answer;
              return '<div style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:' + (isCorrect ? "#DCFCE7" : "#F8FBF8") + ';border-radius:8px;font-size:12.5px;' + (isCorrect ? "font-weight:700;color:#065F46;" : "color:#57675D;") + '">' +
                '<span style="font-weight:800;font-family:ui-monospace,monospace;font-size:11px;">' + letter + '.</span>' +
                '<span style="flex:1;line-height:1.5;">' + formatLatex(opt) + '</span>' +
              '</div>';
            }).join("") +
          '</div>';
        } else {
          optionsHtml = '<div style="font-size:13px;color:#1C3E2C;line-height:1.75;padding:10px 12px;background:#F8FBF8;border-radius:8px;border-left:3px solid #1C3E2C;">' + formatLatex(q.answer || "") + '</div>';
        }
        return '<div style="padding:16px;background:#FFFFFF;border:1.5px solid #E1E8E1;border-radius:16px;">' +
          '<div style="display:flex;align-items:center;gap:6px;margin-bottom:10px;flex-wrap:wrap;">' +
            '<span style="font-size:10px;font-weight:800;color:#065F46;background:#DCFCE7;padding:3px 8px;border-radius:6px;">' + (typeEmoji[q.type] || "❓") + ' ' + (typeLabel[q.type] || q.type) + '</span>' +
            (q.marks ? '<span style="font-size:10px;font-weight:800;color:#92400E;background:#FEF3C7;padding:3px 8px;border-radius:6px;">🎯 ' + escapeHtml(q.marks) + '</span>' : "") +
            '<span style="font-size:10.5px;color:#84968B;font-weight:600;">' + escapeHtml(q.subjectName || "") + ' • Ch.' + q.chapterNumber + '</span>' +
          '</div>' +
          '<div style="font-size:14px;font-weight:700;color:#1C3E2C;line-height:1.55;margin-bottom:12px;">' + formatLatex(q.question || "") + '</div>' +
          optionsHtml +
        '</div>';
      }).join("") +
    '</div>' +
    (filtered.length > 80 ? '<div style="text-align:center;padding:16px;color:#84968B;font-size:12px;font-weight:600;">প্রথম ৮০টি দেখানো হচ্ছে</div>' : "");
  }

  var currentType = filterType;
  var currentQuery = "";

  function renderChips() {
    return ["all", "creative", "short", "mcq"].map(function (t) {
      var isActive = t === currentType;
      var count = t === "all" ? allQuestions.length : allQuestions.filter(function (x) { return x.type === t; }).length;
      var label = t === "all" ? "📋 সব" : (typeEmoji[t] + " " + typeLabel[t]);
      return '<button class="q-chip' + (isActive ? ' active' : '') + '" data-tab="' + t + '" type="button" style="flex:0 0 auto;padding:9px 15px;background:' + (isActive ? "linear-gradient(135deg,#1C3E2C,#2A5540)" : "#FFFFFF") + ';color:' + (isActive ? "#FFFFFF" : "#57675D") + ';border:1.5px solid ' + (isActive ? "#1C3E2C" : "#E1E8E1") + ';border-radius:999px;font-size:12.5px;font-weight:700;font-family:inherit;cursor:pointer;white-space:nowrap;">' +
        label +
        '<span style="margin-left:6px;font-size:10px;opacity:0.8;">' + count + '</span>' +
      '</button>';
    }).join("");
  }

  main.innerHTML =
    '<div style="position:relative;margin-bottom:14px;">' +

      '<div style="display:flex;align-items:center;gap:10px;padding:12px 16px;background:#FFFFFF;border:1.5px solid #E1E8E1;border-radius:16px;box-shadow:0 4px 12px rgba(28,62,44,0.05);">' +
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#84968B" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>' +
        '<input type="text" id="questions-search" placeholder="প্রশ্ন, উত্তর, বিষয় খুঁজুন..." autocomplete="off" style="flex:1;background:transparent;border:none;outline:none;font-size:14px;font-weight:600;color:#1C3E2C;font-family:inherit;" />' +
        '<button id="questions-search-clear" style="display:none;width:26px;height:26px;border-radius:50%;background:#F2F5F2;border:none;color:#57675D;cursor:pointer;font-size:12px;font-family:inherit;">✕</button>' +
      '</div>' +

      '<div id="questions-suggestions" style="display:none;position:absolute;left:0;right:0;top:calc(100% + 6px);background:#FFFFFF;border:1.5px solid #E1E8E1;border-radius:14px;box-shadow:0 12px 30px rgba(28,62,44,0.12);max-height:320px;overflow-y:auto;z-index:20;"></div>' +

    '</div>' +
    '<div id="questions-chips" style="display:flex;gap:8px;overflow-x:auto;padding:2px 0 12px;margin-bottom:8px;scrollbar-width:none;">' + renderChips() + '</div>' +
    '<div id="questions-results">' + renderList(currentType, "") + '</div>' +
    '<div style="height:20px;"></div>';

  var input = main.querySelector("#questions-search");
  var clearBtn = main.querySelector("#questions-search-clear");
  var suggEl = main.querySelector("#questions-suggestions");
  var chipsEl = main.querySelector("#questions-chips");
  var resultsEl = main.querySelector("#questions-results");
  var debounceTimer = null;

  function escapeAttr(s) {
    if (s == null) return "";
    return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function renderSuggestions() {
    var v = input.value.trim();
    if (!v) {
      suggEl.style.display = "none";
      suggEl.innerHTML = "";
      return;
    }
    var list = findSuggestions(v);
    if (list.length === 0) {
      suggEl.style.display = "none";
      suggEl.innerHTML = "";
      return;
    }
    suggEl.innerHTML = list.map(function (s) {
      var icon = s.kind === "mcq" ? "⚡" : (s.kind === "short" ? "📄" : "📝");
      var bgColor = s.kind === "mcq" ? "#E0E7FF;color:#3730A3;" : (s.kind === "short" ? "#FEF3C7;color:#92400E;" : "#DCFCE7;color:#065F46;");
      return '<div class="sugg-item" data-fill="' + escapeAttr(s.label) + '" style="display:flex;align-items:flex-start;gap:10px;padding:11px 14px;cursor:pointer;border-bottom:1px solid #F1F5F1;font-family:inherit;">' +
        '<span style="width:24px;height:24px;border-radius:8px;background:' + bgColor + 'display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;flex-shrink:0;margin-top:1px;">' + icon + '</span>' +
        '<div style="flex:1;min-width:0;">' +
          '<div style="font-size:12.5px;font-weight:700;color:#1C3E2C;line-height:1.4;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">' + escapeHtml(s.display || s.label) + '</div>' +
          (s.sub ? '<div style="font-size:10.5px;color:#84968B;font-weight:600;margin-top:3px;">' + escapeHtml(s.sub) + '</div>' : "") +
        '</div>' +
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#84968B" stroke-width="2.5" stroke-linecap="round" style="flex-shrink:0;margin-top:6px;"><polyline points="9 18 15 12 9 6"/></svg>' +
      '</div>';
    }).join("");
    suggEl.style.display = "block";

    suggEl.querySelectorAll(".sugg-item").forEach(function (row) {
      row.addEventListener("mouseenter", function () { row.style.background = "#F8FBF8"; });
      row.addEventListener("mouseleave", function () { row.style.background = "transparent"; });
      row.addEventListener("click", function (e) {
        e.preventDefault();
        var val = row.getAttribute("data-fill");
        input.value = val;
        currentQuery = val;
        clearBtn.style.display = "flex";
        suggEl.style.display = "none";
        suggEl.innerHTML = "";
        resultsEl.innerHTML = renderList(currentType, val);
      });
    });
  }

  function refresh() {
    resultsEl.innerHTML = renderList(currentType, currentQuery);
  }

  input.addEventListener("input", function () {
    currentQuery = input.value.trim();
    clearBtn.style.display = currentQuery ? "flex" : "none";

    // Live suggestions
    renderSuggestions();

    // Filter results (debounced)
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(refresh, 150);
  });

  input.addEventListener("focus", function () {
    if (input.value.trim()) renderSuggestions();
  });

  // Close suggestions on outside tap
  document.addEventListener("click", function (e) {
    if (!main.contains(e.target)) return;
    if (e.target === input) return;
    if (suggEl.contains(e.target)) return;
    suggEl.style.display = "none";
    suggEl.innerHTML = "";
  });

  clearBtn.addEventListener("click", function () {
    input.value = "";
    currentQuery = "";
    clearBtn.style.display = "none";
    suggEl.style.display = "none";
    suggEl.innerHTML = "";
    input.focus();
    refresh();
  });

  chipsEl.addEventListener("click", function (e) {
    var chip = e.target.closest(".q-chip");
    if (!chip) return;
    currentType = chip.getAttribute("data-tab");
    chipsEl.innerHTML = renderChips();
    refresh();
  });
}

function escapeHtml(str) {
  if (str == null) return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}