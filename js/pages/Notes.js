/**
 * Notes — Personal study notes (localStorage)
 */

import { AppShell } from "../components/AppShell.js";
import { emptyState } from "../utils/errorState.js";
import { Toast } from "../components/Toast.js";

const STORAGE_KEY = "diplomastudy_notes";

function loadNotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}

function saveNotes(notes) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(notes)); } catch (e) {}
}

export function renderNotes() {
  AppShell.updateHeader({
    title: "My Notes",
    subtitle: "Personal study notes",
    showBack: true,
    showSearch: false,
    showTheme: true,
    showSettings: false
  });

  const main = AppShell.getMainView();
  if (!main) return;

  let searchQuery = "";

  function render() {
    const notes = loadNotes().sort((a, b) => b.updatedAt - a.updatedAt);
    const filtered = searchQuery
      ? notes.filter((n) =>
          n.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.content?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : notes;

    main.innerHTML = `
      <div style="display:flex;gap:8px;margin-bottom:16px;">
        <div style="flex:1;position:relative;">
          <input type="text" id="note-search" value="${escapeAttr(searchQuery)}" placeholder="নোট খুঁজুন..." style="width:100%;padding:12px 14px;padding-left:40px;border-radius:12px;border:1.5px solid #E1E8E1;background:#FFFFFF;color:#1C3E2C;font-family:inherit;font-size:13.5px;font-weight:600;box-sizing:border-box;" />
          <span style="position:absolute;left:14px;top:50%;transform:translateY(-50%);color:#84968B;font-size:14px;pointer-events:none;">🔍</span>
        </div>
        <button id="add-note" style="padding:12px 16px;background:linear-gradient(135deg,#1C3E2C,#2A5540);color:#FFFFFF;border:none;border-radius:12px;font-weight:800;font-size:13px;cursor:pointer;font-family:inherit;flex-shrink:0;">➕</button>
      </div>

      ${filtered.length === 0
        ? emptyState({
            icon: "📝",
            title: searchQuery ? "কিছু পাওয়া যায়নি" : "কোনো নোট নেই",
            message: searchQuery ? "অন্য keyword try করুন" : "উপরের ➕ button দিয়ে নতুন নোট বানান",
            actionFn: !searchQuery ? () => openNoteModal() : null,
            actionLabel: !searchQuery ? "➕ নতুন নোট" : ""
          })
        : `<div style="display:flex;flex-direction:column;gap:10px;">
            ${filtered.map((n) => `
              <div class="note-card" data-id="${n.id}" style="padding:16px;background:#FFFFFF;border:1.5px solid #E1E8E1;border-radius:16px;box-shadow:0 2px 8px rgba(28,62,44,0.04);">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;margin-bottom:8px;">
                  <h3 style="font-size:14.5px;font-weight:800;color:#1C3E2C;margin:0;line-height:1.3;flex:1;">${escapeHtml(n.title || "Untitled")}</h3>
                  <div style="display:flex;gap:4px;flex-shrink:0;">
                    <button class="note-edit" data-id="${n.id}" style="width:30px;height:30px;border-radius:8px;background:#F2F5F2;border:none;color:#57675D;cursor:pointer;font-size:12px;">✏️</button>
                    <button class="note-del" data-id="${n.id}" style="width:30px;height:30px;border-radius:8px;background:#FEE2E2;border:none;color:#991B1B;cursor:pointer;font-size:12px;">🗑️</button>
                  </div>
                </div>
                <p style="font-size:12.5px;color:#57675D;line-height:1.55;margin:0 0 8px;white-space:pre-wrap;overflow:hidden;display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;">${escapeHtml(n.content || "")}</p>
                <div style="font-size:10.5px;color:#84968B;font-weight:600;">${formatDate(n.updatedAt)}</div>
              </div>
            `).join("")}
          </div>`
      }

      <div style="height:20px;"></div>
    `;

    main.querySelector("#note-search")?.addEventListener("input", (e) => {
      searchQuery = e.target.value.trim();
      render();
    });
    main.querySelector("#add-note")?.addEventListener("click", () => openNoteModal());
    main.querySelectorAll(".note-edit").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const note = loadNotes().find((x) => x.id === id);
        if (note) openNoteModal(note);
      });
    });
    main.querySelectorAll(".note-del").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        if (!confirm("এই নোট মুছে ফেলবেন?")) return;
        const notes = loadNotes().filter((x) => x.id !== id);
        saveNotes(notes);
        Toast.success("🗑️ Deleted");
        render();
      });
    });
  }

  function openNoteModal(existing = null) {
    const overlay = document.createElement("div");
    overlay.style.cssText = `position:fixed;inset:0;background:rgba(15,23,42,0.7);backdrop-filter:blur(6px);z-index:9999;display:flex;align-items:flex-end;justify-content:center;padding:0;`;
    overlay.innerHTML = `
      <div style="background:#FFFFFF;width:100%;max-width:520px;border-radius:24px 24px 0 0;padding:24px;box-shadow:0 -12px 40px rgba(0,0,0,0.3);">
        <div style="width:40px;height:4px;background:#E1E8E1;border-radius:999px;margin:0 auto 16px;"></div>
        <h3 style="font-size:17px;font-weight:900;color:#1C3E2C;margin:0 0 16px;">${existing ? "✏️ Edit Note" : "➕ New Note"}</h3>

        <div style="margin-bottom:12px;">
          <label style="display:block;font-size:12px;font-weight:700;color:#1C3E2C;margin-bottom:6px;">Title</label>
          <input type="text" id="note-title" value="${escapeAttr(existing?.title || "")}" placeholder="যেমন: Ohm's Law key points" style="width:100%;padding:12px 14px;border-radius:12px;border:1.5px solid #E1E8E1;background:#F8FBF8;color:#1C3E2C;font-family:inherit;font-size:14px;box-sizing:border-box;" />
        </div>

        <div style="margin-bottom:16px;">
          <label style="display:block;font-size:12px;font-weight:700;color:#1C3E2C;margin-bottom:6px;">Content</label>
          <textarea id="note-content" rows="6" placeholder="নোট লিখুন..." style="width:100%;padding:12px 14px;border-radius:12px;border:1.5px solid #E1E8E1;background:#F8FBF8;color:#1C3E2C;font-family:inherit;font-size:13.5px;box-sizing:border-box;resize:vertical;line-height:1.5;">${escapeHtml(existing?.content || "")}</textarea>
        </div>

        <div style="display:flex;gap:8px;">
          <button id="cancel" style="flex:1;padding:14px;background:transparent;border:1.5px solid #E1E8E1;color:#57675D;border-radius:12px;font-weight:800;font-size:13.5px;cursor:pointer;font-family:inherit;">Cancel</button>
          <button id="save" style="flex:2;padding:14px;background:linear-gradient(135deg,#1C3E2C,#2A5540);color:#FFFFFF;border:none;border-radius:12px;font-weight:800;font-size:13.5px;cursor:pointer;font-family:inherit;">💾 Save</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    overlay.querySelector("#cancel").onclick = () => overlay.remove();
    overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.remove(); });

    overlay.querySelector("#save").onclick = () => {
      const title = overlay.querySelector("#note-title").value.trim();
      const content = overlay.querySelector("#note-content").value.trim();
      if (!title) { Toast.error("Title দিন"); return; }

      const notes = loadNotes();
      if (existing) {
        const idx = notes.findIndex((x) => x.id === existing.id);
        if (idx >= 0) notes[idx] = { ...notes[idx], title, content, updatedAt: Date.now() };
      } else {
        notes.push({ id: "note-" + Date.now(), title, content, createdAt: Date.now(), updatedAt: Date.now() });
      }
      saveNotes(notes);
      Toast.success(existing ? "✅ Updated" : "✅ Saved");
      overlay.remove();
      render();
    };
  }

  render();
}

function escapeHtml(str) {
  if (str == null) return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function escapeAttr(str) {
  if (str == null) return "";
  return String(str).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function formatDate(iso) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    const diff = Math.floor((Date.now() - d) / 86400000);
    if (diff === 0) return "আজ";
    if (diff === 1) return "গতকাল";
    if (diff < 7) return `${diff} দিন আগে`;
    return d.toLocaleDateString("bn-BD", { day: "numeric", month: "short" });
  } catch (e) { return ""; }
}