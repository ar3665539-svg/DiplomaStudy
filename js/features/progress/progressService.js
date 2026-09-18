/**
 * Progress Feature - Service
 */

const STORAGE_KEY = "diplomastudy_progress";

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { chapters: {}, subjects: {}, lastRead: null };
  } catch (e) { return { chapters: {}, subjects: {}, lastRead: null }; }
}

function save(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
  catch (e) {}
}

export const progressService = {
  getAll() { return load(); },

  markChapterRead(chapterId, meta = {}) {
    const data = load();
    if (!data.chapters[chapterId]) {
      data.chapters[chapterId] = { id: chapterId, firstReadAt: Date.now(), readCount: 0, ...meta };
    }
    data.chapters[chapterId].readCount = (data.chapters[chapterId].readCount || 0) + 1;
    data.chapters[chapterId].lastReadAt = Date.now();
    data.lastRead = { chapterId, ...meta, at: Date.now() };
    save(data);
  },

  isChapterRead(chapterId) {
    return !!load().chapters[chapterId];
  },

  getChapterReadCount(chapterId) {
    return load().chapters[chapterId]?.readCount || 0;
  },

  getSubjectProgress(subjectId, totalChapters = 0) {
    const data = load();
    const readInSubject = Object.values(data.chapters).filter((c) => c.subjectId === subjectId).length;
    const percent = totalChapters > 0 ? Math.round((readInSubject / totalChapters) * 100) : 0;
    return { read: readInSubject, total: totalChapters, percent };
  },

  getLastRead() { return load().lastRead; },
  getTotalRead() { return Object.keys(load().chapters).length; },

  getWeeklyActivity() {
    const data = load();
    const result = {};
    const today = new Date(); today.setHours(0, 0, 0, 0);
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today); d.setDate(d.getDate() - i);
      result[d.toISOString().slice(0, 10)] = 0;
    }
    Object.values(data.chapters).forEach((c) => {
      const ts = c.lastReadAt || c.firstReadAt;
      if (!ts) return;
      const key = new Date(ts).toISOString().slice(0, 10);
      if (result[key] !== undefined) result[key]++;
    });
    return result;
  },

  reset() { save({ chapters: {}, subjects: {}, lastRead: null }); }
};

export default progressService;