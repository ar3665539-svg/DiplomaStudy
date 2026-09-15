/**
 * DiplomaStudy - SubjectCard Component
 */

export const SubjectCard = {
  render(subject) {
    const progress = subject.progress || 0;
    return `
      <div class="card card-interactive mb-md subject-card" data-subject-id="${subject.id}" id="subject-card-${subject.id}">
        <div class="flex items-start justify-between mb-sm">
          <div class="flex items-center gap-sm">
            <div style="font-size: 24px; line-height: 1;">${subject.icon || "📚"}</div>
            <div>
              <h3 class="text-base font-bold text-forest">${subject.name}</h3>
              <span class="text-xs text-muted">Code: ${subject.code} • ${subject.credits || 3} Credits</span>
            </div>
          </div>
          <span class="badge badge-sage">${subject.type || "Theory & Practical"}</span>
        </div>

        <p class="text-xs text-muted clamp-2 mb-sm" style="line-height: 1.4;">${subject.description}</p>

        <div class="flex items-center justify-between text-xs text-dim mb-xs">
          <span>Syllabus Progress</span>
          <span class="font-bold text-forest">${progress}%</span>
        </div>
        <div class="progress-bar-track">
          <div class="progress-bar-fill" style="width: ${progress}%;"></div>
        </div>
      </div>
    `;
  },

  bindClick(container, callback) {
    container.querySelectorAll(".subject-card").forEach((card) => {
      card.addEventListener("click", () => {
        const subjectId = card.getAttribute("data-subject-id");
        if (callback) callback(subjectId);
      });
    });
  }
};
