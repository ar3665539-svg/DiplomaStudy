/**
 * DiplomaStudy - Student Tools Page View
 * BTEB CGPA Calculator, 75% Attendance Tracker, and Engineering Unit Converter
 */

import { AppShell } from "../components/AppShell.js";

export function renderTools() {
  AppShell.updateHeader({
    title: "Engineering Tools & Calculators",
    subtitle: "CGPA, Attendance & Unit Converters",
    showBack: true,
    showSearch: false
  });

  const main = AppShell.getMainView();
  if (!main) return;

  main.innerHTML = `
    <!-- Tool 1: BTEB CGPA Calculator -->
    <div class="card mb-md p-md" id="tool-cgpa-calculator">
      <div class="flex items-center gap-xs mb-xs">
        <span style="font-size: 22px;">🎓</span>
        <h3 class="text-sm font-bold text-forest">BTEB Semester CGPA Calculator</h3>
      </div>
      <p class="text-xs text-muted mb-md">Calculate your GPA on BTEB 4.0 grading scale with credit hour weightage.</p>

      <div id="cgpa-subject-rows" class="flex flex-col gap-xs mb-sm">
        <div class="grid" style="display: grid; grid-template-columns: 2fr 1.5fr 1fr; gap: 8px; font-weight: bold; font-size: 11px; color: var(--color-text-dim);">
          <span>Subject</span>
          <span>Grade</span>
          <span>Credits</span>
        </div>
        ${[
          { name: "Basic Electricity", grade: "4.0", credit: "3" },
          { name: "Mathematics - 1", grade: "3.75", credit: "4" },
          { name: "Physics - 1", grade: "3.5", credit: "3" },
          { name: "Computer App.", grade: "4.0", credit: "2" }
        ].map((sub, i) => `
          <div class="grid cgpa-row" style="display: grid; grid-template-columns: 2fr 1.5fr 1fr; gap: 8px;">
            <input type="text" class="search-input" style="padding: 6px 10px; font-size: 11px;" value="${sub.name}" />
            <select class="search-input cgpa-grade-select" style="padding: 6px 8px; font-size: 11px;">
              <option value="4.0" ${sub.grade === "4.0" ? "selected" : ""}>A+ (4.00)</option>
              <option value="3.75" ${sub.grade === "3.75" ? "selected" : ""}>A (3.75)</option>
              <option value="3.5" ${sub.grade === "3.5" ? "selected" : ""}>A- (3.50)</option>
              <option value="3.25" ${sub.grade === "3.25" ? "selected" : ""}>B+ (3.25)</option>
              <option value="3.0" ${sub.grade === "3.0" ? "selected" : ""}>B (3.00)</option>
              <option value="2.0" ${sub.grade === "2.0" ? "selected" : ""}>D (2.00)</option>
              <option value="0.0" ${sub.grade === "0.0" ? "selected" : ""}>F (0.00)</option>
            </select>
            <input type="number" class="search-input cgpa-credit-input" style="padding: 6px 8px; font-size: 11px;" value="${sub.credit}" min="1" max="6" />
          </div>
        `).join("")}
      </div>

      <div class="flex items-center justify-between p-sm mt-sm" style="background-color: var(--color-forest-soft); border-radius: var(--radius-sm);">
        <span class="text-xs font-bold text-forest">Calculated GPA:</span>
        <span class="text-lg font-extrabold text-forest" id="cgpa-result-display">3.79 / 4.00</span>
      </div>
    </div>

    <!-- Tool 2: Attendance 75% Rule Tracker -->
    <div class="card mb-md p-md" id="tool-attendance-tracker">
      <div class="flex items-center gap-xs mb-xs">
        <span style="font-size: 22px;">📊</span>
        <h3 class="text-sm font-bold text-forest">BTEB 75% Attendance Check</h3>
      </div>
      <p class="text-xs text-muted mb-md">Verify your exam eligibility according to polytechnic board criteria.</p>

      <div class="grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px;">
        <div>
          <label class="text-xs font-bold text-muted block mb-xs">Total Classes Held</label>
          <input type="number" id="att-total" class="search-input" value="48" min="1" />
        </div>
        <div>
          <label class="text-xs font-bold text-muted block mb-xs">Classes Attended</label>
          <input type="number" id="att-attended" class="search-input" value="40" min="0" />
        </div>
      </div>

      <div class="p-sm" id="att-result-box" style="background-color: var(--color-forest-soft); border-radius: var(--radius-sm);">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-forest">Current Attendance:</span>
          <span class="text-sm font-bold text-forest" id="att-percent">83.3%</span>
        </div>
        <p class="text-xs text-muted mt-xs" id="att-advice">✅ Safe! You are above the mandatory 75% requirement.</p>
      </div>
    </div>

    <!-- Tool 3: Engineering Unit Converter -->
    <div class="card mb-md p-md" id="tool-unit-converter">
      <div class="flex items-center gap-xs mb-xs">
        <span style="font-size: 22px;">⚙️</span>
        <h3 class="text-sm font-bold text-forest">Engineering Unit Converter</h3>
      </div>
      <p class="text-xs text-muted mb-md">Instant conversions for Pressure, Power, Length and Electrical units.</p>

      <div class="flex flex-col gap-sm">
        <div>
          <label class="text-xs font-bold text-muted block mb-xs">Convert Category</label>
          <select id="unit-cat-select" class="search-input">
            <option value="pressure">Pressure (Bar ⟷ PSI ⟷ Pascal)</option>
            <option value="power">Power (Horsepower HP ⟷ Watts kW)</option>
            <option value="length">Length (Meters ⟷ Feet ⟷ Inches)</option>
          </select>
        </div>

        <div class="grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
          <div>
            <label class="text-xs font-bold text-muted block mb-xs">Input Value</label>
            <input type="number" id="unit-input-val" class="search-input" value="1" />
          </div>
          <div>
            <label class="text-xs font-bold text-muted block mb-xs">Converted Output</label>
            <input type="text" id="unit-output-val" class="search-input" value="14.5038 PSI" readonly style="background-color: var(--color-surface-hover); font-weight: bold;" />
          </div>
        </div>
      </div>
    </div>
  `;

  // Bind CGPA updates
  const recalcCGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;
    main.querySelectorAll(".cgpa-row").forEach((row) => {
      const g = parseFloat(row.querySelector(".cgpa-grade-select")?.value || "0");
      const c = parseFloat(row.querySelector(".cgpa-credit-input")?.value || "0");
      totalPoints += g * c;
      totalCredits += c;
    });

    const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";
    const resEl = main.querySelector("#cgpa-result-display");
    if (resEl) resEl.textContent = `${gpa} / 4.00`;
  };

  main.querySelectorAll(".cgpa-grade-select, .cgpa-credit-input").forEach((el) => {
    el.addEventListener("input", recalcCGPA);
  });

  // Bind Attendance Tracker
  const recalcAtt = () => {
    const total = parseFloat(main.querySelector("#att-total")?.value || "1");
    const attended = parseFloat(main.querySelector("#att-attended")?.value || "0");
    const pct = total > 0 ? ((attended / total) * 100).toFixed(1) : "0";

    const pctEl = main.querySelector("#att-percent");
    const adviceEl = main.querySelector("#att-advice");
    if (pctEl) pctEl.textContent = `${pct}%`;

    if (adviceEl) {
      if (pct >= 75) {
        adviceEl.innerHTML = `✅ Safe! You are above the mandatory 75% requirement.`;
        adviceEl.style.color = "var(--color-forest)";
      } else {
        const needed = Math.ceil((0.75 * total - attended) / 0.25);
        adviceEl.innerHTML = `⚠️ Low Attendance! You need to attend the next <strong>${needed > 0 ? needed : 1}</strong> classes consecutively to reach 75%.`;
        adviceEl.style.color = "var(--color-danger)";
      }
    }
  };

  main.querySelector("#att-total")?.addEventListener("input", recalcAtt);
  main.querySelector("#att-attended")?.addEventListener("input", recalcAtt);

  // Bind Unit Converter
  const recalcUnit = () => {
    const cat = main.querySelector("#unit-cat-select")?.value;
    const val = parseFloat(main.querySelector("#unit-input-val")?.value || "0");
    const out = main.querySelector("#unit-output-val");
    if (!out) return;

    if (cat === "pressure") {
      out.value = `${(val * 14.5038).toFixed(2)} PSI (${(val * 100000).toLocaleString()} Pa)`;
    } else if (cat === "power") {
      out.value = `${(val * 0.7457).toFixed(2)} kW (${(val * 745.7).toFixed(0)} Watts)`;
    } else if (cat === "length") {
      out.value = `${(val * 3.28084).toFixed(2)} Feet (${(val * 39.37).toFixed(1)} In)`;
    }
  };

  main.querySelector("#unit-cat-select")?.addEventListener("change", recalcUnit);
  main.querySelector("#unit-input-val")?.addEventListener("input", recalcUnit);
}
