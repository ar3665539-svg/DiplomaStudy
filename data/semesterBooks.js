/**
 * DiplomaStudy - Semester Books
 * প্রতিটা semester এ কি কি book/subject আছে
 * 
 * ⚠️ server থেকে আসবে, এখানে শুধু structure
 * civilSubjects.js থেকে 1st semester এর data reuse করা হচ্ছে
 */

import { civilSubjects } from "./civilSubjects.js";

/**
 * Semester ID অনুযায়ী books list দেয়
 * @param {number} semesterId 
 * @returns {Array}
 */
export function getBooksBySemester(semesterId) {
  // 1st semester এ books আছে
  if (Number(semesterId) === 1) {
    return civilSubjects.map((sub) => ({
      id: sub.id,
      name: sub.name,
      banglaName: sub.banglaName,
      code: sub.code,
      icon: sub.icon,
      type: sub.type,
      credits: sub.credits,
      description: sub.description,
      pdfUrl: null, // Server থেকে আসবে
      hasPdf: false
    }));
  }

  // বাকি semester এ এখনো content নেই
  return [];
}

/**
 * কোনো semester এ কতগুলো book আছে
 */
export function getBookCountBySemester(semesterId) {
  return getBooksBySemester(semesterId).length;
}