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

  setTimeout(function () {
    runPrefetch().catch(function () {});
  }, 150);
}

function delay(ms) {
  return new Promise(function (resolve) { setTimeout(resolve, ms); });
}

async function runPrefetch() {
  try {
    var departments = [];
    try {
      departments = await getDepartments();
    } catch (e) { return; }

    if (!departments || departments.length === 0) return;

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

    // Stagger requests so the server is not hit with many concurrent payloads at once.
    try {
      await getSemestersByDepartment(currentDept.id);
    } catch (e) {}

    await delay(150);

    try {
      await getSubjects();
    } catch (e) {}

    await delay(150);

    try {
      await getNotices();
    } catch (e) {}

    console.log("[Prefetch] Done");
  } catch (e) {
    console.warn("[Prefetch] Failed gracefully:", e);
  }
}