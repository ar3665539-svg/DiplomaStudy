/**
 * Progress Page — User learning stats
 */

import { AppShell } from "../components/AppShell.js";
import { progressService } from "../features/progress/progressService.js";
import { getSubjects, getChaptersBySubject } from "../services/api.js";
import { Toast } from "../components/Toast.js";

export async function renderProgress() {
  AppShell.updateHeader({
    title: "My Progress",
    subtitle: "Your learning journey",
    showBack: true,
    showSearch: false,
    showTheme: true,
    showSettings: false
  });

  const main = AppShell.getMainView();
  if (!main) return;

  main.innerHTML = `<div style="text-align:center;padding:60px 20px;"><div class="spinner"></div></div>`;

  const allData = progressService.getAll();
  const totalRead = progressService.getTotalRead();
  const weekly = progressService.getWeeklyActivity();
  const lastRead = progressService.getLastRead();

  // Load subjects to compute per-subject progress
  let subjects = [];
  try { subjects = await getSubjects(); } catch (e) {}

  const subjectProgress = [];
  for (const sub of subjects) {
    try {
      const chapters = await getChaptersBySubject(sub.id);
      const p = progressService.getSubjectProgress(sub.id, chapters.length);
      if (p.read > 0 || p.total > 0) {
        subjectProgress.push({ subject: sub, ...p });
      }
    } catch (e) {}
  }
  subjectProgress.sort((a, b) => b.percent - a.percent);

  // Weekly stats
  const weekTotal = Object.values(weekly).reduce((s, v) => s + v, 0);
  const maxDay = Math.max(...Object.values(weekly), 1);

  const dayNames = ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহঃ", "শুক্র", "শনি"];

  main.innerHTML = `
    <!-- KPI cards -->
    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:20px;">
      <div style="padding:18px;background:linear-gradient(135deg, #DCFCE7, #BBF7D0);border-radius:18px;position:relative;overflow:hidden;">
        <div style="position:absolute;top:-20px;right:-20px;width:80px;height:80px;background:rgba(255,255,255,0.4);border-radius:50%;"></div>
        <div style="position:relative;">
          <div style="font-size:28px;font-weight:900;color:#065F46;line-height:1;margin-bottom:6px;">${totalRead}</div>
          <div style="font-size:11.5px;font-weight:700;color:#047857;">Chapters Read</div>
        </div>
      </div>
      <div style="padding:18px;background:linear-gradient(135deg, #FEF3C7, #FDE68A);border-radius:18px;position:relative;overflow:hidden;">
        <div style="position:absolute;top:-20px;right:-20px;width:80px;height:80px;background:rgba(255,255,255,0.4);border-radius:50%;"></div>
        <div style="position:relative;">
          <div style="font-size:28px;font-weight:900;color:#92400E;line-height:1;margin-bottom:6px;">${weekTotal}</div>
          <div style="font-size:11.5px;font-weight:700;color:#B45309;">This Week</div>
        </div>
      </div>
    </div>

    <!-- Weekly chart -->
    <div style="background:#FFFFFF;border:1.5px solid #E1E8E1;border-radius:18px;padding:18px;margin-bottom:20px;">
      <div style="font-size:13px;font-weight:800;color:#1C3E2C;margin-bottom:14px;">📊 Weekly Activity</div>
      <div style="display:flex;align-items:flex-end;justify-content:space-between;gap:6px;height:120px;">
        ${Object.entries(weekly).map(([date, count]) => {
          const d = new Date(date);
          const dayLabel = dayNames[d.getDay()];
          const height = count > 0 ? Math.max((count / maxDay) * 100, 8) : 4;
          const isToday = date === new Date().toISOString().slice(0, 10);
          return `
            <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;">
              <div style="font-size:10px;font-weight:800;color:${count > 0 ? "#1C3E2C" : "#84968B"};">${count}</div>
              <div style="width:100%;height:${height}%;min-height:4px;background:${isToday ? "linear-gradient(180deg,#F59E0B,#D97706)" : count > 0 ? "linear-gradient(180deg,#10B981,#059669)" : "#E1E8E1"};border-radius:6px 6px 0 0;transition:all 0.3s;"></div>
              <div style="font-size:9.5px;font-weight:600;color:#84968B;">${dayLabel}</div>
            </div>
          `;
        }).join("")}
      </div>
    </div>

    <!-- Last read -->
    ${lastRead ? `
      <div style="background:linear-gradient(135deg, #DBEAFE, #BFDBFE);border-radius:18px;padding:16px;margin-bottom:20px;">
        <div style="font-size:10.5px;font-weight:800;color:#1E40AF;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:8px;">📖 Continue Reading</div>
        <div style="font-size:14px;font-weight:800;color:#1E3A8A;margin-bottom:4px;">${escapeHtml(lastRead.chapterName || "Chapter")}</div>
        ${lastRead.subjectName ? `<div style="font-size:11.5px;color:#1E40AF;font-weight:600;margin-bottom:12px;">${escapeHtml(lastRead.subjectName)}</div>` : ""}
        <button id="progress-continue" data-chapter-id="${lastRead.chapterId}" data-subject-id="${lastRead.subjectId || ""}" style="padding:10px 16px;background:#1E40AF;color:#FFFFFF;border:none;border-radius:10px;font-weight:800;font-size:12.5px;cursor:pointer;font-family:inherit;">Continue →</button>
      </div>
    ` : ""}

    <!-- Subject progress -->
    ${subjectProgress.length > 0 ? `
      <div style="font-size:13px;font-weight:800;color:#1C3E2C;margin-bottom:12px;">📚 Subject Progress</div>
      <div style="display:flex;flex-direction:column;gap:10px;">
        ${subjectProgress.map((p) => `
          <div style="padding:14px;background:#FFFFFF;border:1.5px solid #E1E8E1;border-radius:14px;">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
              <div style="width:38px;height:38px;border-radius:11px;background:#F8FBF8;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">${p.subject.icon || "📘"}</div>
              <div style="flex:1;min-width:0;">
                <div style="font-size:13px;font-weight:800;color:#1C3E2C;margin-bottom:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(p.subject.name)}</div>
                <div style="font-size:10.5px;color:#84968B;font-weight:600;">${p.read} / ${p.total} chapters</div>
              </div>
              <div style="font-size:16px;font-weight:900;color:#10B981;">${p.percent}%</div>
            </div>
            <div style="height:6px;background:#E8EFE8;border-radius:999px;overflow:hidden;">
              <div style="height:100%;width:${p.percent}%;background:linear-gradient(90deg,#10B981,#059669);border-radius:999px;transition:width 0.6s;"></div>
            </div>
          </div>
        `).join("")}
      </div>
    ` : `
      <div style="text-align:center;padding:40px 20px;background:#F8FBF8;border-radius:16px;border:1.5px dashed #E1E8E1;">
        <div style="font-size:48px;margin-bottom:12px;">📊</div>
        <div style="font-size:14px;font-weight:800;color:#1C3E2C;margin-bottom:6px;">এখনো কোনো progress নেই</div>
        <div style="font-size:12px;color:#84968B;line-height:1.5;">Chapter পড়া শুরু করলে এখানে progress দেখা যাবে।</div>
      </div>
    `}

    <!-- Reset -->
    <button id="progress-reset" style="width:100%;margin-top:20px;padding:12px;background:transparent;border:1.5px solid #FECACA;color:#991B1B;border-radius:12px;font-weight:700;font-size:12.5px;cursor:pointer;font-family:inherit;">
      🗑️ Reset All Progress
    </button>

    <div style="height:20px;"></div>
  `;

  main.querySelector("#progress-continue")?.addEventListener("click", (e) => {
    const chapterId = e.target.getAttribute("data-chapter-id");
    const subjectId = e.target.getAttribute("data-subject-id");
    if (chapterId && subjectId) {
      window.location.hash = `#/content?subjectId=${subjectId}&chapterId=${chapterId}`;
    }
  });

  main.querySelector("#progress-reset")?.addEventListener("click", () => {
    if (!confirm("সব progress মুছে ফেলবেন?\n\nএটা undo করা যাবে না।")) return;
    progressService.reset();
    Toast.success("✅ Progress reset");
    renderProgress();
  });
}

function escapeHtml(str) {
  if (str == null) return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}