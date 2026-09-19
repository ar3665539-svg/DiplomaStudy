/**
 * Prefetch - Load frequently used data in background after app boots.
 */

import {
  getDepartments,
  getSemestersByDepartment,
  getSubjects,
  getNotices
} from "../services/api.js";

import { storage, STORAGE_KEYS } from "./storage.js";

var _started = false;

export function startPrefetch() {
  if (_started) return;
  _started = true;

  // Wait a tiny bit so the initial page render isn't delayed
  setTimeout(function () {
    runPrefetch().catch(function () {});
  }, 100);
}

async function runPrefetch() {
  // 1. Departments (fast, needed everywhere)
  var departments = [];
  try {
    departments = await getDepartments();
  } catch (e) { return; }

  if (!departments || departments.length === 0) return;

  // 2. Determine current department from settings
  var settings = {};
  try {
    settings = storage.get(STORAGE_KEYS.SETTINGS, {}) || {};
  } catch (e) {}

  var curDeptKey = settings.department || settings.departmentId || "";
  var currentDept = null;
  if (curDeptKey) {
    currentDept = departments.filter(function (d) {
      return d.id === curDeptKey ||
             (d.code && d.code.toLowerCase() === String(curDeptKey).toLowerCase());
    })[0];
  }
  if (!currentDept) currentDept = departments[0];

  // 3. Semesters for current department
  var semesters = [];
  try {
    semesters = await getSemestersByDepartment(currentDept.id);
  } catch (e) {}

  // 4. Subjects (uses current settings internally)
  try {
    await getSubjects();
  } catch (e) {}

  // 5. Notices
  try {
    await getNotices();
  } catch (e) {}

  // 6. Also prefetch other departments' semesters (in background, low priority)
  //    Skip for now to keep it fast.

  console.log("[Prefetch] Done");
}