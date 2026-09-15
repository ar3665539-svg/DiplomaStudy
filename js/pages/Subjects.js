/**
 * DiplomaStudy - Subjects Page View
 */

import { AppShell } from "../components/AppShell.js";
import { getDepartmentById } from "../../data/departments.js";
import { getSemesterById } from "../../data/semesters.js";
import { getSubjectsByDeptAndSemester } from "../../data/subjects.js";
import { state } from "../core/state.js";
import { router } from "../core/router.js";
import { SubjectCard } from "../components/SubjectCard.js";
import { SearchBar } from "../components/SearchBar.js";

export function renderSubjects() {
  const currentDept = getDepartmentById(state.selectedDepartment);
  const currentSem = getSemesterById(state.selectedSemester);
  const allSubjects = getSubjectsByDeptAndSemester(state.selectedDepartment, state.selectedSemester);

  AppShell.updateHeader({
    title: `${currentSem.name} Subjects`,
    subtitle: `${currentDept.shortName} Technology`,
    showBack: true,
    showSearch: true
  });

  const main = AppShell.getMainView();
  if (!main) return;

  main.innerHTML = `
    <!-- Top Filter & Search Bar -->
    <div class="mb-sm">
      ${SearchBar.render({ placeholder: "Filter subjects by name or code...", id: "subject-filter-input" })}
    </div>

    <!-- Quick Switcher Bar -->
    <div class="flex items-center justify-between mb-md p-xs text-xs text-muted" style="border-bottom: 1px solid var(--color-border);">
      <span>Showing <strong>${allSubjects.length}</strong> curriculum subjects</span>
      <div class="flex items-center gap-xs">
        <a href="#/departments" class="text-forest font-bold">Dept</a> •
        <a href="#/semesters" class="text-forest font-bold">Semester</a>
      </div>
    </div>

    <div id="subject-cards-container">
      ${allSubjects.length > 0 ? (
        allSubjects.map((s) => SubjectCard.render(s)).join("")
      ) : `
        <div class="empty-state">
          <div class="empty-state-icon">📚</div>
          <h2 class="empty-state-title">No Subjects Found</h2>
          <p class="empty-state-desc">No subjects registered for this department and semester combination.</p>
          <a href="#/departments" class="btn btn-primary btn-sm">Choose another department</a>
        </div>
      `}
    </div>
  `;

  // Search filter
  const container = main.querySelector("#subject-cards-container");
  SearchBar.bindEvents(main, (q) => {
    const query = q.toLowerCase().trim();
    const filtered = allSubjects.filter((s) => 
      s.name.toLowerCase().includes(query) || 
      s.code.toLowerCase().includes(query) ||
      s.description.toLowerCase().includes(query)
    );

    if (container) {
      if (filtered.length === 0) {
        container.innerHTML = `<div class="empty-state"><p class="empty-state-desc">No matching subjects found.</p></div>`;
      } else {
        container.innerHTML = filtered.map((s) => SubjectCard.render(s)).join("");
        SubjectCard.bindClick(container, (subjectId) => {
          router.navigate(`#/chapters?subjectId=${subjectId}`);
        });
      }
    }
  }, "subject-filter-input");

  SubjectCard.bindClick(main, (subjectId) => {
    router.navigate(`#/chapters?subjectId=${subjectId}`);
  });
}
