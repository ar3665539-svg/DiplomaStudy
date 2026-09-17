/**
 * DiplomaStudy User App - API Service
 * Supabase + localStorage cache
 * Field names normalized to camelCase
 * Chapters sorted by sort_order (server-side)
 */

import { supabase } from '../core/supabase.js';

// ═══════════════════════════════════════════
// CACHE
// ═══════════════════════════════════════════
const CACHE_PREFIX = 'diplomastudy_cache_';

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

// ═══════════════════════════════════════════
// FIELD NORMALIZERS
// ═══════════════════════════════════════════
function normalizeSubject(s) {
  if (!s) return null;
  return {
    id: s.id,
    name: s.name,
    banglaName: s.bangla_name || s.banglaName || '',
    code: s.code || '',
    icon: s.icon || '📚',
    type: s.type || 'Theory',
    credits: s.credits || 3,
    description: s.description || '',
    banglaDesc: s.bangla_desc || s.banglaDesc || '',
    department: s.department || 'civil',
    semester: s.semester || 1
  };
}

function normalizeChapter(c) {
  if (!c) return null;
  return {
    id: c.id,
    subjectId: c.subject_id || c.subjectId,
    number: c.number,
    sortOrder: c.sort_order || c.sortOrder || 0,
    name: c.name,
    nameEn: c.name_en || c.nameEn || '',
    icon: c.icon || '📖'
  };
}

function normalizeQuestion(q) {
  if (!q) return null;
  return {
    id: q.id,
    type: q.type,
    subjectId: q.subject_id || q.subjectId,
    chapterId: q.chapter_id || q.chapterId,
    question: q.question,
    questionEn: q.question_en || q.questionEn || '',
    answer: q.answer,
    options: q.options || [],
    correctLetter: q.correct_letter || '',
    explanation: q.explanation || '',
    marks: q.marks || '',
    board: q.board || '',
    createdAt: q.created_at || q.createdAt
  };
}

function normalizeSuggestion(s) {
  if (!s) return null;
  return {
    id: s.id,
    subjectId: s.subject_id || s.subjectId,
    chapterId: s.chapter_id || s.chapterId,
    title: s.title,
    category: s.category || 'Most Important',
    summary: s.summary,
    examTip: s.exam_tip || s.examTip || '',
    createdAt: s.created_at || s.createdAt
  };
}

function normalizeFormula(f) {
  if (!f) return null;
  return {
    id: f.id,
    subjectId: f.subject_id || f.subjectId,
    chapterId: f.chapter_id || f.chapterId,
    name: f.name,
    equation: f.equation,
    explanation: f.explanation || '',
    example: f.example || '',
    createdAt: f.created_at || f.createdAt
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
    subjectId: p.subject_id || p.subjectId,
    chapterId: p.chapter_id || p.chapterId,
    title: p.title,
    fileName: p.file_name || '',
    fileSize: p.file_size || '',
    filePath: p.file_path || '',
    fileUrl: publicUrl,
    createdAt: p.created_at || p.createdAt
  };
}

// ═══════════════════════════════════════════
// SUBJECTS
// ═══════════════════════════════════════════
export async function getSubjects() {
  let dept = "civil";
  let sem = 1;

  try {
    const settings = JSON.parse(localStorage.getItem("diplomastudy_settings") || "{}");
    if (settings.department) dept = settings.department;
    if (settings.semester) sem = settings.semester;
  } catch (e) {}

  const cacheKey = `subjects_${dept}_${sem}`;

  try {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .eq('department', dept)
      .eq('semester', sem)
      .order('id');

    if (error) throw error;

    if (data && data.length > 0) {
      const normalized = data.map(normalizeSubject);
      saveCache(cacheKey, normalized);
      return normalized;
    }
    return getCache(cacheKey) || [];
  } catch (err) {
    console.warn('[API] getSubjects failed, using cache:', err.message);
    return getCache(cacheKey) || [];
  }
}

export async function getSubjectById(id) {
  if (!id) return null;
  const subs = await getSubjects();
  return subs.find(s => s.id === id) || null;
}

// ═══════════════════════════════════════════
// CHAPTERS — ordered by sort_order (server)
// ═══════════════════════════════════════════
export async function getChaptersBySubject(subjectId) {
  try {
    const { data, error } = await supabase
      .from('chapters')
      .select('*')
      .eq('subject_id', subjectId)
      .order('sort_order', { ascending: true });

    if (error) throw error;

    if (data && data.length > 0) {
      const normalized = data.map(normalizeChapter);
      saveCache('chapters_' + subjectId, normalized);
      return normalized;
    }
    return getCache('chapters_' + subjectId) || [];
  } catch (err) {
    console.warn('[API] getChapters failed, using cache:', err.message);
    return getCache('chapters_' + subjectId) || [];
  }
}

export async function getChapterById(chapterId) {
  try {
    const { data, error } = await supabase
      .from('chapters')
      .select('*')
      .eq('id', chapterId)
      .maybeSingle();
    if (error) throw error;
    return normalizeChapter(data);
  } catch (err) {
    return null;
  }
}

// ═══════════════════════════════════════════
// QUESTIONS
// ═══════════════════════════════════════════
export async function getQuestionsByChapter(chapterId, type = null) {
  try {
    let query = supabase
      .from('questions')
      .select('*')
      .eq('chapter_id', chapterId)
      .order('created_at', { ascending: false });

    if (type) query = query.eq('type', type);

    const { data, error } = await query;
    if (error) throw error;

    const cacheKey = 'questions_' + chapterId + (type ? '_' + type : '');
    if (data && data.length > 0) {
      const normalized = data.map(normalizeQuestion);
      saveCache(cacheKey, normalized);
      return normalized;
    }
    return getCache(cacheKey) || [];
  } catch (err) {
    const cacheKey = 'questions_' + chapterId + (type ? '_' + type : '');
    return getCache(cacheKey) || [];
  }
}

// ═══════════════════════════════════════════
// SUGGESTIONS
// ═══════════════════════════════════════════
export async function getSuggestionsByChapter(chapterId) {
  try {
    const { data, error } = await supabase
      .from('suggestions')
      .select('*')
      .eq('chapter_id', chapterId)
      .order('created_at', { ascending: false });
    if (error) throw error;

    const cacheKey = 'suggestions_' + chapterId;
    if (data && data.length > 0) {
      const normalized = data.map(normalizeSuggestion);
      saveCache(cacheKey, normalized);
      return normalized;
    }
    return getCache(cacheKey) || [];
  } catch (err) {
    return getCache('suggestions_' + chapterId) || [];
  }
}

// ═══════════════════════════════════════════
// FORMULAS
// ═══════════════════════════════════════════
export async function getFormulasByChapter(chapterId) {
  try {
    const { data, error } = await supabase
      .from('formulas')
      .select('*')
      .eq('chapter_id', chapterId)
      .order('created_at', { ascending: false });
    if (error) throw error;

    const cacheKey = 'formulas_' + chapterId;
    if (data && data.length > 0) {
      const normalized = data.map(normalizeFormula);
      saveCache(cacheKey, normalized);
      return normalized;
    }
    return getCache(cacheKey) || [];
  } catch (err) {
    return getCache('formulas_' + chapterId) || [];
  }
}

// ═══════════════════════════════════════════
// PDFS
// ═══════════════════════════════════════════
export async function getPdfsByChapter(chapterId) {
  try {
    const { data, error } = await supabase
      .from('pdfs')
      .select('*')
      .eq('chapter_id', chapterId)
      .order('created_at', { ascending: false });
    if (error) throw error;

    const cacheKey = 'pdfs_' + chapterId;
    if (data && data.length > 0) {
      const normalized = data.map(normalizePdf);
      saveCache(cacheKey, normalized);
      return normalized;
    }
    return getCache(cacheKey) || [];
  } catch (err) {
    return getCache('pdfs_' + chapterId) || [];
  }
}

console.log('[User App] API Service loaded');