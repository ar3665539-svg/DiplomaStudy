/**
 * DiplomaStudy - Settings Page View
 */

import { AppShell } from "../components/AppShell.js";
import { state } from "../core/state.js";
import { departments } from "../../data/departments.js";
import { semesters } from "../../data/semesters.js";
import { storage } from "../core/storage.js";
import { Modal } from "../components/Modal.js";
import { Toast } from "../components/Toast.js";
import { APP_CONFIG } from "../core/config.js";
import { notificationService } from "../services/notificationService.js";

export function renderSettings() {
  AppShell.updateHeader({
    title: "Settings & Profile",
    subtitle: "Preferences, backups & data",
    showBack: true,
    showSearch: false
  });

  const main = AppShell.getMainView();
  if (!main) return;

  const currentSettings = {
    name: state.userPreferences.name,
    dept: state.selectedDepartment,
    sem: state.selectedSemester,
    dailyGoal: state.userPreferences.dailyGoalMinutes,
    theme: state.theme
  };

  main.innerHTML = `
    <!-- User Profile Section -->
    <div class="card mb-md p-md">
      <div class="flex items-center gap-sm mb-md">
        <div style="width: 44px; height: 44px; border-radius: 50%; background-color: var(--color-forest); color: #FFFFFF; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px;">
          ${currentSettings.name.charAt(0) || "S"}
        </div>
        <div>
          <h3 class="text-sm font-bold text-forest">${currentSettings.name}</h3>
          <span class="text-xs text-muted">Diploma-in-Engineering Student</span>
        </div>
      </div>

      <div class="flex flex-col gap-sm">
        <div>
          <label class="text-xs font-bold text-muted block mb-xs">Your Name</label>
          <input type="text" id="setting-user-name" class="search-input" value="${currentSettings.name}" />
        </div>

        <div class="grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
          <div>
            <label class="text-xs font-bold text-muted block mb-xs">Technology</label>
            <select id="setting-dept-select" class="search-input">
              ${departments.map((d) => `
                <option value="${d.id}" ${d.id === currentSettings.dept ? "selected" : ""}>${d.shortName}</option>
              `).join("")}
            </select>
          </div>

          <div>
            <label class="text-xs font-bold text-muted block mb-xs">Semester</label>
            <select id="setting-sem-select" class="search-input">
              ${semesters.map((s) => `
                <option value="${s.id}" ${s.id === currentSettings.sem ? "selected" : ""}>${s.name}</option>
              `).join("")}
            </select>
          </div>
        </div>

        <div>
          <label class="text-xs font-bold text-muted block mb-xs">Daily Study Target (Minutes)</label>
          <input type="number" id="setting-daily-goal" class="search-input" value="${currentSettings.dailyGoal}" min="15" max="360" />
        </div>

        <button class="btn btn-primary btn-sm mt-xs" id="btn-save-profile">Save Profile Changes</button>
      </div>
    </div>

    <!-- Appearance & App Preferences -->
    <div class="card mb-md p-md">
      <h3 class="text-sm font-bold text-forest mb-sm">Appearance & System</h3>

      <div class="flex items-center justify-between py-sm" style="border-bottom: 1px solid var(--color-border);">
        <div>
          <span class="text-xs font-bold text-text block">Dark Theme</span>
          <span class="text-xs text-muted">Reduced eye strain in night study</span>
        </div>
        <button class="btn btn-secondary btn-sm" id="btn-toggle-theme-setting">
          ${currentSettings.theme === "dark" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </div>

      <div class="flex items-center justify-between py-sm" style="border-bottom: 1px solid var(--color-border);">
        <div>
          <span class="text-xs font-bold text-text block">Study Reminders</span>
          <span class="text-xs text-muted">Daily goal & test notifications</span>
        </div>
        <button class="btn btn-secondary btn-sm" id="btn-enable-notifications">
          Enable
        </button>
      </div>

      <!-- PWA Install Prompt Trigger -->
      <div class="flex items-center justify-between py-sm" id="pwa-install-row">
        <div>
          <span class="text-xs font-bold text-text block">Install DiplomaStudy PWA</span>
          <span class="text-xs text-muted">Add to home screen for offline access</span>
        </div>
        <button class="btn btn-primary btn-sm" id="btn-pwa-install-app">
          Install App
        </button>
      </div>
    </div>

    <!-- Data Management & Backups -->
    <div class="card mb-md p-md">
      <h3 class="text-sm font-bold text-forest mb-sm">Data & Backup</h3>
      <p class="text-xs text-muted mb-sm">Export your bookmarks, study notes, planner tasks, and quiz scores into a JSON backup file.</p>

      <div class="flex items-center gap-xs mb-sm">
        <button class="btn btn-secondary btn-sm flex-1" id="btn-export-backup">
          <span>Export Backup (JSON)</span>
        </button>
        <button class="btn btn-secondary btn-sm flex-1" id="btn-import-trigger">
          <span>Import Backup</span>
        </button>
        <input type="file" id="file-import-input" accept=".json" style="display: none;" />
      </div>

      <div class="pt-sm" style="border-top: 1px dashed var(--color-border);">
        <button class="btn btn-secondary btn-sm btn-block text-danger" id="btn-reset-all-data">
          Reset All App Data
        </button>
      </div>
    </div>

    <!-- About & Board Disclaimer -->
    <div class="card mb-xl p-md text-xs text-muted" style="line-height: 1.5;">
      <h4 class="font-bold text-forest mb-xs">About DiplomaStudy v${APP_CONFIG.version}</h4>
      <p class="mb-xs">Created for Diploma-in-Engineering polytechnic students across Bangladesh. Designed for offline readiness, fast access, and mobile-first revision.</p>
      <p><strong>Disclaimer:</strong> This application is an independent educational aid and is not officially affiliated with or endorsed by Bangladesh Technical Education Board (BTEB).</p>
    </div>
  `;

  // Bind profile save
  main.querySelector("#btn-save-profile")?.addEventListener("click", () => {
    const name = main.querySelector("#setting-user-name")?.value || "";
    const dept = main.querySelector("#setting-dept-select")?.value;
    const sem = main.querySelector("#setting-sem-select")?.value;
    const goal = main.querySelector("#setting-daily-goal")?.value;

    state.updateUserProfile(name, goal);
    if (dept) state.setDepartment(dept);
    if (sem) state.setSemester(sem);

    Toast.show("Profile preferences saved!", "success");
    renderSettings();
  });

  // Bind Theme toggle
  main.querySelector("#btn-toggle-theme-setting")?.addEventListener("click", () => {
    state.toggleTheme();
    renderSettings();
  });

  // Bind notifications
  main.querySelector("#btn-enable-notifications")?.addEventListener("click", () => {
    notificationService.requestPermission();
  });

  // Bind PWA Install button
  const installBtn = main.querySelector("#btn-pwa-install-app");
  installBtn?.addEventListener("click", () => {
    if (window.deferredPWAInstallPrompt) {
      window.deferredPWAInstallPrompt.prompt();
      window.deferredPWAInstallPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          Toast.show("DiplomaStudy installed to home screen!", "success");
        }
        window.deferredPWAInstallPrompt = null;
      });
    } else {
      Toast.show("Open your browser menu and tap 'Add to Home screen'", "info");
    }
  });

  // Bind Export
  main.querySelector("#btn-export-backup")?.addEventListener("click", () => {
    const data = storage.exportAllData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `DiplomaStudy_Backup_${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    Toast.show("Backup downloaded successfully!", "success");
  });

  // Bind Import
  const fileInput = main.querySelector("#file-import-input");
  main.querySelector("#btn-import-trigger")?.addEventListener("click", () => {
    fileInput?.click();
  });

  fileInput?.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      const res = storage.importData(content);
      if (res.success) {
        Toast.show("Data imported successfully! Reloading...", "success");
        setTimeout(() => window.location.reload(), 800);
      } else {
        Toast.show("Failed to import data: " + res.error, "error");
      }
    };
    reader.readAsText(file);
  });

  // Bind Reset
  main.querySelector("#btn-reset-all-data")?.addEventListener("click", () => {
    Modal.show({
      title: "Reset All App Data?",
      bodyHtml: "<p class='text-xs text-danger'>This will erase all your local study notes, saved bookmarks, quiz scores, and planner routine. This cannot be reversed!</p>",
      confirmText: "Yes, Reset Everything",
      cancelText: "Cancel",
      onConfirm: () => {
        storage.clearAll();
        Toast.show("All application data reset", "info");
        setTimeout(() => window.location.reload(), 500);
      }
    });
  });
}
