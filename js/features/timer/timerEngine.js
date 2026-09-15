/**
 * DiplomaStudy - Pomodoro & Focus Timer Engine
 * Accurate time keeping with background tracking and Web Audio synthesized chimes
 */

import { storage, STORAGE_KEYS } from "../../core/storage.js";
import { events } from "../../core/events.js";
import { state } from "../../core/state.js";

class TimerEngine {
  constructor() {
    this.intervalId = null;
    this.mode = "pomodoro"; // "pomodoro" (25m), "shortBreak" (5m), "longBreak" (15m), "custom"
    this.durations = {
      pomodoro: 25 * 60,
      shortBreak: 5 * 60,
      longBreak: 15 * 60,
      custom: 30 * 60
    };
    this.secondsLeft = this.durations.pomodoro;
    this.totalSeconds = this.durations.pomodoro;
    this.isRunning = false;
    this.sessionsCompleted = 0;
  }

  setMode(mode, customMinutes = 30) {
    this.pause();
    this.mode = mode;
    if (mode === "custom") {
      this.durations.custom = customMinutes * 60;
    }
    this.totalSeconds = this.durations[mode] || 25 * 60;
    this.secondsLeft = this.totalSeconds;
    this._syncState();
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.intervalId = setInterval(() => {
      if (this.secondsLeft > 0) {
        this.secondsLeft--;
        this._syncState();
      } else {
        this._complete();
      }
    }, 1000);
    this._syncState();
  }

  pause() {
    if (!this.isRunning) return;
    clearInterval(this.intervalId);
    this.intervalId = null;
    this.isRunning = false;
    this._syncState();
  }

  reset() {
    this.pause();
    this.secondsLeft = this.totalSeconds;
    this._syncState();
  }

  skip() {
    this.pause();
    if (this.mode === "pomodoro") {
      this.setMode("shortBreak");
    } else {
      this.setMode("pomodoro");
    }
  }

  _complete() {
    this.pause();
    this._playChime();

    if (this.mode === "pomodoro") {
      this.sessionsCompleted++;
      this._recordFocusTime(Math.round(this.totalSeconds / 60));
      events.emit("timer:sessionCompleted", this.sessionsCompleted);
      this.setMode("shortBreak");
    } else {
      this.setMode("pomodoro");
    }
  }

  _recordFocusTime(minutes) {
    const history = storage.get(STORAGE_KEYS.STUDY_HISTORY, {
      totalMinutes: 0,
      sessions: 0,
      dailyMinutes: {}
    });

    const today = new Date().toISOString().split("T")[0];
    history.totalMinutes = (history.totalMinutes || 0) + minutes;
    history.sessions = (history.sessions || 0) + 1;
    history.dailyMinutes[today] = (history.dailyMinutes[today] || 0) + minutes;

    storage.set(STORAGE_KEYS.STUDY_HISTORY, history);
  }

  _syncState() {
    state.setTimerState({
      isRunning: this.isRunning,
      mode: this.mode,
      secondsLeft: this.secondsLeft,
      totalSeconds: this.totalSeconds,
      completedSessions: this.sessionsCompleted
    });
    events.emit("timer:tick", {
      secondsLeft: this.secondsLeft,
      totalSeconds: this.totalSeconds,
      mode: this.mode,
      isRunning: this.isRunning
    });
  }

  _playChime() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch (err) {
      // Audio context may be restricted by autoplay policy
    }
  }
}

export const timerEngine = new TimerEngine();
