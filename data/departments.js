/**
 * ⚠️ DEPRECATED — Hardcoded data removed
 * 
 * All department data now comes from Supabase via API.
 * This file exists only for backward compatibility.
 * 
 * To get real departments: import { getDepartments } from "../services/api.js"
 */

export const departments = [];

/**
 * @deprecated Use getDepartmentById from services/api.js
 */
export function getDepartmentById(id) {
  console.warn("[departments.js] Deprecated — use API instead");
  return null;
}

export default [];