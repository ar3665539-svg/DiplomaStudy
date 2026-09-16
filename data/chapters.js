/**
 * DiplomaStudy - All Subject Chapters
 * Civil 1st Semester - সব বিষয়ের chapter list এক জায়গায়
 *
 * নতুন subject যোগ করতে:
 * ১. উপরে import করুন
 * ২. getChaptersBySubject() function এর switch-case এ যোগ করুন
 * ৩. Done! SubjectDetail.js auto detect করবে
 */

import { math1Chapters } from "./mathChapters.js";
import { chemistryChapters } from "./chemistryChapters.js";
import { materialsChapters } from "./materialsChapters.js";

/**
 * Subject ID অনুযায়ী chapter list দেয়
 * @param {string} subjectId - Subject এর unique ID
 * @returns {Array} chapter array (খালি array যদি subject না থাকে)
 */
export function getChaptersBySubject(subjectId) {
  switch (subjectId) {
    // ═══════════════════════════════════════════
    // ১. Mathematics - 1 (১৫টি chapter)
    // ═══════════════════════════════════════════
    case "math-1":
      return math1Chapters;

    // ═══════════════════════════════════════════
    // ২. Chemistry (১৫টি chapter)
    // ═══════════════════════════════════════════
    case "chemistry":
      return chemistryChapters;

    // ═══════════════════════════════════════════
    // ৩. Construction Materials (১২টি chapter)
    // ═══════════════════════════════════════════
    case "materials":
      return materialsChapters;

    // ═══════════════════════════════════════════
    // ভবিষ্যতে যোগ হবে:
    // ═══════════════════════════════════════════
    // case "bangla-1":
    //   return banglaChapters;
    //
    // case "english-1":
    //   return englishChapters;
    //
    // case "basic-elec":
    //   return basicElectricityChapters;
    //
    // case "civil-drawing":
    //   return civilDrawingChapters;
    //
    // case "social-science":
    //   return socialScienceChapters;

    // ═══════════════════════════════════════════
    // Unknown subject → empty (Coming Soon দেখাবে)
    // ═══════════════════════════════════════════
    default:
      return [];
  }
}

/**
 * কোনো subject এ কতগুলো chapter আছে সেটা দেয়
 * Home page এ badge বা count দেখানোর জন্য
 * @param {string} subjectId
 * @returns {number} chapter count
 */
export function getChapterCountForSubject(subjectId) {
  return getChaptersBySubject(subjectId).length;
}

/**
 * কোনো subject এ chapter আছে কি না
 * @param {string} subjectId
 * @returns {boolean}
 */
export function hasChapters(subjectId) {
  return getChaptersBySubject(subjectId).length > 0;
}