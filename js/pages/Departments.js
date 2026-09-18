/**
 * DiplomaStudy - Department PDFs Page (DB-driven)
 */

import { AppShell } from "../components/AppShell.js";
import {
  getDepartments,
  getPdfsBySubject,
  getSubjectsByAssignment,
  getSemestersByDepartment
} from "../services/api.js";
import { storage, STORAGE_KEYS } from "../core/storage.js";

export async function renderDepartmentPDF(params = {}) {
  AppShell.updateHeader({
    title: "PDFs",
    subtitle: "Loading...",
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
    </div>
  `;

  const settings = storage.get(STORAGE_KEYS.SETTINGS, {});
  const deptId = settings.departmentId || settings.department || "";
  const semId = settings.semesterId || settings.semester || "";

  if (!deptId) {
    main.innerHTML = `
      <div style="text-align:center;padding:60px 20px;">
        <div style="font-size:56px;margin-bottom:16px;">🏛️</div>
        <h2 style="font-size:17px;font-weight:800;color:#1C3E2C;margin:0 0 8px;">Department নেই</h2>
        <button id="goto-home" style="margin-top:12px;padding:12px 20px;border-radius:12px;border:none;background:linear-gradient(135deg,#1C3E2C,#2A5540);color:#FFFFFF;font-weight:800;font-size:13.5px;cursor:pointer;font-family:inherit;">
          🏠 Home এ যান
        </button>
      </div>
    `;
    main.querySelector("#goto-home")?.addEventListener("click", () => {
      window.location.hash = "#/home";
    });
    return;
  }

  // Load
  let departments = [];
  let subjects = [];
  let semesters = [];

  try { departments = await getDepartments(); } catch (e) {}
  try { subjects = await getSubjectsByAssignment(deptId, semId); } catch (e) {}
  try { semesters = await getSemestersByDepartment(deptId); } catch (e) {}

  const currentDept = departments.find((d) => d.id === deptId);
  const currentSem = semesters.find((s) => s.id === semId);

  if (!currentDept) {
    main.innerHTML = `<div style="text-align:center;padding:60px 20px;"><p>Department not found</p></div>`;
    return;
  }

  AppShell.updateHeader({
    title: "PDFs",
    subtitle: currentDept.name,
    showBack: true,
    showSearch: false,
    showTheme: true,
    showSettings: false
  });

  // Load PDFs for each subject
  const subjectPdfs = [];
  for (const sub of subjects) {
    try {
      const pdfs = await getPdfsBySubject(sub.id);
      if (pdfs.length > 0) {
        subjectPdfs.push({ subject: sub, pdfs });
      }
    } catch (e) {}
  }

  const totalPdfs = subjectPdfs.reduce((sum, s) => sum + s.pdfs.length, 0);

  main.innerHTML = `
    <!-- HERO -->
    <div style="
      display:flex;align-items:center;gap:14px;
      padding:18px;
      background:linear-gradient(135deg, #DCFCE7, #BBF7D0);
      border:1.5px solid #10B981;
      border-radius:18px;
      margin-bottom:18px;
    ">
      <div style="
        width:60px;height:60px;border-radius:16px;
        background:#FFFFFF;
        display:flex;align-items:center;justify-content:center;
        font-size:30px;flex-shrink:0;
        box-shadow:0 4px 12px rgba(16,185,129,0.15);
      ">${currentDept.icon || "🏛️"}</div>
      <div style="flex:1;min-width:0;">
        <div style="font-size:17px;font-weight:900;color:#065F46;letter-spacing:-0.3px;margin-bottom:2px;">
          ${escapeHtml(currentDept.name)}
        </div>
        ${currentSem ? `
          <div style="font-size:11.5px;color:#047857;font-weight:600;">
            ${escapeHtml(currentSem.name)} • ${totalPdfs}টি PDF
          </div>
        ` : ""}
      </div>
    </div>

    <!-- PDF LIST -->
    ${subjectPdfs.length > 0 ? `
      <div style="display:flex;flex-direction:column;gap:16px;">
        ${subjectPdfs.map(({ subject, pdfs }) => `
          <div>
            <div style="
              display:flex;align-items:center;gap:8px;
              margin-bottom:8px;padding-left:4px;
            ">
              <span style="font-size:16px;">${subject.icon || "📘"}</span>
              <span style="font-size:13px;font-weight:800;color:#1C3E2C;">${escapeHtml(subject.name)}</span>
              <span style="
                font-size:10px;font-weight:800;color:#065F46;
                background:#DCFCE7;padding:2px 8px;border-radius:999px;
              ">${pdfs.length}</span>
            </div>

            <div style="display:flex;flex-direction:column;gap:8px;">
              ${pdfs.map((pdf) => `
                <a 
                  href="${pdf.fileUrl || '#'}" 
                  target="_blank" 
                  rel="noopener"
                  ${pdf.fileUrl ? "" : `onclick="event.preventDefault(); alert('PDF file নেই');"`}
                  style="
                    display:flex;align-items:center;gap:12px;
                    padding:14px;
                    background:#FFFFFF;
                    border:1px solid #E1E8E1;
                    border-radius:14px;
                    text-decoration:none;
                    cursor:pointer;
                    box-shadow:0 2px 6px rgba(28,62,44,0.04);
                    transition:all 0.15s ease;
                  "
                >
                  <div style="
                    width:46px;height:46px;border-radius:13px;
                    background:linear-gradient(135deg,#FEE2E2,#FECACA);
                    color:#991B1B;
                    display:flex;align-items:center;justify-content:center;
                    font-size:22px;flex-shrink:0;
                  ">📄</div>
                  <div style="flex:1;min-width:0;">
                    <div style="
                      font-size:13.5px;font-weight:800;color:#1C3E2C;
                      letter-spacing:-0.2px;margin-bottom:3px;
                      overflow:hidden;text-overflow:ellipsis;
                      display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;
                    ">${escapeHtml(pdf.title || "Untitled")}</div>
                    ${pdf.fileName ? `
                      <div style="font-size:11px;color:#84968B;font-weight:600;">
                        ${escapeHtml(pdf.fileName)} ${pdf.fileSize ? `• ${pdf.fileSize}` : ""}
                      </div>
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
    ` : `
      <div style="
        text-align:center;padding:48px 24px;
        background:#FFFFFF;
        border:1.5px dashed #E1E8E1;
        border-radius:20px;
      ">
        <div style="font-size:64px;margin-bottom:12px;">📄</div>
        <h3 style="font-size:16px;font-weight:800;color:#1C3E2C;margin:0 0 8px;">কোনো PDF নেই</h3>
        <p style="font-size:12.5px;color:#84968B;line-height:1.6;max-width:280px;margin:0 auto;">
          ${escapeHtml(currentDept.banglaName || currentDept.name)} এর বইয়ের PDF শীঘ্রই যুক্ত করা হবে।
        </p>
      </div>
    `}

    <div style="height:20px;"></div>
  `;
}

function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}