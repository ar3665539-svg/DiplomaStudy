/**
 * DiplomaStudy - Loader Component
 */

export const Loader = {
  render(text = "Loading study materials...") {
    return `
      <div class="flex flex-col items-center justify-center p-xl" style="min-height: 200px;">
        <div class="spinner"></div>
        <p class="text-xs text-muted" style="margin-top: 10px;">${text}</p>
      </div>
    `;
  }
};
