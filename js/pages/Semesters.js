/**
 * DiplomaStudy - Semesters Page View
 */

import { AppShell } from "../components/AppShell.js";
import { semesters } from "../../data/semesters.js";
import { getDepartmentById } from "../../data/departments.js";
import { state } from "../core/state.js";
import { router } from "../core/router.js";
import { Toast } from "../components/Toast.js";

export function renderSemesters() {
  const currentDept = getDepartmentById(state.selectedDepartment);

  AppShell.updateHeader({
    title: "Select Semester",
    subtitle: `${currentDept.shortName} Technology`,
    showBack: true,
    showSearch: false
  });

  const main = AppShell.getMainView();
  if (!main) return;

  const currentSem = state.selectedSemester;

  main.innerHTML = `
    <div class="card mb-md p-sm" style="background-color: var(--color-forest-soft); border: 1px solid var(--color-sage);">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-xs">
          <span style="font-size: 20px;">${currentDept.icon}</span>
          <div>
            <span class="text-xs font-bold text-forest">${currentDept.shortName}</span>
            <p class="text-xs text-muted" style="font-size: 11px;">${currentDept.name}</p>
          </div>
        </div>
        <button class="btn btn-secondary btn-sm" id="btn-switch-dept" style="padding: 4px 8px; font-size: 11px;">Change</button>
      </div>
    </div>

    <div class="flex flex-col gap-sm" id="semester-list">
      ${semesters.map((sem) => {
        const isSelected = sem.id === currentSem;
        return `
          <div 
            class="card card-interactive p-md sem-card ${isSelected ? "card-highlight" : ""}" 
            data-id="${sem.id}"
            id="sem-card-${sem.id}"
            style="border-left: 4px solid ${isSelected ? "var(--color-forest)" : "transparent"};"
          >
            <div class="flex items-center justify-between">
              <div>
                <div class="flex items-center gap-xs mb-xs">
                  <h3 class="text-sm font-bold text-forest">${sem.name}</h3>
                  <span class="text-xs text-muted">(${sem.banglaName})</span>
                  ${sem.isIndustrialAttachment ? `<span class="badge badge-accent">Industrial Attachment</span>` : ""}
                </div>
                <p class="text-xs text-muted">${sem.description}</p>
              </div>
              <div>
                <span class="text-sm font-bold text-forest">➔</span>
              </div>
            </div>
          </div>
        `;
      }).join("")}
    </div>
  `;

  main.querySelector("#btn-switch-dept")?.addEventListener("click", () => {
    router.navigate("#/departments");
  });

  main.querySelectorAll(".sem-card").forEach((card) => {
    card.addEventListener("click", () => {
      const id = parseInt(card.getAttribute("data-id"), 10);
      state.setSemester(id);
      Toast.show(`Semester ${id} selected`, "success");
      router.navigate("#/subjects");
    });
  });
}
