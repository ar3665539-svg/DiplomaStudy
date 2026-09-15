/**
 * DiplomaStudy - Quiz Engine
 * Interactive stateful quiz session runner with timer, answer evaluation, review and history recording
 */

import { storage, STORAGE_KEYS } from "../../core/storage.js";
import { events } from "../../core/events.js";

class QuizEngine {
  constructor() {
    this.reset();
  }

  reset() {
    this.activeQuiz = null;
    this.currentIndex = 0;
    this.userAnswers = {}; // questionId -> selectedOption
    this.timeRemaining = 0;
    this.timerInterval = null;
    this.isSubmitted = false;
    this.result = null;
    this.startTime = null;
  }

  start(quiz) {
    this.reset();
    this.activeQuiz = quiz;
    this.currentIndex = 0;
    this.timeRemaining = quiz.durationSeconds || 300;
    this.startTime = Date.now();
    this.isSubmitted = false;

    this.timerInterval = setInterval(() => {
      if (this.timeRemaining > 0) {
        this.timeRemaining--;
        events.emit("quiz:tick", this.timeRemaining);
      } else {
        this.submit();
      }
    }, 1000);

    events.emit("quiz:started", this.activeQuiz);
  }

  selectAnswer(questionId, answerOption) {
    if (this.isSubmitted) return;
    this.userAnswers[questionId] = answerOption;
    events.emit("quiz:answerSelected", { questionId, answerOption });
  }

  next() {
    if (!this.activeQuiz) return;
    if (this.currentIndex < this.activeQuiz.questions.length - 1) {
      this.currentIndex++;
      events.emit("quiz:navigated", this.currentIndex);
    }
  }

  prev() {
    if (!this.activeQuiz) return;
    if (this.currentIndex > 0) {
      this.currentIndex--;
      events.emit("quiz:navigated", this.currentIndex);
    }
  }

  goTo(index) {
    if (!this.activeQuiz) return;
    if (index >= 0 && index < this.activeQuiz.questions.length) {
      this.currentIndex = index;
      events.emit("quiz:navigated", this.currentIndex);
    }
  }

  submit() {
    if (this.isSubmitted || !this.activeQuiz) return;
    clearInterval(this.timerInterval);
    this.isSubmitted = true;

    const total = this.activeQuiz.questions.length;
    let correctCount = 0;
    let wrongCount = 0;
    let unansweredCount = 0;

    const breakdown = this.activeQuiz.questions.map((q) => {
      const selected = this.userAnswers[q.id] || null;
      const isCorrect = selected === q.answer;
      if (!selected) unansweredCount++;
      else if (isCorrect) correctCount++;
      else wrongCount++;

      return {
        questionId: q.id,
        questionText: q.question,
        selectedOption: selected,
        correctAnswer: q.answer,
        isCorrect,
        explanation: q.explanation
      };
    });

    const accuracy = Math.round((correctCount / total) * 100);
    const timeSpentSeconds = Math.round((Date.now() - this.startTime) / 1000);

    this.result = {
      quizId: this.activeQuiz.id,
      quizTitle: this.activeQuiz.title,
      subjectName: this.activeQuiz.subjectName || "Engineering",
      totalQuestions: total,
      correctCount,
      wrongCount,
      unansweredCount,
      accuracy,
      timeSpentSeconds,
      date: new Date().toISOString(),
      breakdown
    };

    // Save to quiz history in storage
    const history = storage.get(STORAGE_KEYS.QUIZ_RESULTS, []);
    history.unshift(this.result);
    storage.set(STORAGE_KEYS.QUIZ_RESULTS, history.slice(0, 30)); // retain last 30 tests

    events.emit("quiz:submitted", this.result);
    return this.result;
  }

  getHistory() {
    return storage.get(STORAGE_KEYS.QUIZ_RESULTS, []);
  }
}

export const quizEngine = new QuizEngine();
