/**
 * DiplomaStudy - PDF Library Data
 * Curated open educational reference documents & sample handouts
 */

export const pdfs = [
  {
    id: "pdf-elec-handnote",
    title: "Basic Electricity - Complete Hand Notes (Bangla)",
    banglaTitle: "বেসিক ইলেকট্রিসিটি হ্যান্ড নোট ও সার্কিট সমাধান",
    category: "Hand Notes",
    departmentId: "electrical",
    semesterId: 1,
    subjectId: "basic-elec",
    subjectName: "Basic Electricity",
    pages: 48,
    fileSize: "3.4 MB",
    downloads: 1420,
    author: "Dept. of Electrical, Dhaka Polytechnic",
    url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
  {
    id: "pdf-math1-formulas",
    title: "Mathematics-1 Formula Sheet & Board Solutions",
    banglaTitle: "ম্যাথমেটিক্স-১ এর সকল সূত্র ও বোর্ড সমাধান",
    category: "Notes",
    departmentId: "all",
    semesterId: 1,
    subjectId: "math-1",
    subjectName: "Mathematics - 1",
    pages: 32,
    fileSize: "2.1 MB",
    downloads: 2890,
    author: "Mathematics Faculty Forum",
    url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
  {
    id: "pdf-c-labmanual",
    title: "Computer Programming (C) - Lab Manual with 30 Programs",
    banglaTitle: "সি প্রোগ্রামিং ল্যাব ম্যানুয়াল (৩০টি এক্সপেরিমেন্ট)",
    category: "Lab Manual",
    departmentId: "computer",
    semesterId: 2,
    subjectId: "cst-prog-c",
    subjectName: "Computer Programming (C)",
    pages: 56,
    fileSize: "4.8 MB",
    downloads: 1950,
    author: "Polytechnic CST Instructors Team",
    url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
  {
    id: "pdf-civil-sfd-guide",
    title: "Structural Mechanics - SFD & BMD Step-by-Step Guide",
    banglaTitle: "স্ট্রাকচারাল মেকানিক্স এসএফডি ও বিএমডি সমাধান গাইড",
    category: "Notes",
    departmentId: "civil",
    semesterId: 3,
    subjectId: "civil-struct-mech",
    subjectName: "Structural Mechanics",
    pages: 40,
    fileSize: "3.1 MB",
    downloads: 2310,
    author: "Civil Engineering Research Group",
    url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
  {
    id: "pdf-bteb-syllabus-general",
    title: "BTEB 1st & 2nd Semester Foundation Syllabus Outline",
    banglaTitle: "১ম ও ২য় পর্ব কারিকুলাম ও সিলেবাস গাইডলাইন",
    category: "Syllabus",
    departmentId: "all",
    semesterId: 1,
    subjectId: "all",
    subjectName: "General Foundation",
    pages: 24,
    fileSize: "1.9 MB",
    downloads: 3400,
    author: "Educational Standards Council",
    url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
  {
    id: "pdf-board-questions-2023",
    title: "BTEB Board Exam Question Archive (2020-2023 Sample)",
    banglaTitle: "বিগত সালের বোর্ড প্রশ্ন সমাধান সংকলন",
    category: "Board Questions",
    departmentId: "all",
    semesterId: 1,
    subjectId: "basic-elec",
    subjectName: "Basic Electricity",
    pages: 64,
    fileSize: "5.2 MB",
    downloads: 4120,
    author: "Diploma Alumni Association",
    url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
  {
    id: "pdf-model-test-elec",
    title: "Semester Final Model Test Papers with Marking Scheme",
    banglaTitle: "মডেল টেস্ট পেপার ও মার্কিং স্কিম",
    category: "Model Test",
    departmentId: "electrical",
    semesterId: 1,
    subjectId: "basic-elec",
    subjectName: "Basic Electricity",
    pages: 18,
    fileSize: "1.5 MB",
    downloads: 870,
    author: "Academic Evaluation Cell",
    url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  }
];

export function getPdfsByCategory(category) {
  if (!category || category === "All") return pdfs;
  return pdfs.filter((p) => p.category === category);
}
