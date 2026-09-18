/**
 * DiplomaStudy User App - API Service v3
 * + Realtime-aware cache invalidation
 */

import { supabase } from '../core/supabase.js';

// ═══════════════════════════════════════════
// CACHE
// ═══════════════════════════════════════════
const CACHE_PREFIX = 'diplomastudy_cache_v2_';

function saveCache(key, data) {
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({
      data, cachedAt: Date.now()
    }));
  } catch (e) {}
}

function getCache(key, maxAgeMs = 24 * 60 * 60 * 1000) {
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
    const keys = Object.keys(localStorage).filter((k) => k.startsWith(CACHE_PREFIX));
    keys.forEach((k) => localStorage.removeItem(k));
  } catch (e) {}
}

/**
 * Invalidate cache keys matching a table/purpose
 * Example: invalidateCache('subjects') → removes subjects_*
 */
export function invalidateCache(pattern) {
  try {
    const keys = Object.keys(localStorage).filter((k) =>
      k.startsWith(CACHE_PREFIX) && k.includes(pattern)
    );
    keys.forEach((k) => localStorage.removeItem(k));
  } catch (e) {}
}

// Auto-invalidate on realtime changes
try {
  window.addEventListener("ds:content-change", (e) => {
    const { table } = e.detail || {};
    if (!table) return;

    // Map table → cache prefixes
    const mapping = {
      departments: ["departments"],
      semesters: ["semesters"],
      subjects: ["subjects"],
      subject_assignments: ["subjects"],
      chapters: ["chapters", "subjects"],
      topics: ["topics", "chapters"],
      questions: ["questions", "chapters"],
      suggestions: ["suggestions", "chapters"],
      formulas: ["formulas", "chapters"],
      pdfs: ["pdfs", "chapters"],
      notices: ["notices"],
      quizzes: ["quizzes"]
    };

    const prefixes = mapping[table] || [table];
    prefixes.forEach((p) => invalidateCache(p));
    console.log(`[API] Cache invalidated for: ${prefixes.join(", ")}`);
  });
} catch (e) {}

// ═══════════════════════════════════════════
// UTILITY: UUID check
// ═══════════════════════════════════════════
function isUUID(v) {
  return typeof v === "string" && v.length >= 30 && v.includes("-");
}

// ═══════════════════════════════════════════
// NORMALIZERS
// ═══════════════════════════════════════════
function normalizeDepartment(d) {
  if (!d) return null;
  return {
    id: d.id,
    name: d.name,
    banglaName: d.bangla_name || '',
    code: d.code || '',
    icon: d.icon || '🏛️',
    description: d.description || '',
    displayOrder: d.display_order || 0
  };
}

function normalizeSemester(s) {
  if (!s) return null;
  return {
    id: s.id,
    departmentId: s.department_id,
    name: s.name,
    number: s.number,
    icon: s.icon || '📅',
    displayOrder: s.display_order || 0
  };
}

function normalizeSubject(s) {
  if (!s) return null;
  return {
    id: s.id,
    name: s.name,
    banglaName: s.bangla_name || '',
    code: s.code || '',
    icon: s.icon || '📚',
    type: s.type || 'Theory',
    credits: s.credits || 3,
    description: s.description || '',
    banglaDesc: s.bangla_desc || '',
    department: s.department || '',
    semester: s.semester || 1,
    departmentId: s.department_id,
    semesterId: s.semester_id
  };
}

function normalizeChapter(c) {
  if (!c) return null;
  return {
    id: c.id,
    subjectId: c.subject_id,
    number: c.number,
    sortOrder: c.sort_order || 0,
    name: c.name,
    nameEn: c.name_en || '',
    icon: c.icon || '📖',
    category: c.category || '',
    description: c.description || ''
  };
}

function normalizeQuestion(q) {
  if (!q) return null;
  return {
    id: q.id,
    type: q.type,
    subjectId: q.subject_id,
    chapterId: q.chapter_id,
    question: q.question,
    questionEn: q.question_en || '',
    answer: q.answer,
    options: q.options || [],
    correctLetter: q.correct_letter || '',
    explanation: q.explanation || '',
    marks: q.marks || '',
    board: q.board || '',
    createdAt: q.created_at
  };
}

function normalizeSuggestion(s) {
  if (!s) return null;
  return {
    id: s.id,
    subjectId: s.subject_id,
    chapterId: s.chapter_id,
    title: s.title,
    category: s.category || 'Most Important',
    summary: s.summary,
    examTip: s.exam_tip || '',
    createdAt: s.created_at
  };
}

function normalizeFormula(f) {
  if (!f) return null;
  return {
    id: f.id,
    subjectId: f.subject_id,
    chapterId: f.chapter_id,
    name: f.name,
    equation: f.equation,
    explanation: f.explanation || '',
    example: f.example || '',
    createdAt: f.created_at
  };
}

function normalizePdf(p) {
  if (!p) return null;
  let publicUrl = null;
  if (p.file_path && p.file_path.trim() !== '') {
    const { data } = supabase.storage.from('pdfs').getPublicUrl(p.file_path);
    publicUrl = data?.publicUrl || null;
  } else if (p.file_url) {
    publicUrl = p.file_url;
  }
  return {
    id: p.id,
    subjectId: p.subject_id,
    chapterId: p.chapter_id,
    title: p.title,
    fileName: p.file_name || '',
    fileSize: p.file_size || '',
    filePath: p.file_path || '',
    fileUrl: publicUrl,
    description: p.description || '',
    createdAt: p.created_at
  };
}

function normalizeNotice(n) {
  if (!n) return null;
  return {
    id: n.id,
    title: n.title,
    content: n.content,
    audience: n.audience || 'all',
    departmentId: n.department_id,
    publishedAt: n.published_at,
    createdAt: n.created_at
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
    if (semNumber) { raw.semesterNumber = semNumber; }
    localStorage.setItem("diplomastudy_settings", JSON.stringify(raw));
  } catch (e) {}
}

// ═══════════════════════════════════════════
// DEPARTMENTS
// ═══════════════════════════════════════════
export async function getDepartments() {
  const cacheKey = "departments";
  try {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;

    if (data && data.length > 0) {
      const normalized = data.map(normalizeDepartment);
      saveCache(cacheKey, normalized);
      return normalized;
    }
    return getCache(cacheKey) || [];
  } catch (err) {
    console.warn('[API] getDepartments failed, using cache:', err.message);
    return getCache(cacheKey) || [];
  }
}

export async function getDepartmentById(id) {
  if (!id) return null;
  try {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return normalizeDepartment(data);
  } catch (err) {
    return null;
  }
}

// ═══════════════════════════════════════════
// SEMESTERS
// ═══════════════════════════════════════════
export async function getSemestersByDepartment(deptId) {
  if (!deptId) return [];
  const cacheKey = "semesters_" + deptId;
  try {
    const { data, error } = await supabase
      .from('semesters')
      .select('*')
      .eq('department_id', deptId)
      .eq('is_active', true)
      .order('number', { ascending: true });

    if (error) throw error;

    if (data && data.length > 0) {
      const normalized = data.map(normalizeSemester);
      saveCache(cacheKey, normalized);
      return normalized;
    }
    return getCache(cacheKey) || [];
  } catch (err) {
    return getCache(cacheKey) || [];
  }
}

export async function getAllSemesters() {
  const cacheKey = "semesters_all";
  try {
    const { data, error } = await supabase
      .from('semesters')
      .select('*')
      .eq('is_active', true)
      .order('number', { ascending: true });
    if (error) throw error;

    if (data && data.length > 0) {
      const normalized = data.map(normalizeSemester);
      saveCache(cacheKey, normalized);
      return normalized;
    }
    return getCache(cacheKey) || [];
  } catch (err) {
    return getCache(cacheKey) || [];
  }
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
    deptObj = depts.find((d) =>
      (d.code && d.code.toLowerCase() === String(deptId).toLowerCase()) ||
      (d.name && d.name.toLowerCase().includes(String(deptId).toLowerCase())) ||
      d.id === deptId
    );
    if (deptObj) deptId = deptObj.id;
    else if (depts.length > 0) { deptObj = depts[0]; deptId = depts[0].id; }
  } else {
    deptObj = depts.find((d) => d.id === deptId);
  }

  if (!deptId) return [];

  let semId = settings.semesterId || settings.semester || "";
  let semObj = null;
  const sems = await getSemestersByDepartment(deptId);

  if (!isUUID(semId) || !semId) {
    const semNumber = parseInt(settings.semesterNumber || settings.semester || 1, 10);
    semObj = sems.find((s) => s.id === semId || s.number === semNumber);
    if (semObj) semId = semObj.id;
    else if (sems.length > 0) { semObj = sems[0]; semId = sems[0].id; }
  } else {
    semObj = sems.find((s) => s.id === semId);
  }

  syncBackSettings(deptId, semId, semObj?.number);

  if (!semId) return getSubjectsByAssignment(deptId, null);
  return getSubjectsByAssignment(deptId, semId);
}

export async function getSubjectsByAssignment(deptId, semId) {
  if (!deptId) return [];
  const cacheKey = `subjects_${deptId}_${semId || 'all'}`;

  try {
    let query = supabase
      .from('subject_assignments')
      .select('subject_id')
      .eq('department_id', deptId)
      .eq('is_active', true);

    if (semId) query = query.eq('semester_id', semId);

    const { data: assignments, error: aErr } = await query;
    if (aErr) throw aErr;

    const subjectIds = [...new Set((assignments || []).map((a) => a.subject_id))];
    if (subjectIds.length === 0) {
      let legacy = supabase.from('subjects').select('*').eq('department_id', deptId).eq('is_active', true);
      if (semId) legacy = legacy.eq('semester_id', semId);
      const { data: legacyData } = await legacy.order('display_order', { ascending: true });
      if (legacyData && legacyData.length > 0) {
        const normalized = legacyData.map(normalizeSubject);
        saveCache(cacheKey, normalized);
        return normalized;
      }
      return getCache(cacheKey) || [];
    }

    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .in('id', subjectIds)
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;

    if (data && data.length > 0) {
      const normalized = data.map(normalizeSubject);
      saveCache(cacheKey, normalized);
      return normalized;
    }
    return getCache(cacheKey) || [];
  } catch (err) {
    return getCache(cacheKey) || [];
  }
}

export async function getSubjectById(id) {
  if (!id) return null;
  try {
    const { data, error } = await supabase.from('subjects').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return normalizeSubject(data);
  } catch (err) { return null; }
}

// ═══════════════════════════════════════════
// CHAPTERS
// ═══════════════════════════════════════════
export async function getChaptersBySubject(subjectId) {
  if (!subjectId) return [];
  const cacheKey = "chapters_" + subjectId;
  try {
    const { data, error } = await supabase
      .from('chapters')
      .select('*')
      .eq('subject_id', subjectId)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) throw error;

    if (data && data.length > 0) {
      const normalized = data.map(normalizeChapter);
      saveCache(cacheKey, normalized);
      return normalized;
    }
    return getCache(cacheKey) || [];
  } catch (err) { return getCache(cacheKey) || []; }
}

export async function getChaptersByCategory(subjectId) {
  const chapters = await getChaptersBySubject(subjectId);
  const groups = {};
  chapters.forEach((c) => {
    const key = c.category || "__uncategorized__";
    if (!groups[key]) groups[key] = [];
    groups[key].push(c);
  });
  return groups;
}

export async function getChapterById(chapterId) {
  if (!chapterId) return null;
  try {
    const { data, error } = await supabase.from('chapters').select('*').eq('id', chapterId).maybeSingle();
    if (error) throw error;
    return normalizeChapter(data);
  } catch (err) { return null; }
}

// ═══════════════════════════════════════════
// QUESTIONS
// ═══════════════════════════════════════════
export async function getQuestionsByChapter(chapterId, type = null) {
  if (!chapterId) return [];
  const cacheKey = 'questions_' + chapterId + (type ? '_' + type : '');
  try {
    let query = supabase
      .from('questions')
      .select('*')
      .eq('chapter_id', chapterId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    if (type) query = query.eq('type', type);
    const { data, error } = await query;
    if (error) throw error;
    if (data && data.length > 0) {
      const normalized = data.map(normalizeQuestion);
      saveCache(cacheKey, normalized);
      return normalized;
    }
    return getCache(cacheKey) || [];
  } catch (err) { return getCache(cacheKey) || []; }
}

// ═══════════════════════════════════════════
// SUGGESTIONS
// ═══════════════════════════════════════════
export async function getSuggestionsByChapter(chapterId) {
  if (!chapterId) return [];
  const cacheKey = 'suggestions_' + chapterId;
  try {
    const { data, error } = await supabase
      .from('suggestions')
      .select('*')
      .eq('chapter_id', chapterId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    if (error) throw error;
    if (data && data.length > 0) {
      const normalized = data.map(normalizeSuggestion);
      saveCache(cacheKey, normalized);
      return normalized;
    }
    return getCache(cacheKey) || [];
  } catch (err) { return getCache(cacheKey) || []; }
}

export async function getSuggestionsBySubject(subjectId) {
  if (!subjectId) return [];
  try {
    const { data, error } = await supabase
      .from('suggestions')
      .select('*')
      .eq('subject_id', subjectId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(normalizeSuggestion);
  } catch (err) { return []; }
}

// ═══════════════════════════════════════════
// FORMULAS
// ═══════════════════════════════════════════
export async function getFormulasByChapter(chapterId) {
  if (!chapterId) return [];
  const cacheKey = 'formulas_' + chapterId;
  try {
    const { data, error } = await supabase
      .from('formulas')
      .select('*')
      .eq('chapter_id', chapterId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    if (error) throw error;
    if (data && data.length > 0) {
      const normalized = data.map(normalizeFormula);
      saveCache(cacheKey, normalized);
      return normalized;
    }
    return getCache(cacheKey) || [];
  } catch (err) { return getCache(cacheKey) || []; }
}

// ═══════════════════════════════════════════
// PDFS
// ═══════════════════════════════════════════
export async function getPdfsByChapter(chapterId) {
  if (!chapterId) return [];
  const cacheKey = 'pdfs_' + chapterId;
  try {
    const { data, error } = await supabase
      .from('pdfs')
      .select('*')
      .eq('chapter_id', chapterId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    if (error) throw error;
    if (data && data.length > 0) {
      const normalized = data.map(normalizePdf);
      saveCache(cacheKey, normalized);
      return normalized;
    }
    return getCache(cacheKey) || [];
  } catch (err) { return getCache(cacheKey) || []; }
}

export async function getPdfsBySubject(subjectId) {
  if (!subjectId) return [];
  try {
    const { data, error } = await supabase
      .from('pdfs')
      .select('*')
      .eq('subject_id', subjectId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(normalizePdf);
  } catch (err) { return []; }
}

// ═══════════════════════════════════════════
// NOTICES
// ═══════════════════════════════════════════
export async function getNotices(deptId = null) {
  const cacheKey = "notices_" + (deptId || "all");
  try {
    const { data, error } = await supabase
      .from('notices')
      .select('*')
      .eq('is_active', true)
      .eq('is_published', true)
      .order('published_at', { ascending: false });
    if (error) throw error;

    let list = (data || []).map(normalizeNotice);

    if (deptId) {
      list = list.filter((n) => n.audience === "all" || n.departmentId === deptId);
    } else {
      list = list.filter((n) => n.audience === "all" || !n.departmentId);
    }

    if (list.length > 0) saveCache(cacheKey, list);
    return list.length > 0 ? list : (getCache(cacheKey) || []);
  } catch (err) { return getCache(cacheKey) || []; }
}

// ═══════════════════════════════════════════
// SEARCH
// ═══════════════════════════════════════════
export async function searchContent(query) {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  try {
    const { data: subData } = await supabase
      .from('subjects').select('*').eq('is_active', true)
      .or(`name.ilike.%${q}%,bangla_name.ilike.%${q}%,code.ilike.%${q}%`).limit(5);

    const { data: chData } = await supabase
      .from('chapters').select('*').eq('is_active', true)
      .or(`name.ilike.%${q}%,name_en.ilike.%${q}%,category.ilike.%${q}%`).limit(8);

    const results = [];
    (subData || []).forEach((s) => results.push({
      type: "subject", id: s.id, title: s.name, subtitle: s.code, icon: s.icon || "📚"
    }));
    (chData || []).forEach((c) => results.push({
      type: "chapter", id: c.id, title: c.name, subtitle: c.category || "",
      icon: c.icon || "📖", subjectId: c.subject_id
    }));
    return results;
  } catch (err) { return []; }
}

export { clearCache as clearAllCache };

console.log('[User App] ✅ API Service v3 loaded');