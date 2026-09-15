/**
 * DiplomaStudy - Chapters Page View
 */

import { AppShell } from "../components/AppShell.js";
import { getSubjectById } from "../../data/subjects.js";
import { getChaptersBySubjectId } from "../../data/chapters.js";
import { router } from "../core/router.js";
import { state } from "../core/state.js";

export function renderChapters(params = {}) {
  const subjectId = params.subjectId || (state.selectedSubject ? state.selectedSubject.id : "basic-elec");
  const subject = getSubjectById(subjectId) || { name: "Subject Chapters", code: "" };
  const subjectChapters = getChaptersBySubjectId(subjectId);

  state.setSubject(subject);

  AppShell.updateHeader({
    title: subject.name,
    subtitle: `Code: ${subject.code} • Chapters`,
    showBack: true,
    showSearch: false
  });

  const main = AppShell.getMainView();
  if (!main) return;

  main.innerHTML = `
    <!-- Subject Summary Header -->
    <div class="card mb-md p-sm" style="background-color: var(--color-forest-soft); border-left: 4px solid var(--color-forest);">
      <h3 class="text-sm font-bold text-forest">${subject.name} (${subject.code})</h3>
      <p class="text-xs text-muted mt-xs">${subject.description || "Course syllabus breakdown and chapter-wise question bank."}</p>
    </div>

    <div class="section-header">
      <h3 class="section-title">Course Chapters</h3>
      <span class="text-xs text-muted">${subjectChapters.length} Total Chapters</span>
    </div>

    <div class="flex flex-col gap-sm" id="chapter-list">
      ${subjectChapters.length > 0 ? (
        subjectChapters.map((ch) => `
          <div 
            class="card card-interactive p-md chapter-card" 
            data-chapter-id="${ch.id}"
            id="chapter-card-${ch.id}"
          >
            <div class="flex items-start justify-between mb-xs">
              <div class="flex items-center gap-xs">
                <span class="badge badge-forest" style="font-size: 11px;">Ch. ${ch.number}</span>
                <h4 class="text-sm font-bold text-forest">${ch.title}</h4>
              </div>
              <span class="badge badge-sage">${ch.questionCount || 10} Qs</span>
            </div>

            <p class="text-xs text-muted mb-sm" style="line-height: 1.4;">${ch.description}</p>

            <div class="flex items-center justify-between text-xs text-dim">
              <span>Key: ${ch.keyConcepts ? ch.keyConcepts.slice(0, 2).join(", ") : "Core Topics"}</span>
              <span class="text-forest font-bold">Open Questions →</span>
            </div>
          </div>
        `).join("")
      ) : `
        <div class="empty-state">
          <div class="empty-state-icon">📖</div>
          <h2 class="empty-state-title">No Chapters Found</h2>
          <p class="empty-state-desc">Chapters are being updated for this subject.</p>
        </div>
      `}
    </div>
  `;

  main.querySelectorAll(".chapter-card").forEach((card) => {
    card.addEventListener("click", () => {
      const chapterId = card.getAttribute("data-chapter-id");
      router.navigate(`#/questions?subjectId=${subjectId}&chapterId=${chapterId}`);
    });
  });
}
