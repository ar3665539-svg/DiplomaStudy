/**
 * DiplomaStudy - Empty State Component
 * সব "content নেই" অবস্থার জন্য একই design
 */

export const EmptyState = {
  render({
    icon = "📭",
    title = "Content Not Available",
    banglaTitle = "কনটেন্ট এখনো আসেনি",
    message = "Server থেকে content যুক্ত হলে এখানে দেখা যাবে।",
    showBadge = true
  } = {}) {
    return `
      <div class="empty-state-box">
        ${showBadge ? `<span class="badge badge-sage empty-badge">🔒 Coming Soon</span>` : ""}
        <div class="empty-icon-circle">${icon}</div>
        <h3 class="empty-heading">${title}</h3>
        <p class="empty-bangla">${banglaTitle}</p>
        <p class="empty-message">${message}</p>
      </div>
    `;
  }
};