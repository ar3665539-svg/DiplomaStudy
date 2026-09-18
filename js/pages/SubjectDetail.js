/**
 * SubjectDetail — with hash guard
 */

import { AppShell } from "../components/AppShell.js";
import { getSubjectById, getChaptersBySubject, getDepartments } from "../services/api.js";
import { storage, STORAGE_KEYS } from "../core/storage.js";
import { chapterListSkeleton } from "../utils/skeleton.js";
import { errorState, emptyState } from "../utils/errorState.js";

export async function renderSubjectDetail(params = {}) {
  const MY_HASH = "#/subject";

  AppShell.updateHeader({
    title: "Loading...",
    subtitle: "",
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
    main.innerHTML = errorState({ type: "notFound", customBangla: "Subject select করা হয়নি" });
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
  if ((window.location.hash || "").split("?")[0] !== MY_HASH) {
    console.log("[SubjectDetail] Route changed — abort");
    return;
  }

  if (!subject) {
    main.innerHTML = errorState({
      type: loadError ? "server" : "notFound",
      message: loadError?.message,
      retryFn: () => renderSubjectDetail(params)
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

  const categoryMap = {};
  chapters.forEach((c) => {
    const key = c.category || "__uncategorized__";
    if (!categoryMap[key]) categoryMap[key] = [];
    categoryMap[key].push(c);
  });

  const categoryKeys = Object.keys(categoryMap).sort((a, b) => {
    if (a === "__uncategorized__") return 1;
    if (b === "__uncategorized__") return -1;
    return a.localeCompare(b);
  });

  const hasCategories = categoryKeys.filter((k) => k !== "__uncategorized__").length > 0;

  const catEmojis = {
    "গদ্য": "📖", "পদ্য": "🎭", "উপন্যাস": "📕", "নাটক": "🎬",
    "প্রবন্ধ": "📝", "গল্প": "📗", "কবিতা": "✒️", "জীবনী": "👤",
    "অনুবাদ": "🔄", "ব্যাকরণ": "📐", "সাহিত্য": "📚",
    "Prose": "📖", "Poetry": "🎭", "Novel": "📕", "Drama": "🎬",
    "Essay": "📝", "Short Story": "📗", "Grammar": "📐",
    "বীজগণিত": "🔢", "জ্যামিতি": "📐", "ত্রিকোণমিতি": "📊",
    "ক্যালকুলাস": "∫", "পরিসংখ্যান": "📈", "সমীকরণ": "⚖️",
    "মেকানিক্স": "⚙️", "তাপ": "🌡️", "শব্দ": "🔊", "আলো": "💡",
    "বিদ্যুৎ": "⚡", "চুম্বক": "🧲",
    "থিওরি": "📖", "ড্রয়িং": "✏️", "প্র্যাকটিক্যাল": "🔧",
    "সার্ভে": "📐", "ম্যাটেরিয়াল": "🧱", "স্ট্রাকচার": "🏗️",
    "__uncategorized__": "📄"
  };

  main.innerHTML = `
    <div style="padding:18px;background:linear-gradient(135deg, rgba(28,62,44,0.08), transparent);border-left:4px solid #1C3E2C;border-radius:16px;margin-bottom:18px;">
      <div style="display:flex;align-items:center;gap:14px;">
        <div style="width:56px;height:56px;border-radius:16px;background:linear-gradient(135deg,#DCFCE7,#BBF7D0);display:flex;align-items:center;justify-content:center;font-size:28px;flex-shrink:0;box-shadow:0 4px 12px rgba(16,185,129,0.15);">${subject.icon || "📘"}</div>
        <div style="flex:1;min-width:0;">
          <h2 style="font-size:17px;font-weight:900;color:#1C3E2C;letter-spacing:-0.3px;margin:0 0 3px;">${escapeHtml(subject.name)}</h2>
          ${subject.banglaName ? `<p style="font-size:12px;color:#84968B;font-weight:600;margin:0 0 6px;">${escapeHtml(subject.banglaName)}</p>` : ""}
          <div style="display:flex;gap:4px;flex-wrap:wrap;">
            ${subject.code ? `<span style="font-size:9.5px;font-weight:800;color:#065F46;background:#DCFCE7;padding:3px 8px;border-radius:6px;text-transform:uppercase;">${escapeHtml(subject.code)}</span>` : ""}
            ${subject.type ? `<span style="font-size:9.5px;font-weight:800;color:#57675D;background:#F2F5F2;padding:3px 8px;border-radius:6px;text-transform:uppercase;">${escapeHtml(subject.type)}</span>` : ""}
            ${subject.credits ? `<span style="font-size:9.5px;font-weight:800;color:#C87A1E;background:#FEF3C7;padding:3px 8px;border-radius:6px;">${subject.credits} CR</span>` : ""}
          </div>
        </div>
      </div>
    </div>

    ${hasChapters ? `
      <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 14px;background:linear-gradient(135deg, rgba(28,62,44,0.06), transparent);border-radius:12px;margin-bottom:14px;">
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="font-size:16px;">📖</span>
          <span style="font-size:13px;font-weight:700;color:#57675D;">মোট <strong style="color:#1C3E2C;font-weight:900;">${chapters.length}</strong>টি অধ্যায়</span>
        </div>
        <span style="font-size:11px;color:#84968B;font-weight:600;">ট্যাপ করে খুলুন →</span>
      </div>

      ${categoryKeys.map((catKey) => {
        const catChapters = categoryMap[catKey];
        const label = catKey === "__uncategorized__" ? "Other" : catKey;
        const emoji = catEmojis[catKey] || "📄";
        return `
          <div style="margin-bottom:16px;">
            ${hasCategories ? `
              <div style="display:flex;align-items:center;gap:8px;margin:0 0 10px 4px;">
                <span style="font-size:16px;">${emoji}</span>
                <span style="font-size:13px;font-weight:800;color:#1C3E2C;">${escapeHtml(label)}</span>
                <span style="font-size:10.5px;font-weight:800;color:#84968B;background:#F2F5F2;padding:2px 8px;border-radius:999px;">${catChapters.length}</span>
              </div>
            ` : ""}

            <div style="display:flex;flex-direction:column;gap:8px;">
              ${catChapters.map((ch) => `
                <div class="chapter-item" data-chapter-id="${ch.id}" style="background:#FFFFFF;border:1.5px solid #E1E8E1;border-radius:14px;overflow:hidden;transition:all 0.2s ease;">
                  <button class="chapter-header" data-toggle="${ch.id}" type="button" style="width:100%;display:flex;align-items:center;gap:12px;padding:14px;background:transparent;border:none;cursor:pointer;font-family:inherit;text-align:left;">
                    <div style="min-width:38px;height:38px;padding:0 8px;border-radius:10px;background:linear-gradient(135deg,#DCFCE7,#BBF7D0);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:900;color:#065F46;font-family:ui-monospace,monospace;flex-shrink:0;">${ch.number}</div>
                    <div style="flex:1;min-width:0;">
                      <div style="font-size:13.5px;font-weight:800;color:#1C3E2C;line-height:1.3;margin-bottom:3px;">${escapeHtml(ch.name)}</div>
                      ${ch.nameEn ? `<div style="font-size:10.5px;color:#84968B;font-weight:500;font-style:italic;">${escapeHtml(ch.nameEn)}</div>` : ""}
                    </div>
                    <div class="chevron" style="width:28px;height:28px;border-radius:50%;background:#F2F5F2;color:#57675D;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all 0.25s cubic-bezier(0.34,1.56,0.64,1);">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                  </button>

                  <div class="chapter-body" data-body="${ch.id}" style="max-height:0;overflow:hidden;transition:max-height 0.3s cubic-bezier(0.34,1.2,0.64,1);">
                    <div style="padding:12px 14px 14px;border-top:1px dashed #E1E8E1;">
                      <div style="font-size:11px;font-weight:700;color:#57675D;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:10px;">📝 Content দেখতে ট্যাপ করুন</div>
                      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;">
                        ${contentBtn("pdf", "📄", "PDF", "pdf", ch, subjectId)}
                        ${contentBtn("creative", "📝", "রচনামূলক", "creative", ch, subjectId)}
                        ${contentBtn("short", "📄", "সংক্ষিপ্ত", "short", ch, subjectId)}
                        ${contentBtn("mcq", "⚡", "MCQ", "mcq", ch, subjectId)}
                        ${contentBtn("suggestion", "💡", "সাজেশন", "suggestion", ch, subjectId)}
                        ${contentBtn("formula", "🧮", "সূত্রাবলী", "formula", ch, subjectId)}
                      </div>
                    </div>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>
        `;
      }).join("")}
    ` : emptyState({
      icon: "📚",
      title: "কোনো অধ্যায় নেই",
      message: "এই subject-এ এখনো কোনো chapter যোগ করা হয়নি।"
    })}

    <div style="height:20px;"></div>
  `;

  main.querySelectorAll("[data-toggle]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const chId = btn.getAttribute("data-toggle");
      const body = main.querySelector(`[data-body="${chId}"]`);
      const item = btn.closest(".chapter-item");
      const chevron = btn.querySelector(".chevron");
      const isOpen = body.style.maxHeight && body.style.maxHeight !== "0px";

      main.querySelectorAll(".chapter-body").forEach((b) => {
        if (b !== body) {
          b.style.maxHeight = "0";
          const oi = b.closest(".chapter-item");
          const oc = oi?.querySelector(".chevron");
          if (oc) oc.style.transform = "";
          if (oi) oi.style.borderColor = "#E1E8E1";
        }
      });

      if (isOpen) {
        body.style.maxHeight = "0";
        if (chevron) chevron.style.transform = "";
        if (item) item.style.borderColor = "#E1E8E1";
      } else {
        body.style.maxHeight = body.scrollHeight + "px";
        if (chevron) chevron.style.transform = "rotate(180deg)";
        if (item) item.style.borderColor = "#1C3E2C";
      }
    });
  });

  main.querySelectorAll("[data-content]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const type = btn.getAttribute("data-content");
      const chapterId = btn.getAttribute("data-chapter-id");
      const chapterNumber = btn.getAttribute("data-chapter-number");
      window.location.hash = `#/content?type=${type}&subjectId=${subjectId}&chapterId=${chapterId}&chapterNumber=${chapterNumber}`;
    });
  });
}

function contentBtn(type, icon, label, colorSet, chapter, subjectId) {
  const colors = {
    pdf:        { bg: "#FEE2E2", fg: "#991B1B" },
    rose:       { bg: "#FEE2E2", fg: "#991B1B" },
    creative:   { bg: "#DCFCE7", fg: "#065F46" },
    forest:     { bg: "#DCFCE7", fg: "#065F46" },
    short:      { bg: "#FEF3C7", fg: "#92400E" },
    accent:     { bg: "#FEF3C7", fg: "#92400E" },
    mcq:        { bg: "#E0E7FF", fg: "#3730A3" },
    indigo:     { bg: "#E0E7FF", fg: "#3730A3" },
    suggestion: { bg: "#F3E8FF", fg: "#6B21A8" },
    purple:     { bg: "#F3E8FF", fg: "#6B21A8" },
    formula:    { bg: "#CFFAFE", fg: "#155E75" },
    cyan:       { bg: "#CFFAFE", fg: "#155E75" }
  };
  const c = colors[colorSet] || colors.pdf;

  return `
    <button data-content="${type}" data-chapter-id="${chapter.id}" data-chapter-number="${chapter.number}" data-subject-id="${subjectId}" type="button" style="display:flex;flex-direction:column;align-items:center;gap:4px;padding:10px 4px 8px;background:${c.bg};border:1px solid ${c.fg}20;border-radius:11px;cursor:pointer;font-family:inherit;">
      <span style="font-size:18px;line-height:1;">${icon}</span>
      <span style="font-size:10px;font-weight:800;color:${c.fg};line-height:1.1;text-align:center;">${label}</span>
    </button>
  `;
}

function escapeHtml(str) {
  if (str == null) return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}