/**
 * Notices — with hash guard
 */

import { AppShell } from "../components/AppShell.js";
import { getNotices, getDepartments } from "../services/api.js";
import { storage, STORAGE_KEYS } from "../core/storage.js";
import { noticesSkeleton } from "../utils/skeleton.js";
import { emptyState } from "../utils/errorState.js";

export async function renderNotices() {
  const MY_HASH = "#/notices";

  AppShell.updateHeader({
    title: "Notices", subtitle: "সর্বশেষ নোটিশ",
    showBack: true, showSearch: false, showTheme: true, showSettings: false,
    expectedHash: MY_HASH
  });

  const main = AppShell.getMainView();
  if (!main) return;

  main.innerHTML = noticesSkeleton(4);

  const settings = storage.get(STORAGE_KEYS.SETTINGS, {});
  const departments = await getDepartments();
  const curDeptId = settings.departmentId || settings.department || "";
  const currentDept = departments.find((d) => d.id === curDeptId);

  let notices = [];
  try { notices = await getNotices(currentDept?.id || null); } catch (e) {}

  if ((window.location.hash || "").split("?")[0] !== MY_HASH) return;

  if (notices.length === 0) {
    main.innerHTML = emptyState({
      icon: "📭", title: "No Notices Yet",
      message: "এখনো কোনো notice publish করা হয়নি।",
      actionFn: () => window.location.hash = "#/home",
      actionLabel: "🏠 Home"
    });
    return;
  }

  const catColors = {
    routine: { bg: "#FEF3C7", color: "#92400E", label: "📅 Routine" },
    result: { bg: "#DBEAFE", color: "#1E40AF", label: "📊 Result" },
    exam: { bg: "#FEE2E2", color: "#991B1B", label: "📝 Exam" },
    admission: { bg: "#DCFCE7", color: "#065F46", label: "🎓 Admission" },
    holiday: { bg: "#EDE9FE", color: "#5B21B6", label: "🎉 Holiday" },
    general: { bg: "#F2F5F2", color: "#57675D", label: "📢 General" }
  };

  main.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 16px;background:linear-gradient(135deg, #FFFBEB, #FEF3C7);border:1px solid #FCD34D;border-radius:16px;margin-bottom:16px;box-shadow:0 4px 12px rgba(200,122,30,0.08);">
      <div style="display:flex;align-items:center;gap:10px;">
        <div style="width:40px;height:40px;border-radius:12px;background:rgba(255,255,255,0.8);display:flex;align-items:center;justify-content:center;font-size:20px;">📢</div>
        <div>
          <div style="font-size:14px;font-weight:800;color:#92400E;">${notices.length}টি নোটিশ</div>
          <div style="font-size:11px;color:#B45309;font-weight:600;">সর্বশেষ আপডেট</div>
        </div>
      </div>
    </div>

    <div style="display:flex;flex-direction:column;gap:12px;">
      ${notices.map((n) => {
        const catKey = (n.audience || "general").toLowerCase();
        const cat = catColors[catKey] || catColors.general;
        return `
          <div class="notice-card" data-notice-id="${n.id}" style="background:#FFFFFF;border:1px solid #E1E8E1;border-radius:18px;overflow:hidden;box-shadow:0 2px 8px rgba(28,62,44,0.04);cursor:pointer;transition:all 0.2s ease;position:relative;">
            <div style="position:absolute;top:0;left:0;width:4px;height:100%;background:${cat.color};"></div>
            <div style="padding:16px 16px 16px 20px;">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                <span style="font-size:10px;font-weight:800;color:${cat.color};background:${cat.bg};padding:4px 10px;border-radius:999px;letter-spacing:0.4px;text-transform:uppercase;">${cat.label}</span>
                <span style="font-size:11px;color:#84968B;font-weight:600;">${formatDate(n.publishedAt || n.createdAt)}</span>
              </div>
              <h3 style="font-size:15px;font-weight:800;color:#1C3E2C;letter-spacing:-0.2px;line-height:1.35;margin:0 0 8px;">${escapeHtml(n.title || "")}</h3>
              <p style="font-size:12.5px;color:#57675D;line-height:1.55;margin:0 0 12px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;">${escapeHtml(stripMarkdown(n.content || ""))}</p>
              <div style="display:flex;align-items:center;gap:4px;font-size:11.5px;font-weight:800;color:#1C3E2C;">Read more →</div>
            </div>
          </div>
        `;
      }).join("")}
    </div>

    <div style="height:20px;"></div>
  `;

  main.querySelectorAll(".notice-card").forEach((card) => {
    card.addEventListener("click", () => {
      const id = card.getAttribute("data-notice-id");
      const notice = notices.find((n) => n.id === id);
      if (notice) openNoticeDetail(notice);
    });
    card.addEventListener("mouseenter", () => { card.style.transform = "translateY(-2px)"; card.style.boxShadow = "0 8px 20px rgba(28,62,44,0.1)"; });
    card.addEventListener("mouseleave", () => { card.style.transform = ""; card.style.boxShadow = "0 2px 8px rgba(28,62,44,0.04)"; });
  });
}

function openNoticeDetail(notice) {
  document.getElementById("notice-modal")?.remove();
  const overlay = document.createElement("div");
  overlay.id = "notice-modal";
  overlay.style.cssText = `position:fixed;inset:0;background:rgba(16,23,18,0.6);backdrop-filter:blur(8px);z-index:100;display:flex;align-items:flex-end;justify-content:center;`;
  overlay.innerHTML = `
    <div style="background:#FFFFFF;width:100%;max-width:680px;border-radius:24px 24px 0 0;max-height:85vh;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 -12px 48px rgba(0,0,0,0.25);">
      <div style="padding:18px 20px 12px;border-bottom:1px solid #E1E8E1;">
        <div style="width:40px;height:4px;background:#E1E8E1;border-radius:999px;margin:0 auto 14px;"></div>
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;">
          <h2 style="font-size:18px;font-weight:900;color:#1C3E2C;letter-spacing:-0.4px;line-height:1.3;margin:0;flex:1;">${escapeHtml(notice.title || "")}</h2>
          <button data-close-modal style="width:36px;height:36px;border-radius:10px;background:#F2F5F2;border:none;color:#57675D;font-size:16px;cursor:pointer;flex-shrink:0;font-family:inherit;">✕</button>
        </div>
        <div style="font-size:11.5px;color:#84968B;font-weight:600;margin-top:8px;">${formatDate(notice.publishedAt || notice.createdAt)}</div>
      </div>
      <div style="padding:20px;overflow-y:auto;flex:1;">
        <div style="font-size:14px;color:#1C3E2C;line-height:1.7;white-space:pre-wrap;">${escapeHtml(notice.content || "")}</div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  const close = () => overlay.remove();
  overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
  overlay.querySelector("[data-close-modal]").addEventListener("click", close);
  document.addEventListener("keydown", function esc(e) { if (e.key === "Escape") { close(); document.removeEventListener("keydown", esc); } });
}

function escapeHtml(str) {
  if (str == null) return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function stripMarkdown(text) {
  return String(text || "").replace(/[#*_`>]/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\n+/g, " ").trim();
}
function formatDate(iso) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    const now = new Date();
    const diff = Math.floor((now - d) / 86400000);
    if (diff === 0) return "আজ";
    if (diff === 1) return "গতকাল";
    if (diff < 7) return `${diff} দিন আগে`;
    return d.toLocaleDateString("bn-BD", { day: "numeric", month: "long" });
  } catch (e) { return ""; }
}