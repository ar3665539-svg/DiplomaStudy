/**
 * DiplomaStudy - Semesters Data
 * 1st to 8th Semester Structure
 */

export const semesters = [
  {
    id: 1,
    name: "1st Semester",
    roman: "I",
    bangla: "১ম পর্ব",
    focus: "Basic Engineering Fundamentals, Mathematics-1 & Physics-1",
    totalCredits: 20
  },
  {
    id: 2,
    name: "2nd Semester",
    roman: "II",
    bangla: "২য় পর্ব",
    focus: "Applied Sciences, Engineering Drawing & English Communication",
    totalCredits: 21
  },
  {
    id: 3,
    name: "3rd Semester",
    roman: "III",
    bangla: "৩য় পর্ব",
    focus: "Core Departmental Concepts & Introductory Specialization",
    totalCredits: 22
  },
  {
    id: 4,
    name: "4th Semester",
    roman: "IV",
    bangla: "৪র্থ পর্ব",
    focus: "Intermediate Engineering Analysis, Labs & Design",
    totalCredits: 22
  },
  {
    id: 5,
    name: "5th Semester",
    roman: "V",
    bangla: "৫ম পর্ব",
    focus: "Advanced Departmental Engineering & Applied Laboratories",
    totalCredits: 23
  },
  {
    id: 6,
    name: "6th Semester",
    roman: "VI",
    bangla: "৬ষ্ঠ পর্ব",
    focus: "Industrial Standards, Project Management & Estimation",
    totalCredits: 23
  },
  {
    id: 7,
    name: "7th Semester",
    roman: "VII",
    bangla: "৭ম পর্ব",
    focus: "Specialized Electives, Capstone Project & Innovation",
    totalCredits: 22
  },
  {
    id: 8,
    name: "8th Semester",
    roman: "VIII",
    bangla: "৮ম পর্ব",
    focus: "Industrial Attachment / Internship & Viva Voce",
    totalCredits: 18
  }
];

export function getSemesterById(id) {
  const num = parseInt(id, 10);
  return semesters.find((s) => s.id === num) || semesters[0];
}
