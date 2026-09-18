/**
 * Suggestions — All suggestions list
 */

import { AppShell } from "../components/AppShell.js";
import { getSubjects, getSuggestionsBySubject } from "../services/api.js";
import { listSkeleton } from "../utils/skeleton.js";
import { errorState, emptyState } from "../utils/errorState.js";

export async function renderSuggestions(params = {}) {
  const MY_HASH = "#/suggestions";

  AppShell.updateHeader({
    title: "Suggestions",
    subtitle: "Exam suggestions",
    showBack: true,
    showSearch: false,
    showTheme: true,
    showSettings: false,
    expectedHash: MY_HASH
  });

  const main = AppShell.getMainView();
  if (!main) return;

  main.innerHTML = listSkeleton(4, "140px");

  let allSuggestions = [];
  let loadError = null;

  try {
    const subjects = await getSubjects();
    for (const sub of subjects) {
      const sug = await getSuggestionsBySubject(sub.id);
      sug.forEach((s) => {
        allSuggestions.push({ ...s, subjectName: sub.name, subjectId: sub.id });
      });
    }
  } catch (e) { loadError = e; }

  // Guard
  if ((window.location.hash || "").split("?")[0] !== MY_HASH) return;

  if (allSuggestions.length === 0) {
    main.innerHTML = emptyState({
      icon: "💡",
      title: "কোনো সাজেশন নেই",
      message: "Admin Panel থেকে suggestion যোগ করলে এখানে দেখা যাবে।",
      actionFn: () => window.location.hash = "#/home",
      actionLabel: "🏠 Home"
    });
    return;
  }

  const catEmoji = { "Most Important": "🔥", "Very Important": "⭐", "Board Top": "🏆", "Last Minute": "⏰" };

  main.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;padding:14px 16px;background:linear-gradient(135deg, #FEF3C7, #FDE68A);border:1px solid #FCD34D;border-radius:16px;margin-bottom:18px;">
      <span style="font-size:22px;">💡</span>
      <div>
        <div style="font-size:14px;font-weight:800;color:#92400E;">${allSuggestions.length}টি সাজেশন</div>
        <div style="font-size:11px;color:#B45309;font-weight:600;">পরীক্ষার জন্য গুরুত্বপূর্ণ</div>
      </div>
    </div>

    <div style="display:flex;flex-direction:column;gap:12px;">
      ${allSuggestions.map((s) => `
        <div style="background:linear-gradient(135deg, #FFFBEB, #FFFFFF);border:1.5px solid #FCD34D;border-radius:16px;padding:16px;">
          <div style="display:flex;justify-content:space-between;gap:8px;margin-bottom:10px;flex-wrap:wrap;">
            <span style="display:inline-flex;align-items:center;gap:4px;padding:4px 10px;background:linear-gradient(135deg,#F59E0B,#D97706);color:#FFFFFF;font-size:10.5px;font-weight:800;border-radius:999px;">${catEmoji[s.category] || "💡"} ${escapeHtml(s.category || "")}</span>
            <span style="font-size:10.5px;color:#84968B;font-weight:600;">${escapeHtml(s.subjectName || "")}</span>
          </div>
          <h3 style="font-size:15px;font-weight:800;color:#78350F;margin:0 0 8px;line-height:1.35;">${escapeHtml(s.title || "")}</h3>
          <div style="font-size:13.5px;color:#78350F;line-height:1.6;margin-bottom:12px;white-space:pre-wrap;">${escapeHtml(s.summary || "")}</div>
          ${s.examTip ? `<div style="display:flex;gap:10px;padding:10px 12px;background:rgba(255,255,255,0.7);border-radius:10px;border:1px dashed #FCD34D;">
            <span style="font-size:18px;">🎯</span>
            <div>
              <div style="font-size:10px;font-weight:800;color:#92400E;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:3px;">Exam Tip</div>
              <div style="font-size:12.5px;color:#78350F;line-height:1.5;">${escapeHtml(s.examTip)}</div>
            </div>
          </div>` : ""}
        </div>
      `).join("")}
    </div>

    <div style="height:20px;"></div>
  `;
}

function escapeHtml(str) {
  if (str == null) return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}