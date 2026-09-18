/**
 * Planner — Daily study tasks (localStorage)
 */

import { AppShell } from "../components/AppShell.js";
import { emptyState } from "../utils/errorState.js";
import { Toast } from "../components/Toast.js";

const STORAGE_KEY = "diplomastudy_planner";

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}
function saveTasks(tasks) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); } catch (e) {}
}
function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function renderPlanner() {
  AppShell.updateHeader({
    title: "Study Planner",
    subtitle: "Today's tasks",
    showBack: true,
    showSearch: false,
    showTheme: true,
    showSettings: false
  });

  const main = AppShell.getMainView();
  if (!main) return;

  function render() {
    const all = loadTasks();
    const today = all.filter((t) => t.date === todayKey()).sort((a, b) => a.done - b.done);
    const doneCount = today.filter((t) => t.done).length;

    main.innerHTML = `
      <div style="padding:20px;background:linear-gradient(135deg, #163524 0%, #1F4A32 100%);border-radius:20px;margin-bottom:20px;color:#FFFFFF;position:relative;overflow:hidden;">
        <div style="position:absolute;top:-30px;right:-30px;width:120px;height:120px;border-radius:50%;background:radial-gradient(circle,rgba(200,122,30,0.2),transparent 70%);"></div>
        <div style="position:relative;">
          <div style="font-size:11px;font-weight:700;opacity:0.8;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">TODAY</div>
          <div style="font-size:18px;font-weight:900;letter-spacing:-0.3px;margin-bottom:14px;">${new Date().toLocaleDateString("bn-BD", { weekday: "long", day: "numeric", month: "long" })}</div>
          <div style="display:flex;align-items:center;gap:12px;">
            <div style="flex:1;">
              <div style="height:6px;background:rgba(255,255,255,0.2);border-radius:999px;overflow:hidden;">
                <div style="height:100%;width:${today.length > 0 ? (doneCount / today.length) * 100 : 0}%;background:linear-gradient(90deg,#10B981,#059669);border-radius:999px;transition:width 0.4s;"></div>
              </div>
            </div>
            <div style="font-size:14px;font-weight:800;">${doneCount} / ${today.length}</div>
          </div>
        </div>
      </div>

      <div style="display:flex;gap:8px;margin-bottom:14px;">
        <input type="text" id="task-input" placeholder="নতুন task লিখুন..." style="flex:1;padding:12px 14px;border-radius:12px;border:1.5px solid #E1E8E1;background:#FFFFFF;color:#1C3E2C;font-family:inherit;font-size:13.5px;font-weight:600;box-sizing:border-box;" />
        <button id="add-task" style="padding:12px 18px;background:linear-gradient(135deg,#1C3E2C,#2A5540);color:#FFFFFF;border:none;border-radius:12px;font-weight:800;font-size:13px;cursor:pointer;font-family:inherit;flex-shrink:0;">➕</button>
      </div>

      ${today.length === 0
        ? emptyState({ icon: "📅", title: "কোনো task নেই", message: "উপরে নতুন task যোগ করুন" })
        : `<div style="display:flex;flex-direction:column;gap:8px;">
            ${today.map((t) => `
              <div style="display:flex;align-items:center;gap:12px;padding:14px;background:${t.done ? "#F8FBF8" : "#FFFFFF"};border:1.5px solid ${t.done ? "#10B981" : "#E1E8E1"};border-radius:14px;transition:all 0.2s;">
                <button class="task-toggle" data-id="${t.id}" style="width:26px;height:26px;border-radius:8px;background:${t.done ? "#10B981" : "transparent"};border:1.5px solid ${t.done ? "#10B981" : "#CBD5E1"};color:#FFFFFF;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:900;cursor:pointer;flex-shrink:0;padding:0;font-family:inherit;">${t.done ? "✓" : ""}</button>
                <div style="flex:1;min-width:0;font-size:13.5px;font-weight:700;color:${t.done ? "#84968B" : "#1C3E2C"};text-decoration:${t.done ? "line-through" : "none"};line-height:1.4;">${escapeHtml(t.text)}</div>
                <button class="task-del" data-id="${t.id}" style="width:28px;height:28px;border-radius:8px;background:#FEE2E2;border:none;color:#991B1B;cursor:pointer;font-size:12px;flex-shrink:0;">✕</button>
              </div>
            `).join("")}
          </div>`
      }

      <div style="height:20px;"></div>
    `;

    main.querySelector("#add-task")?.addEventListener("click", addTask);
    main.querySelector("#task-input")?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") addTask();
    });
    main.querySelectorAll(".task-toggle").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const tasks = loadTasks().map((t) => t.id === id ? { ...t, done: !t.done } : t);
        saveTasks(tasks);
        render();
      });
    });
    main.querySelectorAll(".task-del").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        saveTasks(loadTasks().filter((t) => t.id !== id));
        Toast.success("🗑️ Removed");
        render();
      });
    });
  }

  function addTask() {
    const input = main.querySelector("#task-input");
    const text = input?.value.trim();
    if (!text) { Toast.warning("Task লিখুন"); return; }
    const tasks = loadTasks();
    tasks.push({ id: "task-" + Date.now(), text, date: todayKey(), done: false, createdAt: Date.now() });
    saveTasks(tasks);
    Toast.success("✅ Added");
    render();
  }

  render();
}

function escapeHtml(str) {
  if (str == null) return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}