/**
 * Settings — Professional
 */

import { AppShell } from "../components/AppShell.js";
import { storage, STORAGE_KEYS } from "../core/storage.js";
import { getDepartments, clearAllCache } from "../services/api.js";
import { Toast } from "../components/Toast.js";

const THEME_KEY = "diplomastudy_theme";
const APP_VERSION = "2.0.0";

export async function renderSettings() {
  AppShell.updateHeader({
    title: "Settings",
    subtitle: "App preferences",
    showBack: true,
    showSearch: false,
    showTheme: false,
    showSettings: false
  });

  const main = AppShell.getMainView();
  if (!main) return;

  const settings = storage.get(STORAGE_KEYS.SETTINGS, {});
  const theme = localStorage.getItem(THEME_KEY) || "light";
  const departments = await getDepartments();
  const currentDept = departments.find((d) => d.id === (settings.departmentId || settings.department));

  main.innerHTML = `
    <div style="padding:20px;background:linear-gradient(135deg, #163524 0%, #1F4A32 100%);border-radius:20px;margin-bottom:20px;box-shadow:0 12px 28px -8px rgba(28,62,44,0.3);position:relative;overflow:hidden;">
      <div style="position:absolute;top:-30px;right:-30px;width:120px;height:120px;border-radius:50%;background:radial-gradient(circle,rgba(200,122,30,0.2),transparent 70%);"></div>
      <div style="position:relative;display:flex;align-items:center;gap:14px;">
        <div style="width:60px;height:60px;border-radius:18px;background:rgba(255,255,255,0.15);border:1.5px solid rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;font-size:28px;">👤</div>
        <div style="flex:1;min-width:0;">
          <div style="font-size:16px;font-weight:900;color:#FFFFFF;margin-bottom:2px;">${escapeHtml(settings.userName || "Student")}</div>
          <div style="font-size:12px;color:rgba(255,255,255,0.7);font-weight:600;">${currentDept ? `${currentDept.icon || "🏛️"} ${currentDept.name}` : "No department"}</div>
        </div>
      </div>
    </div>

    <div style="margin-bottom:20px;">
      <h3 style="font-size:11px;font-weight:800;color:#84968B;text-transform:uppercase;letter-spacing:1px;margin:0 0 10px 4px;">Appearance</h3>
      <div style="background:#FFFFFF;border:1px solid #E1E8E1;border-radius:18px;overflow:hidden;">
        <button class="settings-row" id="setting-theme" style="width:100%;display:flex;align-items:center;gap:14px;padding:16px;background:transparent;border:none;cursor:pointer;font-family:inherit;text-align:left;">
          <div style="width:42px;height:42px;border-radius:13px;background:#F2F5F2;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">${theme === "dark" ? "🌙" : "☀️"}</div>
          <div style="flex:1;min-width:0;">
            <div style="font-size:13.5px;font-weight:800;color:#1C3E2C;margin-bottom:2px;">Dark Mode</div>
            <div style="font-size:11px;color:#84968B;font-weight:600;">${theme === "dark" ? "চালু আছে" : "বন্ধ আছে"}</div>
          </div>
          <div style="width:44px;height:24px;border-radius:999px;background:${theme === "dark" ? "#1C3E2C" : "#E1E8E1"};position:relative;transition:background 0.25s;flex-shrink:0;">
            <div style="position:absolute;top:2px;left:${theme === "dark" ? "22px" : "2px"};width:20px;height:20px;border-radius:50%;background:#FFFFFF;transition:left 0.25s;box-shadow:0 2px 4px rgba(0,0,0,0.15);"></div>
          </div>
        </button>
      </div>
    </div>

    <div style="margin-bottom:20px;">
      <h3 style="font-size:11px;font-weight:800;color:#84968B;text-transform:uppercase;letter-spacing:1px;margin:0 0 10px 4px;">Preferences</h3>
      <div style="background:#FFFFFF;border:1px solid #E1E8E1;border-radius:18px;overflow:hidden;">
        <button class="settings-row" id="setting-dept" style="width:100%;display:flex;align-items:center;gap:14px;padding:16px;background:transparent;border:none;cursor:pointer;font-family:inherit;text-align:left;border-bottom:1px solid #F2F5F2;">
          <div style="width:42px;height:42px;border-radius:13px;background:#DCFCE7;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">🏛️</div>
          <div style="flex:1;min-width:0;">
            <div style="font-size:13.5px;font-weight:800;color:#1C3E2C;margin-bottom:2px;">Department</div>
            <div style="font-size:11px;color:#84968B;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${currentDept ? currentDept.name : "Select department"}</div>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#84968B" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
        <button class="settings-row" id="setting-name" style="width:100%;display:flex;align-items:center;gap:14px;padding:16px;background:transparent;border:none;cursor:pointer;font-family:inherit;text-align:left;">
          <div style="width:42px;height:42px;border-radius:13px;background:#DBEAFE;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">✏️</div>
          <div style="flex:1;min-width:0;">
            <div style="font-size:13.5px;font-weight:800;color:#1C3E2C;margin-bottom:2px;">Your Name</div>
            <div style="font-size:11px;color:#84968B;font-weight:600;">${escapeHtml(settings.userName || "Student")}</div>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#84968B" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
    </div>

    <div style="margin-bottom:20px;">
      <h3 style="font-size:11px;font-weight:800;color:#84968B;text-transform:uppercase;letter-spacing:1px;margin:0 0 10px 4px;">Data</h3>
      <div style="background:#FFFFFF;border:1px solid #E1E8E1;border-radius:18px;overflow:hidden;">
        <button class="settings-row" id="setting-refresh" style="width:100%;display:flex;align-items:center;gap:14px;padding:16px;background:transparent;border:none;cursor:pointer;font-family:inherit;text-align:left;border-bottom:1px solid #F2F5F2;">
          <div style="width:42px;height:42px;border-radius:13px;background:#FEF3C7;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">🔄</div>
          <div style="flex:1;min-width:0;">
            <div style="font-size:13.5px;font-weight:800;color:#1C3E2C;margin-bottom:2px;">Refresh Data</div>
            <div style="font-size:11px;color:#84968B;font-weight:600;">Server থেকে নতুন data আনুন</div>
          </div>
        </button>
        <button class="settings-row" id="setting-clear" style="width:100%;display:flex;align-items:center;gap:14px;padding:16px;background:transparent;border:none;cursor:pointer;font-family:inherit;text-align:left;">
          <div style="width:42px;height:42px;border-radius:13px;background:#FEE2E2;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">🗑️</div>
          <div style="flex:1;min-width:0;">
            <div style="font-size:13.5px;font-weight:800;color:#991B1B;margin-bottom:2px;">Clear Cache</div>
            <div style="font-size:11px;color:#84968B;font-weight:600;">Temporary data মুছুন</div>
          </div>
        </button>
      </div>
    </div>

    <div style="text-align:center;padding:24px 20px;background:#FFFFFF;border:1px solid #E1E8E1;border-radius:18px;margin-bottom:20px;">
      <div style="font-size:36px;margin-bottom:8px;">🎓</div>
      <div style="font-size:15px;font-weight:900;color:#1C3E2C;margin-bottom:3px;">DiplomaStudy</div>
      <div style="font-size:11.5px;color:#84968B;font-weight:600;margin-bottom:10px;">Version ${APP_VERSION}</div>
      <div style="font-size:11px;color:#84968B;line-height:1.6;">Made with ❤️ for Diploma Engineering students<br>🇧🇩 Bangladesh</div>
    </div>

    <div style="height:20px;"></div>
  `;

  main.querySelector("#setting-theme")?.addEventListener("click", () => {
    const current = localStorage.getItem(THEME_KEY) || "light";
    const next = current === "dark" ? "light" : "dark";
    localStorage.setItem(THEME_KEY, next);
    if (next === "dark") document.documentElement.setAttribute("data-theme", "dark");
    else document.documentElement.removeAttribute("data-theme");
    Toast.success(next === "dark" ? "🌙 Dark mode on" : "☀️ Light mode on");
    renderSettings();
  });

  main.querySelector("#setting-dept")?.addEventListener("click", () => {
    window.location.hash = "#/onboarding";
  });

  main.querySelector("#setting-name")?.addEventListener("click", () => {
    const current = settings.userName || "Student";
    const name = prompt("আপনার নাম লিখুন:", current);
    if (name && name.trim()) {
      const ns = storage.get(STORAGE_KEYS.SETTINGS, {});
      ns.userName = name.trim();
      storage.set(STORAGE_KEYS.SETTINGS, ns);
      Toast.success("✅ নাম আপডেট হয়েছে");
      renderSettings();
    }
  });

  main.querySelector("#setting-refresh")?.addEventListener("click", () => {
    clearAllCache();
    Toast.info("🔄 Cache cleared, reloading...");
    setTimeout(() => window.location.reload(), 500);
  });

  main.querySelector("#setting-clear")?.addEventListener("click", () => {
    if (!confirm("সব cached data মুছে ফেলবেন?")) return;
    clearAllCache();
    Toast.success("🗑️ Cache cleared");
  });
}

function escapeHtml(str) {
  if (str == null) return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}