/**
 * DiplomaStudy - Progress & Analytics Page View
 */

import { AppShell } from "../components/AppShell.js";
import { progressService } from "../features/progress/progressService.js";
import { ProgressCard } from "../components/ProgressCard.js";

export function renderProgress() {
  AppShell.updateHeader({
    title: "Progress & Analytics",
    subtitle: "Study metrics & syllabus coverage",
    showBack: true,
    showSearch: false
  });

  const main = AppShell.getMainView();
  if (!main) return;

  const summary = progressService.getSummary();

  main.innerHTML = `
    <!-- Top Stats Overview Card -->
    ${ProgressCard.render(summary)}

    <!-- Subject Wise Syllabus Completion -->
    <div class="section-header mt-md">
      <h3 class="section-title">Subject Completion</h3>
      <span class="text-xs text-muted">BTEB Curriculum</span>
    </div>

    <div class="flex flex-col gap-sm mb-lg" id="subject-progress-list">
      ${summary.subjectCompletion.map((s) => `
        <div class="card p-md">
          <div class="flex items-center justify-between mb-xs">
            <div>
              <h4 class="text-xs font-bold text-forest">${s.name}</h4>
              <span class="text-xs text-dim">Code: ${s.code}</span>
            </div>
            <span class="badge ${s.progress >= 70 ? "badge-success" : s.progress >= 40 ? "badge-warning" : "badge-sage"}">${s.progress}% Completed</span>
          </div>

          <div class="progress-bar-track mt-xs">
            <div class="progress-bar-fill" style="width: ${s.progress}%;"></div>
          </div>
        </div>
      `).join("")}
    </div>

    <!-- Milestones & Badges -->
    <div class="section-header">
      <h3 class="section-title">Academic Milestones</h3>
      <span class="badge badge-accent">3 Unlocked</span>
    </div>

    <div class="grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 20px;">
      <div class="card p-sm flex items-center gap-sm">
        <div style="font-size: 26px;">🔥</div>
        <div>
          <h4 class="text-xs font-bold text-forest">5-Day Streak</h4>
          <p class="text-xs text-muted">Consistent Learner</p>
        </div>
      </div>

      <div class="card p-sm flex items-center gap-sm">
        <div style="font-size: 26px;">🎯</div>
        <div>
          <h4 class="text-xs font-bold text-forest">Quiz Ace</h4>
          <p class="text-xs text-muted">>80% Accuracy</p>
        </div>
      </div>

      <div class="card p-sm flex items-center gap-sm">
        <div style="font-size: 26px;">📚</div>
        <div>
          <h4 class="text-xs font-bold text-forest">Bookworm</h4>
          <p class="text-xs text-muted">5+ PDFs Saved</p>
        </div>
      </div>

      <div class="card p-sm flex items-center gap-sm" style="opacity: 0.6;">
        <div style="font-size: 26px;">🏆</div>
        <div>
          <h4 class="text-xs font-bold text-muted">Board Ready</h4>
          <p class="text-xs text-muted">Unlock at 100%</p>
        </div>
      </div>
    </div>
  `;
}
