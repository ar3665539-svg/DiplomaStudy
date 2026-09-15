/**
 * DiplomaStudy - QuizCard Component
 */

export const QuizCard = {
  render(quiz) {
    const minutes = Math.round((quiz.durationSeconds || 300) / 60);
    return `
      <div class="card mb-md quiz-card" data-id="${quiz.id}" id="quiz-card-${quiz.id}">
        <div class="flex items-start justify-between mb-sm">
          <div>
            <span class="badge badge-forest mb-xs">${quiz.subjectName || "Engineering"}</span>
            <h3 class="text-base font-bold text-forest">${quiz.title}</h3>
          </div>
          <span class="badge badge-accent">${quiz.difficulty || "Mixed"}</span>
        </div>

        <div class="flex items-center gap-md text-xs text-muted mb-md">
          <span class="flex items-center gap-xs">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            ${minutes} Minutes
          </span>
          <span class="flex items-center gap-xs">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            ${quiz.totalQuestions || quiz.questions.length} MCQs
          </span>
        </div>

        <button class="btn btn-primary btn-block btn-start-quiz" data-id="${quiz.id}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
          <span>Start Practice Test</span>
        </button>
      </div>
    `;
  },

  bindEvents(container, onStart) {
    container.querySelectorAll(".btn-start-quiz").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        if (onStart) onStart(id);
      });
    });
  }
};
