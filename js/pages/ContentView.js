/**
 * ContentView — with hash guard
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

const TABS = [
  { id: "pdf",        icon: "📄", label: "PDF" },
  { id: "creative",   icon: "📝", label: "রচনামূলক" },
  { id: "short",      icon: "📄", label: "সংক্ষিপ্ত" },
  { id: "mcq",        icon: "⚡", label: "MCQ" },
  { id: "suggestion", icon: "💡", label: "সাজেশন" },
  { id: "formula",    icon: "🧮", label: "সূত্রাবলী" }
];

export async function renderContentView(params = {}) {
  const MY_HASH = "#/content";

  AppShell.updateHeader({
    title: "Content",
    subtitle: "Loading...",
    showBack: true,
    showSearch: false,
    showTheme: true,
    showSettings: false,
    expectedHash: MY_HASH
  });

  const main = AppShell.getMainView();
  if (!main) return;

  main.innerHTML = contentSkeleton();

  const urlParams = new URLSearchParams(window.location.hash.split("?")[1] || "");
  const subjectId = params.subjectId || urlParams.get("subjectId") || "";
  const chapterId = params.chapterId || urlParams.get("chapterId") || "";
  const initialTab = urlParams.get("type") || "pdf";

  if (!chapterId) {
    main.innerHTML = errorState({ type: "notFound", customBangla: "Chapter select করা হয়নি" });
    return;
  }

  let subject = null, chapter = null;
  let questions = [], suggestions = [], formulas = [], pdfs = [];
  let loadError = null;

  try {
    [subject, chapter, questions, suggestions, formulas, pdfs] = await Promise.all([
      subjectId ? getSubjectById(subjectId) : Promise.resolve(null),
      getChapterById(chapterId),
      getQuestionsByChapter(chapterId),
      getSuggestionsByChapter(chapterId),
      getFormulasByChapter(chapterId),
      getPdfsByChapter(chapterId)
    ]);
  } catch (e) { loadError = e; }

  // Guard
  if ((window.location.hash || "").split("?")[0] !== MY_HASH) {
    console.log("[ContentView] Route changed — abort");
    return;
  }

  if (!chapter) {
    main.innerHTML = errorState({
      type: loadError ? "server" : "notFound",
      message: loadError?.message,
      retryFn: () => renderContentView(params)
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

  const creative = questions.filter((q) => q.type === "creative");
  const short = questions.filter((q) => q.type === "short");
  const mcq = questions.filter((q) => q.type === "mcq");

  const counts = {
    pdf: pdfs.length,
    creative: creative.length,
    short: short.length,
    mcq: mcq.length,
    suggestion: suggestions.length,
    formula: formulas.length
  };

  const data = { pdfs, creative, short, mcq, suggestions, formulas };

  main.innerHTML = `
    <div style="padding:18px;background:linear-gradient(135deg, rgba(28,62,44,0.08), transparent);border-left:4px solid #1C3E2C;border-radius:16px;margin-bottom:16px;">
      <div style="display:inline-block;padding:4px 12px;background:#1C3E2C;color:#FFFFFF;font-size:11px;font-weight:800;border-radius:999px;margin-bottom:8px;">Ch. ${chapter.number}</div>
      <h2 style="font-size:19px;font-weight:900;color:#1C3E2C;letter-spacing:-0.3px;margin:0 0 4px;">${escapeHtml(chapter.name)}</h2>
      ${subject ? `<div style="font-size:11.5px;color:#84968B;font-weight:600;">${subject.icon || "📘"} ${escapeHtml(subject.name)}</div>` : ""}
    </div>

    <div style="display:flex;gap:8px;overflow-x:auto;padding:2px 0 12px;margin-bottom:8px;scrollbar-width:none;">
      ${TABS.map((tab) => `
        <button class="content-tab ${tab.id === initialTab ? "active" : ""}" data-tab="${tab.id}" type="button" style="
          flex:0 0 auto;display:flex;align-items:center;gap:6px;
          padding:9px 15px;background:${tab.id === initialTab ? "linear-gradient(135deg,#1C3E2C,#2A5540)" : "#FFFFFF"};
          color:${tab.id === initialTab ? "#FFFFFF" : "#57675D"};
          border:1.5px solid ${tab.id === initialTab ? "#1C3E2C" : "#E1E8E1"};
          border-radius:999px;font-size:12.5px;font-weight:700;font-family:inherit;cursor:pointer;white-space:nowrap;
          box-shadow:${tab.id === initialTab ? "0 4px 12px rgba(28,62,44,0.25)" : "0 2px 6px rgba(28,62,44,0.04)"};
        ">
          <span style="font-size:14px;">${tab.icon}</span>
          <span>${tab.label}</span>
          ${counts[tab.id] > 0 ? `<span style="min-width:18px;height:18px;padding:0 5px;background:${tab.id === initialTab ? "rgba(255,255,255,0.25)" : "rgba(28,62,44,0.1)"};color:${tab.id === initialTab ? "#FFFFFF" : "#1C3E2C"};font-size:10px;font-weight:800;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;">${counts[tab.id]}</span>` : ""}
        </button>
      `).join("")}
    </div>

    <div id="content-area">${renderTab(initialTab, data)}</div>

    <div style="height:20px;"></div>
  `;

  main.querySelectorAll(".content-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      const tabId = tab.getAttribute("data-tab");
      main.querySelectorAll(".content-tab").forEach((t) => {
        const isActive = t === tab;
        t.style.background = isActive ? "linear-gradient(135deg,#1C3E2C,#2A5540)" : "#FFFFFF";
        t.style.color = isActive ? "#FFFFFF" : "#57675D";
        t.style.borderColor = isActive ? "#1C3E2C" : "#E1E8E1";
        t.style.boxShadow = isActive ? "0 4px 12px rgba(28,62,44,0.25)" : "0 2px 6px rgba(28,62,44,0.04)";
        t.classList.toggle("active", isActive);
      });

      const area = main.querySelector("#content-area");
      area.style.opacity = "0";
      area.style.transform = "translateY(8px)";

      setTimeout(() => {
        area.innerHTML = renderTab(tabId, data);
        area.style.transition = "all 0.25s ease";
        area.style.opacity = "1";
        area.style.transform = "translateY(0)";
      }, 120);
    });
  });
}

function renderTab(tabId, data) {
  switch (tabId) {
    case "pdf":        return renderPdfs(data.pdfs);
    case "creative":   return renderQuestions(data.creative, "creative");
    case "short":      return renderQuestions(data.short, "short");
    case "mcq":        return renderQuestions(data.mcq, "mcq");
    case "suggestion": return renderSuggestions(data.suggestions);
    case "formula":    return renderFormulas(data.formulas);
    default:           return "";
  }
}

function renderPdfs(pdfs) {
  if (!pdfs || pdfs.length === 0) {
    return emptyState({ icon: "📄", title: "কোনো PDF নেই", message: "এই chapter-এ এখনো PDF যোগ করা হয়নি।" });
  }
  return `
    <div style="display:flex;flex-direction:column;gap:10px;">
      ${pdfs.map((pdf) => `
        <a href="${pdf.fileUrl || '#'}" target="_blank" rel="noopener" ${pdf.fileUrl ? "" : `onclick="event.preventDefault(); alert('File নেই');"`} style="
          display:flex;align-items:center;gap:12px;
          padding:14px;background:#FFFFFF;border:1.5px solid #E1E8E1;border-radius:14px;
          text-decoration:none;cursor:pointer;box-shadow:0 2px 6px rgba(28,62,44,0.04);
        ">
          <div style="width:48px;height:48px;border-radius:14px;background:linear-gradient(135deg,#FEE2E2,#FECACA);color:#991B1B;display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0;">📄</div>
          <div style="flex:1;min-width:0;">
            <div style="font-size:13.5px;font-weight:800;color:#1C3E2C;margin-bottom:3px;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">${escapeHtml(pdf.title || "Untitled")}</div>
            ${pdf.fileName ? `<div style="font-size:11px;color:#84968B;font-weight:600;">${escapeHtml(pdf.fileName)} ${pdf.fileSize ? `• ${pdf.fileSize}` : ""}</div>` : ""}
          </div>
          <div style="width:32px;height:32px;border-radius:50%;background:#DCFCE7;color:#065F46;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M7 17l10-10M7 7h10v10"/></svg>
          </div>
        </a>
      `).join("")}
    </div>
  `;
}

function renderQuestions(questions, type) {
  if (!questions || questions.length === 0) {
    return emptyState({ icon: "❓", title: "কোনো প্রশ্ন নেই", message: "এই ধরনের প্রশ্ন এখনো যোগ করা হয়নি।" });
  }
  return `
    <div style="display:flex;flex-direction:column;gap:12px;">
      ${questions.map((q, idx) => `
        <div style="padding:16px;background:#FFFFFF;border:1.5px solid #E1E8E1;border-radius:16px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;gap:8px;">
            <div style="width:30px;height:30px;border-radius:10px;background:linear-gradient(135deg,#1C3E2C,#2A5540);color:#FFFFFF;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;flex-shrink:0;">${idx + 1}</div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              ${q.marks ? `<span style="font-size:10px;font-weight:800;color:#92400E;background:#FEF3C7;padding:3px 8px;border-radius:6px;">🎯 ${q.marks}</span>` : ""}
              ${q.board ? `<span style="font-size:10px;font-weight:800;color:#065F46;background:#DCFCE7;padding:3px 8px;border-radius:6px;">${escapeHtml(q.board)}</span>` : ""}
            </div>
          </div>
          <div style="font-size:14.5px;font-weight:700;color:#1C3E2C;line-height:1.55;margin-bottom:14px;">${escapeHtml(q.question || "")}</div>

          ${type === "mcq" && q.options && q.options.length > 0 ? `
            <div style="display:flex;flex-direction:column;gap:8px;">
              ${q.options.map((opt, i) => {
                const letter = String.fromCharCode(65 + i);
                const isCorrect = opt === q.answer;
                return `
                  <div style="display:flex;align-items:center;gap:10px;padding:11px 14px;background:${isCorrect ? "linear-gradient(135deg,#DCFCE7,#BBF7D0)" : "#F8FBF8"};border:1.5px solid ${isCorrect ? "#10B981" : "#E1E8E1"};border-radius:12px;">
                    <span style="width:26px;height:26px;border-radius:8px;background:${isCorrect ? "#10B981" : "#FFFFFF"};color:${isCorrect ? "#FFFFFF" : "#57675D"};font-size:12px;font-weight:800;display:flex;align-items:center;justify-content:center;font-family:ui-monospace,monospace;">${letter}</span>
                    <span style="flex:1;font-size:13.5px;font-weight:600;color:#1C3E2C;">${escapeHtml(opt)}</span>
                    ${isCorrect ? `<span style="color:#10B981;font-size:16px;font-weight:800;">✓</span>` : ""}
                  </div>
                `;
              }).join("")}
            </div>
          ` : `
            <div style="padding:14px 16px;background:linear-gradient(135deg, rgba(28,62,44,0.06), transparent);border-left:3px solid #1C3E2C;border-radius:12px;">
              <div style="font-size:10px;font-weight:800;color:#1C3E2C;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:6px;">উত্তর</div>
              <div style="font-size:14px;font-weight:600;color:#1C3E2C;line-height:1.6;white-space:pre-wrap;">${escapeHtml(q.answer || "")}</div>
            </div>
          `}
        </div>
      `).join("")}
    </div>
  `;
}

function renderSuggestions(suggestions) {
  if (!suggestions || suggestions.length === 0) {
    return emptyState({ icon: "💡", title: "কোনো সাজেশন নেই", message: "এই chapter-এ এখনো সাজেশন যোগ করা হয়নি।" });
  }
  const catEmoji = { "Most Important": "🔥", "Very Important": "⭐", "Board Top": "🏆", "Last Minute": "⏰" };
  return `
    <div style="display:flex;flex-direction:column;gap:12px;">
      ${suggestions.map((s) => `
        <div style="background:linear-gradient(135deg, #FFFBEB, #FFFFFF);border:1.5px solid #FCD34D;border-radius:16px;padding:16px;">
          <div style="margin-bottom:10px;">
            <span style="display:inline-flex;align-items:center;gap:4px;padding:4px 10px;background:linear-gradient(135deg,#F59E0B,#D97706);color:#FFFFFF;font-size:10.5px;font-weight:800;border-radius:999px;">${catEmoji[s.category] || "💡"} ${escapeHtml(s.category || "")}</span>
          </div>
          <h3 style="font-size:15px;font-weight:800;color:#78350F;margin:0 0 8px;line-height:1.35;">${escapeHtml(s.title || "")}</h3>
          <div style="font-size:13.5px;color:#78350F;line-height:1.6;margin-bottom:12px;white-space:pre-wrap;">${escapeHtml(s.summary || "")}</div>
          ${s.examTip ? `
            <div style="display:flex;gap:10px;padding:10px 12px;background:rgba(255,255,255,0.7);border-radius:10px;border:1px dashed #FCD34D;">
              <span style="font-size:18px;">🎯</span>
              <div>
                <div style="font-size:10px;font-weight:800;color:#92400E;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:3px;">Exam Tip</div>
                <div style="font-size:12.5px;color:#78350F;line-height:1.5;">${escapeHtml(s.examTip)}</div>
              </div>
            </div>
          ` : ""}
        </div>
      `).join("")}
    </div>
  `;
}

function renderFormulas(formulas) {
  if (!formulas || formulas.length === 0) {
    return emptyState({ icon: "🧮", title: "কোনো সূত্র নেই", message: "এই chapter-এ এখনো সূত্র যোগ করা হয়নি।" });
  }
  return `
    <div style="display:flex;flex-direction:column;gap:12px;">
      ${formulas.map((f) => `
        <div style="background:#FFFFFF;border:1.5px solid #E1E8E1;border-radius:16px;padding:16px;">
          <h3 style="font-size:15px;font-weight:800;color:#0E7490;margin:0 0 12px;">${escapeHtml(f.name || "")}</h3>
          ${f.equation ? `
            <div style="padding:14px 16px;background:linear-gradient(135deg,#CFFAFE,#E0F2FE);border-left:4px solid #0891B2;border-radius:10px;margin-bottom:12px;text-align:center;">
              <code style="font-family:ui-monospace,monospace;font-size:16px;font-weight:800;color:#0E7490;">${escapeHtml(f.equation)}</code>
            </div>
          ` : ""}
          ${f.explanation ? `<div style="font-size:13px;color:#57675D;line-height:1.6;margin-bottom:10px;">${escapeHtml(f.explanation)}</div>` : ""}
          ${f.example ? `
            <div style="padding:10px 12px;background:#F8FBF8;border-left:3px solid #E1E8E1;border-radius:8px;">
              <div style="font-size:10px;font-weight:800;color:#84968B;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">উদাহরণ</div>
              <div style="font-size:12.5px;color:#1C3E2C;line-height:1.5;">${escapeHtml(f.example)}</div>
            </div>
          ` : ""}
        </div>
      `).join("")}
    </div>
  `;
}

function escapeHtml(str) {
  if (str == null) return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}