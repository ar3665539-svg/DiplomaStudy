/**
 * DiplomaStudy - Semester Structure
 * ৮টা semester এর তথ্য + প্রতিটাতে কি কি subject
 * 
 * ⚠️ সব content server থেকে আসবে
 * এখানে শুধু UI structure
 */

export const semesters = [
  {
    id: 1,
    name: "1st Semester",
    banglaName: "১ম পর্ব",
    roman: "I",
    subtitle: "Foundation",
    description: "Basic Engineering Fundamentals",
    totalSubjects: 8,
    totalBooks: 8,
    isActive: true, // Content available
    icon: "🌱"
  },
  {
    id: 2,
    name: "2nd Semester",
    banglaName: "২য় পর্ব",
    roman: "II",
    subtitle: "Applied Sciences",
    description: "Applied Science & Communication",
    totalSubjects: 0,
    totalBooks: 0,
    isActive: false,
    icon: "🌿"
  },
  {
    id: 3,
    name: "3rd Semester",
    banglaName: "৩য় পর্ব",
    roman: "III",
    subtitle: "Core Concepts",
    description: "Departmental Core Subjects",
    totalSubjects: 0,
    totalBooks: 0,
    isActive: false,
    icon: "🌳"
  },
  {
    id: 4,
    name: "4th Semester",
    banglaName: "৪র্থ পর্ব",
    roman: "IV",
    subtitle: "Intermediate",
    description: "Advanced Analysis & Labs",
    totalSubjects: 0,
    totalBooks: 0,
    isActive: false,
    icon: "🌲"
  },
  {
    id: 5,
    name: "5th Semester",
    banglaName: "৫ম পর্ব",
    roman: "V",
    subtitle: "Advanced",
    description: "Advanced Engineering",
    totalSubjects: 0,
    totalBooks: 0,
    isActive: false,
    icon: "🎯"
  },
  {
    id: 6,
    name: "6th Semester",
    banglaName: "৬ষ্ঠ পর্ব",
    roman: "VI",
    subtitle: "Industrial",
    description: "Industrial Standards & Project",
    totalSubjects: 0,
    totalBooks: 0,
    isActive: false,
    icon: "🏭"
  },
  {
    id: 7,
    name: "7th Semester",
    banglaName: "৭ম পর্ব",
    roman: "VII",
    subtitle: "Specialized",
    description: "Electives & Capstone",
    totalSubjects: 0,
    totalBooks: 0,
    isActive: false,
    icon: "🚀"
  },
  {
    id: 8,
    name: "8th Semester",
    banglaName: "৮ম পর্ব",
    roman: "VIII",
    subtitle: "Industrial Attachment",
    description: "Internship & Viva",
    totalSubjects: 0,
    totalBooks: 0,
    isActive: false,
    icon: "🎓"
  }
];

/**
 * Semester ID দিয়ে semester তথ্য দেয়
 */
export function getSemesterById(id) {
  return semesters.find((s) => s.id === Number(id)) || null;
}

/**
 * কোনো semester এ books আছে কি না
 */
export function hasSemesterContent(id) {
  const sem = getSemesterById(id);
  return sem ? sem.isActive && sem.totalBooks > 0 : false;
}