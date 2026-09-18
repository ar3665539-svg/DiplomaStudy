/**
 * DiplomaStudy - Semesters Page (DB-driven)
 */

import { AppShell } from "../components/AppShell.js";
import { getSemestersByDepartment, getDepartments } from "../services/api.js";
import { storage, STORAGE_KEYS } from "../core/storage.js";

export async function renderSemesters() {
  AppShell.updateHeader({
    title: "Select Semester",
    subtitle: "আপনার semester নির্বাচন করুন",
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

  if (!deptId) {
    main.innerHTML = `
      <div style="text-align:center;padding:60px 20px;">
        <div style="font-size:56px;margin-bottom:16px;">🏛️</div>
        <h2 style="font-size:17px;font-weight:800;color:#1C3E2C;margin:0 0 8px;">Department select করা হয়নি</h2>
        <p style="font-size:13px;color:#84968B;margin-bottom:16px;">প্রথমে department বেছে নিন।</p>
        <button id="goto-dept" style="padding:12px 20px;border-radius:12px;border:none;background:linear-gradient(135deg,#1C3E2C,#2A5540);color:#FFFFFF;font-weight:800;font-size:13.5px;cursor:pointer;font-family:inherit;">
          🏛️ Departments এ যান
        </button>
      </div>
    `;
    main.querySelector("#goto-dept")?.addEventListener("click", () => {
      window.location.hash = "#/departments";
    });
    return;
  }

  // Load department + semesters
  let departments = [];
  let semesters = [];

  try { departments = await getDepartments(); } catch (e) {}
  try { semesters = await getSemestersByDepartment(deptId); } catch (e) {}

  const currentDept = departments.find((d) => d.id === deptId);

  if (semesters.length === 0) {
    main.innerHTML = `
      <div style="text-align:center;padding:60px 24px;">
        <div style="font-size:56px;margin-bottom:16px;">📅</div>
        <h2 style="font-size:17px;font-weight:800;color:#1C3E2C;margin:0 0 8px;">কোনো Semester নেই</h2>
        <p style="font-size:13px;color:#84968B;line-height:1.6;max-width:300px;margin:0 auto 16px;">
          ${currentDept ? escapeHtml(currentDept.name) : "এই"} department-এ এখনো কোনো semester যোগ করা হয়নি।
        </p>
        <button id="goto-dept" style="padding:12px 20px;border-radius:12px;border:none;background:linear-gradient(135deg,#1C3E2C,#2A5540);color:#FFFFFF;font-weight:800;font-size:13.5px;cursor:pointer;font-family:inherit;">
          ← অন্য Department
        </button>
      </div>
    `;
    main.querySelector("#goto-dept")?.addEventListener("click", () => {
      window.location.hash = "#/departments";
    });
    return;
  }

  const currentSemId = settings.semesterId || settings.semester || "";

  main.innerHTML = `
    <!-- Dept info -->
    ${currentDept ? `
      <div style="
        display:flex;align-items:center;gap:12px;
        padding:14px 16px;
        background:linear-gradient(135deg, #DCFCE7, #BBF7D0);
        border:1px solid #10B981;
        border-radius:16px;
        margin-bottom:18px;
      ">
        <div style="
          width:44px;height:44px;border-radius:13px;
          background:#FFFFFF;
          display:flex;align-items:center;justify-content:center;
          font-size:22px;flex-shrink:0;
        ">${currentDept.icon || "🏛️"}</div>
        <div style="flex:1;min-width:0;">
          <div style="font-size:13.5px;font-weight:800;color:#065F46;margin-bottom:2px;">
            ${escapeHtml(currentDept.name)}
          </div>
          <div style="font-size:11px;color:#047857;font-weight:600;">
            ${semesters.length}টি semester available
          </div>
        </div>
        <button id="change-dept" style="
          padding:7px 12px;border-radius:10px;
          background:#FFFFFF;border:1px solid #10B981;
          color:#065F46;font-weight:800;font-size:11px;
          cursor:pointer;font-family:inherit;
        ">Change</button>
      </div>
    ` : ""}

    <!-- Semesters list -->
    <div style="display:flex;flex-direction:column;gap:10px;">
      ${semesters.map((sem, idx) => {
        const isSelected = sem.id === currentSemId;
        return `
          <button 
            class="sem-card"
            data-id="${sem.id}"
            data-number="${sem.number}"
            data-name="${escapeHtml(sem.name)}"
            style="
              position:relative;
              display:flex;align-items:center;gap:14px;
              padding:16px;
              background:${isSelected ? "linear-gradient(135deg, #FEF3C7, #FDE68A)" : "#FFFFFF"};
              border:1.5px solid ${isSelected ? "#F59E0B" : "#E1E8E1"};
              border-radius:16px;
              cursor:pointer;font-family:inherit;text-align:left;
              box-shadow:${isSelected ? "0 6px 16px rgba(245,158,11,0.15)" : "0 2px 8px rgba(28,62,44,0.04)"};
              transition:all 0.2s cubic-bezier(0.34,1.56,0.64,1);
              -webkit-tap-highlight-color:transparent;
              width:100%;
            "
          >
            <div style="
              width:52px;height:52px;border-radius:15px;
              background:${isSelected ? "#FFFFFF" : "linear-gradient(135deg, #FEF3C7, #FDE68A)"};
              display:flex;align-items:center;justify-content:center;
              font-size:24px;flex-shrink:0;
            ">${sem.icon || "📅"}</div>

            <div style="flex:1;min-width:0;">
              <div style="
                font-size:14.5px;font-weight:800;
                color:${isSelected ? "#78350F" : "#1C3E2C"};
                letter-spacing:-0.2px;margin-bottom:3px;
              ">${escapeHtml(sem.name)}</div>
              <div style="
                font-size:11px;font-weight:600;
                color:${isSelected ? "#92400E" : "#84968B"};
              ">Semester ${sem.number}</div>
            </div>

            ${isSelected ? `
              <div style="
                width:28px;height:28px;border-radius:50%;
                background:#F59E0B;color:#FFFFFF;
                display:flex;align-items:center;justify-content:center;
                font-size:14px;font-weight:900;flex-shrink:0;
                box-shadow:0 3px 8px rgba(245,158,11,0.4);
              ">✓</div>
            ` : `
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#84968B" stroke-width="2.5" stroke-linecap="round" style="flex-shrink:0;">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            `}
          </button>
        `;
      }).join("")}
    </div>

    <div style="height:20px;"></div>
  `;

  // Bind
  main.querySelector("#change-dept")?.addEventListener("click", () => {
    window.location.hash = "#/departments";
  });

  main.querySelectorAll(".sem-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      e.preventDefault();

      const id = card.getAttribute("data-id");
      const number = parseInt(card.getAttribute("data-number"), 10);

      if (!id) return;

      console.log("[Semesters] Selected:", { id, number });

      // Save
      const ns = storage.get(STORAGE_KEYS.SETTINGS, {});
      ns.semester = id;
      ns.semesterId = id;
      ns.semesterNumber = number;
      storage.set(STORAGE_KEYS.SETTINGS, ns);

      // Visual feedback
      card.style.transform = "scale(0.97)";

      // Navigate home
      setTimeout(() => {
        window.location.hash = "#/home";
      }, 200);
    });

    // Hover
    card.addEventListener("mouseenter", () => {
      const isSelected = card.getAttribute("data-id") === currentSemId;
      if (isSelected) return;
      card.style.transform = "translateY(-2px)";
      card.style.boxShadow = "0 8px 20px rgba(28,62,44,0.1)";
      card.style.borderColor = "#7A9B7A";
    });
    card.addEventListener("mouseleave", () => {
      const isSelected = card.getAttribute("data-id") === currentSemId;
      card.style.transform = "";
      card.style.boxShadow = isSelected
        ? "0 6px 16px rgba(245,158,11,0.15)"
        : "0 2px 8px rgba(28,62,44,0.04)";
      card.style.borderColor = isSelected ? "#F59E0B" : "#E1E8E1";
    });
  });
}

// ═══════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════
function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}