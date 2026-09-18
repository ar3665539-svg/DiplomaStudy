/**
 * Timer — Pomodoro Study Timer
 */

import { AppShell } from "../components/AppShell.js";
import { Toast } from "../components/Toast.js";

let timerInterval = null;
let timerState = {
  seconds: 25 * 60,
  total: 25 * 60,
  running: false,
  mode: "focus" // focus | break
};

export function renderTimer() {
  AppShell.updateHeader({
    title: "Study Timer",
    subtitle: "Pomodoro",
    showBack: true,
    showSearch: false,
    showTheme: true,
    showSettings: false
  });

  const main = AppShell.getMainView();
  if (!main) return;

  // Cleanup previous
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }

  render();

  function render() {
    const m = Math.floor(timerState.seconds / 60);
    const s = timerState.seconds % 60;
    const timeStr = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    const progress = 1 - timerState.seconds / timerState.total;
    const circumference = 2 * Math.PI * 90;
    const dashOffset = circumference * (1 - progress);

    const isFocus = timerState.mode === "focus";
    const accentColor = isFocus ? "#1C3E2C" : "#0891B2";

    main.innerHTML = `
      <div style="text-align:center;padding:20px 0;">
        <div style="display:flex;justify-content:center;gap:6px;margin-bottom:28px;">
          <button class="mode-btn" data-mode="focus" style="padding:9px 18px;background:${isFocus ? "linear-gradient(135deg,#1C3E2C,#2A5540)" : "#FFFFFF"};color:${isFocus ? "#FFFFFF" : "#57675D"};border:1.5px solid ${isFocus ? "#1C3E2C" : "#E1E8E1"};border-radius:999px;font-size:12.5px;font-weight:800;cursor:pointer;font-family:inherit;">🎯 Focus</button>
          <button class="mode-btn" data-mode="break" style="padding:9px 18px;background:${!isFocus ? "linear-gradient(135deg,#0891B2,#0E7490)" : "#FFFFFF"};color:${!isFocus ? "#FFFFFF" : "#57675D"};border:1.5px solid ${!isFocus ? "#0891B2" : "#E1E8E1"};border-radius:999px;font-size:12.5px;font-weight:800;cursor:pointer;font-family:inherit;">☕ Break</button>
        </div>

        <div style="position:relative;width:240px;height:240px;margin:0 auto 32px;">
          <svg width="240" height="240" style="transform:rotate(-90deg);">
            <circle cx="120" cy="120" r="90" stroke="#E8EFE8" stroke-width="12" fill="none" />
            <circle cx="120" cy="120" r="90" stroke="${accentColor}" stroke-width="12" fill="none" stroke-linecap="round" stroke-dasharray="${circumference}" stroke-dashoffset="${dashOffset}" style="transition:stroke-dashoffset 0.5s ease;" />
          </svg>
          <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;">
            <div style="font-size:52px;font-weight:900;color:${accentColor};letter-spacing:-2px;font-family:ui-monospace,monospace;line-height:1;">${timeStr}</div>
            <div style="font-size:11px;font-weight:800;color:#84968B;text-transform:uppercase;letter-spacing:1px;margin-top:8px;">${isFocus ? "Focus Time" : "Break Time"}</div>
          </div>
        </div>

        <div style="display:flex;justify-content:center;gap:10px;margin-bottom:20px;">
          <button id="start-btn" style="padding:14px 32px;background:linear-gradient(135deg,#1C3E2C,#2A5540);color:#FFFFFF;border:none;border-radius:14px;font-weight:800;font-size:14.5px;cursor:pointer;font-family:inherit;box-shadow:0 8px 20px -4px rgba(28,62,44,0.4);">
            ${timerState.running ? "⏸ Pause" : "▶️ Start"}
          </button>
          <button id="reset-btn" style="padding:14px 24px;background:#FFFFFF;color:#1C3E2C;border:1.5px solid #E1E8E1;border-radius:14px;font-weight:800;font-size:14.5px;cursor:pointer;font-family:inherit;">
            🔄 Reset
          </button>
        </div>

        <div style="padding:14px;background:#F8FBF8;border-radius:14px;border:1px solid #E1E8E1;max-width:320px;margin:0 auto;">
          <div style="font-size:11.5px;color:#57675D;line-height:1.6;font-weight:600;">
            💡 Pomodoro Technique: ২৫ মিনিট পড়ুন → ৫ মিনিট break। ৪ সাইকেল শেষে ১৫ মিনিট লম্বা break।
          </div>
        </div>
      </div>
    `;

    main.querySelector("#start-btn")?.addEventListener("click", toggleTimer);
    main.querySelector("#reset-btn")?.addEventListener("click", resetTimer);

    main.querySelectorAll(".mode-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const mode = btn.getAttribute("data-mode");
        if (timerState.running) {
          Toast.warning("আগে timer বন্ধ করুন");
          return;
        }
        timerState.mode = mode;
        timerState.total = mode === "focus" ? 25 * 60 : 5 * 60;
        timerState.seconds = timerState.total;
        render();
      });
    });
  }

  function toggleTimer() {
    if (timerState.running) {
      // Pause
      timerState.running = false;
      if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
      render();
    } else {
      // Start
      timerState.running = true;
      render();
      timerInterval = setInterval(() => {
        if (timerState.seconds > 0) {
          timerState.seconds--;
          updateDisplay();
        } else {
          // Done
          clearInterval(timerInterval);
          timerInterval = null;
          timerState.running = false;
          playBeep();
          Toast.success(timerState.mode === "focus" ? "✅ Focus complete!" : "☕ Break over!");
          timerState.seconds = timerState.total;
          render();
        }
      }, 1000);
    }
  }

  function updateDisplay() {
    const m = Math.floor(timerState.seconds / 60);
    const s = timerState.seconds % 60;
    const timeStr = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    const progress = 1 - timerState.seconds / timerState.total;
    const circumference = 2 * Math.PI * 90;
    const dashOffset = circumference * (1 - progress);

    const timeEl = main.querySelector("div[style*='font-family:ui-monospace']");
    if (timeEl) timeEl.textContent = timeStr;

    const circle = main.querySelector("circle[stroke-dasharray]");
    if (circle) circle.setAttribute("stroke-dashoffset", dashOffset);
  }

  function resetTimer() {
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
    timerState.running = false;
    timerState.seconds = timerState.total;
    render();
  }

  function playBeep() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.value = 800;
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1);
      osc.start();
      osc.stop(audioCtx.currentTime + 1);
    } catch (e) {}
  }
}