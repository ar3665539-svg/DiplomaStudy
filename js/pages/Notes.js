/**
 * DiplomaStudy - Personal Notes Page View
 */

import { AppShell } from "../components/AppShell.js";
import { notesService } from "../features/notes/notesService.js";
import { Modal } from "../components/Modal.js";
import { SearchBar } from "../components/SearchBar.js";

export function renderNotes() {
  AppShell.updateHeader({
    title: "Personal Study Notes",
    subtitle: "Revision notes & formula cheats",
    showBack: true,
    showSearch: true
  });

  const main = AppShell.getMainView();
  if (!main) return;

  let searchQuery = "";

  const renderNotesList = () => {
    const listEl = main.querySelector("#notes-list-container");
    if (!listEl) return;

    let notes = notesService.getAll();
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      notes = notes.filter((n) =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.subjectTag.toLowerCase().includes(q)
      );
    }

    if (notes.length === 0) {
      listEl.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📝</div>
          <h2 class="empty-state-title">No Notes Found</h2>
          <p class="empty-state-desc">Create your first revision note using the button above.</p>
        </div>
      `;
      return;
    }

    listEl.innerHTML = notes.map((n) => `
      <div class="card mb-md note-card ${n.isPinned ? "card-highlight" : ""}" data-id="${n.id}" id="note-item-${n.id}">
        <div class="flex items-start justify-between mb-xs">
          <div class="flex items-center gap-xs flex-wrap">
            ${n.isPinned ? `<span class="badge badge-accent">📌 Pinned</span>` : ""}
            <span class="badge badge-forest">${n.subjectTag || "General"}</span>
            <span class="text-xs text-dim">${new Date(n.updatedAt).toLocaleDateString()}</span>
          </div>
          <div class="flex items-center gap-xs">
            <button class="header-icon-btn btn-pin-note" data-id="${n.id}" title="${n.isPinned ? "Unpin" : "Pin to top"}">
              📌
            </button>
            <button class="header-icon-btn btn-fav-note" data-id="${n.id}" title="Favorite">
              ${n.isFavorite ? "⭐" : "☆"}
            </button>
            <button class="header-icon-btn btn-edit-note" data-id="${n.id}" title="Edit Note">
              ✏️
            </button>
            <button class="header-icon-btn btn-delete-note text-danger" data-id="${n.id}" title="Delete Note">
              🗑️
            </button>
          </div>
        </div>

        <h3 class="text-sm font-bold text-forest mb-xs">${n.title}</h3>
        <p class="text-xs text-text mb-sm" style="white-space: pre-wrap; line-height: 1.5;">${n.content}</p>

        ${n.chapterTag ? `<span class="text-xs text-dim">Tag: ${n.chapterTag}</span>` : ""}
      </div>
    `).join("");

    // Bind item actions
    listEl.querySelectorAll(".btn-pin-note").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        notesService.togglePin(id);
        renderNotesList();
      });
    });

    listEl.querySelectorAll(".btn-fav-note").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        notesService.toggleFavorite(id);
        renderNotesList();
      });
    });

    listEl.querySelectorAll(".btn-edit-note").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const note = notesService.getById(id);
        if (note) openNoteModal(note);
      });
    });

    listEl.querySelectorAll(".btn-delete-note").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        Modal.show({
          title: "Delete Note?",
          bodyHtml: "<p class='text-xs text-muted'>Are you sure you want to delete this study note? This action cannot be undone.</p>",
          confirmText: "Delete Note",
          cancelText: "Keep Note",
          onConfirm: () => {
            notesService.delete(id);
            renderNotesList();
          }
        });
      });
    });
  };

  const openNoteModal = (existingNote = null) => {
    const isEdit = !!existingNote;
    const bodyHtml = `
      <div class="flex flex-col gap-sm">
        <div>
          <label class="text-xs font-bold text-muted block mb-xs">Note Title</label>
          <input 
            type="text" 
            id="modal-note-title" 
            class="search-input" 
            style="padding: 10px 12px;"
            placeholder="e.g., Ohm's Law Key Points"
            value="${existingNote ? existingNote.title : ""}"
          />
        </div>

        <div>
          <label class="text-xs font-bold text-muted block mb-xs">Subject / Category</label>
          <input 
            type="text" 
            id="modal-note-subject" 
            class="search-input" 
            style="padding: 10px 12px;"
            placeholder="e.g., Basic Electricity, CST, Math"
            value="${existingNote ? existingNote.subjectTag : "General"}"
          />
        </div>

        <div>
          <label class="text-xs font-bold text-muted block mb-xs">Note Content</label>
          <textarea 
            id="modal-note-content" 
            class="search-input" 
            rows="5"
            style="padding: 10px 12px; height: 120px; resize: vertical; border-radius: var(--radius-sm);"
            placeholder="Write key equations, board question notes, or concepts..."
          >${existingNote ? existingNote.content : ""}</textarea>
        </div>
      </div>
    `;

    Modal.show({
      title: isEdit ? "Edit Study Note" : "Create New Study Note",
      bodyHtml,
      confirmText: isEdit ? "Save Changes" : "Create Note",
      onConfirm: () => {
        const title = document.getElementById("modal-note-title")?.value || "";
        const content = document.getElementById("modal-note-content")?.value || "";
        const subjectTag = document.getElementById("modal-note-subject")?.value || "General";

        if (isEdit) {
          notesService.update(existingNote.id, { title, content, subjectTag });
        } else {
          notesService.create({ title, content, subjectTag });
        }
        renderNotesList();
      }
    });
  };

  main.innerHTML = `
    <!-- Top Action Bar -->
    <div class="flex items-center gap-sm mb-sm">
      <div class="flex-1">
        ${SearchBar.render({ placeholder: "Search notes by title, topic...", id: "notes-search-input" })}
      </div>
      <button class="btn btn-primary btn-sm" id="btn-create-note" style="white-space: nowrap;">
        <span>+ Add Note</span>
      </button>
    </div>

    <div id="notes-list-container"></div>
  `;

  main.querySelector("#btn-create-note")?.addEventListener("click", () => openNoteModal());

  SearchBar.bindEvents(main, (q) => {
    searchQuery = q.trim();
    renderNotesList();
  }, "notes-search-input");

  renderNotesList();
}
