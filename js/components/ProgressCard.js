/**
 * DiplomaStudy - ProgressCard Component
 * Pure HTML/CSS statistics and progress overview
 */

export const ProgressCard = {
  render({ streak = 5, totalHours = 14.5, quizAccuracy = 82, completedTasks = 12 } = {}) {
    return `
      <div class="card mb-md" id="progress-overview-card">
        <div class="flex items-center justify-between mb-sm">
          <h3 class="text-base font-bold text-forest">Study Statistics</h3>
          <span class="badge badge-success">On Track 🔥</span>
        </div>

        <div class="grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 14px;">
          <div style="background-color: var(--color-surface-hover); padding: 12px; border-radius: var(--radius-sm);">
            <span class="text-xs text-muted">Daily Streak</span>
            <div class="flex items-center gap-xs mt-xs">
              <span style="font-size: 20px;">🔥</span>
              <span class="text-lg font-bold text-forest">${streak} Days</span>
            </div>
          </div>

          <div style="background-color: var(--color-surface-hover); padding: 12px; border-radius: var(--radius-sm);">
            <span class="text-xs text-muted">Quiz Accuracy</span>
            <div class="flex items-center gap-xs mt-xs">
              <span style="font-size: 20px;">🎯</span>
              <span class="text-lg font-bold text-forest">${quizAccuracy}%</span>
            </div>
          </div>

          <div style="background-color: var(--color-surface-hover); padding: 12px; border-radius: var(--radius-sm);">
            <span class="text-xs text-muted">Total Study Time</span>
            <div class="flex items-center gap-xs mt-xs">
              <span style="font-size: 20px;">⏱️</span>
              <span class="text-lg font-bold text-forest">${totalHours} hrs</span>
            </div>
          </div>

          <div style="background-color: var(--color-surface-hover); padding: 12px; border-radius: var(--radius-sm);">
            <span class="text-xs text-muted">Tasks Finished</span>
            <div class="flex items-center gap-xs mt-xs">
              <span style="font-size: 20px;">✅</span>
              <span class="text-lg font-bold text-forest">${completedTasks} Tasks</span>
            </div>
          </div>
        </div>

        <!-- Weekly Activity Mini Chart -->
        <div>
          <div class="flex items-center justify-between text-xs text-muted mb-xs">
            <span>Weekly Focus Activity</span>
            <span>4.2 hrs avg/day</span>
          </div>
          <div class="flex items-end justify-between" style="height: 52px; padding: 0 4px; gap: 6px;">
            ${[
              { day: "Sat", height: "45%" },
              { day: "Sun", height: "70%" },
              { day: "Mon", height: "85%" },
              { day: "Tue", height: "60%" },
              { day: "Wed", height: "90%" },
              { day: "Thu", height: "100%", active: true },
              { day: "Fri", height: "50%" }
            ].map((d) => `
              <div class="flex flex-col items-center flex-1" style="height: 100%; justify-content: flex-end; gap: 4px;">
                <div style="width: 100%; height: ${d.height}; background-color: ${d.active ? "var(--color-forest)" : "var(--color-sage)"}; border-radius: 3px 3px 0 0;"></div>
                <span style="font-size: 10px; color: var(--color-text-dim);">${d.day}</span>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `;
  }
};
