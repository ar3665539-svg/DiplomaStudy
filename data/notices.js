/**
 * DiplomaStudy - Notice Center Data
 * (Sample/Demo Academic Notices based on BTEB patterns)
 */

export const notices = [
  {
    id: "not-1",
    title: "Diploma in Engineering 2026 Semester Final Exam Routine",
    banglaTitle: "ডিপ্লোমা ইন ইঞ্জিনিয়ারিং পর্ব সমাপনী পরীক্ষা ২০২৬ এর সময়সূচি",
    category: "Routine",
    date: "2026-09-12",
    pinned: true,
    description: "Bangladesh Technical Education Board (BTEB) has released the tentative schedule for 1st, 3rd, 5th, and 7th semester final theoretical examinations starting from next month.",
    source: "BTEB Examination Controller Cell",
    link: "http://bteb.gov.bd"
  },
  {
    id: "not-2",
    title: "Online Form Fill-up & Examination Fee Submission Notice",
    banglaTitle: "পরীক্ষার ফরম পূরণ ও ফি জমাদান সংক্রান্ত জরুরি বিজ্ঞপ্তি",
    category: "Exam",
    date: "2026-09-08",
    pinned: true,
    description: "Students must complete their course registration and pay the requisite examination fees via Polytechnic e-portal before the deadline of 28th September 2026.",
    source: "Academic Affairs Division",
    link: "http://bteb.gov.bd"
  },
  {
    id: "not-3",
    title: "Publication of Re-scrutiny & Retake Results for Even Semesters",
    banglaTitle: "খাতা পুনঃনিরীক্ষণ ও ইম্প্রুভমেন্ট পরীক্ষার ফলাফল প্রকাশ",
    category: "Result",
    date: "2026-08-30",
    pinned: false,
    description: "Results of 2nd, 4th, 6th, and 8th semester re-scrutiny applications have been uploaded to the BTEB official results server.",
    source: "BTEB Result Publication Cell",
    link: "http://bteb.gov.bd"
  },
  {
    id: "not-4",
    title: "Government Stipend (DTE) Beneficiary List Confirmation",
    banglaTitle: "কারিগরি শিক্ষা অধিদপ্তর উপবৃত্তি তালিকা যাচাই",
    category: "Scholarship",
    date: "2026-08-22",
    pinned: false,
    description: "All enrolled polytechnic students eligible for technical education merit allowances must verify their bank/mobile financial account numbers with college authorities.",
    source: "Directorate of Technical Education (DTE)",
    link: "http://techedu.gov.bd"
  },
  {
    id: "not-5",
    title: "8th Semester Industrial Training Placement Guidelines 2026",
    banglaTitle: "৮ম পর্বের ইন্ডাস্ট্রিয়াল ট্রেনিং বা ইন্টার্নশিপ নির্দেশিকা",
    category: "Academic",
    date: "2026-08-15",
    pinned: false,
    description: "Instructions for selecting certified industries, submitting log books, weekly supervisor reports, and final viva voce schedule.",
    source: "Polytechnic Industrial Attachment Bureau",
    link: "http://bteb.gov.bd"
  }
];

export function getNoticesByCategory(category) {
  if (!category || category === "All") return notices;
  return notices.filter((n) => n.category === category);
}
