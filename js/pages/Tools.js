/**
 * Tools — Student utility tools hub
 */

import { AppShell } from "../components/AppShell.js";
import { emptyState } from "../utils/errorState.js";
import { Toast } from "../components/Toast.js";

export function renderTools() {
  AppShell.updateHeader({
    title: "Student Tools",
    subtitle: "Useful utilities",
    showBack: true,
    showSearch: false,
    showTheme: true,
    showSettings: false
  });

  const main = AppShell.getMainView();
  if (!main) return;

  const tools = [
    { icon: "🧮", label: "Calculator", bangla: "ক্যালকুলেটর", bg: "#DCFCE7", color: "#065F46", action: "calculator" },
    { icon: "📏", label: "Unit Converter", bangla: "একক রূপান্তর", bg: "#DBEAFE", color: "#1E40AF", action: "converter" },
    { icon: "📐", label: "Formula Reference", bangla: "সূত্র রেফারেন্স", bg: "#CFFAFE", color: "#155E75", route: "#/formulas" },
    { icon: "⏱️", label: "Study Timer", bangla: "টাইমার", bg: "#FEF3C7", color: "#92400E", route: "#/timer" },
    { icon: "📅", label: "Study Planner", bangla: "প্ল্যানার", bg: "#F3E8FF", color: "#6B21A8", route: "#/planner" },
    { icon: "📝", label: "Quick Notes", bangla: "নোট", bg: "#FFE4E6", color: "#9F1239", route: "#/notes" }
  ];

  main.innerHTML = `
    <div style="padding:20px;background:linear-gradient(135deg, #163524 0%, #1F4A32 100%);border-radius:20px;margin-bottom:20px;color:#FFFFFF;position:relative;overflow:hidden;">
      <div style="position:absolute;top:-30px;right:-30px;width:140px;height:140px;border-radius:50%;background:radial-gradient(circle,rgba(200,122,30,0.2),transparent 70%);"></div>
      <div style="position:relative;">
        <div style="font-size:36px;margin-bottom:10px;">🛠️</div>
        <div style="font-size:20px;font-weight:900;letter-spacing:-0.3px;margin-bottom:6px;">Student Tools</div>
        <div style="font-size:12.5px;opacity:0.85;font-weight:600;line-height:1.5;">পড়াশোনার জন্য প্রয়োজনীয় সব utility এক জায়গায়।</div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;">
      ${tools.map((t) => `
        <button class="tool-card" data-action="${t.action || ''}" data-route="${t.route || ''}" type="button" style="
          display:flex;flex-direction:column;align-items:center;gap:8px;
          padding:20px 12px;
          background:#FFFFFF;
          border:1.5px solid #E1E8E1;border-radius:18px;
          cursor:pointer;font-family:inherit;
          box-shadow:0 2px 8px rgba(28,62,44,0.04);
          transition:all 0.2s cubic-bezier(0.34,1.56,0.64,1);
        ">
          <div style="width:52px;height:52px;border-radius:16px;background:${t.bg};color:${t.color};display:flex;align-items:center;justify-content:center;font-size:26px;">${t.icon}</div>
          <div style="font-size:13px;font-weight:800;color:#1C3E2C;letter-spacing:-0.2px;">${t.label}</div>
          <div style="font-size:10.5px;font-weight:600;color:#84968B;">${t.bangla}</div>
        </button>
      `).join("")}
    </div>

    <!-- Popular constants -->
    <div style="margin-top:24px;">
      <div style="font-size:13px;font-weight:800;color:#1C3E2C;margin-bottom:12px;">📌 Common Constants</div>
      <div style="display:flex;flex-direction:column;gap:8px;">
        ${[
          { label: "π (Pi)", value: "3.14159" },
          { label: "e (Euler)", value: "2.71828" },
          { label: "√2", value: "1.41421" },
          { label: "√3", value: "1.73205" },
          { label: "g (gravity)", value: "9.8 m/s²" },
          { label: "c (speed of light)", value: "3×10⁸ m/s" }
        ].map((c) => `
          <div class="const-row" data-val="${c.value}" style="display:flex;align-items:center;justify-content:space-between;padding:12px 14px;background:#F8FBF8;border:1px solid #E1E8E1;border-radius:12px;cursor:pointer;">
            <span style="font-size:13px;font-weight:700;color:#1C3E2C;">${c.label}</span>
            <span style="font-size:13px;font-weight:800;color:#065F46;font-family:ui-monospace,monospace;">${c.value}</span>
          </div>
        `).join("")}
      </div>
      <div style="font-size:11px;color:#84968B;font-weight:600;margin-top:8px;text-align:center;">ট্যাপ করে copy করুন</div>
    </div>

    <div style="height:20px;"></div>
  `;

  // Bind
  main.querySelectorAll(".tool-card").forEach((btn) => {
    btn.addEventListener("click", () => {
      const route = btn.getAttribute("data-route");
      const action = btn.getAttribute("data-action");

      if (route) {
        window.location.hash = route;
      } else if (action === "calculator") {
        openCalculator(main);
      } else if (action === "converter") {
        showComingSoon("Unit Converter");
      }
    });

    btn.addEventListener("mouseenter", () => {
      btn.style.transform = "translateY(-3px)";
      btn.style.boxShadow = "0 12px 24px rgba(28,62,44,0.12)";
      btn.style.borderColor = "#7A9B7A";
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "";
      btn.style.boxShadow = "0 2px 8px rgba(28,62,44,0.04)";
      btn.style.borderColor = "#E1E8E1";
    });
  });

  main.querySelectorAll(".const-row").forEach((row) => {
    row.addEventListener("click", () => {
      const val = row.getAttribute("data-val");
      try {
        navigator.clipboard.writeText(val);
        Toast.success(`✅ Copy: ${val}`);
      } catch (e) {
        Toast.error("Copy failed");
      }
    });
  });
}

// ═══════════════════════════════════════════
// Simple Calculator Modal
// ═══════════════════════════════════════════
function openCalculator(parent) {
  document.getElementById("ds-calc")?.remove();

  let current = "0";
  let previous = "";
  let operator = null;

  const overlay = document.createElement("div");
  overlay.id = "ds-calc";
  overlay.style.cssText = `position:fixed;inset:0;background:rgba(15,23,42,0.75);backdrop-filter:blur(6px);z-index:9999;display:flex;align-items:flex-end;justify-content:center;`;

  function renderDisplay() {
    return `${previous} ${operator || ""} ${current}`.trim() || "0";
  }

  overlay.innerHTML = `
    <div style="background:#FFFFFF;width:100%;max-width:400px;border-radius:24px 24px 0 0;padding:20px;box-shadow:0 -12px 40px rgba(0,0,0,0.3);">
      <div style="width:40px;height:4px;background:#E1E8E1;border-radius:999px;margin:0 auto 16px;"></div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
        <h3 style="font-size:16px;font-weight:900;color:#1C3E2C;margin:0;">🧮 Calculator</h3>
        <button id="calc-close" style="width:32px;height:32px;border-radius:10px;background:#F2F5F2;border:none;color:#57675D;cursor:pointer;font-size:14px;font-family:inherit;">✕</button>
      </div>
      <div style="padding:20px;background:#F8FBF8;border:1.5px solid #E1E8E1;border-radius:14px;margin-bottom:16px;text-align:right;">
        <div id="calc-display" style="font-size:32px;font-weight:900;color:#1C3E2C;font-family:ui-monospace,monospace;letter-spacing:-1px;word-break:break-all;">0</div>
      </div>
      <div id="calc-keys" style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;">
        ${["C","±","%","÷","7","8","9","×","4","5","6","−","1","2","3","+","0",".","=","⌫"].map((k) => `
          <button class="calc-btn" data-key="${k}" type="button" style="
            padding:16px 4px;
            border-radius:12px;
            font-size:18px;
            font-weight:800;
            font-family:inherit;
            cursor:pointer;
            border:1.5px solid ${["C","±","%","÷","×","−","+"].includes(k) ? "#FCD34D" : k === "=" ? "#10B981" : "#E1E8E1"};
            background:${["C","±","%","÷","×","−","+"].includes(k) ? "#FEF3C7" : k === "=" ? "#10B981" : "#FFFFFF"};
            color:${["C","±","%","÷","×","−","+"].includes(k) ? "#92400E" : k === "=" ? "#FFFFFF" : "#1C3E2C"};
          ">${k}</button>
        `).join("")}
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  overlay.querySelector("#calc-close").onclick = () => overlay.remove();
  overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.remove(); });

  function updateDisplay() {
    overlay.querySelector("#calc-display").textContent = renderDisplay();
  }

  function calculate(a, b, op) {
    a = parseFloat(a); b = parseFloat(b);
    switch (op) {
      case "+": return a + b;
      case "−": return a - b;
      case "×": return a * b;
      case "÷": return b !== 0 ? a / b : "Error";
      default: return b;
    }
  }

  overlay.querySelectorAll(".calc-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.getAttribute("data-key");

      if (key === "C") {
        current = "0"; previous = ""; operator = null;
      } else if (key === "⌫") {
        current = current.length > 1 ? current.slice(0, -1) : "0";
      } else if (key === "±") {
        current = current.startsWith("-") ? current.slice(1) : "-" + current;
      } else if (["÷", "×", "−", "+"].includes(key)) {
        if (operator && previous) {
          current = String(calculate(previous, current, operator));
          previous = current;
        } else {
          previous = current;
        }
        operator = key;
        current = "0";
      } else if (key === "=") {
        if (operator && previous) {
          current = String(calculate(previous, current, operator));
          previous = "";
          operator = null;
        }
      } else if (key === ".") {
        if (!current.includes(".")) current += ".";
      } else if (key === "%") {
        current = String(parseFloat(current) / 100);
      } else {
        current = current === "0" ? key : current + key;
      }

      updateDisplay();
    });
  });

  updateDisplay();
}

function showComingSoon(name) {
  const overlay = document.createElement("div");
  overlay.style.cssText = `position:fixed;inset:0;background:rgba(15,23,42,0.7);backdrop-filter:blur(6px);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;`;
  overlay.innerHTML = `
    <div style="background:#FFFFFF;border-radius:20px;padding:24px;max-width:340px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3);">
      <div style="font-size:52px;margin-bottom:12px;">🚧</div>
      <h3 style="font-size:17px;font-weight:800;color:#1C3E2C;margin:0 0 8px;">${name}</h3>
      <p style="font-size:13px;color:#84968B;line-height:1.5;margin:0 0 18px;">এই tool শীঘ্রই আসছে।</p>
      <button style="width:100%;padding:12px;border-radius:12px;border:none;background:linear-gradient(135deg,#1C3E2C,#2A5540);color:#FFFFFF;font-weight:800;font-size:14px;cursor:pointer;font-family:inherit;">ঠিক আছে</button>
    </div>
  `;
  document.body.appendChild(overlay);
  const close = () => overlay.remove();
  overlay.querySelector("button").onclick = close;
  overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
}