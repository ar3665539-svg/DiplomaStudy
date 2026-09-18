/**
 * DiplomaStudy - Skeleton Loaders
 * Reusable loading placeholders
 */

// ═══════════════════════════════════════════
// BASE SKELETON
// ═══════════════════════════════════════════
export function skeletonBox(height = "20px", width = "100%", radius = "8px", style = "") {
  return `<div class="ds-skeleton" style="height:${height};width:${width};border-radius:${radius};${style}"></div>`;
}

export function skeletonCircle(size = "40px") {
  return `<div class="ds-skeleton" style="width:${size};height:${size};border-radius:50%;flex-shrink:0;"></div>`;
}

export function skeletonText(lines = 2, widths = ["100%", "60%"]) {
  return Array.from({ length: lines })
    .map((_, i) => `<div class="ds-skeleton" style="height:12px;width:${widths[i] || "80%"};border-radius:6px;margin-bottom:8px;"></div>`)
    .join("");
}

// ═══════════════════════════════════════════
// PRESET SKELETONS
// ═══════════════════════════════════════════

/**
 * Home page skeleton
 */
export function homeSkeleton() {
  return `
    <div style="padding:0 0 20px;">
      <!-- Hero -->
      <div class="ds-skeleton" style="height:200px;border-radius:24px;margin-bottom:20px;"></div>

      <!-- Quick actions grid -->
      <div class="ds-skeleton" style="height:14px;width:40%;border-radius:6px;margin-bottom:14px;"></div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:24px;">
        ${Array.from({ length: 8 }).map(() => `<div class="ds-skeleton" style="height:80px;border-radius:16px;"></div>`).join("")}
      </div>

      <!-- Continue learning -->
      <div class="ds-skeleton" style="height:14px;width:50%;border-radius:6px;margin-bottom:14px;"></div>
      <div class="ds-skeleton" style="height:88px;border-radius:18px;margin-bottom:24px;"></div>

      <!-- Quiz card -->
      <div class="ds-skeleton" style="height:14px;width:60%;border-radius:6px;margin-bottom:14px;"></div>
      <div class="ds-skeleton" style="height:160px;border-radius:18px;"></div>
    </div>
  `;
}

/**
 * List page skeleton (Subjects, Chapters, etc.)
 */
export function listSkeleton(count = 5, itemHeight = "80px") {
  return `
    <div style="padding:0;">
      ${Array.from({ length: count }).map(() => `
        <div class="ds-skeleton" style="height:${itemHeight};border-radius:14px;margin-bottom:10px;"></div>
      `).join("")}
    </div>
  `;
}

/**
 * Card grid skeleton (Departments)
 */
export function cardGridSkeleton(count = 6) {
  return `
    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;">
      ${Array.from({ length: count }).map(() => `
        <div class="ds-skeleton" style="height:130px;border-radius:18px;"></div>
      `).join("")}
    </div>
  `;
}

/**
 * Chapter list skeleton (accordion style)
 */
export function chapterListSkeleton(count = 5) {
  return `
    <div style="display:flex;flex-direction:column;gap:10px;">
      ${Array.from({ length: count }).map(() => `
        <div class="ds-skeleton" style="height:64px;border-radius:14px;"></div>
      `).join("")}
    </div>
  `;
}

/**
 * Content view skeleton (with tabs)
 */
export function contentSkeleton() {
  return `
    <div>
      <!-- Chapter hero -->
      <div class="ds-skeleton" style="height:100px;border-radius:18px;margin-bottom:16px;"></div>

      <!-- Tabs -->
      <div style="display:flex;gap:8px;margin-bottom:16px;">
        ${Array.from({ length: 4 }).map(() => `<div class="ds-skeleton" style="height:40px;width:90px;border-radius:999px;"></div>`).join("")}
      </div>

      <!-- Content cards -->
      ${Array.from({ length: 3 }).map(() => `
        <div class="ds-skeleton" style="height:140px;border-radius:16px;margin-bottom:12px;"></div>
      `).join("")}
    </div>
  `;
}

/**
 * Notices skeleton
 */
export function noticesSkeleton(count = 4) {
  return `
    <div style="display:flex;flex-direction:column;gap:12px;">
      ${Array.from({ length: count }).map(() => `
        <div class="ds-skeleton" style="height:130px;border-radius:18px;"></div>
      `).join("")}
    </div>
  `;
}

// ═══════════════════════════════════════════
// INJECT GLOBAL STYLES (once)
// ═══════════════════════════════════════════
export function injectSkeletonStyles() {
  if (document.getElementById("ds-skeleton-styles")) return;

  const style = document.createElement("style");
  style.id = "ds-skeleton-styles";
  style.textContent = `
    .ds-skeleton {
      background: linear-gradient(
        90deg,
        #E8EFE8 0%,
        #F2F5F2 50%,
        #E8EFE8 100%
      );
      background-size: 200% 100%;
      animation: ds-skeleton-shimmer 1.4s ease-in-out infinite;
    }

    [data-theme="dark"] .ds-skeleton {
      background: linear-gradient(
        90deg,
        #1F2E24 0%,
        #2A3E31 50%,
        #1F2E24 100%
      );
      background-size: 200% 100%;
    }

    @keyframes ds-skeleton-shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `;
  document.head.appendChild(style);
}

// Auto-inject on first import
injectSkeletonStyles();