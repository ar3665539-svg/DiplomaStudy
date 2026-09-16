/**
 * DiplomaStudy - Subjects List Page
 * Civil 1st Semester এর ৮টি বিষয়
 */

import { AppShell } from "../components/AppShell.js";
import { CIVIL_DEPARTMENT, civilSubjects } from "../../data/civilSubjects.js";
import { router } from "../core/router.js";

export function renderSubjects() {
  AppShell.updateHeader({
    title: "Subjects",
    subtitle: `${CIVIL_DEPARTMENT.name} • ${CIVIL_DEPARTMENT.semesterName}`,
    showBack: true
  });

  const main = AppShell.getMainView();
  if (!main) return;

  main.innerHTML = `
    <div class="page-intro">
      <p class="page-intro-text">
        নিচের যেকোনো বিষয়ে ট্যাপ করুন। প্রতিটি বিষয়ের chapter, প্রশ্ন ও সাজেশন server থেকে যুক্ত করা হবে।
      </p>
    </div>

    <div class="subject-list-full">
      ${civilSubjects.map((sub, idx) => `
        <div 
          class="subject-card-full" 
          data-subject-id="${sub.id}"
          role="button"
          tabindex="0"
          aria-label="${sub.name}"
        >
          <div class="subj-left">
            <div class="subj-number">${String(idx + 1).padStart(2, "0")}</div>
            <div class="subj-icon">${sub.icon}</div>
          </div>
          <div class="subj-body">
            <h3 class="subj-name">${sub.name}</h3>
            <p class="subj-bangla">${sub.banglaName}</p>
            <div class="subj-meta">
              <span class="badge badge-forest">${sub.code}</span>
              <span class="badge badge-sage">${sub.type}</span>
              <span class="badge badge-accent">${sub.credits} Credits</span>
            </div>
            <p class="subj-desc">${sub.description}</p>
          </div>
          <div class="subj-arrow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
        </div>
      `).join("")}
    </div>
  `;

  main.querySelectorAll(".subject-card-full").forEach((card) => {
    const navigate = () => {
      const id = card.getAttribute("data-subject-id");
      if (id) router.navigate(`#/subject?subjectId=${id}`);
    };
    card.addEventListener("click", navigate);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        navigate();
      }
    });
  });
}