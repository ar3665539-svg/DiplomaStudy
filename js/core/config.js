/**
 * DiplomaStudy - App Configuration
 */

export const APP_CONFIG = {
  name: "DiplomaStudy",
  tagline: "Learn Smart. Prepare Better.",
  version: "2.0.0",
  supportEmail: "support@diplomastudy.app",
  website: "https://diplomastudy.app",

  // Cache settings
  cacheMaxAgeMs: 24 * 60 * 60 * 1000,       // 24 hours
  apiTimeoutMs: 15000,                       // 15 seconds

  // Feature flags
  features: {
    realtime: true,
    offlineMode: true,
    darkMode: true,
    quiz: true,
    bookmarks: true,
    progress: true,
    notes: true,
    planner: true,
    timer: true,
    aiTutor: false,        // Future
    jobs: false,           // Future
    discussion: false      // Future
  },

  // Pagination
  defaultPageSize: 20,
  maxSearchResults: 50,

  // UI
  toastDuration: 3000,
  skeletonRows: 5,
  maxContentWidth: 680,
  bottomNavHeight: 64,
  headerHeight: 56
};

export default APP_CONFIG;