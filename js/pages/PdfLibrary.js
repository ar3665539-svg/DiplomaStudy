/**
 * DiplomaStudy - PDF Library (DB-driven ONLY)
 * Fetches from server, no hardcoded data
 */

import { AppShell } from "../components/AppShell.js";
import { getSubjects, getPdfsBySubject } from "../services/api.js";
import { storage, STORAGE_KEYS } from "../core/storage.js";

export async function renderPdfLibrary() {
  AppShell.updateHeader({
    title: "PDF Library",
    subtitle: "Books, Notes & Handouts",
    showBack: true,
    showSearch: false,
    showTheme: true,
    showSettings: false
  });

  const main = AppShell.getMainView();
  if (!main) return;

  main.innerHTML = `
    <div style="text-align:center;padding:60px 20px;">
      <div class="spinner"></div>
      <p style="margin-top:12px;color:#84968B;font-size:13px;">Loading PDFs...</p>
    </div>
  `;

  const settings = storage.get(STORAGE_KEYS.SETTINGS, {});
  const deptId = settings.departmentId || settings.department || "";

  // ═══ Load subjects + their PDFs from server ═══
  let allPdfs = [];
  let subjectsMap = {};

  try {
    // Get subjects for this department (via settings)
    let subjects = [];
    if (deptId) {
      const { getSubjectsByAssignment } = await import("../services/api.js");
      const semId = settings.semesterId || settings.semester || "";
      subjects = await getSubjectsByAssignment(deptId, semId || null);
    } else {
      subjects = await getSubjects();
    }

    subjects.forEach((s) => { subjectsMap[s.id] = s; });

    // Load PDFs for each subject
    for (const sub of subjects) {
      try {
        const pdfs = await getPdfsBySubject(sub.id);
        pdfs.forEach((p) => {
          allPdfs.push({
            ...p,
            subjectName: sub.name,
            subjectId: sub.id
          });
        });
      } catch (e) {}
    }
  } catch (err) {
    console.error("[PdfLibrary] Load error:", err);
  }

  console.log(`[PdfLibrary] Loaded ${allPdfs.length} PDFs from server`);

  // ═══ Empty state ═══
  if (allPdfs.length === 0) {
    main.innerHTML = `
      <div style="text-align:center;padding:60px 24px;">
        <div style="font-size:64px;margin-bottom:16px;">📄</div>
        <h2 style="font-size:17px;font-weight:800;color:#1C3E2C;margin:0 0 8px;">কোনো PDF নেই</h2>
        <p style="font-size:13px;color:#84968B;line-height:1.6;max-width:300px;margin:0 auto 20px;">
          Admin Panel থেকে PDF upload করলে এখানে দেখা যাবে।
        </p>
        <button id="goto-home" style="
          padding:12px 22px;border-radius:12px;border:none;
          background:linear-gradient(135deg,#1C3E2C,#2A5540);
          color:#FFFFFF;font-weight:800;font-size:13.5px;
          cursor:pointer;font-family:inherit;
        ">🏠 Home এ যান</button>
      </div>
    `;
    main.querySelector("#goto-home")?.addEventListener("click", () => {
      window.location.hash = "#/home";
    });
    return;
  }

  // ═══ Group by subject ═══
  const bySubject = {};
  allPdfs.forEach((p) => {
    if (!bySubject[p.subjectId]) {
      bySubject[p.subjectId] = {
        subject: subjectsMap[p.subjectId] || { name: p.subjectName || "Unknown", icon: "📘" },
        pdfs: []
      };
    }
    bySubject[p.subjectId].pdfs.push(p);
  });

  // ═══ Render ═══
  main.innerHTML = `
    <!-- Header stat -->
    <div style="
      display:flex;align-items:center;gap:10px;
      padding:14px 16px;
      background:linear-gradient(135deg, #FEE2E2, #FECACA);
      border:1px solid #FCA5A5;
      border-radius:16px;
      margin-bottom:18px;
    ">
      <div style="
        width:42px;height:42px;border-radius:12px;
        background:rgba(255,255,255,0.7);
        display:flex;align-items:center;justify-content:center;
        font-size:22px;
      ">📄</div>
      <div style="flex:1;min-width:0;">
        <div style="font-size:14px;font-weight:800;color:#991B1B;">
          ${allPdfs.length}টি PDF
        </div>
        <div style="font-size:11px;color:#B91C1C;font-weight:600;">
          ${Object.keys(bySubject).length}টি subject-এ
        </div>
      </div>
    </div>

    <!-- PDFs grouped by subject -->
    <div style="display:flex;flex-direction:column;gap:20px;">
      ${Object.values(bySubject).map(({ subject, pdfs }) => `
        <div>
          <div style="
            display:flex;align-items:center;gap:10px;
            padding:10px 12px;
            background:linear-gradient(135deg, rgba(28,62,44,0.06), transparent);
            border-left:3px solid #1C3E2C;
            border-radius:10px;
            margin-bottom:10px;
          ">
            <span style="font-size:20px;">${subject.icon || "📘"}</span>
            <span style="font-size:13.5px;font-weight:800;color:#1C3E2C;flex:1;">
              ${escapeHtml(subject.name)}
            </span>
            <span style="
              font-size:10.5px;font-weight:800;color:#991B1B;
              background:#FEE2E2;padding:3px 9px;border-radius:999px;
            ">${pdfs.length}</span>
          </div>

          <div style="display:flex;flex-direction:column;gap:10px;">
            ${pdfs.map((pdf) => `
              <a 
                href="${pdf.fileUrl || '#'}"
                target="_blank"
                rel="noopener"
                ${pdf.fileUrl ? "" : `onclick="event.preventDefault(); alert('File নেই');"`}
                style="
                  display:flex;align-items:center;gap:12px;
                  padding:14px;
                  background:#FFFFFF;
                  border:1.5px solid #E1E8E1;
                  border-radius:14px;
                  text-decoration:none;
                  cursor:pointer;
                  box-shadow:0 2px 6px rgba(28,62,44,0.04);
                  transition:all 0.15s ease;
                "
              >
                <div style="
                  width:48px;height:48px;border-radius:13px;
                  background:linear-gradient(135deg,#FEE2E2,#FECACA);
                  color:#991B1B;
                  display:flex;align-items:center;justify-content:center;
                  font-size:24px;flex-shrink:0;
                ">📄</div>

                <div style="flex:1;min-width:0;">
                  <div style="
                    font-size:13.5px;font-weight:800;
                    color:#1C3E2C;letter-spacing:-0.2px;
                    line-height:1.3;margin-bottom:3px;
                    overflow:hidden;text-overflow:ellipsis;
                    display:-webkit-box;-webkit-line-clamp:2;
                    -webkit-box-orient:vertical;
                  ">${escapeHtml(pdf.title || "Untitled")}</div>

                  ${pdf.fileName ? `
                    <div style="
                      font-size:11px;color:#84968B;
                      font-weight:600;
                      overflow:hidden;text-overflow:ellipsis;
                      white-space:nowrap;
                    ">${escapeHtml(pdf.fileName)} ${pdf.fileSize ? `• ${pdf.fileSize}` : ""}</div>
                  ` : ""}
                </div>

                <div style="
                  width:32px;height:32px;border-radius:50%;
                  background:#DCFCE7;color:#065F46;
                  display:flex;align-items:center;justify-content:center;
                  flex-shrink:0;
                ">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                    <path d="M7 17l10-10M7 7h10v10"/>
                  </svg>
                </div>
              </a>
            `).join("")}
          </div>
        </div>
      `).join("")}
    </div>

    <div style="height:20px;"></div>
  `;
}

function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}