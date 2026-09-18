/**
 * DiplomaStudy - Onboarding Page (DB-driven)
 * Step 1: Department select (from server)
 * Step 2: Semester select (from server, filtered by dept)
 */

import { AppShell } from "../components/AppShell.js";
import { storage, STORAGE_KEYS } from "../core/storage.js";
import { getDepartments, getSemestersByDepartment } from "../services/api.js";

export async function renderOnboarding() {
  AppShell.updateHeader({
    title: "Welcome",
    subtitle: "",
    showBack: false,
    showSearch: false,
    showTheme: true,
    showSettings: false
  });

  const main = AppShell.getMainView();
  if (!main) return;

  // Loading state
  main.innerHTML = `
    <div style="text-align:center;padding:60px 20px;">
      <div class="spinner"></div>
      <p style="margin-top:14px;color:#84968B;font-size:13px;">Loading...</p>
    </div>
  `;

  // ═══ Load departments from server ═══
  let departments = [];
  try {
    departments = await getDepartments();
  } catch (e) {
    console.error("[Onboarding] Dept load failed:", e);
  }

  if (departments.length === 0) {
    main.innerHTML = `
      <div style="text-align:center;padding:80px 24px;">
        <div style="font-size:64px;margin-bottom:16px;">🏛️</div>
        <h2 style="font-size:17px;font-weight:800;color:#1C3E2C;margin:0 0 8px;">কোনো Department নেই</h2>
        <p style="font-size:13px;color:#84968B;line-height:1.6;max-width:300px;margin:0 auto;">
          Admin Panel থেকে department যোগ করুন।
        </p>
      </div>
    `;
    return;
  }

  // ═══ State ═══
  let selectedDeptId = "";
  let selectedSemId = "";
  let selectedSemNumber = 0;
  let semesters = []; // semesters for selected dept

  // Pre-select if already in settings
  const settings = storage.get(STORAGE_KEYS.SETTINGS, {});
  if (settings.departmentId || settings.department) {
    const cur = departments.find((d) =>
      d.id === (settings.departmentId || settings.department)
    );
    if (cur) selectedDeptId = cur.id;
  }

  // ═══ Render ═══
  function render() {
    const step = selectedDeptId ? (selectedSemId ? "done" : "sem") : "dept";

    main.innerHTML = `
      <!-- Logo/Brand -->
      <div style="text-align:center;padding:20px 0 26px;">
        <div style="
          width:72px;height:72px;border-radius:22px;
          background:linear-gradient(135deg, #1C3E2C, #2A5540);
          color:#FFFFFF;font-weight:900;font-size:28px;
          letter-spacing:-1px;
          display:inline-flex;align-items:center;justify-content:center;
          box-shadow:0 12px 28px -8px rgba(28,62,44,0.4);
          margin-bottom:14px;
        ">DS</div>
        <h1 style="font-size:22px;font-weight:900;color:#1C3E2C;letter-spacing:-0.4px;margin:0 0 6px;">
          DiplomaStudy
        </h1>
        <p style="font-size:12.5px;color:#84968B;font-weight:600;margin:0;">
          Learn Smart. Prepare Better.
        </p>
      </div>

      <!-- Welcome banner -->
      <div style="
        display:flex;align-items:flex-start;gap:12px;
        padding:14px 16px;
        background:linear-gradient(135deg, #FFFBEB, #FEF3C7);
        border-left:4px solid #F59E0B;
        border-radius:14px;
        margin-bottom:22px;
      ">
        <span style="font-size:22px;line-height:1;">👋</span>
        <div>
          <div style="font-size:13.5px;font-weight:800;color:#92400E;margin-bottom:3px;">
            স্বাগতম!
          </div>
          <div style="font-size:12px;color:#B45309;line-height:1.5;font-weight:600;">
            আপনার Department এবং Semester নির্বাচন করুন
          </div>
        </div>
      </div>

      <!-- STEP 1: Department -->
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">
        <div style="
          width:26px;height:26px;border-radius:50%;
          background:${selectedDeptId ? "#10B981" : "#1C3E2C"};
          color:#FFFFFF;font-weight:900;font-size:13px;
          display:flex;align-items:center;justify-content:center;
          flex-shrink:0;
        ">${selectedDeptId ? "✓" : "1"}</div>
        <div>
          <div style="font-size:14.5px;font-weight:900;color:#1C3E2C;letter-spacing:-0.2px;">
            Department নির্বাচন করুন
          </div>
          <div style="font-size:11px;color:#84968B;font-weight:600;margin-top:1px;">
            আপনার Technology বেছে নিন
          </div>
        </div>
      </div>

      <div style="
        display:grid;
        grid-template-columns:repeat(2, 1fr);
        gap:10px;
        margin-bottom:24px;
      ">
        ${departments.map((dept) => {
          const isSelected = dept.id === selectedDeptId;
          return `
            <button 
              class="onb-dept-btn"
              data-dept-id="${dept.id}"
              type="button"
              style="
                position:relative;
                display:flex;flex-direction:column;align-items:center;
                padding:16px 10px 14px;
                background:${isSelected ? "linear-gradient(135deg, #DCFCE7, #BBF7D0)" : "#FFFFFF"};
                border:1.5px solid ${isSelected ? "#10B981" : "#E1E8E1"};
                border-radius:16px;
                cursor:pointer;
                font-family:inherit;
                text-align:center;
                transition:all 0.2s cubic-bezier(0.34,1.56,0.64,1);
                box-shadow:${isSelected ? "0 8px 20px rgba(16,185,129,0.15)" : "0 2px 8px rgba(28,62,44,0.04)"};
                -webkit-tap-highlight-color:transparent;
                min-height:130px;
              "
            >
              ${isSelected ? `
                <div style="
                  position:absolute;top:8px;right:8px;
                  width:20px;height:20px;border-radius:50%;
                  background:#10B981;color:#FFFFFF;
                  display:flex;align-items:center;justify-content:center;
                  font-size:11px;font-weight:900;
                ">✓</div>
              ` : ""}

              <div style="
                width:52px;height:52px;border-radius:15px;
                background:${isSelected ? "#FFFFFF" : "#F8FBF8"};
                display:flex;align-items:center;justify-content:center;
                font-size:26px;flex-shrink:0;margin-bottom:10px;
              ">${dept.icon || "🏛️"}</div>

              <div style="
                font-size:13px;font-weight:800;
                color:${isSelected ? "#065F46" : "#1C3E2C"};
                letter-spacing:-0.2px;line-height:1.25;margin-bottom:3px;
                overflow:hidden;text-overflow:ellipsis;
                display:-webkit-box;-webkit-line-clamp:2;
                -webkit-box-orient:vertical;
              ">${escapeHtml(dept.name)}</div>

              <div style="
                font-size:10.5px;font-weight:600;
                color:${isSelected ? "#047857" : "#84968B"};
                line-height:1.3;
                overflow:hidden;text-overflow:ellipsis;
                display:-webkit-box;-webkit-line-clamp:1;
                -webkit-box-orient:vertical;
              ">${escapeHtml(dept.banglaName || "")}</div>
            </button>
          `;
        }).join("")}
      </div>

      <!-- STEP 2: Semester (only if dept selected) -->
      ${selectedDeptId ? `
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">
          <div style="
            width:26px;height:26px;border-radius:50%;
            background:${selectedSemId ? "#10B981" : "#1C3E2C"};
            color:#FFFFFF;font-weight:900;font-size:13px;
            display:flex;align-items:center;justify-content:center;
            flex-shrink:0;
          ">${selectedSemId ? "✓" : "2"}</div>
          <div>
            <div style="font-size:14.5px;font-weight:900;color:#1C3E2C;letter-spacing:-0.2px;">
              Semester নির্বাচন করুন
            </div>
            <div style="font-size:11px;color:#84968B;font-weight:600;margin-top:1px;">
              আপনার চলমান পর্ব বেছে নিন
            </div>
          </div>
        </div>

        ${semesters.length > 0 ? `
          <div style="
            display:grid;
            grid-template-columns:repeat(4, 1fr);
            gap:8px;
            margin-bottom:24px;
          ">
            ${semesters.map((sem) => {
              const isSelected = sem.id === selectedSemId;
              return `
                <button 
                  class="onb-sem-btn"
                  data-sem-id="${sem.id}"
                  data-sem-number="${sem.number}"
                  type="button"
                  style="
                    position:relative;
                    display:flex;flex-direction:column;align-items:center;
                    padding:14px 6px 12px;
                    background:${isSelected ? "linear-gradient(135deg, #FEF3C7, #FDE68A)" : "#FFFFFF"};
                    border:1.5px solid ${isSelected ? "#F59E0B" : "#E1E8E1"};
                    border-radius:14px;
                    cursor:pointer;
                    font-family:inherit;
                    text-align:center;
                    transition:all 0.2s cubic-bezier(0.34,1.56,0.64,1);
                    box-shadow:${isSelected ? "0 6px 16px rgba(245,158,11,0.15)" : "0 2px 6px rgba(28,62,44,0.04)"};
                    -webkit-tap-highlight-color:transparent;
                  "
                >
                  <div style="
                    font-size:16px;font-weight:900;
                    color:${isSelected ? "#78350F" : "#1C3E2C"};
                    letter-spacing:0.5px;margin-bottom:4px;
                    font-family:Georgia,serif;
                  ">${romanize(sem.number)}</div>
                  <div style="
                    font-size:9.5px;font-weight:800;
                    color:${isSelected ? "#92400E" : "#57675D"};
                    letter-spacing:-0.1px;line-height:1.15;
                  ">${sem.number}${ordinalSuffix(sem.number)}</div>
                  <div style="
                    font-size:8.5px;color:${isSelected ? "#B45309" : "#84968B"};
                    font-weight:600;margin-top:2px;
                  ">${bnNumber(sem.number)} পর্ব</div>
                </button>
              `;
            }).join("")}
          </div>
        ` : `
          <div style="
            padding:20px;text-align:center;
            background:#FEF3C7;
            border:1.5px dashed #FCD34D;
            border-radius:14px;
            margin-bottom:24px;
          ">
            <div style="font-size:32px;margin-bottom:8px;">📅</div>
            <div style="font-size:13px;font-weight:800;color:#92400E;margin-bottom:4px;">
              কোনো Semester নেই
            </div>
            <div style="font-size:11.5px;color:#B45309;line-height:1.5;">
              এই department-এ এখনো semester যোগ করা হয়নি।
            </div>
          </div>
        `}
      ` : ""}

      <!-- Continue button -->
      ${selectedDeptId && selectedSemId ? `
        <button id="onb-continue" style="
          width:100%;
          display:flex;align-items:center;justify-content:center;gap:8px;
          padding:16px;
          background:linear-gradient(135deg, #1C3E2C, #2A5540);
          color:#FFFFFF;
          border:none;
          border-radius:16px;
          font-size:15px;
          font-weight:800;
          font-family:inherit;
          letter-spacing:-0.2px;
          cursor:pointer;
          box-shadow:0 10px 24px -6px rgba(28,62,44,0.4);
          transition:transform 0.15s ease;
          margin-bottom:20px;
          -webkit-tap-highlight-color:transparent;
        ">
          <span>📖</span>
          <span>পড়া শুরু করুন</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      ` : ""}

      <div style="height:20px;"></div>
    `;

    bindEvents();
  }

  // ═══ Bind Events ═══
  function bindEvents() {
    // Department buttons
    main.querySelectorAll(".onb-dept-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        e.preventDefault();
        const deptId = btn.getAttribute("data-dept-id");

        if (deptId === selectedDeptId) return;

        selectedDeptId = deptId;
        selectedSemId = "";
        selectedSemNumber = 0;

        // Show loading on that button
        btn.style.transform = "scale(0.96)";

        // Load semesters for this dept
        try {
          semesters = await getSemestersByDepartment(deptId);
          console.log(`[Onboarding] Loaded ${semesters.length} semesters for ${deptId}`);
        } catch (err) {
          console.error("[Onboarding] Semester load failed:", err);
          semesters = [];
        }

        render();
      });

      // Hover
      btn.addEventListener("mouseenter", () => {
        if (btn.getAttribute("data-dept-id") !== selectedDeptId) {
          btn.style.transform = "translateY(-2px)";
          btn.style.boxShadow = "0 8px 20px rgba(28,62,44,0.1)";
          btn.style.borderColor = "#7A9B7A";
        }
      });
      btn.addEventListener("mouseleave", () => {
        if (btn.getAttribute("data-dept-id") !== selectedDeptId) {
          btn.style.transform = "";
          btn.style.boxShadow = "0 2px 8px rgba(28,62,44,0.04)";
          btn.style.borderColor = "#E1E8E1";
        }
      });
    });

    // Semester buttons
    main.querySelectorAll(".onb-sem-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        selectedSemId = btn.getAttribute("data-sem-id");
        selectedSemNumber = parseInt(btn.getAttribute("data-sem-number"), 10);
        render();
      });

      // Hover
      btn.addEventListener("mouseenter", () => {
        if (btn.getAttribute("data-sem-id") !== selectedSemId) {
          btn.style.transform = "translateY(-2px)";
          btn.style.borderColor = "#F59E0B";
        }
      });
      btn.addEventListener("mouseleave", () => {
        if (btn.getAttribute("data-sem-id") !== selectedSemId) {
          btn.style.transform = "";
          btn.style.borderColor = "#E1E8E1";
        }
      });
    });

    // Continue button
    main.querySelector("#onb-continue")?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (!selectedDeptId || !selectedSemId) return;

      // Save to settings
      const ns = storage.get(STORAGE_KEYS.SETTINGS, {});
      ns.department = selectedDeptId;
      ns.departmentId = selectedDeptId;
      ns.semester = selectedSemId;
      ns.semesterId = selectedSemId;
      ns.semesterNumber = selectedSemNumber;
      storage.set(STORAGE_KEYS.SETTINGS, ns);

      console.log("[Onboarding] Saved:", {
        dept: selectedDeptId,
        sem: selectedSemId,
        semNum: selectedSemNumber
      });

      // Navigate to home
      window.location.hash = "#/home";
    });
  }

  // ═══ Initial render ═══
  // If pre-selected dept, load its semesters
  if (selectedDeptId) {
    try {
      semesters = await getSemestersByDepartment(selectedDeptId);
    } catch (e) {
      semesters = [];
    }
  }

  render();
}

// ═══════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════
function romanize(num) {
  const map = {
    1: "I", 2: "II", 3: "III", 4: "IV", 5: "V",
    6: "VI", 7: "VII", 8: "VIII", 9: "IX", 10: "X"
  };
  return map[num] || String(num);
}

function ordinalSuffix(num) {
  if (num === 1) return "st";
  if (num === 2) return "nd";
  if (num === 3) return "rd";
  return "th";
}

function bnNumber(num) {
  const bn = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return String(num).replace(/\d/g, (d) => bn[parseInt(d, 10)]);
}

function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}