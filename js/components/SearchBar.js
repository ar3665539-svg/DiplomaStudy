/**
 * SearchBar — Reusable debounced search input
 */

export const SearchBar = {
  render({ placeholder = "খুঁজুন...", id = "search-input", value = "" } = {}) {
    return `
      <div style="position:relative;width:100%;">
        <input 
          type="text" 
          id="${id}" 
          value="${escapeAttr(value)}" 
          placeholder="${escapeAttr(placeholder)}" 
          autocomplete="off"
          style="
            width:100%;
            padding:12px 40px 12px 44px;
            border-radius:14px;
            border:1.5px solid #E1E8E1;
            background:#FFFFFF;
            color:#1C3E2C;
            font-family:inherit;
            font-size:13.5px;
            font-weight:600;
            box-sizing:border-box;
            outline:none;
            transition:border-color 0.2s, box-shadow 0.2s;
          "
        />
        <span style="position:absolute;left:16px;top:50%;transform:translateY(-50%);color:#84968B;pointer-events:none;font-size:16px;">🔍</span>
        <button 
          type="button" 
          data-clear="${id}" 
          style="position:absolute;right:12px;top:50%;transform:translateY(-50%);width:24px;height:24px;border-radius:50%;background:transparent;border:none;color:#84968B;cursor:pointer;font-size:12px;display:none;font-family:inherit;"
        >✕</button>
      </div>
    `;
  },

  bindEvents(container, onChange, id = "search-input") {
    const input = container.querySelector(`#${id}`);
    const clearBtn = container.querySelector(`[data-clear="${id}"]`);

    if (!input) return;

    // Focus glow
    input.addEventListener("focus", () => {
      input.style.borderColor = "#1C3E2C";
      input.style.boxShadow = "0 0 0 3px rgba(28,62,44,0.08)";
    });
    input.addEventListener("blur", () => {
      input.style.borderColor = "#E1E8E1";
      input.style.boxShadow = "none";
    });

    let timer = null;
    input.addEventListener("input", (e) => {
      const val = e.target.value;
      if (clearBtn) clearBtn.style.display = val ? "block" : "none";
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        if (onChange) onChange(val);
      }, 300);
    });

    clearBtn?.addEventListener("click", () => {
      input.value = "";
      clearBtn.style.display = "none";
      input.focus();
      if (onChange) onChange("");
    });
  }
};

function escapeAttr(str) {
  if (str == null) return "";
  return String(str).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}