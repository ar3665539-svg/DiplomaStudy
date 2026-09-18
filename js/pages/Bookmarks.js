/**
 * Bookmarks Page
 */

import { AppShell } from "../components/AppShell.js";
import { bookmarkService } from "../features/bookmark/bookmarkService.js";
import { emptyState } from "../utils/errorState.js";
import { Toast } from "../components/Toast.js";

export function renderBookmarks() {
  AppShell.updateHeader({
    title: "Saved Items",
    subtitle: "Bookmarked content",
    showBack: true,
    showSearch: false,
    showTheme: true,
    showSettings: false
  });

  const main = AppShell.getMainView();
  if (!main) return;

  const bookmarks = bookmarkService.getAll();

  if (bookmarks.length === 0) {
    main.innerHTML = emptyState({
      icon: "⭐",
      title: "কিছু Save করা হয়নি",
      message: "যেকোনো chapter/PDF-এর পাশে ☆ button tap করে save করুন।",
      actionFn: () => window.location.hash = "#/subjects",
      actionLabel: "📚 Subjects এ যান"
    });
    return;
  }

  main.innerHTML = `
    <div style="
      display:flex;align-items:center;gap:10px;
      padding:14px 16px;
      background:linear-gradient(135deg, #FEF3C7, #FDE68A);
      border:1px solid #FCD34D;
      border-radius:16px;
      margin-bottom:18px;
    ">
      <div style="width:42px;height:42px;border-radius:12px;background:rgba(255,255,255,0.7);display:flex;align-items:center;justify-content:center;font-size:22px;">⭐</div>
      <div style="flex:1;min-width:0;">
        <div style="font-size:14px;font-weight:800;color:#92400E;">${bookmarks.length}টি Saved Item</div>
        <div style="font-size:11px;color:#B45309;font-weight:600;">Swipe বা tap করে খুলুন</div>
      </div>
    </div>

    <div style="display:flex;flex-direction:column;gap:10px;">
      ${bookmarks.map((b) => `
        <button class="bm-row" data-id="${b.id}" data-type="${b.type}" data-route="${b.route || ""}" style="
          display:flex;align-items:center;gap:12px;
          padding:14px;background:#FFFFFF;
          border:1.5px solid #E1E8E1;border-radius:14px;
          cursor:pointer;font-family:inherit;text-align:left;width:100%;
          box-shadow:0 2px 6px rgba(28,62,44,0.04);
        ">
          <div style="width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,#FEF3C7,#FDE68A);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;">
            ${b.icon || "📌"}
          </div>
          <div style="flex:1;min-width:0;">
            <div style="font-size:13.5px;font-weight:800;color:#1C3E2C;margin-bottom:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(b.title || "")}</div>
            ${b.subtitle ? `<div style="font-size:11px;color:#84968B;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(b.subtitle)}</div>` : ""}
          </div>
          <button class="bm-remove" data-id="${b.id}" data-type="${b.type}" type="button" style="width:32px;height:32px;border-radius:50%;background:#FEE2E2;color:#991B1B;border:none;cursor:pointer;font-size:14px;font-weight:800;flex-shrink:0;">✕</button>
        </button>
      `).join("")}
    </div>

    <div style="height:20px;"></div>
  `;

  main.querySelectorAll(".bm-row").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      if (e.target.closest(".bm-remove")) return;
      const route = btn.getAttribute("data-route");
      if (route) window.location.hash = route;
    });
  });

  main.querySelectorAll(".bm-remove").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = btn.getAttribute("data-id");
      const type = btn.getAttribute("data-type");
      bookmarkService.remove(id, type);
      Toast.success("🗑️ Removed");
      renderBookmarks();
    });
  });
}

function escapeHtml(str) {
  if (str == null) return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}