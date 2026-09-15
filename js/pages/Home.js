/**
 * DiplomaStudy - Home Page View
 */

import { AppShell } from "../components/AppShell.js";
import { state } from "../core/state.js";
import { router } from "../core/router.js";
import { getDepartmentById } from "../../data/departments.js";
import { getSemesterById } from "../../data/semesters.js";
import { getSubjectsByDeptAndSemester } from "../../data/subjects.js";
import { getDailyQuiz } from "../../data/quizzes.js";
import { notices } from "../../data/notices.js";
import { suggestions } from "../../data/suggestions.js";
import { progressService } from "../features/progress/progressService.js";
import { ProgressCard } from "../components/ProgressCard.js";
import { SubjectCard } from "../components/SubjectCard.js";
import { QuizCard } from "../components/QuizCard.js";

export function renderHome() {
  AppShell.updateHeader({
    showBack: false,
    showSearch: true,
    showTheme: true
  });

  const main = AppShell.getMainView();
  if (!main) return;

  const currentDept = getDepartmentById(state.selectedDepartment);
  const currentSem = getSemesterById(state.selectedSemester);
  const user = state.userPreferences;
  const progressData = progressService.getSummary();
  const deptSubjects = getSubjectsByDeptAndSemester(state.selectedDepartment, state.selectedSemester);
  const dailyQuiz = getDailyQuiz();
  const latestNotice = notices[0];
  const featuredSuggestion = suggestions[0];

  main.innerHTML = `
    <!-- Greeting & Current Study Banner -->
    <div class="hero-banner animate-fade-in">
      <div class="flex items-center justify-between mb-xs">
        <span class="text-xs font-semibold" style="opacity: 0.85; text-transform: uppercase; letter-spacing: 0.5px;">Welcome back 👋</span>
        <span class="badge" style="background-color: rgba(255, 255, 255, 0.2); color: #FFFFFF; font-size: 10px;">
          ${progressData.streak} Day Streak 🔥
        </span>
      </div>
      <h2 class="text-xl font-bold mb-xs" style="color: #FFFFFF;">${user.name}</h2>
      
      <!-- Current Study Tag -->
      <div class="flex items-center gap-xs flex-wrap mt-sm">
        <button class="badge" id="btn-change-dept" style="background-color: #FFFFFF; color: var(--color-forest); font-weight: 700; cursor: pointer; padding: 5px 10px;">
          ${currentDept.icon} ${currentDept.shortName}
        </button>
        <button class="badge" id="btn-change-sem" style="background-color: rgba(255, 255, 255, 0.25); color: #FFFFFF; font-weight: 600; cursor: pointer; padding: 5px 10px;">
          ${currentSem.name} ▾
        </button>
      </div>

      <!-- Today's Goal -->
      <div class="mt-md pt-sm" style="border-top: 1px solid rgba(255, 255, 255, 0.2);">
        <div class="flex items-center justify-between text-xs mb-xs" style="opacity: 0.9;">
          <span>Today's Study Goal</span>
          <span>${user.dailyGoalMinutes} mins target</span>
        </div>
        <div class="progress-bar-track" style="background-color: rgba(255, 255, 255, 0.25);">
          <div class="progress-bar-fill" style="width: 65%; background: #A8BFA8;"></div>
        </div>
      </div>
    </div>

    <!-- Quick Actions Grid (10 Requested Icons) -->
    <div class="section-header" style="margin-top: 10px;">
      <h3 class="section-title">Quick Actions</h3>
      <a href="#/departments" class="section-action">All Subjects →</a>
    </div>

    <div class="quick-grid">
      <a href="#/departments" class="quick-action-btn">
        <div class="quick-action-icon" style="background-color: var(--color-forest-soft); color: var(--color-forest);">📚</div>
        <span>Study</span>
      </a>
      <a href="#/quiz" class="quick-action-btn">
        <div class="quick-action-icon" style="background-color: var(--color-accent-light); color: var(--color-accent);">🎯</div>
        <span>Quiz</span>
      </a>
      <a href="#/notes" class="quick-action-btn">
        <div class="quick-action-icon" style="background-color: var(--color-sage-light); color: var(--color-sage-dark);">📝</div>
        <span>Notes</span>
      </a>
      <a href="#/bookmarks" class="quick-action-btn">
        <div class="quick-action-icon" style="background-color: #FCE7F3; color: #DB2777;">⭐</div>
        <span>Saved</span>
      </a>
      <a href="#/pdfs" class="quick-action-btn">
        <div class="quick-action-icon" style="background-color: var(--color-danger-bg); color: var(--color-danger);">📄</div>
        <span>PDFs</span>
      </a>
      <a href="#/planner" class="quick-action-btn">
        <div class="quick-action-icon" style="background-color: #EDE9FE; color: #7C3AED;">📅</div>
        <span>Planner</span>
      </a>
      <a href="#/timer" class="quick-action-btn">
        <div class="quick-action-icon" style="background-color: #FEF3C7; color: #D97706;">⏱️</div>
        <span>Timer</span>
      </a>
      <a href="#/formula" class="quick-action-btn">
        <div class="quick-action-icon" style="background-color: #E0E7FF; color: #4338CA;">📐</div>
        <span>Formula</span>
      </a>
      <a href="#/tools" class="quick-action-btn">
        <div class="quick-action-icon" style="background-color: #CCFBF1; color: #0F766E;">🧮</div>
        <span>Tools</span>
      </a>
      <a href="#/ai" class="quick-action-btn">
        <div class="quick-action-icon" style="background-color: #CFFAFE; color: #0891B2;">🤖</div>
        <span>AI Tutor</span>
      </a>
    </div>

    <!-- Continue Learning Section -->
    <div class="section-header">
      <h3 class="section-title">Continue Learning</h3>
      <a href="#/subjects" class="section-action">View All (${deptSubjects.length})</a>
    </div>
    <div id="continue-learning-slot">
      ${deptSubjects.length > 0 ? SubjectCard.render(deptSubjects[0]) : `<p class="text-xs text-muted">No subjects found for this semester.</p>`}
    </div>

    <!-- Today's Quiz / Daily Challenge -->
    <div class="section-header">
      <h3 class="section-title">Today's Quiz Challenge</h3>
      <span class="badge badge-accent">Daily Set</span>
    </div>
    <div id="daily-quiz-slot">
      ${QuizCard.render(dailyQuiz)}
    </div>

    <!-- Progress Overview Component -->
    ${ProgressCard.render(progressData)}

    <!-- Smart Revision (Revise Today) -->
    <div class="section-header">
      <h3 class="section-title">Smart Revision</h3>
      <span class="badge badge-forest">Revise Today</span>
    </div>
    <div class="card mb-md card-highlight" style="border-left: 4px solid var(--color-forest);">
      <div class="flex items-center justify-between mb-xs">
        <span class="badge badge-danger">High Exam Priority</span>
        <span class="text-xs text-dim">Cramer's Rule & Ohm's Law</span>
      </div>
      <h4 class="text-sm font-bold text-forest mb-xs">${featuredSuggestion.title}</h4>
      <p class="text-xs text-muted mb-sm">${featuredSuggestion.summary}</p>
      <div class="flex items-center gap-xs">
        <a href="#/questions?subjectId=${featuredSuggestion.subjectId}&chapterId=${featuredSuggestion.chapterId}" class="btn btn-primary btn-sm flex-1">
          <span>Practice Now</span>
        </a>
        <a href="#/suggestions" class="btn btn-secondary btn-sm">
          <span>All Suggestions</span>
        </a>
      </div>
    </div>

    <!-- Recent Subjects List -->
    <div class="section-header">
      <h3 class="section-title">Semester Subjects</h3>
      <a href="#/subjects" class="section-action">Explore All</a>
    </div>
    <div id="recent-subjects-list">
      ${deptSubjects.slice(1, 3).map((s) => SubjectCard.render(s)).join("")}
    </div>

    <!-- Latest Notice Card -->
    ${latestNotice ? `
      <div class="section-header">
        <h3 class="section-title">Latest Notice</h3>
        <a href="#/notices" class="section-action">All Notices</a>
      </div>
      <div class="card mb-md" style="border-left: 3px solid var(--color-accent);">
        <div class="flex items-center justify-between mb-xs">
          <span class="badge badge-accent">${latestNotice.category}</span>
          <span class="text-xs text-dim">${latestNotice.date}</span>
        </div>
        <h4 class="text-sm font-bold text-text mb-xs">${latestNotice.title}</h4>
        <p class="text-xs text-muted mb-sm clamp-2">${latestNotice.description}</p>
        <a href="#/notices" class="text-xs font-bold text-forest">Read full notice →</a>
      </div>
    ` : ""}
  `;

  // Bind Events
  main.querySelector("#btn-change-dept")?.addEventListener("click", () => {
    router.navigate("#/departments");
  });

  main.querySelector("#btn-change-sem")?.addEventListener("click", () => {
    router.navigate("#/semesters");
  });

  SubjectCard.bindClick(main, (subjectId) => {
    router.navigate(`#/chapters?subjectId=${subjectId}`);
  });

  QuizCard.bindEvents(main, (quizId) => {
    router.navigate(`#/quiz?quizId=${quizId}`);
  });
}
