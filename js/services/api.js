/**
 * DiplomaStudy User App - API Service v7
 * Fix: Questions now in ascending order (1, 2, 3...)
 */

import { supabase } from '../core/supabase.js';
import { getChaptersBySubject as getStaticChaptersBySubject } from '../../data/chapters.js';

// ═══════════════════════════════════════════
// MEMORY CACHE
// ═══════════════════════════════════════════
const MEM_TTL = 60000;
const _mem = new Map();
const _inflight = new Map();

function memGet(key) {
  const entry = _mem.get(key);
  if (!entry) return null;
  if (Date.now() - entry.t > MEM_TTL) { _mem.delete(key); return null; }
  return entry.p;
}
function memSet(key, promise) {
  _mem.set(key, { p: promise, t: Date.now() });
  promise.catch(() => { _mem.delete(key); });
  return promise;
}
function memClear(prefix) {
  if (!prefix) { _mem.clear(); return; }
  for (const k of _mem.keys()) {
    if (k.indexOf(prefix) === 0) _mem.delete(k);
  }
}

// ═══════════════════════════════════════════
// LOCALSTORAGE CACHE
// ═══════════════════════════════════════════
const CACHE_PREFIX = 'diplomastudy_cache_v2_';
const CACHE_TTL = 24 * 60 * 60 * 1000;

function saveCache(key, data) {
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ data: data, cachedAt: Date.now() }));
  } catch (e) {}
}
function getCache(key, maxAgeMs) {
  if (maxAgeMs === undefined) maxAgeMs = CACHE_TTL;
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.cachedAt > maxAgeMs) return null;
    return parsed.data;
  } catch (e) { return null; }
}
export function clearCache() {
  try {
    const keys = Object.keys(localStorage).filter(function (k) { return k.indexOf(CACHE_PREFIX) === 0; });
    keys.forEach(function (k) { localStorage.removeItem(k); });
  } catch (e) {}
  memClear();
}
export function invalidateCache(pattern) {
  try {
    const keys = Object.keys(localStorage).filter(function (k) {
      return k.indexOf(CACHE_PREFIX) === 0 && k.indexOf(pattern) !== -1;
    });
    keys.forEach(function (k) { localStorage.removeItem(k); });
  } catch (e) {}
  memClear(pattern);
}

// ═══════════════════════════════════════════
// CACHE-FIRST HELPER
// ═══════════════════════════════════════════
function hasData(v) {
  if (v == null) return false;
  if (Array.isArray(v)) return v.length > 0;
  return true;
}

function cacheFirst(memKey, cacheKey, fetchFn) {
  const mem = memGet(memKey);
  if (mem) return mem;

  const inFlight = _inflight.get(memKey);
  if (inFlight) return inFlight;

  const cached = getCache(cacheKey);
  if (hasData(cached)) {
    const refresh = Promise.resolve()
      .then(fetchFn)
      .then(function (fresh) {
        if (hasData(fresh)) {
          saveCache(cacheKey, fresh);
          memSet(memKey, Promise.resolve(fresh));
        }
        return fresh;
      })
      .catch(function () {
        return cached;
      })
      .finally(function () {
        _inflight.delete(memKey);
      });

    _inflight.set(memKey, refresh);
    return Promise.resolve(cached);
  }

  const p = Promise.resolve()
    .then(fetchFn)
    .then(function (fresh) {
      if (hasData(fresh)) {
        saveCache(cacheKey, fresh);
      }
      return fresh;
    })
    .finally(function () {
      _inflight.delete(memKey);
    });

  _inflight.set(memKey, p);
  return memSet(memKey, p);
}

// ═══════════════════════════════════════════
// EVENT LISTENER
// ═══════════════════════════════════════════
try {
  window.addEventListener("ds:content-change", function (e) {
    const table = (e.detail || {}).table;
    if (!table) return;
    const mapping = {
      departments: ["departments"], semesters: ["semesters"],
      subjects: ["subjects"], subject_assignments: ["subjects"],
      chapters: ["chapters", "subjects"], topics: ["topics", "chapters"],
      questions: ["questions", "chapters"], suggestions: ["suggestions", "chapters"],
      formulas: ["formulas", "chapters"], pdfs: ["pdfs", "chapters"],
      notices: ["notices"], quizzes: ["quizzes"]
    };
    const prefixes = mapping[table] || [table];
    prefixes.forEach(function (p) { invalidateCache(p); });
  });
} catch (e) {}

function isUUID(v) {
  return typeof v === "string" && v.length >= 30 && v.indexOf("-") !== -1;
}

// ═══════════════════════════════════════════
// NORMALIZERS
// ═══════════════════════════════════════════
const ICON_DEPT = "\uD83C\uDFDB\uFE0F";
const ICON_SEM  = "\uD83D\uDCC5";
const ICON_SUB  = "\uD83D\uDCDA";
const ICON_CHAP = "\uD83D\uDCD6";

function normalizeDepartment(d) {
  if (!d) return null;
  return {
    id: d.id, name: d.name, banglaName: d.bangla_name || '',
    code: d.code || '', icon: d.icon || ICON_DEPT,
    description: d.description || '', displayOrder: d.display_order || 0
  };
}
function normalizeSemester(s) {
  if (!s) return null;
  return {
    id: s.id, departmentId: s.department_id, name: s.name, number: s.number,
    icon: s.icon || ICON_SEM, displayOrder: s.display_order || 0
  };
}
function normalizeSubject(s) {
  if (!s) return null;
  return {
    id: s.id, name: s.name, banglaName: s.bangla_name || '', code: s.code || '',
    icon: s.icon || ICON_SUB, type: s.type || 'Theory', credits: s.credits || 3,
    description: s.description || '', department: s.department || '',
    semester: s.semester || 1, departmentId: s.department_id, semesterId: s.semester_id
  };
}
function getNumericSerial(value) {
  if (value === null || value === undefined || value === '') return 0;
  if (typeof value === 'number' && Number.isFinite(value)) return value;

  const str = String(value).trim();
  if (!str) return 0;

  const match = str.match(/-?\d+(?:\.\d+)?/);
  if (match) return Number(match[0]);

  const num = Number(str);
  return Number.isFinite(num) ? num : 0;
}

function sortChapters(list) {
  return (list || []).slice().sort(function (a, b) {
    const aSerial = getNumericSerial(a.number ?? a._serial ?? a.sortOrder ?? a.chapter_number ?? a.sort_order ?? 0);
    const bSerial = getNumericSerial(b.number ?? b._serial ?? b.sortOrder ?? b.chapter_number ?? b.sort_order ?? 0);
    if (aSerial !== bSerial) return aSerial - bSerial;

    const aSort = getNumericSerial(a.sortOrder ?? a.sort_order ?? a._serial ?? a.number ?? 0);
    const bSort = getNumericSerial(b.sortOrder ?? b.sort_order ?? b._serial ?? b.number ?? 0);
    if (aSort !== bSort) return aSort - bSort;

    const aText = String(a.name || a.number || '');
    const bText = String(b.name || b.number || '');
    return aText.localeCompare(bText, 'bn');
  });
}

function normalizeChapter(c) {
  if (!c) return null;
  const rawNumber = c.number ?? c.chapter_number ?? c.sort_order ?? 0;
  const parsedNumber = getNumericSerial(rawNumber);
  const parsedSort = getNumericSerial(c.sort_order ?? c.number ?? c.chapter_number ?? 0);
  return {
    id: c.id, subjectId: c.subject_id,
    number: rawNumber,
    sortOrder: parsedSort,
    name: c.name, nameEn: c.name_en || '',
    icon: c.icon || ICON_CHAP, category: c.category || '', description: c.description || '',
    _serial: parsedNumber
  };
}
function normalizeQuestion(q) {
  if (!q) return null;
  return {
    id: q.id, type: q.type, subjectId: q.subject_id, chapterId: q.chapter_id,
    question: q.question, questionEn: q.question_en || '', answer: q.answer,
    options: q.options || [], correctLetter: q.correct_letter || '',
    explanation: q.explanation || '', marks: q.marks || '', board: q.board || '',
    createdAt: q.created_at
  };
}
function normalizeSuggestion(s) {
  if (!s) return null;
  return {
    id: s.id, subjectId: s.subject_id, chapterId: s.chapter_id,
    title: s.title, category: s.category || 'Most Important',
    summary: s.summary, examTip: s.exam_tip || '', createdAt: s.created_at
  };
}
function normalizeFormula(f) {
  if (!f) return null;
  return {
    id: f.id, subjectId: f.subject_id, chapterId: f.chapter_id,
    name: f.name, equation: f.equation, explanation: f.explanation || '',
    example: f.example || '', createdAt: f.created_at
  };
}
function normalizePdf(p) {
  if (!p) return null;
  let publicUrl = null;
  if (p.file_path && p.file_path.trim() !== '') {
    const result = supabase.storage.from('pdfs').getPublicUrl(p.file_path);
    publicUrl = (result.data && result.data.publicUrl) || null;
  } else if (p.file_url) { publicUrl = p.file_url; }
  return {
    id: p.id, subjectId: p.subject_id, chapterId: p.chapter_id, title: p.title,
    fileName: p.file_name || '', fileSize: p.file_size || '', filePath: p.file_path || '',
    fileUrl: publicUrl, description: p.description || '', createdAt: p.created_at
  };
}
function normalizeNotice(n) {
  if (!n) return null;
  return {
    id: n.id, title: n.title, content: n.content, audience: n.audience || 'all',
    departmentId: n.department_id, publishedAt: n.published_at, createdAt: n.created_at
  };
}

// ═══════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════
function getSettings() {
  try {
    const s = JSON.parse(localStorage.getItem("diplomastudy_settings") || "{}");
    return {
      departmentId: s.departmentId || s.department || "",
      semesterId: s.semesterId || s.semester || "",
      department: s.department || "",
      semester: s.semester || 1,
      semesterNumber: s.semesterNumber || s.semester || 1
    };
  } catch (e) {
    return { departmentId: "", semesterId: "", department: "", semester: 1, semesterNumber: 1 };
  }
}
function syncBackSettings(deptId, semId, semNumber) {
  try {
    const raw = JSON.parse(localStorage.getItem("diplomastudy_settings") || "{}");
    if (deptId) { raw.departmentId = deptId; raw.department = deptId; }
    if (semId) { raw.semesterId = semId; raw.semester = semId; }
    if (semNumber) raw.semesterNumber = semNumber;
    localStorage.setItem("diplomastudy_settings", JSON.stringify(raw));
  } catch (e) {}
}

// ═══════════════════════════════════════════
// DEPARTMENTS
// ═══════════════════════════════════════════
export async function getDepartments() {
  return cacheFirst("departments", "departments", async function () {
    try {
      const res = await supabase.from('departments').select('*').eq('is_active', true)
        .order('display_order', { ascending: true });
      if (res.error) throw res.error;
      return (res.data || []).map(normalizeDepartment);
    } catch (err) { return []; }
  });
}

export async function getDepartmentById(id) {
  if (!id) return null;
  return cacheFirst("dept_" + id, "dept_" + id, async function () {
    try {
      const res = await supabase.from('departments').select('*').eq('id', id).maybeSingle();
      if (res.error) throw res.error;
      return normalizeDepartment(res.data);
    } catch (err) { return null; }
  });
}

// ═══════════════════════════════════════════
// SEMESTERS
// ═══════════════════════════════════════════
export async function getSemestersByDepartment(deptId) {
  if (!deptId) return [];
  return cacheFirst("semesters_" + deptId, "semesters_" + deptId, async function () {
    try {
      const res = await supabase.from('semesters').select('*')
        .eq('department_id', deptId).eq('is_active', true)
        .order('number', { ascending: true });
      if (res.error) throw res.error;
      return (res.data || []).map(normalizeSemester);
    } catch (err) { return []; }
  });
}

export async function getAllSemesters() {
  return cacheFirst("semesters_all", "semesters_all", async function () {
    try {
      const res = await supabase.from('semesters').select('*').eq('is_active', true)
        .order('number', { ascending: true });
      if (res.error) throw res.error;
      return (res.data || []).map(normalizeSemester);
    } catch (err) { return []; }
  });
}

// ═══════════════════════════════════════════
// SUBJECTS
// ═══════════════════════════════════════════
export async function getSubjects() {
  const settings = getSettings();
  let deptId = settings.departmentId || settings.department || "";
  let deptObj = null;
  const depts = await getDepartments();

  if (!isUUID(deptId) || !deptId) {
    deptObj = depts.find(function (d) {
      return (d.code && d.code.toLowerCase() === String(deptId).toLowerCase()) ||
             (d.name && d.name.toLowerCase().indexOf(String(deptId).toLowerCase()) !== -1) ||
             d.id === deptId;
    });
    if (deptObj) deptId = deptObj.id;
    else if (depts.length > 0) { deptObj = depts[0]; deptId = depts[0].id; }
  } else {
    deptObj = depts.find(function (d) { return d.id === deptId; });
  }
  if (!deptId) return [];

  let semId = settings.semesterId || settings.semester || "";
  let semObj = null;
  const sems = await getSemestersByDepartment(deptId);

  if (!isUUID(semId) || !semId) {
    const semNumber = parseInt(settings.semesterNumber || settings.semester || 1, 10);
    semObj = sems.find(function (s) { return s.id === semId || s.number === semNumber; });
    if (semObj) semId = semObj.id;
    else if (sems.length > 0) { semObj = sems[0]; semId = sems[0].id; }
  } else {
    semObj = sems.find(function (s) { return s.id === semId; });
  }

  syncBackSettings(deptId, semId, semObj && semObj.number);
  if (!semId) return getSubjectsByAssignment(deptId, null);
  return getSubjectsByAssignment(deptId, semId);
}

// ═══════════════════════════════════════════
// RECENT SUBJECT ACTIVITY
// Optional Supabase table: recent_subjects
// Columns: device_id, subject_id, accessed_at
// ═══════════════════════════════════════════
function getDeviceId() {
  const key = "diplomastudy_device_id";
  try {
    let id = localStorage.getItem(key);
    if (!id) {
      id = "device_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 10);
      localStorage.setItem(key, id);
    }
    return id;
  } catch (e) {
    return "anonymous";
  }
}

export async function recordRecentSubject(subjectId) {
  if (!subjectId) return false;
  try {
    const key = "diplomastudy_recent_subjects";
    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    const list = existing.filter(function (item) { return item.id !== subjectId; });
    list.unshift({ id: subjectId, at: Date.now() });
    localStorage.setItem(key, JSON.stringify(list.slice(0, 8)));
  } catch (e) {}

  if (typeof navigator === "undefined" || !navigator.onLine) return false;
  try {
    const res = await supabase.from("recent_subjects").upsert({
      device_id: getDeviceId(),
      subject_id: subjectId,
      accessed_at: new Date().toISOString()
    }, { onConflict: "device_id,subject_id" });
    return !res.error;
  } catch (e) {
    return false;
  }
}

export async function getRecentSubjectsFromServer(subjectIds = []) {
  if (!subjectIds.length || typeof navigator === "undefined" || !navigator.onLine) return [];
  try {
    const res = await supabase.from("recent_subjects")
      .select("subject_id,accessed_at")
      .eq("device_id", getDeviceId())
      .in("subject_id", subjectIds)
      .order("accessed_at", { ascending: false })
      .limit(8);
    if (res.error) return [];
    return (res.data || []).map(function (item) {
      return { id: item.subject_id, at: item.accessed_at };
    });
  } catch (e) {
    return [];
  }
}

export async function getSubjectsByAssignment(deptId, semId) {
  if (!deptId) return [];
  const key = "subjects_" + deptId + "_" + (semId || "all");
  return cacheFirst(key, key, async function () {
    try {
      let query = supabase.from('subject_assignments').select('subject_id')
        .eq('department_id', deptId).eq('is_active', true);
      if (semId) query = query.eq('semester_id', semId);
      const aRes = await query;
      if (aRes.error) throw aRes.error;

      const subjectIds = [];
      const seen = {};
      (aRes.data || []).forEach(function (a) {
        if (!seen[a.subject_id]) { seen[a.subject_id] = true; subjectIds.push(a.subject_id); }
      });

      if (subjectIds.length === 0) {
        let legacy = supabase.from('subjects').select('*')
          .eq('department_id', deptId).eq('is_active', true);
        if (semId) legacy = legacy.eq('semester_id', semId);
        const lRes = await legacy.order('display_order', { ascending: true });
        return (lRes.data || []).map(normalizeSubject);
      }

      const sRes = await supabase.from('subjects').select('*')
        .in('id', subjectIds).eq('is_active', true)
        .order('display_order', { ascending: true });
      if (sRes.error) throw sRes.error;
      return (sRes.data || []).map(normalizeSubject);
    } catch (err) { return []; }
  });
}

export async function getSubjectById(id) {
  if (!id) return null;
  return cacheFirst("subject_" + id, "subject_" + id, async function () {
    try {
      const res = await supabase.from('subjects').select('*').eq('id', id).maybeSingle();
      if (res.error) throw res.error;
      return normalizeSubject(res.data);
    } catch (err) { return null; }
  });
}

// ═══════════════════════════════════════════
// CHAPTERS
// ═══════════════════════════════════════════
export async function getChaptersBySubject(subjectId) {
  if (!subjectId) return [];
  return cacheFirst("chapters_" + subjectId, "chapters_" + subjectId, async function () {
    const staticChapters = getStaticChaptersBySubject(subjectId);
    if (subjectId === "bangla" && staticChapters.length > 0) return staticChapters.slice();

    try {
      const res = await supabase.from('chapters').select('*')
        .eq('subject_id', subjectId).eq('is_active', true)
        .order('sort_order', { ascending: true });
      if (res.error) throw res.error;

      const list = (res.data || []).map(normalizeChapter).filter(Boolean);
      return sortChapters(list);
    } catch (err) { return []; }
  });
}

export async function getChapterById(chapterId) {
  if (!chapterId) return null;
  return cacheFirst("chapter_" + chapterId, "chapter_" + chapterId, async function () {
    try {
      const res = await supabase.from('chapters').select('*').eq('id', chapterId).maybeSingle();
      if (res.error) throw res.error;
      return normalizeChapter(res.data);
    } catch (err) { return null; }
  });
}

// ═══════════════════════════════════════════
// QUESTIONS - FIXED: ascending order (1, 2, 3...)
// ═══════════════════════════════════════════
export async function getQuestionsByChapter(chapterId, type) {
  if (!chapterId) return [];
  const key = "questions_v2_" + chapterId + "_" + (type || "all");
  return cacheFirst(key, "questions_v2_" + chapterId + (type ? "_" + type : ""), async function () {
    try {
      let query = supabase.from('questions').select('*')
        .eq('chapter_id', chapterId).eq('is_active', true)
        .order('created_at', { ascending: true });
      if (type) query = query.eq('type', type);
      const res = await query;
      if (res.error) throw res.error;
      return (res.data || []).map(normalizeQuestion);
    } catch (err) { return []; }
  });
}

// ═══════════════════════════════════════════
// SUGGESTIONS
// ═══════════════════════════════════════════
export async function getSuggestionsByChapter(chapterId) {
  if (!chapterId) return [];
  return cacheFirst("suggestions_" + chapterId, "suggestions_" + chapterId, async function () {
    try {
      const res = await supabase.from('suggestions').select('*')
        .eq('chapter_id', chapterId).eq('is_active', true)
        .order('created_at', { ascending: true });
      if (res.error) throw res.error;
      return (res.data || []).map(normalizeSuggestion);
    } catch (err) { return []; }
  });
}

export async function getSuggestionsBySubject(subjectId) {
  if (!subjectId) return [];
  return cacheFirst("suggestions_subj_" + subjectId, "suggestions_subj_" + subjectId, async function () {
    try {
      const res = await supabase.from('suggestions').select('*')
        .eq('subject_id', subjectId).eq('is_active', true)
        .order('created_at', { ascending: true });
      if (res.error) throw res.error;
      return (res.data || []).map(normalizeSuggestion);
    } catch (err) { return []; }
  });
}

// ═══════════════════════════════════════════
// FORMULAS
// ═══════════════════════════════════════════
export async function getFormulasByChapter(chapterId) {
  if (!chapterId) return [];
  return cacheFirst("formulas_" + chapterId, "formulas_" + chapterId, async function () {
    try {
      const res = await supabase.from('formulas').select('*')
        .eq('chapter_id', chapterId).eq('is_active', true)
        .order('created_at', { ascending: true });
      if (res.error) throw res.error;
      return (res.data || []).map(normalizeFormula);
    } catch (err) { return []; }
  });
}

// ═══════════════════════════════════════════
// PDFS
// ═══════════════════════════════════════════
export async function getPdfsByChapter(chapterId) {
  if (!chapterId) return [];
  return cacheFirst("pdfs_" + chapterId, "pdfs_" + chapterId, async function () {
    try {
      const res = await supabase.from('pdfs').select('*')
        .eq('chapter_id', chapterId).eq('is_active', true)
        .order('created_at', { ascending: true });
      if (res.error) throw res.error;
      return (res.data || []).map(normalizePdf);
    } catch (err) { return []; }
  });
}

export async function getPdfsBySubject(subjectId) {
  if (!subjectId) return [];
  return cacheFirst("pdfs_subj_" + subjectId, "pdfs_subj_" + subjectId, async function () {
    try {
      const res = await supabase.from('pdfs').select('*')
        .eq('subject_id', subjectId).eq('is_active', true)
        .order('created_at', { ascending: true });
      if (res.error) throw res.error;
      return (res.data || []).map(normalizePdf);
    } catch (err) { return []; }
  });
}

// ═══════════════════════════════════════════
// NOTICES
// ═══════════════════════════════════════════
export async function getNotices(deptId) {
  const key = "notices_" + (deptId || "all");
  return cacheFirst(key, key, async function () {
    try {
      const res = await supabase.from('notices').select('*')
        .eq('is_active', true).eq('is_published', true)
        .order('published_at', { ascending: false });
      if (res.error) throw res.error;
      let list = (res.data || []).map(normalizeNotice);
      if (deptId) {
        list = list.filter(function (n) { return n.audience === "all" || n.departmentId === deptId; });
      } else {
        list = list.filter(function (n) { return n.audience === "all" || !n.departmentId; });
      }
      return list;
    } catch (err) { return []; }
  });
}

// ═══════════════════════════════════════════
// SEARCH
// ═══════════════════════════════════════════
export async function searchContent(query) {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  try {
    const subP = supabase.from('subjects').select('*').eq('is_active', true)
      .or('name.ilike.%' + q + '%,bangla_name.ilike.%' + q + '%,code.ilike.%' + q + '%').limit(5);
    const chP = supabase.from('chapters').select('*').eq('is_active', true)
      .or('name.ilike.%' + q + '%,name_en.ilike.%' + q + '%,category.ilike.%' + q + '%').limit(8);
    const results = await Promise.all([subP, chP]);
    const subData = results[0].data || [];
    const chData = results[1].data || [];
    const out = [];
    subData.forEach(function (s) {
      out.push({ type: "subject", id: s.id, title: s.name, subtitle: s.code, icon: s.icon || ICON_SUB });
    });
    chData.forEach(function (c) {
      out.push({ type: "chapter", id: c.id, title: c.name, subtitle: c.category || "", icon: c.icon || ICON_CHAP, subjectId: c.subject_id });
    });
    return out;
  } catch (err) { return []; }
}

console.log('[User App] API Service v7 loaded (ascending questions)');