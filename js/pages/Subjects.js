/**
 * DiplomaStudy - Subjects List v2 (Modern)
 * + Stagger animations
 * + Modern cards
 * + Count-up subtitle
 */

import { AppShell } from "../components/AppShell.js";
import { getSubjects, getDepartments } from "../services/api.js";
import { storage, STORAGE_KEYS } from "../core/storage.js";
import { router } from "../core/router.js";

export async function renderSubjects() {
  AppShell.updateHeader({
    title: "Subjects",
    subtitle: "Loading...",
    showBack: true
  });

  const main = AppShell.getMainView();
  if (!main) return;

  // Skeleton
  main.innerHTML = `
    <div class="skeleton skeleton-text w-100" style="height:44px;margin-bottom:16px;"></div>
    <div class="flex flex-col gap-sm">
      <div class="skeleton skeleton-card" style="height:96px;"></div>
      <div class="skeleton skeleton-card" style="height:96px;"></div>
      <div class="skeleton skeleton-card" style="height:96px;"></div>
    </div>
  `;

  const settings = storage.get(STORAGE_KEYS.SETTINGS, {});
  const departments = await getDepartments();
  const curDeptId = settings.departmentId || settings.department || "";
  const currentDept = departments.find((d) => d.id === curDeptId) || departments[0];

  const subjects = await getSubjects();

  AppShell.updateHeader({
    title: "Subjects",
    subtitle: currentDept ? `${currentDept.name} • Semester ${settings.semesterNumber || 1}` : "",
    showBack: true
  });

  if (subjects.length === 0) {
    main.innerHTML = `
      <div class="empty-state animate-fade-in" style="margin-top: 40px;">
        <div class="empty-state-icon">📚</div>
        <h2 class="empty-state-title">No Subjects</h2>
        <p class="empty-state-desc">এই semester-এ এখনো কোনো subject যোগ করা হয়নি।</p>
      </div>
    `;
    return;
  }

  main.innerHTML = `
    <div class="page-intro animate-slide-up">
      <p class="page-intro-text">
        নিচের যেকোনো বিষয়ে ট্যাপ করুন। প্রতিটি বিষয়ের chapter, প্রশ্ন ও সাজেশন server থেকে যুক্ত করা হবে।
      </p>
    </div>

    <div class="subject-list-full">
      ${subjects.map((sub, idx) => `
        <div 
          class="subject-card-full tap-effect animate-slide-up" 
          data-subject-id="${sub.id}"
          role="button"
          tabindex="0"
          style="animation-delay:${idx * 0.04}s;"
          aria-label="${sub.name}"
        >
          <div class="subj-left">
            <div class="subj-number">${String(idx + 1).padStart(2, "0")}</div>
            <div class="subj-icon">${sub.icon || "📘"}</div>
          </div>
          <div class="subj-body">
            <h3 class="subj-name">${sub.name}</h3>
            <p class="subj-bangla">${sub.banglaName || ""}</p>
            <div class="subj-meta">
              ${sub.code ? `<span class="badge badge-forest">${sub.code}</span>` : ""}
              <span class="badge badge-sage">${sub.type || "Theory"}</span>
              <span class="badge badge-accent">${sub.credits || 3} Credits</span>
            </div>
            ${sub.description ? `<p class="subj-desc">${sub.description}</p>` : ""}
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