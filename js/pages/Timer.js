/**
 * DiplomaStudy - Focus & Pomodoro Timer Page View
 */

import { AppShell } from "../components/AppShell.js";
import { timerEngine } from "../features/timer/timerEngine.js";
import { events } from "../core/events.js";
import { storage, STORAGE_KEYS } from "../core/storage.js";

export function renderTimer() {
  AppShell.updateHeader({
    title: "Focus Study Timer",
    subtitle: "Pomodoro technique for deep work",
    showBack: true,
    showSearch: false
  });

  const main = AppShell.getMainView();
  if (!main) return;

  const studyHistory = storage.get(STORAGE_KEYS.STUDY_HISTORY, {
    totalMinutes: 780,
    sessions: 18,
    dailyMinutes: {}
  });

  const streak = storage.get(STORAGE_KEYS.STREAK, 5);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const currentMode = timerEngine.mode;
  const isRunning = timerEngine.isRunning;
  const timeDisplay = formatTime(timerEngine.secondsLeft);

  main.innerHTML = `
    <!-- Mode Switcher Tabs -->
    <div class="flex items-center justify-center gap-xs mb-lg">
      <button class="badge ${currentMode === "pomodoro" ? "badge-forest active" : "badge-sage"} timer-mode-chip" data-mode="pomodoro">Pomodoro (25m)</button>
      <button class="badge ${currentMode === "shortBreak" ? "badge-forest active" : "badge-sage"} timer-mode-chip" data-mode="shortBreak">Short Break (5m)</button>
      <button class="badge ${currentMode === "longBreak" ? "badge-forest active" : "badge-sage"} timer-mode-chip" data-mode="longBreak">Long Break (15m)</button>
    </div>

    <!-- Timer Visual Card -->
    <div class="card mb-lg p-xl text-center" style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 260px; background: radial-gradient(circle, var(--color-forest-soft) 0%, var(--color-surface) 70%);">
      <span class="badge badge-forest mb-sm text-xs" id="timer-status-badge">
        ${currentMode === "pomodoro" ? "🎯 Focus Session" : "☕ Rest Interval"}
      </span>

      <div class="text-4xl font-extrabold text-forest my-md" id="timer-digits-text" style="font-size: 56px; font-family: monospace; letter-spacing: 2px;">
        ${timeDisplay}
      </div>

      <!-- Control Buttons -->
      <div class="flex items-center gap-md mt-sm">
        <button class="btn btn-secondary btn-sm" id="btn-timer-reset" title="Reset Timer">
          Reset
        </button>

        <button class="btn btn-primary" id="btn-timer-toggle" style="padding: 12px 28px; font-size: 15px;">
          ${isRunning ? "Pause" : "Start Focus"}
        </button>

        <button class="btn btn-secondary btn-sm" id="btn-timer-skip" title="Skip Session">
          Skip
        </button>
      </div>
    </div>

    <!-- Focus Productivity Stats -->
    <div class="grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px;">
      <div class="card p-sm text-center">
        <span class="text-xs text-muted block">Today's Focus</span>
        <span class="text-base font-bold text-forest mt-xs block">${(studyHistory.totalMinutes / 60).toFixed(1)} hrs</span>
      </div>

      <div class="card p-sm text-center">
        <span class="text-xs text-muted block">Completed</span>
        <span class="text-base font-bold text-forest mt-xs block">${timerEngine.sessionsCompleted || studyHistory.sessions} Sets</span>
      </div>

      <div class="card p-sm text-center">
        <span class="text-xs text-muted block">Study Streak</span>
        <span class="text-base font-bold text-forest mt-xs block">${streak} Days 🔥</span>
      </div>
    </div>

    <!-- Study Tip -->
    <div class="card p-md" style="border-left: 3px solid var(--color-accent);">
      <h4 class="text-xs font-bold text-forest mb-xs">🧠 Active Recall Tip</h4>
      <p class="text-xs text-muted" style="line-height: 1.4;">
        Study for 25 minutes without checking notifications. When the chime sounds, take a 5-minute break to let your memory consolidate before the next session.
      </p>
    </div>
  `;

  // Bind Buttons
  const toggleBtn = main.querySelector("#btn-timer-toggle");
  const resetBtn = main.querySelector("#btn-timer-reset");
  const skipBtn = main.querySelector("#btn-timer-skip");
  const digitsEl = main.querySelector("#timer-digits-text");

  toggleBtn?.addEventListener("click", () => {
    if (timerEngine.isRunning) {
      timerEngine.pause();
      toggleBtn.textContent = "Resume Focus";
    } else {
      timerEngine.start();
      toggleBtn.textContent = "Pause";
    }
  });

  resetBtn?.addEventListener("click", () => {
    timerEngine.reset();
    if (digitsEl) digitsEl.textContent = formatTime(timerEngine.secondsLeft);
    if (toggleBtn) toggleBtn.textContent = "Start Focus";
  });

  skipBtn?.addEventListener("click", () => {
    timerEngine.skip();
    renderTimer();
  });

  main.querySelectorAll(".timer-mode-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const mode = chip.getAttribute("data-mode");
      timerEngine.setMode(mode);
      renderTimer();
    });
  });

  // Listen for timer ticks to update display smoothly
  const tickUnsub = events.on("timer:tick", ({ secondsLeft, isRunning: running }) => {
    if (digitsEl) {
      digitsEl.textContent = formatTime(secondsLeft);
    }
    if (toggleBtn) {
      toggleBtn.textContent = running ? "Pause" : "Resume Focus";
    }
  });
}
