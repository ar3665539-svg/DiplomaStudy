/**
 * Formula v5 - Live suggestions dropdown
 */

import { AppShell } from "../components/AppShell.js";
import { getSubjects, getChaptersBySubject, getFormulasByChapter } from "../services/api.js";
import { listSkeleton } from "../utils/skeleton.js";
import { emptyState } from "../utils/errorState.js";

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
// SMART SEARCH
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
export async function renderFormula() {
  ensureLatexStyles();
  const MY_HASH = "#/formulas";

  AppShell.updateHeader({
    title: "Engineering Formulas", subtitle: "Equations, variables & units",
    showBack: true,
    showSearch: true,
    showTheme: true,
    showSettings: false,
    expectedHash: MY_HASH
  });

  const main = AppShell.getMainView();
  if (!main) return;

  main.innerHTML = listSkeleton(4, "140px");

  let allFormulas = [];
  let subjectsMap = {};

  try {
    const subjects = await getSubjects();
    subjects.forEach((s) => { subjectsMap[s.id] = s; });

    const subjectChapterSets = await Promise.all(
      subjects.map(async function (subject) {
        const chapters = await getChaptersBySubject(subject.id).catch(function () { return []; });
        return { subject, chapters };
      })
    );

    const chapterResults = await Promise.all(
      subjectChapterSets.flatMap(function ({ subject, chapters }) {
        return chapters.map(async function (ch) {
          const formulas = await getFormulasByChapter(ch.id).catch(function () { return []; });
          return formulas.map(function (f) {
            return { ...f, chapterName: ch.name, chapterNumber: ch.number, subjectName: subject.name, subjectId: subject.id };
          });
        });
      })
    );

    chapterResults.forEach(function (list) {
      if (Array.isArray(list)) allFormulas.push(...list);
    });
  } catch (err) {}

  if ((window.location.hash || "").split("?")[0] !== MY_HASH) return;

  if (allFormulas.length === 0) {
    main.innerHTML = emptyState({
      icon: "🧮", title: "কোনো সূত্র নেই",
      message: "Admin Panel থেকে formula যোগ করলে এখানে দেখা যাবে।",
      actionFn: () => window.location.hash = "#/home",
      actionLabel: "🏠 Home"
    });
    return;
  }

  // ── Build suggestion index (only from formulas that exist) ──
  var suggestions = [];
  allFormulas.forEach(function (f) {
    if (f.name) suggestions.push({ label: f.name, sub: f.subjectName || "", kind: "name", id: f.id });
    if (f.equation) suggestions.push({ label: f.equation, sub: f.subjectName || "", kind: "eq", id: f.id });
  });

  function findSuggestions(query) {
    var q = (query || "").trim();
    if (!q || q.length < 1) return [];
    var seen = {};
    var out = [];
    for (var i = 0; i < suggestions.length; i++) {
      var s = suggestions[i];
      if (smartMatch(s.label, q)) {
        var key = s.label + "|" + s.sub;
        if (!seen[key]) {
          seen[key] = true;
          out.push(s);
          if (out.length >= 8) break;
        }
      }
    }
    return out;
  }

  function renderResults(query) {
    var q = (query || "").trim();
    var filtered = allFormulas;
    if (q) {
      filtered = allFormulas.filter(function (f) {
        return smartMatch(f.name, q) ||
               smartMatch(f.equation, q) ||
               smartMatch(f.explanation, q) ||
               smartMatch(f.example, q) ||
               smartMatch(f.subjectName, q) ||
               smartMatch(f.chapterName, q);
      });
    }

    if (filtered.length === 0) {
      return '<div style="text-align:center;padding:60px 20px;">' +
        '<div style="font-size:56px;margin-bottom:12px;">🔍</div>' +
        '<div style="font-size:14px;font-weight:800;color:#1C3E2C;">কিছু পাওয়া যায়নি</div>' +
        '<div style="font-size:12px;color:#84968B;margin-top:6px;">অন্য কিছু দিয়ে খুঁজুন</div>' +
      '</div>';
    }

    var bySub = {};
    filtered.forEach(function (f) {
      if (!bySub[f.subjectId]) bySub[f.subjectId] = { subject: subjectsMap[f.subjectId] || { name: f.subjectName, icon: "📘" }, formulas: [] };
      bySub[f.subjectId].formulas.push(f);
    });

    return '<div style="display:flex;flex-direction:column;gap:20px;">' +
      Object.values(bySub).map(function (grp) {
        return '<div>' +
          '<div style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:linear-gradient(135deg,rgba(28,62,44,0.06),transparent);border-left:3px solid #1C3E2C;border-radius:10px;margin-bottom:10px;">' +
            '<span style="font-size:20px;">' + (grp.subject.icon || "📘") + '</span>' +
            '<span style="font-size:13.5px;font-weight:800;color:#1C3E2C;flex:1;">' + escapeHtml(grp.subject.name) + '</span>' +
            '<span style="font-size:10.5px;font-weight:800;color:#065F46;background:#DCFCE7;padding:3px 9px;border-radius:999px;">' + grp.formulas.length + '</span>' +
          '</div>' +
          '<div style="display:flex;flex-direction:column;gap:10px;">' +
            grp.formulas.map(function (f) {
              return '<div style="padding:16px;background:#FFFFFF;border:1.5px solid #E1E8E1;border-radius:16px;box-shadow:0 2px 8px rgba(28,62,44,0.04);">' +
                '<div style="display:flex;align-items:center;gap:6px;font-size:11px;color:#84968B;font-weight:600;margin-bottom:8px;">' +
                  '<span style="font-size:10px;font-weight:800;color:#065F46;background:#DCFCE7;padding:2px 8px;border-radius:6px;">Ch. ' + f.chapterNumber + '</span>' +
                  '<span>' + escapeHtml(f.chapterName || "") + '</span>' +
                '</div>' +
                '<h3 style="font-size:15px;font-weight:800;color:#1C3E2C;letter-spacing:-0.2px;margin:0 0 10px;line-height:1.5;">' + formatLatex(f.name || "") + '</h3>' +
                (f.equation ? '<div style="padding:16px 14px;background:linear-gradient(135deg,#CFFAFE,#E0F2FE);border-left:4px solid #0891B2;border-radius:10px;margin-bottom:12px;text-align:center;font-size:16px;font-weight:800;color:#0E7490;line-height:1.9;">' + formatLatex(f.equation) + '</div>' : "") +
                (f.explanation ? '<div style="font-size:13px;color:#57675D;line-height:1.75;margin:0 0 10px;">' + formatLatex(f.explanation) + '</div>' : "") +
                (f.example ? '<div style="padding:10px 12px;background:#F8FBF8;border-left:3px solid #E1E8E1;border-radius:8px;"><div style="font-size:10px;font-weight:800;color:#84968B;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">উদাহরণ</div><div style="font-size:12.5px;color:#1C3E2C;line-height:1.75;font-weight:500;">' + formatLatex(f.example) + '</div></div>' : "") +
              '</div>';
            }).join("") +
          '</div>' +
        '</div>';
      }).join("") +
    '</div>';
  }

  main.innerHTML =
    '<div style="position:relative;margin-bottom:20px;">' +

      '<div style="display:flex;align-items:center;gap:10px;padding:12px 16px;background:#FFFFFF;border:1.5px solid #E1E8E1;border-radius:16px;box-shadow:0 4px 12px rgba(28,62,44,0.05);">' +
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#84968B" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>' +
        '<input type="text" id="formula-search" placeholder="সূত্র, নাম, বিষয়, অধ্যায় খুঁজুন..." autocomplete="off" style="flex:1;background:transparent;border:none;outline:none;font-size:14px;font-weight:600;color:#1C3E2C;font-family:inherit;" />' +
        '<button id="formula-search-clear" style="display:none;width:26px;height:26px;border-radius:50%;background:#F2F5F2;border:none;color:#57675D;cursor:pointer;font-size:12px;font-family:inherit;">✕</button>' +
      '</div>' +

      '<div id="formula-suggestions" style="display:none;position:absolute;left:0;right:0;top:calc(100% + 6px);background:#FFFFFF;border:1.5px solid #E1E8E1;border-radius:14px;box-shadow:0 12px 30px rgba(28,62,44,0.12);max-height:320px;overflow-y:auto;z-index:20;"></div>' +

    '</div>' +
    '<div id="formula-results">' + renderResults("") + '</div>' +
    '<div style="height:20px;"></div>';

  var input = main.querySelector("#formula-search");
  var clearBtn = main.querySelector("#formula-search-clear");
  var suggEl = main.querySelector("#formula-suggestions");
  var resultsEl = main.querySelector("#formula-results");
  var debounceTimer = null;

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
    suggEl.innerHTML = list.map(function (s, i) {
      return '<div class="sugg-item" data-fill="' + escapeAttr(s.label) + '" data-idx="' + i + '" style="display:flex;align-items:center;gap:10px;padding:11px 14px;cursor:pointer;border-bottom:1px solid #F1F5F1;font-family:inherit;">' +
        '<span style="width:24px;height:24px;border-radius:8px;background:' + (s.kind === "eq" ? "#CFFAFE;color:#0E7490;" : "#DCFCE7;color:#065F46;") + 'display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;flex-shrink:0;">' + (s.kind === "eq" ? "=" : "ƒ") + '</span>' +
        '<div style="flex:1;min-width:0;">' +
          '<div style="font-size:13px;font-weight:700;color:#1C3E2C;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + escapeHtml(s.label) + '</div>' +
          (s.sub ? '<div style="font-size:10.5px;color:#84968B;font-weight:600;margin-top:2px;">' + escapeHtml(s.sub) + '</div>' : "") +
        '</div>' +
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#84968B" stroke-width="2.5" stroke-linecap="round" style="flex-shrink:0;"><polyline points="9 18 15 12 9 6"/></svg>' +
      '</div>';
    }).join("");
    suggEl.style.display = "block";

    // hover effects
    suggEl.querySelectorAll(".sugg-item").forEach(function (row) {
      row.addEventListener("mouseenter", function () { row.style.background = "#F8FBF8"; });
      row.addEventListener("mouseleave", function () { row.style.background = "transparent"; });
      row.addEventListener("click", function (e) {
        e.preventDefault();
        var val = row.getAttribute("data-fill");
        input.value = val;
        clearBtn.style.display = "flex";
        suggEl.style.display = "none";
        suggEl.innerHTML = "";
        resultsEl.innerHTML = renderResults(val);
      });
    });
  }

  function escapeAttr(s) {
    if (s == null) return "";
    return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  input.addEventListener("input", function () {
    var v = input.value.trim();
    clearBtn.style.display = v ? "flex" : "none";

    // Live suggestions (immediate)
    renderSuggestions();

    // Filter results (debounced)
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function () {
      resultsEl.innerHTML = renderResults(v);
    }, 150);
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
    clearBtn.style.display = "none";
    suggEl.style.display = "none";
    suggEl.innerHTML = "";
    input.focus();
    resultsEl.innerHTML = renderResults("");
  });
}

function escapeHtml(str) {
  if (str == null) return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}