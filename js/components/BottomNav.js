/**
 * DiplomaStudy - Bottom Navigation Bar Component
 * 5 primary tabs: Home, Study, Quiz, Saved, More
 */

import { state } from "../core/state.js";

export const BottomNav = {
  render() {
    const currentRoute = state.currentRoute;
    
    const isHome = currentRoute === "#/home" || currentRoute === "";
    const isStudy = currentRoute.startsWith("#/departments") || currentRoute.startsWith("#/semesters") || currentRoute.startsWith("#/subjects") || currentRoute.startsWith("#/chapters") || currentRoute.startsWith("#/questions") || currentRoute.startsWith("#/suggestions") || currentRoute.startsWith("#/pdfs");
    const isQuiz = currentRoute.startsWith("#/quiz");
    const isSaved = currentRoute.startsWith("#/bookmarks");
    const isMore = currentRoute.startsWith("#/more") || currentRoute.startsWith("#/notes") || currentRoute.startsWith("#/planner") || currentRoute.startsWith("#/timer") || currentRoute.startsWith("#/progress") || currentRoute.startsWith("#/formula") || currentRoute.startsWith("#/tools") || currentRoute.startsWith("#/jobs") || currentRoute.startsWith("#/notices") || currentRoute.startsWith("#/ai") || currentRoute.startsWith("#/settings");

    return `
      <nav class="app-bottom-nav" aria-label="Main Navigation">
        <a href="#/home" class="nav-item ${isHome ? "active" : ""}" id="nav-tab-home">
          <div class="nav-item-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
          <span>Home</span>
        </a>

        <a href="#/departments" class="nav-item ${isStudy ? "active" : ""}" id="nav-tab-study">
          <div class="nav-item-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
          </div>
          <span>Study</span>
        </a>

        <a href="#/quiz" class="nav-item ${isQuiz ? "active" : ""}" id="nav-tab-quiz">
          <div class="nav-item-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polygon points="10 8 16 12 10 16 10 8"></polygon>
            </svg>
          </div>
          <span>Quiz</span>
        </a>

        <a href="#/bookmarks" class="nav-item ${isSaved ? "active" : ""}" id="nav-tab-saved">
          <div class="nav-item-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <span>Saved</span>
        </a>

        <a href="#/more" class="nav-item ${isMore ? "active" : ""}" id="nav-tab-more">
          <div class="nav-item-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="19" cy="12" r="1"></circle>
              <circle cx="5" cy="12" r="1"></circle>
            </svg>
          </div>
          <span>More</span>
        </a>
      </nav>
    `;
  }
};
