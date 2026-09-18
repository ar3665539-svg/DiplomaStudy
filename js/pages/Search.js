/**
 * Search Page - Simple search
 */

import { AppShell } from "../components/AppShell.js";
import { router } from "../core/router.js";

export function renderSearch() {
  AppShell.updateHeader({
    title: "Search",
    subtitle: "খুঁজুন",
    showBack: true,
    showSettings: false,
    showTheme: false
  });

  const main = AppShell.getMainView();
  if (!main) return;

  main.innerHTML = `
    <div style="
      display:flex;align-items:center;gap:10px;
      padding:12px 16px;
      background:#FFFFFF;
      border:1.5px solid #E1E8E1;
      border-radius:16px;
      box-shadow:0 4px 12px rgba(28,62,44,0.05);
      margin-bottom:20px;
    ">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#84968B" stroke-width="2.2" stroke-linecap="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
      <input 
        type="text" 
        id="search-input" 
        placeholder="Subject, chapter নাম লিখুন..." 
        autocomplete="off"
        style="
          flex:1;
          background:transparent;
          border:none;
          outline:none;
          font-size:15px;
          font-weight:600;
          color:#1C3E2C;
          font-family:inherit;
        "
      />
    </div>

    <div id="search-results">
      <div style="text-align:center;padding:60px 20px;">
        <div style="font-size:64px;margin-bottom:16px;">🔍</div>
        <h2 style="font-size:16px;font-weight:800;color:#1C3E2C;margin:0 0 6px;">কিছু খুঁজুন</h2>
        <p style="font-size:13px;color:#84968B;line-height:1.6;max-width:280px;margin:0 auto;">
          Subject বা chapter-এর নাম লিখুন
        </p>
      </div>
    </div>
  `;

  const input = main.querySelector("#search-input");
  const resultsEl = main.querySelector("#search-results");

  let debounceTimer = null;

  input.addEventListener("input", () => {
    const q = input.value.trim();

    if (debounceTimer) clearTimeout(debounceTimer);
    if (!q || q.length < 2) {
      resultsEl.innerHTML = `
        <div style="text-align:center;padding:60px 20px;">
          <div style="font-size:64px;margin-bottom:16px;">🔍</div>
          <h2 style="font-size:16px;font-weight:800;color:#1C3E2C;margin:0 0 6px;">আরো টাইপ করুন</h2>
          <p style="font-size:13px;color:#84968B;">কমপক্ষে ২ অক্ষর</p>
        </div>
      `;
      return;
    }

    debounceTimer = setTimeout(async () => {
      resultsEl.innerHTML = `<div style="text-align:center;padding:40px;"><div class="spinner"></div></div>`;

      try {
        const { searchContent } = await import("../services/api.js");
        const results = await searchContent(q);

        if (!results || results.length === 0) {
          resultsEl.innerHTML = `
            <div style="text-align:center;padding:60px 20px;">
              <div style="font-size:56px;margin-bottom:16px;">😕</div>
              <h2 style="font-size:15px;font-weight:800;color:#1C3E2C;margin:0 0 6px;">কিছু পাওয়া যায়নি</h2>
              <p style="font-size:12.5px;color:#84968B;">"${escapeHtml(q)}" এর জন্য কিছু নেই</p>
            </div>
          `;
          return;
        }

        resultsEl.innerHTML = `
          <div style="font-size:11px;font-weight:800;color:#84968B;text-transform:uppercase;letter-spacing:0.8px;margin:0 0 10px 4px;">
            ${results.length}টি result
          </div>
          <div style="display:flex;flex-direction:column;gap:8px;">
            ${results.map((r) => `
              <button class="search-result" data-type="${r.type}" data-id="${r.id}" data-subject-id="${r.subjectId || ""}" style="
                display:flex;align-items:center;gap:12px;
                padding:14px;
                background:#FFFFFF;
                border:1px solid #E1E8E1;
                border-radius:14px;
                cursor:pointer;
                font-family:inherit;
                text-align:left;
                width:100%;
                box-shadow:0 2px 6px rgba(28,62,44,0.03);
              ">
                <div style="width:44px;height:44px;border-radius:12px;background:${r.type === "subject" ? "#DCFCE7" : "#DBEAFE"};color:${r.type === "subject" ? "#065F46" : "#1E40AF"};display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;">${r.icon}</div>
                <div style="flex:1;min-width:0;">
                  <div style="font-size:14px;font-weight:800;color:#1C3E2C;letter-spacing:-0.2px;margin-bottom:2px;">${escapeHtml(r.title)}</div>
                  ${r.subtitle ? `<div style="font-size:11.5px;color:#84968B;font-weight:600;">${escapeHtml(r.subtitle)}</div>` : ""}
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#84968B" stroke-width="2.5" stroke-linecap="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            `).join("")}
          </div>
        `;

        // Bind
        resultsEl.querySelectorAll(".search-result").forEach((btn) => {
          btn.addEventListener("click", () => {
            const type = btn.getAttribute("data-type");
            const id = btn.getAttribute("data-id");

            if (type === "subject") {
              window.location.hash = `#/subject?subjectId=${id}`;
            } else if (type === "chapter") {
              const subId = btn.getAttribute("data-subject-id");
              window.location.hash = `#/content?subjectId=${subId}&chapterId=${id}`;
            }
          });
        });

      } catch (err) {
        console.error("[Search] Error:", err);
        resultsEl.innerHTML = `
          <div style="text-align:center;padding:60px 20px;">
            <div style="font-size:48px;margin-bottom:12px;">⚠️</div>
            <p style="font-size:13px;color:#DC2626;">Search failed</p>
          </div>
        `;
      }
    }, 250);
  });

  input.focus();
}

function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}