/**
 * Chapters — All chapters of a subject (accordion with content tabs)
 * Same as SubjectDetail but dedicated route
 */

import { AppShell } from "../components/AppShell.js";
import { getSubjectById, getChaptersBySubject, getDepartments } from "../services/api.js";
import { storage, STORAGE_KEYS } from "../core/storage.js";
import { chapterListSkeleton } from "../utils/skeleton.js";
import { errorState, emptyState } from "../utils/errorState.js";

export async function renderChapters(params = {}) {
  const MY_HASH = "#/chapters";

  AppShell.updateHeader({
    title: "Chapters",
    subtitle: "Loading...",
    showBack: true,
    showSearch: false,
    showTheme: true,
    showSettings: false,
    expectedHash: MY_HASH
  });

  const main = AppShell.getMainView();
  if (!main) return;

  main.innerHTML = chapterListSkeleton(6);

  const urlParams = new URLSearchParams(window.location.hash.split("?")[1] || "");
  const subjectId = params.subjectId || urlParams.get("subjectId") || "";

  if (!subjectId) {
    // No subject → show subject picker
    await renderSubjectPicker(main, MY_HASH);
    return;
  }

  let subject = null, chapters = [], deptName = "";
  let loadError = null;

  try {
    subject = await getSubjectById(subjectId);
    if (subject) chapters = await getChaptersBySubject(subjectId);
  } catch (e) { loadError = e; }

  try {
    const settings = storage.get(STORAGE_KEYS.SETTINGS, {});
    const deptId = settings.departmentId || settings.department || "";
    if (deptId) {
      const depts = await getDepartments();
      const cur = depts.find((d) => d.id === deptId);
      if (cur) deptName = cur.name;
    }
  } catch (e) {}

  // Guard
  if ((window.location.hash || "").split("?")[0] !== MY_HASH) return;

  if (!subject) {
    main.innerHTML = errorState({
      type: loadError ? "server" : "notFound",
      message: loadError?.message,
      retryFn: () => renderChapters(params)
    });
    return;
  }

  AppShell.updateHeader({
    title: subject.name,
    subtitle: deptName,
    showBack: true,
    showSearch: false,
    showTheme: true,
    showSettings: false,
    expectedHash: MY_HASH
  });

  const hasChapters = chapters.length > 0;

  main.innerHTML = `
    <div style="padding:18px;background:linear-gradient(135deg, rgba(28,62,44,0.08), transparent);border-left:4px solid #1C3E2C;border-radius:16px;margin-bottom:18px;">
      <div style="display:flex;align-items:center;gap:14px;">
        <div style="width:56px;height:56px;border-radius:16px;background:linear-gradient(135deg,#DCFCE7,#BBF7D0);display:flex;align-items:center;justify-content:center;font-size:28px;flex-shrink:0;">${subject.icon || "📘"}</div>
        <div style="flex:1;min-width:0;">
          <h2 style="font-size:17px;font-weight:900;color:#1C3E2C;letter-spacing:-0.3px;margin:0 0 3px;">${escapeHtml(subject.name)}</h2>
          ${subject.code ? `<div style="font-size:11px;color:#84968B;font-weight:600;">${escapeHtml(subject.code)}</div>` : ""}
        </div>
      </div>
    </div>

    ${hasChapters ? `
      <div style="display:flex;justify-content:space-between;padding:12px 14px;background:linear-gradient(135deg, rgba(28,62,44,0.06), transparent);border-radius:12px;margin-bottom:14px;">
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="font-size:16px;">📖</span>
          <span style="font-size:13px;font-weight:700;color:#57675D;">মোট <strong style="color:#1C3E2C;font-weight:900;">${chapters.length}</strong>টি অধ্যায়</span>
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:8px;">
        ${chapters.map((ch) => `
          <button class="ch-row" data-chapter-id="${ch.id}" style="
            display:flex;align-items:center;gap:12px;
            padding:14px;background:#FFFFFF;
            border:1.5px solid #E1E8E1;border-radius:14px;
            cursor:pointer;font-family:inherit;text-align:left;width:100%;
            box-shadow:0 2px 6px rgba(28,62,44,0.04);
          ">
            <div style="min-width:38px;height:38px;padding:0 8px;border-radius:10px;background:linear-gradient(135deg,#DCFCE7,#BBF7D0);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:900;color:#065F46;font-family:ui-monospace,monospace;flex-shrink:0;">${ch.number}</div>
            <div style="flex:1;min-width:0;">
              <div style="font-size:13.5px;font-weight:800;color:#1C3E2C;line-height:1.3;margin-bottom:3px;">${escapeHtml(ch.name)}</div>
              ${ch.nameEn ? `<div style="font-size:10.5px;color:#84968B;font-weight:500;font-style:italic;">${escapeHtml(ch.nameEn)}</div>` : ""}
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#84968B" stroke-width="2.5" stroke-linecap="round" style="flex-shrink:0;"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        `).join("")}
      </div>
    ` : emptyState({ icon: "📚", title: "কোনো অধ্যায় নেই", message: "এই subject-এ এখনো chapter যোগ করা হয়নি।" })}

    <div style="height:20px;"></div>
  `;

  main.querySelectorAll(".ch-row").forEach((btn) => {
    btn.addEventListener("click", () => {
      const chId = btn.getAttribute("data-chapter-id");
      if (chId) window.location.hash = `#/content?subjectId=${subjectId}&chapterId=${chId}`;
    });
  });
}

async function renderSubjectPicker(main, MY_HASH) {
  const { getSubjects } = await import("../services/api.js");
  let subjects = [];
  try { subjects = await getSubjects(); } catch (e) {}

  if ((window.location.hash || "").split("?")[0] !== MY_HASH) return;

  if (subjects.length === 0) {
    main.innerHTML = emptyState({
      icon: "📚",
      title: "কোনো Subject নেই",
      message: "Subjects যোগ করুন।",
      actionFn: () => window.location.hash = "#/home",
      actionLabel: "🏠 Home"
    });
    return;
  }

  main.innerHTML = `
    <div style="padding:14px 16px;background:linear-gradient(135deg, rgba(28,62,44,0.06), transparent);border-left:4px solid #1C3E2C;border-radius:14px;margin-bottom:18px;">
      <p style="font-size:12.5px;color:#57675D;line-height:1.55;font-weight:500;margin:0;">যে subject এর chapters দেখতে চান সেটা select করুন।</p>
    </div>

    <div style="display:flex;flex-direction:column;gap:10px;">
      ${subjects.map((s) => `
        <button class="subj-pick" data-id="${s.id}" style="
          display:flex;align-items:center;gap:12px;
          padding:14px;background:#FFFFFF;
          border:1.5px solid #E1E8E1;border-radius:16px;
          cursor:pointer;font-family:inherit;text-align:left;width:100%;
        ">
          <div style="width:46px;height:46px;border-radius:13px;background:linear-gradient(135deg,#DCFCE7,#BBF7D0);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;">${s.icon || "📘"}</div>
          <div style="flex:1;min-width:0;">
            <div style="font-size:13.5px;font-weight:800;color:#1C3E2C;margin-bottom:2px;">${escapeHtml(s.name)}</div>
            ${s.code ? `<div style="font-size:11px;color:#84968B;font-weight:600;">${escapeHtml(s.code)}</div>` : ""}
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#84968B" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      `).join("")}
    </div>
  `;

  main.querySelectorAll(".subj-pick").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      if (id) window.location.hash = `#/chapters?subjectId=${id}`;
    });
  });
}

function escapeHtml(str) {
  if (str == null) return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}