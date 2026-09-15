/**
 * DiplomaStudy - Diploma Jobs & Internships Page View
 */

import { AppShell } from "../components/AppShell.js";
import { jobs, internships } from "../../data/jobs.js";
import { SearchBar } from "../components/SearchBar.js";

export function renderJobs() {
  AppShell.updateHeader({
    title: "Diploma Jobs & Internships",
    subtitle: "Career circulars & industrial attachments",
    showBack: true,
    showSearch: true
  });

  const main = AppShell.getMainView();
  if (!main) return;

  let activeSection = "jobs"; // "jobs" | "internships"
  let searchQuery = "";

  const renderContent = () => {
    const listEl = main.querySelector("#jobs-list-container");
    if (!listEl) return;

    if (activeSection === "jobs") {
      let filtered = jobs;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter((j) =>
          j.title.toLowerCase().includes(q) ||
          j.organization.toLowerCase().includes(q) ||
          j.technology.toLowerCase().includes(q) ||
          j.location.toLowerCase().includes(q)
        );
      }

      if (filtered.length === 0) {
        listEl.innerHTML = `<div class="empty-state"><p class="empty-state-desc">No job circulars match your search.</p></div>`;
        return;
      }

      listEl.innerHTML = filtered.map((j) => `
        <div class="card mb-md p-md job-card">
          <div class="flex items-start justify-between mb-xs">
            <div>
              <span class="badge badge-forest mb-xs">${j.technology} Engineering</span>
              <h3 class="text-sm font-bold text-forest">${j.title}</h3>
              <p class="text-xs font-semibold text-text">${j.organization}</p>
            </div>
            <span class="badge badge-accent">Active</span>
          </div>

          <div class="flex flex-col gap-xs my-sm text-xs text-muted">
            <span>📍 <strong>Location:</strong> ${j.location}</span>
            <span>🎓 <strong>Requirement:</strong> ${j.qualification}</span>
            <span>💰 <strong>Salary/Scale:</strong> ${j.salaryGrade}</span>
            <span>⏳ <strong>Application Deadline:</strong> ${j.deadline}</span>
          </div>

          <div class="flex items-center justify-between pt-xs" style="border-top: 1px dashed var(--color-border);">
            <span class="text-xs text-dim">Source: ${j.source}</span>
            <a href="${j.link}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
              <span>View Circular →</span>
            </a>
          </div>
        </div>
      `).join("");
    } else {
      let filtered = internships;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter((i) =>
          i.company.toLowerCase().includes(q) ||
          i.position.toLowerCase().includes(q) ||
          i.technology.toLowerCase().includes(q)
        );
      }

      listEl.innerHTML = filtered.map((item) => `
        <div class="card mb-md p-md internship-card">
          <div class="flex items-start justify-between mb-xs">
            <div>
              <span class="badge badge-sage mb-xs">${item.technology} Technology</span>
              <h3 class="text-sm font-bold text-forest">${item.position}</h3>
              <p class="text-xs font-semibold text-text">${item.company}</p>
            </div>
            <span class="badge badge-forest">8th Sem Attachment</span>
          </div>

          <div class="flex flex-col gap-xs my-sm text-xs text-muted">
            <span>📍 <strong>Placement:</strong> ${item.location}</span>
            <span>⏱️ <strong>Duration:</strong> ${item.duration}</span>
            <span>💵 <strong>Stipend:</strong> ${item.stipend}</span>
          </div>

          <div class="pt-xs" style="border-top: 1px dashed var(--color-border);">
            <a href="${item.applicationLink}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm btn-block">
              <span>Attachment Details & Application</span>
            </a>
          </div>
        </div>
      `).join("");
    }
  };

  main.innerHTML = `
    <!-- Demo Disclaimer -->
    <div class="card p-xs mb-sm text-xs text-muted" style="background-color: var(--color-surface-hover); border-left: 3px solid var(--color-accent);">
      <span>📢 <strong>Notice:</strong> Job listings & industrial attachment opportunities are representative demo circulars for student career guidance.</span>
    </div>

    <!-- Section Switcher -->
    <div class="flex items-center gap-xs mb-sm">
      <button class="badge badge-forest active j-sec-btn" data-sec="jobs">Job Circulars (${jobs.length})</button>
      <button class="badge badge-sage j-sec-btn" data-sec="internships">8th Sem Internships (${internships.length})</button>
    </div>

    <div class="mb-sm">
      ${SearchBar.render({ placeholder: "Search by company, position, department...", id: "job-search-input" })}
    </div>

    <div id="jobs-list-container"></div>
  `;

  main.querySelectorAll(".j-sec-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      main.querySelectorAll(".j-sec-btn").forEach((b) => b.classList.remove("badge-forest", "active"));
      main.querySelectorAll(".j-sec-btn").forEach((b) => b.classList.add("badge-sage"));
      btn.classList.remove("badge-sage");
      btn.classList.add("badge-forest", "active");
      activeSection = btn.getAttribute("data-sec");
      renderContent();
    });
  });

  SearchBar.bindEvents(main, (q) => {
    searchQuery = q.trim();
    renderContent();
  }, "job-search-input");

  renderContent();
}
