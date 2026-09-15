/**
 * DiplomaStudy - SearchBar Component
 */

export const SearchBar = {
  render({ placeholder = "Search subjects, questions, formulas, notes...", value = "", id = "global-search-input" } = {}) {
    return `
      <div class="search-container">
        <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input 
          type="text" 
          id="${id}" 
          class="search-input" 
          placeholder="${placeholder}" 
          value="${value}"
          autocomplete="off"
          autocapitalize="off"
          spellcheck="false"
        />
        ${value ? `
          <button class="search-clear-btn" id="${id}-clear" aria-label="Clear Search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        ` : ""}
      </div>
    `;
  },

  bindEvents(container, onSearch, id = "global-search-input") {
    const input = container.querySelector(`#${id}`);
    const clearBtn = container.querySelector(`#${id}-clear`);

    input?.addEventListener("input", (e) => {
      if (onSearch) onSearch(e.target.value);
    });

    clearBtn?.addEventListener("click", () => {
      if (input) {
        input.value = "";
        input.focus();
        if (onSearch) onSearch("");
      }
    });
  }
};
