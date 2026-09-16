/**
 * DiplomaStudy - Coming Soon Features Directory
 * Civil 1st Semester এর বাইরে সব feature লকড
 */

export const comingSoonFeatures = [
  { id: "notes",     title: "Notes",           banglaTitle: "নোটস",            icon: "📝", description: "Personal study notes" },
  { id: "bookmarks", title: "Saved",           banglaTitle: "সেভ করা",          icon: "⭐", description: "Bookmarked items" },
  { id: "quiz",      title: "Quiz",            banglaTitle: "কুইজ",            icon: "🎯", description: "Practice tests" },
  { id: "pdfs",      title: "PDF Library",     banglaTitle: "পিডিএফ লাইব্রেরি", icon: "📄", description: "Books & handouts" },
  { id: "planner",   title: "Study Planner",   banglaTitle: "স্টাডি প্ল্যানার",  icon: "📅", description: "Daily task schedule" },
  { id: "timer",     title: "Focus Timer",     banglaTitle: "ফোকাস টাইমার",     icon: "⏱️", description: "Pomodoro timer" },
  { id: "progress",  title: "Progress",        banglaTitle: "অগ্রগতি",          icon: "📊", description: "Study analytics" },
  { id: "formula",   title: "Formulas",        banglaTitle: "সূত্রাবলী",         icon: "📐", description: "Engineering formulas" },
  { id: "jobs",      title: "Jobs & Internship", banglaTitle: "চাকরি ও ইন্টার্ন", icon: "💼", description: "Career circulars" },
  { id: "notices",   title: "Notice Center",   banglaTitle: "নোটিশ সেন্টার",    icon: "📢", description: "BTEB notices" },
  { id: "ai",        title: "AI Study Tutor",  banglaTitle: "এআই টিউটর",       icon: "🤖", description: "Ask questions" },
  { id: "tools",     title: "Student Tools",   banglaTitle: "স্টুডেন্ট টুলস",    icon: "🧮", description: "CGPA calculator etc." },
  { id: "settings",  title: "Settings",        banglaTitle: "সেটিংস",           icon: "⚙️", description: "Preferences & backup" }
];

/**
 * Subject-specific features (locked inside subject detail)
 * ⚠️ IMPORTANT: এখানে "chapters" entry নেই — কারণ chapters এর জন্য আলাদা accordion আছে
 */
export const subjectFeatures = [
  { id: "questions",   title: "Questions",      banglaTitle: "প্রশ্নাবলী",      icon: "❓", description: "Question bank" },
  { id: "suggestions", title: "Suggestions",    banglaTitle: "সাজেশন",         icon: "💡", description: "Important topics" },
  { id: "pdfs",        title: "PDF Notes",      banglaTitle: "পিডিএফ নোট",      icon: "📄", description: "Hand notes & books" },
  { id: "quiz",        title: "Quiz",           banglaTitle: "কুইজ",           icon: "🎯", description: "Practice MCQ" },
  { id: "formulas",    title: "Formulas",       banglaTitle: "সূত্রাবলী",       icon: "📐", description: "Subject formulas" }
];