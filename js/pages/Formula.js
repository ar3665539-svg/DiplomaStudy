/**
 * Formula — DB-driven formulas list
 */

import { AppShell } from "../components/AppShell.js";
import { getSubjects, getChaptersBySubject, getFormulasByChapter } from "../services/api.js";
import { listSkeleton } from "../utils/skeleton.js";
import { emptyState } from "../utils/errorState.js";

export async function renderFormula() {
  const MY_HASH = "#/formulas";

  AppShell.updateHeader({
    title: "Engineering Formulas", subtitle: "Equations, variables & units",
    showBack: true, showSearch: false, showTheme: true, showSettings: false,
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

    for (const subject of subjects) {
      try {
        const chapters = await getChaptersBySubject(subject.id);
        for (const ch of chapters) {
          try {
            const formulas = await getFormulasByChapter(ch.id);
            formulas.forEach((f) => {
              allFormulas.push({ ...f, chapterName: ch.name, chapterNumber: ch.number, subjectName: subject.name, subjectId: subject.id });
            });
          } catch (e) {}
        }
      } catch (e) {}
    }
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

  const bySubject = {};
  allFormulas.forEach((f) => {
    if (!bySubject[f.subjectId]) bySubject[f.subjectId] = { subject: subjectsMap[f.subjectId] || { name: f.subjectName, icon: "📘" }, formulas: [] };
    bySubject[f.subjectId].formulas.push(f);
  });

  main.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:20px;">
      ${Object.values(bySubject).map(({ subject, formulas }) => `
        <div>
          <div style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:linear-gradient(135deg, rgba(28,62,44,0.06), transparent);border-left:3px solid #1C3E2C;border-radius:10px;margin-bottom:10px;">
            <span style="font-size:20px;">${subject.icon || "📘"}</span>
            <span style="font-size:13.5px;font-weight:800;color:#1C3E2C;flex:1;">${escapeHtml(subject.name)}</span>
            <span style="font-size:10.5px;font-weight:800;color:#065F46;background:#DCFCE7;padding:3px 9px;border-radius:999px;">${formulas.length}</span>
          </div>
          <div style="display:flex;flex-direction:column;gap:10px;">
            ${formulas.map((f) => `
              <div style="padding:16px;background:#FFFFFF;border:1.5px solid #E1E8E1;border-radius:16px;box-shadow:0 2px 8px rgba(28,62,44,0.04);">
                <div style="display:flex;align-items:center;gap:6px;font-size:11px;color:#84968B;font-weight:600;margin-bottom:8px;">
                  <span style="font-size:10px;font-weight:800;color:#065F46;background:#DCFCE7;padding:2px 8px;border-radius:6px;">Ch. ${f.chapterNumber}</span>
                  <span>${escapeHtml(f.chapterName || "")}</span>
                </div>
                <h3 style="font-size:15px;font-weight:800;color:#1C3E2C;letter-spacing:-0.2px;margin:0 0 10px;">${escapeHtml(f.name || "")}</h3>
                ${f.equation ? `<div style="padding:14px;background:linear-gradient(135deg, #CFFAFE, #E0F2FE);border-left:4px solid #0891B2;border-radius:10px;margin-bottom:12px;text-align:center;"><code style="font-family:ui-monospace,monospace;font-size:15px;font-weight:800;color:#0E7490;letter-spacing:0.5px;">${escapeHtml(f.equation)}</code></div>` : ""}
                ${f.explanation ? `<p style="font-size:13px;color:#57675D;line-height:1.6;margin:0 0 10px;">${escapeHtml(f.explanation)}</p>` : ""}
                ${f.example ? `<div style="padding:10px 12px;background:#F8FBF8;border-left:3px solid #E1E8E1;border-radius:8px;"><div style="font-size:10px;font-weight:800;color:#84968B;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">উদাহরণ</div><div style="font-size:12.5px;color:#1C3E2C;line-height:1.5;font-weight:500;">${escapeHtml(f.example)}</div></div>` : ""}
              </div>
            `).join("")}
          </div>
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