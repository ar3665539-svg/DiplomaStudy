/**
 * Questions — All questions list (with filters)
 */

import { AppShell } from "../components/AppShell.js";
import { getSubjects, getChaptersBySubject, getQuestionsByChapter } from "../services/api.js";
import { listSkeleton } from "../utils/skeleton.js";
import { errorState, emptyState } from "../utils/errorState.js";

export async function renderQuestions(params = {}) {
  const MY_HASH = "#/questions";

  AppShell.updateHeader({
    title: "Questions",
    subtitle: "All questions",
    showBack: true,
    showSearch: false,
    showTheme: true,
    showSettings: false,
    expectedHash: MY_HASH
  });

  const main = AppShell.getMainView();
  if (!main) return;

  main.innerHTML = listSkeleton(5, "140px");

  const urlParams = new URLSearchParams(window.location.hash.split("?")[1] || "");
  const filterType = urlParams.get("type") || "all";

  // Load ALL questions across subjects
  let allQuestions = [];
  let loadError = null;

  try {
    const subjects = await getSubjects();
    for (const sub of subjects) {
      const chapters = await getChaptersBySubject(sub.id);
      for (const ch of chapters) {
        const qs = await getQuestionsByChapter(ch.id);
        qs.forEach((q) => {
          allQuestions.push({
            ...q,
            subjectName: sub.name,
            chapterName: ch.name,
            chapterNumber: ch.number,
            subjectId: sub.id
          });
        });
      }
    }
  } catch (e) { loadError = e; }

  // Guard
  if ((window.location.hash || "").split("?")[0] !== MY_HASH) return;

  if (allQuestions.length === 0 && loadError) {
    main.innerHTML = errorState({ type: "server", message: loadError.message, retryFn: () => renderQuestions(params) });
    return;
  }

  let filtered = allQuestions;
  if (filterType !== "all") filtered = filtered.filter((q) => q.type === filterType);

  if (filtered.length === 0) {
    main.innerHTML = emptyState({
      icon: "❓",
      title: "কোনো প্রশ্ন নেই",
      message: "Admin Panel থেকে প্রশ্ন যোগ করলে এখানে দেখা যাবে।",
      actionFn: () => window.location.hash = "#/home",
      actionLabel: "🏠 Home"
    });
    return;
  }

  const typeEmoji = { creative: "📝", short: "📄", mcq: "⚡" };
  const typeLabel = { creative: "রচনামূলক", short: "সংক্ষিপ্ত", mcq: "MCQ" };

  main.innerHTML = `
    <div style="display:flex;gap:8px;overflow-x:auto;padding:2px 0 12px;margin-bottom:8px;scrollbar-width:none;">
      ${["all", "creative", "short", "mcq"].map((t) => `
        <button class="q-chip ${t === filterType ? "active" : ""}" data-tab="${t}" type="button" style="
          flex:0 0 auto;padding:9px 15px;
          background:${t === filterType ? "linear-gradient(135deg,#1C3E2C,#2A5540)" : "#FFFFFF"};
          color:${t === filterType ? "#FFFFFF" : "#57675D"};
          border:1.5px solid ${t === filterType ? "#1C3E2C" : "#E1E8E1"};
          border-radius:999px;font-size:12.5px;font-weight:700;font-family:inherit;cursor:pointer;white-space:nowrap;
        ">
          ${t === "all" ? "📋 সব" : `${typeEmoji[t]} ${typeLabel[t]}`}
          <span style="margin-left:6px;font-size:10px;opacity:0.8;">
            ${t === "all" ? allQuestions.length : allQuestions.filter((q) => q.type === t).length}
          </span>
        </button>
      `).join("")}
    </div>

    <div style="display:flex;flex-direction:column;gap:12px;">
      ${filtered.slice(0, 50).map((q) => `
        <div style="padding:16px;background:#FFFFFF;border:1.5px solid #E1E8E1;border-radius:16px;">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:10px;flex-wrap:wrap;">
            <span style="font-size:10px;font-weight:800;color:#065F46;background:#DCFCE7;padding:3px 8px;border-radius:6px;">${typeEmoji[q.type] || "❓"} ${typeLabel[q.type] || q.type}</span>
            ${q.marks ? `<span style="font-size:10px;font-weight:800;color:#92400E;background:#FEF3C7;padding:3px 8px;border-radius:6px;">🎯 ${q.marks}</span>` : ""}
            <span style="font-size:10.5px;color:#84968B;font-weight:600;">${escapeHtml(q.subjectName || "")} • Ch.${q.chapterNumber}</span>
          </div>
          <div style="font-size:14px;font-weight:700;color:#1C3E2C;line-height:1.5;margin-bottom:12px;">${escapeHtml(q.question || "")}</div>
          ${q.options && q.options.length > 0 ? `
            <div style="display:flex;flex-direction:column;gap:6px;">
              ${q.options.map((opt, i) => {
                const letter = String.fromCharCode(65 + i);
                const isCorrect = opt === q.answer;
                return `<div style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:${isCorrect ? "#DCFCE7" : "#F8FBF8"};border-radius:8px;font-size:12.5px;${isCorrect ? "font-weight:700;color:#065F46;" : "color:#57675D;"}">
                  <span style="font-weight:800;font-family:ui-monospace,monospace;font-size:11px;">${letter}.</span>
                  <span>${escapeHtml(opt)}</span>
                </div>`;
              }).join("")}
            </div>
          ` : `<div style="font-size:13px;color:#57675D;line-height:1.6;padding:10px 12px;background:#F8FBF8;border-radius:8px;border-left:3px solid #1C3E2C;">${escapeHtml(q.answer || "")}</div>`}
        </div>
      `).join("")}
    </div>

    ${filtered.length > 50 ? `<div style="text-align:center;padding:16px;color:#84968B;font-size:12px;font-weight:600;">প্রথম ৫০টি দেখানো হচ্ছে</div>` : ""}

    <div style="height:20px;"></div>
  `;

  // Chip switching
  main.querySelectorAll(".q-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const tab = chip.getAttribute("data-tab");
      const newHash = `#/questions${tab === "all" ? "" : "?type=" + tab}`;
      window.location.hash = newHash;
    });
  });
}

function escapeHtml(str) {
  if (str == null) return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}