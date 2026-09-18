/**
 * Quiz Engine - Quiz Logic
 */

import { getSubjects, getChaptersBySubject, getQuestionsByChapter } from "../../services/api.js";

export const quizEngine = {
  _currentQuiz: null,

  /**
   * Build a quiz from random MCQs
   */
  async buildQuiz(options = {}) {
    const { count = 10, subjectId = null, chapterId = null } = options;
    let mcqs = [];

    try {
      if (chapterId) {
        // Single chapter
        mcqs = await getQuestionsByChapter(chapterId, "mcq");
      } else if (subjectId) {
        // All chapters in subject
        const chapters = await getChaptersBySubject(subjectId);
        for (const ch of chapters) {
          const qs = await getQuestionsByChapter(ch.id, "mcq");
          mcqs.push(...qs.map((q) => ({ ...q, chapterId: ch.id })));
        }
      } else {
        // All subjects
        const subjects = await getSubjects();
        for (const sub of subjects) {
          const chapters = await getChaptersBySubject(sub.id);
          for (const ch of chapters) {
            const qs = await getQuestionsByChapter(ch.id, "mcq");
            mcqs.push(...qs.map((q) => ({ ...q, subjectId: sub.id, chapterId: ch.id })));
          }
        }
      }
    } catch (e) {
      console.warn("[QuizEngine] Load error:", e);
    }

    // Filter valid MCQs
    const valid = mcqs.filter((q) =>
      q.question &&
      q.options &&
      q.options.length >= 2 &&
      q.answer
    );

    // Shuffle
    const shuffled = [...valid].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(count, shuffled.length));

    this._currentQuiz = {
      questions: selected,
      current: 0,
      score: 0,
      answers: [],
      total: selected.length,
      startedAt: Date.now()
    };

    return this._currentQuiz;
  },

  getCurrent() {
    return this._currentQuiz;
  },

  getCurrentQuestion() {
    if (!this._currentQuiz) return null;
    return this._currentQuiz.questions[this._currentQuiz.current] || null;
  },

  submitAnswer(selectedAnswer) {
    const q = this.getCurrentQuestion();
    if (!q) return null;

    const isCorrect = selectedAnswer === q.answer;
    if (isCorrect) this._currentQuiz.score++;

    const result = {
      question: q.question,
      selected: selectedAnswer,
      correct: q.answer,
      isCorrect,
      questionNumber: this._currentQuiz.current + 1
    };

    this._currentQuiz.answers.push(result);
    return result;
  },

  next() {
    if (!this._currentQuiz) return false;
    this._currentQuiz.current++;
    return this._currentQuiz.current < this._currentQuiz.total;
  },

  isFinished() {
    if (!this._currentQuiz) return true;
    return this._currentQuiz.current >= this._currentQuiz.total;
  },

  getResult() {
    if (!this._currentQuiz) return null;
    const score = this._currentQuiz.score;
    const total = this._currentQuiz.total;
    const percent = total > 0 ? Math.round((score / total) * 100) : 0;
    const duration = Date.now() - this._currentQuiz.startedAt;

    return {
      score,
      total,
      percent,
      duration,
      answers: this._currentQuiz.answers,
      emoji: percent >= 80 ? "🏆" : percent >= 60 ? "🎯" : percent >= 40 ? "💪" : "📚",
      message: percent >= 80 ? "অসাধারণ!" : percent >= 60 ? "ভালো করেছ!" : percent >= 40 ? "আরো practice দরকার" : "চালিয়ে যাও!"
    };
  },

  reset() {
    this._currentQuiz = null;
  }
};

export default quizEngine;