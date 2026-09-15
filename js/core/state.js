/**
 * DiplomaStudy - Central State Manager
 * Synchronizes with Storage and emits change events
 */

import { storage, STORAGE_KEYS } from "./storage.js";
import { events } from "./events.js";
import { APP_CONFIG } from "./config.js";

const initialSettings = storage.get(STORAGE_KEYS.SETTINGS, {
  userName: "Diploma Student",
  department: APP_CONFIG.defaultDepartment,
  semester: APP_CONFIG.defaultSemester,
  theme: APP_CONFIG.defaultTheme,
  dailyGoalMinutes: 45
});

class StateManager {
  constructor() {
    this._state = {
      currentRoute: "#/home",
      selectedDepartment: initialSettings.department || "computer",
      selectedSemester: initialSettings.semester || 1,
      selectedSubject: null,
      selectedChapter: null,
      theme: initialSettings.theme || "light",
      currentQuiz: null,
      timerState: {
        isRunning: false,
        mode: "pomodoro", // "pomodoro" (25m), "shortBreak" (5m), "longBreak" (15m), "custom"
        secondsLeft: 25 * 60,
        totalSeconds: 25 * 60,
        completedSessions: 0
      },
      userPreferences: {
        name: initialSettings.userName || "Student",
        dailyGoalMinutes: initialSettings.dailyGoalMinutes || 45
      }
    };

    // Apply initial theme to DOM documentElement
    this._applyTheme(this._state.theme);
  }

  get() {
    return this._state;
  }

  get currentRoute() { return this._state.currentRoute; }
  get selectedDepartment() { return this._state.selectedDepartment; }
  get selectedSemester() { return this._state.selectedSemester; }
  get selectedSubject() { return this._state.selectedSubject; }
  get selectedChapter() { return this._state.selectedChapter; }
  get theme() { return this._state.theme; }
  get currentQuiz() { return this._state.currentQuiz; }
  get timerState() { return this._state.timerState; }
  get userPreferences() { return this._state.userPreferences; }

  setDepartment(deptId) {
    this._state.selectedDepartment = deptId;
    this._persistSettings();
    events.emit("state:departmentChange", deptId);
  }

  setSemester(semId) {
    this._state.selectedSemester = parseInt(semId, 10);
    this._persistSettings();
    events.emit("state:semesterChange", this._state.selectedSemester);
  }

  setSubject(subject) {
    this._state.selectedSubject = subject;
    events.emit("state:subjectChange", subject);
  }

  setChapter(chapter) {
    this._state.selectedChapter = chapter;
    events.emit("state:chapterChange", chapter);
  }

  setRoute(route) {
    this._state.currentRoute = route;
    events.emit("state:routeChange", route);
  }

  setQuiz(quiz) {
    this._state.currentQuiz = quiz;
    events.emit("state:quizChange", quiz);
  }

  setTimerState(partial) {
    this._state.timerState = { ...this._state.timerState, ...partial };
    events.emit("state:timerChange", this._state.timerState);
  }

  setTheme(theme) {
    this._state.theme = theme;
    this._applyTheme(theme);
    this._persistSettings();
    events.emit("state:themeChange", theme);
  }

  toggleTheme() {
    const next = this._state.theme === "dark" ? "light" : "dark";
    this.setTheme(next);
  }

  updateUserProfile(name, dailyGoalMinutes) {
    this._state.userPreferences = {
      name: name || this._state.userPreferences.name,
      dailyGoalMinutes: parseInt(dailyGoalMinutes, 10) || this._state.userPreferences.dailyGoalMinutes
    };
    this._persistSettings();
    events.emit("state:userChange", this._state.userPreferences);
  }

  _applyTheme(theme) {
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }

  _persistSettings() {
    storage.set(STORAGE_KEYS.SETTINGS, {
      userName: this._state.userPreferences.name,
      department: this._state.selectedDepartment,
      semester: this._state.selectedSemester,
      theme: this._state.theme,
      dailyGoalMinutes: this._state.userPreferences.dailyGoalMinutes
    });
  }
}

export const state = new StateManager();
