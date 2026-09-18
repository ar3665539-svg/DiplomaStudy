/**
 * DiplomaStudy - Common Utilities
 */

export function debounce(fn, delay = 300) {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

export function throttle(fn, delay = 200) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last < delay) return;
    last = now;
    fn.apply(this, args);
  };
}

export function formatDate(iso, options = {}) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "এইমাত্র";
    if (diffMins < 60) return `${diffMins} মিনিট আগে`;
    if (diffHours < 24) return `${diffHours} ঘণ্টা আগে`;
    if (diffDays === 1) return "গতকাল";
    if (diffDays < 7) return `${diffDays} দিন আগে`;

    return d.toLocaleDateString("bn-BD", {
      day: "numeric",
      month: options.long ? "long" : "short",
      year: options.showYear ? "numeric" : undefined
    });
  } catch (e) { return ""; }
}

export function formatBytes(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

export function truncate(str, len = 60) {
  if (!str) return "";
  return str.length > len ? str.slice(0, len).trim() + "..." : str;
}

export function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

export function romanize(num) {
  const map = { 1: "I", 2: "II", 3: "III", 4: "IV", 5: "V", 6: "VI", 7: "VII", 8: "VIII" };
  return map[num] || String(num);
}

export function bnNumber(num) {
  const bn = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return String(num).replace(/\d/g, (d) => bn[parseInt(d, 10)]);
}