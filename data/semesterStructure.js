/**
 * ⚠️ DEPRECATED — Hardcoded data removed
 * 
 * All semester data now comes from Supabase via API.
 * This file exists only for backward compatibility.
 * 
 * To get real semesters: import { getSemestersByDepartment } from "../services/api.js"
 */

export const semesters = [];

/**
 * @deprecated Use getSemestersByDepartment from services/api.js
 */
export function getSemesterById(id) {
  console.warn("[semesterStructure.js] Deprecated — use API instead");
  return null;
}

export default [];