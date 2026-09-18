/**
 * DiplomaStudy - Global State Manager
 */

import { storage, STORAGE_KEYS } from "./storage.js";
import { events, EVENTS } from "./events.js";

function loadState() {
  try {
    const settings = storage.get(STORAGE_KEYS.SETTINGS, {});
    return {
      selectedDepartment: settings.departmentId || settings.department || "",
      selectedSemester: settings.semesterId || settings.semester || "",
      semesterNumber: settings.semesterNumber || 1,
      userName: settings.userName || "Student"
    };
  } catch (e) {
    return {
      selectedDepartment: "",
      selectedSemester: "",
      semesterNumber: 1,
      userName: "Student"
    };
  }
}

const state = loadState();

export const appState = {
  get() { return { ...state }; },
  getDepartment() { return state.selectedDepartment; },
  getSemester() { return state.selectedSemester; },
  getSemesterNumber() { return state.semesterNumber; },
  getUserName() { return state.userName; },

  setDepartment(id) {
    state.selectedDepartment = id;
    const settings = storage.get(STORAGE_KEYS.SETTINGS, {});
    settings.department = id;
    settings.departmentId = id;
    storage.set(STORAGE_KEYS.SETTINGS, settings);
    events.emit(EVENTS.SELECTION_CHANGED, { department: id });
  },

  setSemester(id, number) {
    state.selectedSemester = id;
    if (number) state.semesterNumber = number;
    const settings = storage.get(STORAGE_KEYS.SETTINGS, {});
    settings.semester = id;
    settings.semesterId = id;
    if (number) settings.semesterNumber = number;
    storage.set(STORAGE_KEYS.SETTINGS, settings);
    events.emit(EVENTS.SELECTION_CHANGED, { semester: id, number });
  },

  setUserName(name) {
    state.userName = name;
    const settings = storage.get(STORAGE_KEYS.SETTINGS, {});
    settings.userName = name;
    storage.set(STORAGE_KEYS.SETTINGS, settings);
  }
};

// Backward compatibility aliases
export const state = {
  get selectedDepartment() { return state2.selectedDepartment; },
  get selectedSemester() { return state2.selectedSemester; },
  setDepartment: (id) => appState.setDepartment(id),
  setSemester: (id, n) => appState.setSemester(id, n)
};

const state2 = appState;

export default appState;