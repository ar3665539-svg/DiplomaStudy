/**
 * DiplomaStudy - Study Planner Page View
 */

import { AppShell } from "../components/AppShell.js";
import { plannerService } from "../features/planner/plannerService.js";
import { Modal } from "../components/Modal.js";

export function renderPlanner() {
  AppShell.updateHeader({
    title: "Study Planner & Routine",
    subtitle: "Exam schedule & task manager",
    showBack: true,
    showSearch: false
  });

  const main = AppShell.getMainView();
  if (!main) return;

  let currentFilter = "today";

  const renderTaskList = () => {
    const listEl = main.querySelector("#planner-task-list");
    if (!listEl) return;

    const tasks = plannerService.getByFilter(currentFilter);

    if (tasks.length === 0) {
      listEl.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📅</div>
          <h2 class="empty-state-title">No Tasks in this view</h2>
          <p class="empty-state-desc">Create your study target for today or tomorrow using the button above.</p>
        </div>
      `;
      return;
    }

    listEl.innerHTML = tasks.map((t) => {
      const pColor = t.priority === "High" ? "badge-danger" : t.priority === "Low" ? "badge-sage" : "badge-warning";
      return `
        <div class="card mb-sm p-md ${t.isCompleted ? "opacity-75" : ""}" data-id="${t.id}" id="task-item-${t.id}">
          <div class="flex items-start justify-between mb-xs">
            <div class="flex items-center gap-xs flex-wrap">
              <span class="badge ${pColor}">${t.priority}</span>
              <span class="badge badge-forest">${t.subject}</span>
              <span class="text-xs text-dim">⏰ ${t.startTime} (${t.durationMinutes}m)</span>
            </div>
            <button class="header-icon-btn btn-delete-task text-danger" data-id="${t.id}" title="Delete Task">
              🗑️
            </button>
          </div>

          <div class="flex items-center gap-sm mt-xs">
            <input 
              type="checkbox" 
              class="chk-task-complete" 
              data-id="${t.id}" 
              ${t.isCompleted ? "checked" : ""} 
              style="width: 18px; height: 18px; cursor: pointer;"
            />
            <p class="text-sm font-semibold text-text ${t.isCompleted ? "line-through text-muted" : ""}" style="line-height: 1.3;">
              ${t.title}
            </p>
          </div>
        </div>
      `;
    }).join("");

    listEl.querySelectorAll(".chk-task-complete").forEach((chk) => {
      chk.addEventListener("change", () => {
        const id = chk.getAttribute("data-id");
        plannerService.toggleComplete(id);
        renderTaskList();
      });
    });

    listEl.querySelectorAll(".btn-delete-task").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        plannerService.deleteTask(id);
        renderTaskList();
      });
    });
  };

  const openAddTaskModal = () => {
    const todayStr = new Date().toISOString().split("T")[0];
    const bodyHtml = `
      <div class="flex flex-col gap-sm">
        <div>
          <label class="text-xs font-bold text-muted block mb-xs">Task Description</label>
          <input 
            type="text" 
            id="planner-modal-title" 
            class="search-input" 
            placeholder="e.g., Solve 5 previous board questions of Math-1"
          />
        </div>

        <div class="grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
          <div>
            <label class="text-xs font-bold text-muted block mb-xs">Subject</label>
            <input 
              type="text" 
              id="planner-modal-subject" 
              class="search-input" 
              placeholder="e.g., Basic Electricity"
              value="Basic Electricity"
            />
          </div>
          <div>
            <label class="text-xs font-bold text-muted block mb-xs">Priority</label>
            <select id="planner-modal-priority" class="search-input" style="padding: 10px;">
              <option value="High">High Priority</option>
              <option value="Medium" selected>Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <div class="grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
          <div>
            <label class="text-xs font-bold text-muted block mb-xs">Date</label>
            <input 
              type="date" 
              id="planner-modal-date" 
              class="search-input" 
              value="${todayStr}"
            />
          </div>
          <div>
            <label class="text-xs font-bold text-muted block mb-xs">Duration (mins)</label>
            <input 
              type="number" 
              id="planner-modal-duration" 
              class="search-input" 
              value="45"
            />
          </div>
        </div>
      </div>
    `;

    Modal.show({
      title: "Add Study Routine Task",
      bodyHtml,
      confirmText: "Schedule Task",
      onConfirm: () => {
        const title = document.getElementById("planner-modal-title")?.value || "";
        const subject = document.getElementById("planner-modal-subject")?.value || "Engineering";
        const priority = document.getElementById("planner-modal-priority")?.value || "Medium";
        const date = document.getElementById("planner-modal-date")?.value || todayStr;
        const durationMinutes = document.getElementById("planner-modal-duration")?.value || 45;

        if (title.trim()) {
          plannerService.addTask({ title, subject, priority, date, durationMinutes });
          renderTaskList();
        }
      }
    });
  };

  main.innerHTML = `
    <!-- Top Action Bar -->
    <div class="flex items-center justify-between gap-sm mb-md">
      <div class="flex items-center gap-xs overflow-x-auto" id="planner-filter-chips" style="scrollbar-width: none;">
        <button class="badge badge-forest active p-filter-chip" data-filter="today">Today</button>
        <button class="badge badge-sage p-filter-chip" data-filter="tomorrow">Tomorrow</button>
        <button class="badge badge-sage p-filter-chip" data-filter="upcoming">Upcoming</button>
        <button class="badge badge-sage p-filter-chip" data-filter="completed">Completed</button>
      </div>

      <button class="btn btn-primary btn-sm" id="btn-add-planner-task" style="white-space: nowrap;">
        <span>+ Add</span>
      </button>
    </div>

    <div id="planner-task-list"></div>
  `;

  main.querySelectorAll(".p-filter-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      main.querySelectorAll(".p-filter-chip").forEach((c) => c.classList.remove("badge-forest", "active"));
      main.querySelectorAll(".p-filter-chip").forEach((c) => c.classList.add("badge-sage"));
      chip.classList.remove("badge-sage");
      chip.classList.add("badge-forest", "active");
      currentFilter = chip.getAttribute("data-filter");
      renderTaskList();
    });
  });

  main.querySelector("#btn-add-planner-task")?.addEventListener("click", () => openAddTaskModal());

  renderTaskList();
}
