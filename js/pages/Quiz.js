/**
 * DiplomaStudy - Quiz Hub & Active Quiz Runner View
 */

import { AppShell } from "../components/AppShell.js";
import { quizzes, getQuizById } from "../../data/quizzes.js";
import { quizEngine } from "../features/quiz/quizEngine.js";
import { events } from "../core/events.js";
import { router } from "../core/router.js";
import { QuizCard } from "../components/QuizCard.js";
import { Modal } from "../components/Modal.js";

export function renderQuiz(params = {}) {
  const quizId = params.quizId;

  if (quizId) {
    const quiz = getQuizById(quizId) || quizzes[0];
    renderActiveQuiz(quiz);
  } else {
    renderQuizHub();
  }
}

function renderQuizHub() {
  AppShell.updateHeader({
    title: "Practice & Mock Tests",
    subtitle: "BTEB Pattern MCQ Quizzes",
    showBack: false,
    showSearch: false
  });

  const main = AppShell.getMainView();
  if (!main) return;

  const history = quizEngine.getHistory();

  main.innerHTML = `
    <!-- Top Summary Banner -->
    <div class="card mb-md p-md" style="background: linear-gradient(135deg, var(--color-forest) 0%, var(--color-forest-dark) 100%); color: #FFFFFF;">
      <div class="flex items-center justify-between mb-xs">
        <span class="badge" style="background-color: rgba(255, 255, 255, 0.2); color: #FFFFFF;">BTEB Exam Prep</span>
        <span class="text-xs" style="opacity: 0.85;">Timed Mock Sets</span>
      </div>
      <h2 class="text-lg font-bold mb-xs" style="color: #FFFFFF;">Test Your Subject Mastery</h2>
      <p class="text-xs" style="opacity: 0.9; line-height: 1.4;">Practice real semester board MCQs with instant scoring, timer feedback, and detailed step-by-step explanations.</p>
    </div>

    <!-- Quizzes List -->
    <div class="section-header">
      <h3 class="section-title">Available Quiz Sets</h3>
      <span class="text-xs text-muted">${quizzes.length} Tests</span>
    </div>

    <div id="quiz-sets-container">
      ${quizzes.map((q) => QuizCard.render(q)).join("")}
    </div>

    <!-- Recent Attempts History -->
    ${history.length > 0 ? `
      <div class="section-header mt-lg">
        <h3 class="section-title">Recent Test Results</h3>
        <span class="text-xs text-muted">Last ${history.length} attempts</span>
      </div>
      <div class="flex flex-col gap-sm" id="quiz-history-list">
        ${history.slice(0, 5).map((h) => `
          <div class="card p-sm">
            <div class="flex items-center justify-between mb-xs">
              <span class="text-xs font-bold text-forest">${h.quizTitle}</span>
              <span class="badge ${h.accuracy >= 75 ? "badge-success" : h.accuracy >= 50 ? "badge-warning" : "badge-danger"}">${h.accuracy}%</span>
            </div>
            <div class="flex items-center justify-between text-xs text-muted">
              <span>Score: ${h.correctCount} / ${h.totalQuestions} correct</span>
              <span>${new Date(h.date).toLocaleDateString()}</span>
            </div>
          </div>
        `).join("")}
      </div>
    ` : ""}
  `;

  QuizCard.bindEvents(main, (id) => {
    router.navigate(`#/quiz?quizId=${id}`);
  });
}

function renderActiveQuiz(quiz) {
  quizEngine.start(quiz);

  AppShell.updateHeader({
    title: quiz.title,
    subtitle: "Active Mock Test",
    showBack: true,
    showSearch: false,
    showTheme: false
  });

  const main = AppShell.getMainView();
  if (!main) return;

  const renderActiveScreen = () => {
    if (quizEngine.isSubmitted && quizEngine.result) {
      renderResultScreen(quizEngine.result);
      return;
    }

    const currentQ = quiz.questions[quizEngine.currentIndex];
    const totalQ = quiz.questions.length;
    const selectedAns = quizEngine.userAnswers[currentQ.id];

    // Format timer
    const mins = Math.floor(quizEngine.timeRemaining / 60);
    const secs = quizEngine.timeRemaining % 60;
    const timerText = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

    main.innerHTML = `
      <!-- Quiz Progress & Timer Header -->
      <div class="card mb-md p-sm flex items-center justify-between" style="position: sticky; top: 58px; z-index: 10; box-shadow: var(--shadow-sm);">
        <div class="flex items-center gap-xs">
          <span class="badge badge-forest">Q ${quizEngine.currentIndex + 1} of ${totalQ}</span>
        </div>
        <div class="flex items-center gap-xs text-sm font-bold text-forest" id="quiz-timer-display">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span>${timerText}</span>
        </div>
      </div>

      <!-- Question Text -->
      <div class="card mb-md p-md">
        <h3 class="text-sm font-bold text-forest mb-xs" style="line-height: 1.4;">${currentQ.question}</h3>
        ${currentQ.questionBangla ? `<p class="text-xs text-muted mb-md">${currentQ.questionBangla}</p>` : ""}

        <!-- Options -->
        <div class="flex flex-col gap-sm" id="quiz-options-group">
          ${currentQ.options.map((opt, idx) => {
            const letter = String.fromCharCode(65 + idx);
            const isSelected = selectedAns === opt;
            return `
              <button 
                class="quiz-option-btn card-interactive ${isSelected ? "selected" : ""}" 
                data-option="${opt}"
                style="
                  display: flex; 
                  align-items: center; 
                  gap: 10px; 
                  padding: 12px 14px; 
                  border-radius: var(--radius-sm); 
                  border: 1.5px solid ${isSelected ? "var(--color-forest)" : "var(--color-border)"}; 
                  background-color: ${isSelected ? "var(--color-forest-soft)" : "var(--color-surface)"};
                  text-align: left;
                  cursor: pointer;
                  width: 100%;
                "
              >
                <span style="
                  width: 26px; 
                  height: 26px; 
                  border-radius: 50%; 
                  background-color: ${isSelected ? "var(--color-forest)" : "var(--color-surface-hover)"}; 
                  color: ${isSelected ? "#FFFFFF" : "var(--color-text)"};
                  font-size: 11px;
                  font-weight: 700;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  flex-shrink: 0;
                ">${letter}</span>
                <span class="text-xs font-semibold text-text flex-1">${opt}</span>
              </button>
            `;
          }).join("")}
        </div>
      </div>

      <!-- Navigation & Submit Bar -->
      <div class="flex items-center justify-between gap-sm mb-lg">
        <button class="btn btn-secondary btn-sm flex-1" id="quiz-btn-prev" ${quizEngine.currentIndex === 0 ? "disabled" : ""}>
          ← Previous
        </button>

        ${quizEngine.currentIndex < totalQ - 1 ? `
          <button class="btn btn-primary btn-sm flex-1" id="quiz-btn-next">
            Next →
          </button>
        ` : `
          <button class="btn btn-accent btn-sm flex-1" id="quiz-btn-submit">
            Finish & Submit
          </button>
        `}
      </div>

      <!-- Question Palette -->
      <div class="card p-sm mb-lg">
        <span class="text-xs font-bold text-muted mb-xs block">Question Palette</span>
        <div class="flex flex-wrap gap-xs">
          ${quiz.questions.map((q, idx) => {
            const isAnswered = !!quizEngine.userAnswers[q.id];
            const isCurrent = idx === quizEngine.currentIndex;
            return `
              <button 
                class="palette-chip ${isCurrent ? "current" : ""} ${isAnswered ? "answered" : ""}" 
                data-index="${idx}"
                style="
                  width: 32px; 
                  height: 32px; 
                  border-radius: var(--radius-xs); 
                  border: 1px solid var(--color-border);
                  background-color: ${isCurrent ? "var(--color-forest)" : isAnswered ? "var(--color-sage)" : "var(--color-surface)"};
                  color: ${isCurrent ? "#FFFFFF" : isAnswered ? "var(--color-forest-dark)" : "var(--color-text)"};
                  font-size: 11px;
                  font-weight: 700;
                  cursor: pointer;
                "
              >${idx + 1}</button>
            `;
          }).join("")}
        </div>
      </div>
    `;

    // Event listeners
    main.querySelectorAll(".quiz-option-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const opt = btn.getAttribute("data-option");
        quizEngine.selectAnswer(currentQ.id, opt);
        renderActiveScreen();
      });
    });

    main.querySelector("#quiz-btn-prev")?.addEventListener("click", () => {
      quizEngine.prev();
      renderActiveScreen();
    });

    main.querySelector("#quiz-btn-next")?.addEventListener("click", () => {
      quizEngine.next();
      renderActiveScreen();
    });

    main.querySelector("#quiz-btn-submit")?.addEventListener("click", () => {
      Modal.show({
        title: "Submit Test?",
        bodyHtml: `<p class="text-xs text-muted">You have answered <strong>${Object.keys(quizEngine.userAnswers).length}</strong> of <strong>${totalQ}</strong> questions. Are you ready to see your score and answer explanations?</p>`,
        confirmText: "Yes, Submit",
        cancelText: "Review",
        onConfirm: () => {
          quizEngine.submit();
          renderActiveScreen();
        }
      });
    });

    main.querySelectorAll(".palette-chip").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.getAttribute("data-index"), 10);
        quizEngine.goTo(idx);
        renderActiveScreen();
      });
    });
  };

  const timerUnsub = events.on("quiz:tick", (remaining) => {
    const timerDisplay = document.getElementById("quiz-timer-display");
    if (timerDisplay) {
      const mins = Math.floor(remaining / 60);
      const secs = remaining % 60;
      timerDisplay.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        <span>${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}</span>
      `;
    }
  });

  const submitUnsub = events.on("quiz:submitted", () => {
    renderActiveScreen();
  });

  renderActiveScreen();
}

function renderResultScreen(result) {
  const main = AppShell.getMainView();
  if (!main) return;

  const isPassed = result.accuracy >= 50;

  main.innerHTML = `
    <!-- Result Summary Card -->
    <div class="card mb-md p-lg text-center ${isPassed ? "card-highlight" : ""}">
      <div style="font-size: 42px; margin-bottom: 8px;">${isPassed ? "🎉" : "📚"}</div>
      <h2 class="text-xl font-bold text-forest mb-xs">${isPassed ? "Great Effort!" : "Keep Practicing!"}</h2>
      <p class="text-xs text-muted mb-md">${result.quizTitle}</p>

      <div class="flex items-center justify-center gap-md mb-md">
        <div>
          <span class="text-2xl font-bold text-forest">${result.correctCount} / ${result.totalQuestions}</span>
          <p class="text-xs text-muted">Score</p>
        </div>
        <div style="width: 1px; height: 36px; background-color: var(--color-border);"></div>
        <div>
          <span class="text-2xl font-bold ${isPassed ? "text-forest" : "text-accent"}">${result.accuracy}%</span>
          <p class="text-xs text-muted">Accuracy</p>
        </div>
        <div style="width: 1px; height: 36px; background-color: var(--color-border);"></div>
        <div>
          <span class="text-2xl font-bold text-forest">${result.timeSpentSeconds}s</span>
          <p class="text-xs text-muted">Time Taken</p>
        </div>
      </div>

      <div class="flex items-center gap-sm">
        <button class="btn btn-primary btn-sm flex-1" id="btn-retry-quiz">
          <span>Retry Test</span>
        </button>
        <button class="btn btn-secondary btn-sm flex-1" id="btn-quiz-hub">
          <span>Back to Tests</span>
        </button>
      </div>
    </div>

    <!-- Detailed Answer Breakdown -->
    <div class="section-header">
      <h3 class="section-title">Answer Breakdown & Explanations</h3>
    </div>

    <div class="flex flex-col gap-sm mb-xl">
      ${result.breakdown.map((item, idx) => `
        <div class="card p-md" style="border-left: 4px solid ${item.isCorrect ? "var(--color-forest)" : "var(--color-danger)}"};">
          <div class="flex items-center justify-between mb-xs">
            <span class="text-xs font-bold text-muted">Q ${idx + 1}</span>
            <span class="badge ${item.isCorrect ? "badge-success" : "badge-danger"}">${item.isCorrect ? "Correct (+1)" : "Incorrect (0)"}</span>
          </div>
          <p class="text-sm font-semibold text-text mb-sm">${item.questionText}</p>

          <div class="p-xs mb-xs" style="background-color: var(--color-surface-hover); border-radius: var(--radius-xs);">
            <span class="text-xs text-dim block">Your Answer:</span>
            <span class="text-xs font-bold ${item.isCorrect ? "text-forest" : "text-danger"}">${item.selectedOption || "Not Answered"}</span>
          </div>

          <div class="p-xs mb-sm" style="background-color: var(--color-forest-soft); border-radius: var(--radius-xs);">
            <span class="text-xs text-dim block">Correct Answer:</span>
            <span class="text-xs font-bold text-forest">${item.correctAnswer}</span>
          </div>

          ${item.explanation ? `
            <div class="text-xs text-muted" style="line-height: 1.4;">
              <strong>Explanation:</strong> ${item.explanation}
            </div>
          ` : ""}
        </div>
      `).join("")}
    </div>
  `;

  main.querySelector("#btn-retry-quiz")?.addEventListener("click", () => {
    router.navigate(`#/quiz?quizId=${result.quizId}`);
  });

  main.querySelector("#btn-quiz-hub")?.addEventListener("click", () => {
    router.navigate("#/quiz");
  });
}
