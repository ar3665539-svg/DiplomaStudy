/**
 * DiplomaStudy - Departments Page View
 */

import { AppShell } from "../components/AppShell.js";
import { departments } from "../../data/departments.js";
import { state } from "../core/state.js";
import { router } from "../core/router.js";
import { Toast } from "../components/Toast.js";

export function renderDepartments() {
  AppShell.updateHeader({
    title: "Engineering Departments",
    subtitle: "Select your technology",
    showBack: true,
    showSearch: true
  });

  const main = AppShell.getMainView();
  if (!main) return;

  const currentDeptId = state.selectedDepartment;

  main.innerHTML = `
    <div class="p-xs mb-md">
      <p class="text-xs text-muted">Select your engineering technology to view custom syllabus, board questions, and subjects.</p>
    </div>

    <div class="grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;" id="dept-grid">
      ${departments.map((dept) => {
        const isSelected = dept.id === currentDeptId;
        return `
          <div 
            class="card card-interactive p-md dept-card ${isSelected ? "card-highlight" : ""}" 
            data-id="${dept.id}"
            id="dept-card-${dept.id}"
            style="border: 1.5px solid ${isSelected ? "var(--color-forest)" : "var(--color-border)"}; text-align: center; border-radius: var(--radius-md);"
          >
            <div style="font-size: 32px; margin-bottom: 8px;">${dept.icon}</div>
            <h3 class="text-sm font-bold text-forest mb-xs">${dept.shortName}</h3>
            <p class="text-xs text-muted clamp-2" style="font-size: 11px; line-height: 1.3;">${dept.name}</p>
            ${isSelected ? `
              <div class="mt-xs">
                <span class="badge badge-forest" style="font-size: 10px;">Selected</span>
              </div>
            ` : ""}
          </div>
        `;
      }).join("")}
    </div>
  `;

  // Bind clicks
  main.querySelectorAll(".dept-card").forEach((card) => {
    card.addEventListener("click", () => {
      const id = card.getAttribute("data-id");
      state.setDepartment(id);
      const selected = departments.find((d) => d.id === id);
      Toast.show(`Department set to ${selected ? selected.shortName : id}`, "success");
      router.navigate("#/semesters");
    });
  });
}
