/**
 * Search — Global search
 */

import { AppShell } from "../components/AppShell.js";
import { searchContent } from "../services/api.js";
import { searchService } from "../services/searchService.js";

export function renderSearch() {
  AppShell.updateHeader({
    title: "Search", subtitle: "খুঁজুন",
    showBack: true, showSearch: false, showTheme: false, showSettings: false
  });

  const main = AppShell.getMainView();
  if (!main) return;

  main.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;padding:12px 16px;background:#FFFFFF;border:1.5px solid #E1E8E1;border-radius:16px;box-shadow:0 4px 12px rgba(28,62,44,0.05);margin-bottom:20px;">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#84968B" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
      <input type="text" id="search-input" placeholder="Subject, chapter, PDF, সাজেশন..." autocomplete="off" style="flex:1;background:transparent;border:none;outline:none;font-size:15px;font-weight:600;color:#1C3E2C;font-family:inherit;" />
      <button id="search-clear" style="display:none;width:26px;height:26px;border-radius:50%;background:#F2F5F2;border:none;color:#57675D;cursor:pointer;font-size:12px;font-family:inherit;">✕</button>
    </div>

    <div id="search-results">
      <div style="text-align:center;padding:60px 20px;">
        <div style="font-size:64px;margin-bottom:16px;">🔍</div>
        <h2 style="font-size:16px;font-weight:800;color:#1C3E2C;margin:0 0 6px;">কিছু খুঁজুন</h2>
        <p style="font-size:13px;color:#84968B;line-height:1.6;max-width:280px;margin:0 auto;">Subject, chapter, PDF বা সাজেশনের নাম লিখুন</p>
      </div>
    </div>
  `;

  const input = main.querySelector("#search-input");
  const clearBtn = main.querySelector("#search-clear");
  const resultsEl = main.querySelector("#search-results");

  let debounceTimer = null;
  input.focus();

  input.addEventListener("input", () => {
    const q = input.value.trim();
    clearBtn.style.display = q ? "flex" : "none";
    if (debounceTimer) clearTimeout(debounceTimer);
    if (!q || q.length < 2) {
      resultsEl.innerHTML = `<div style="text-align:center;padding:60px 20px;"><div style="font-size:64px;margin-bottom:16px;">🔍</div><h2 style="font-size:16px;font-weight:800;color:#1C3E2C;margin:0 0 6px;">আরো টাইপ করুন</h2><p style="font-size:13px;color:#84968B;">কমপক্ষে ২ অক্ষর</p></div>`;
      return;
    }
    debounceTimer = setTimeout(() => performSearch(q, resultsEl), 300);
  });

  clearBtn.addEventListener("click", () => {
    input.value = "";
    clearBtn.style.display = "none";
    input.focus();
    resultsEl.innerHTML = `<div style="text-align:center;padding:60px 20px;"><div style="font-size:64px;margin-bottom:16px;">🔍</div><h2 style="font-size:16px;font-weight:800;color:#1C3E2C;margin:0 0 6px;">কিছু খুঁজুন</h2></div>`;
  });
}

async function performSearch(query, el) {
  el.innerHTML = `<div style="text-align:center;padding:40px;"><div class="spinner"></div></div>`;

  try {
    const results = await searchService.search(query, { types: ["subject", "chapter", "pdf", "suggestion"] });

    if (!results || results.length === 0) {
      el.innerHTML = `<div style="text-align:center;padding:60px 20px;"><div style="font-size:56px;margin-bottom:16px;">😕</div><h2 style="font-size:15px;font-weight:800;color:#1C3E2C;margin:0 0 6px;">কিছু পাওয়া যায়নি</h2><p style="font-size:12.5px;color:#84968B;">"${escapeHtml(query)}" এর জন্য result নেই</p></div>`;
      return;
    }

    const typeEmoji = { subject: "📚", chapter: "📖", pdf: "📄", suggestion: "💡" };
    const typeLabel = { subject: "Subject", chapter: "Chapter", pdf: "PDF", suggestion: "Suggestion" };

    el.innerHTML = `
      <div style="font-size:11px;font-weight:800;color:#84968B;text-transform:uppercase;letter-spacing:0.8px;margin:0 0 12px 4px;">${results.length}টি result</div>
      <div style="display:flex;flex-direction:column;gap:8px;">
        ${results.map((r) => `
          <button class="search-result" data-route="${r.route || ''}" data-type="${r.type}" style="display:flex;align-items:center;gap:12px;padding:14px;background:#FFFFFF;border:1.5px solid #E1E8E1;border-radius:14px;cursor:pointer;font-family:inherit;text-align:left;width:100%;box-shadow:0 2px 6px rgba(28,62,44,0.03);">
            <div style="width:44px;height:44px;border-radius:12px;background:#F8FBF8;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;">${r.icon}</div>
            <div style="flex:1;min-width:0;">
              <div style="font-size:13.5px;font-weight:800;color:#1C3E2C;margin-bottom:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(r.title || "")}</div>
              ${r.subtitle ? `<div style="font-size:11px;color:#84968B;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(r.subtitle)}</div>` : ""}
            </div>
            <span style="font-size:10px;font-weight:800;color:#065F46;background:#DCFCE7;padding:3px 8px;border-radius:6px;flex-shrink:0;text-transform:uppercase;">${typeLabel[r.type] || r.type}</span>
          </button>
        `).join("")}
      </div>
    `;

    el.querySelectorAll(".search-result").forEach((btn) => {
      btn.addEventListener("click", () => {
        const route = btn.getAttribute("data-route");
        if (route) window.location.href = route;
      });
    });
  } catch (err) {
    el.innerHTML = `<div style="text-align:center;padding:60px 20px;"><div style="font-size:48px;margin-bottom:12px;">⚠️</div><p style="font-size:13px;color:#DC2626;">Search failed</p></div>`;
  }
}

function escapeHtml(str) {
  if (str == null) return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}