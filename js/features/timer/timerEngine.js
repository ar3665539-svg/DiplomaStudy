/**
 * Timer Engine - Pomodoro Timer
 */

export const timerEngine = {
  _interval: null,
  _state: {
    seconds: 25 * 60,
    total: 25 * 60,
    running: false,
    mode: "focus"
  },
  _callbacks: {
    onTick: null,
    onComplete: null
  },

  MODES: {
    focus: { seconds: 25 * 60, label: "Focus" },
    shortBreak: { seconds: 5 * 60, label: "Short Break" },
    longBreak: { seconds: 15 * 60, label: "Long Break" }
  },

  init({ onTick, onComplete } = {}) {
    this._callbacks.onTick = onTick || null;
    this._callbacks.onComplete = onComplete || null;
  },

  getState() {
    return { ...this._state };
  },

  setMode(mode) {
    const cfg = this.MODES[mode];
    if (!cfg) return;
    this._state.mode = mode;
    this._state.total = cfg.seconds;
    this._state.seconds = cfg.seconds;
    this._state.running = false;
    this._clearInterval();
    if (this._callbacks.onTick) this._callbacks.onTick(this._state);
  },

  start() {
    if (this._state.running) return;
    this._state.running = true;

    this._interval = setInterval(() => {
      if (this._state.seconds > 0) {
        this._state.seconds--;
        if (this._callbacks.onTick) this._callbacks.onTick(this._state);
      } else {
        this._state.running = false;
        this._clearInterval();
        if (this._callbacks.onComplete) this._callbacks.onComplete(this._state);
      }
    }, 1000);
  },

  pause() {
    this._state.running = false;
    this._clearInterval();
    if (this._callbacks.onTick) this._callbacks.onTick(this._state);
  },

  toggle() {
    if (this._state.running) this.pause();
    else this.start();
  },

  reset() {
    this._state.seconds = this._state.total;
    this._state.running = false;
    this._clearInterval();
    if (this._callbacks.onTick) this._callbacks.onTick(this._state);
  },

  getProgress() {
    return 1 - this._state.seconds / this._state.total;
  },

  getTimeString() {
    const m = Math.floor(this._state.seconds / 60);
    const s = this._state.seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  },

  _clearInterval() {
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = null;
    }
  }
};

export default timerEngine;