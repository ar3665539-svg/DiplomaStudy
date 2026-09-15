/**
 * DiplomaStudy - Progress Service
 * Aggregates statistics, study streaks, and completion metrics
 */

import { storage, STORAGE_KEYS } from "../../core/storage.js";
import { subjects } from "../../../data/subjects.js";

export const progressService = {
  getSummary() {
    const studyHistory = storage.get(STORAGE_KEYS.STUDY_HISTORY, {
      totalMinutes: 780, // approx 13 hours default demo history
      sessions: 18,
      dailyMinutes: {}
    });

    const quizHistory = storage.get(STORAGE_KEYS.QUIZ_RESULTS, []);
    const plannerTasks = storage.get(STORAGE_KEYS.PLANNER, []);
    const bookmarks = storage.get(STORAGE_KEYS.BOOKMARKS, { questions: [] });

    // Calculate quiz accuracy
    let totalScore = 0;
    let quizCount = quizHistory.length;
    let avgAccuracy = 82; // demo fallback
    if (quizCount > 0) {
      const sum = quizHistory.reduce((acc, q) => acc + (q.accuracy || 0), 0);
      avgAccuracy = Math.round(sum / quizCount);
    }

    const completedTasks = plannerTasks.filter((t) => t.isCompleted).length;

    // Study streak
    const streak = storage.get(STORAGE_KEYS.STREAK, 5);

    const totalHours = (studyHistory.totalMinutes / 60).toFixed(1);

    return {
      streak,
      longestStreak: Math.max(streak, 12),
      totalHours,
      totalMinutes: studyHistory.totalMinutes,
      totalSessions: studyHistory.sessions,
      quizAccuracy: avgAccuracy,
      quizzesTaken: quizCount,
      completedTasks,
      savedQuestionsCount: (bookmarks.questions || []).length,
      subjectCompletion: subjects.map((s) => ({
        id: s.id,
        name: s.name,
        code: s.code,
        progress: s.progress || 0
      }))
    };
  }
};
