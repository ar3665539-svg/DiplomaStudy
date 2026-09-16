/**
 * DiplomaStudy - Civil Technology 1st Semester Subjects
 * শুধু Civil Engineering 1st Semester এর ৮টি বিষয়
 * Content server থেকে আসবে, এখানে শুধু metadata
 */

export const CIVIL_DEPARTMENT = {
  id: "civil",
  name: "Civil Technology",
  shortName: "Civil",
  banglaName: "সিভিল টেকনোলজি",
  icon: "🏗️",
  semesterId: 1,
  semesterName: "1st Semester",
  semesterBangla: "১ম পর্ব"
};

export const civilSubjects = [
  {
    id: "math-1",
    name: "Mathematics - 1",
    banglaName: "গণিত - ১",
    code: "65911",
    icon: "📐",
    type: "Theory",
    credits: 4,
    description: "Algebra, Trigonometry, Matrices, Vectors, Coordinate Geometry",
    banglaDesc: "বীজগণিত, ত্রিকোণমিতি, ম্যাট্রিক্স, ভেক্টর, স্থানাঙ্ক জ্যামিতি"
  },
  {
    id: "bangla-1",
    name: "Bangla - 1",
    banglaName: "বাংলা - ১",
    code: "65711",
    icon: "📖",
    type: "Theory",
    credits: 3,
    description: "Bangla Literature, Grammar, Composition, Essay Writing",
    banglaDesc: "বাংলা সাহিত্য, ব্যাকরণ, রচনা, প্রবন্ধ"
  },
  {
    id: "english-1",
    name: "English - 1",
    banglaName: "ইংরেজি - ১",
    code: "65712",
    icon: "🗣️",
    type: "Theory",
    credits: 3,
    description: "Grammar, Reading, Writing, Technical English Communication",
    banglaDesc: "ব্যাকরণ, পড়া, লেখা, কারিগরি ইংরেজি"
  },
  {
    id: "chemistry",
    name: "Chemistry",
    banglaName: "রসায়ন",
    code: "65913",
    icon: "🧪",
    type: "Theory + Lab",
    credits: 4,
    description: "Atomic Structure, Chemical Bonds, Acids, Bases, Electrochemistry",
    banglaDesc: "পারমাণবিক গঠন, রাসায়নিক বন্ধন, অ্যাসিড, ক্ষার, তড়িৎ রসায়ন"
  },
  {
    id: "basic-elec",
    name: "Basic Electricity",
    banglaName: "বেসিক ইলেকট্রিসিটি",
    code: "66711",
    icon: "⚡",
    type: "Theory + Lab",
    credits: 3,
    description: "Ohm's Law, DC Circuits, Resistance, Magnetism, AC Fundamentals",
    banglaDesc: "ওহমের সূত্র, ডিসি সার্কিট, রোধ, চুম্বকত্ব, এসি বেসিক"
  },
  {
    id: "civil-drawing",
    name: "Civil Engineering Drawing",
    banglaName: "সিভিল ইঞ্জিনিয়ারিং ড্রয়িং",
    code: "66411",
    icon: "✏️",
    type: "Practical",
    credits: 3,
    description: "Geometric Drawing, Orthographic Projection, Building Plan, Section",
    banglaDesc: "জ্যামিতিক অঙ্কন, অর্থোগ্রাফিক প্রজেকশন, বিল্ডিং প্ল্যান, সেকশন"
  },
  {
    id: "materials",
    name: "Construction Materials",
    banglaName: "নির্মাণ সামগ্রী",
    code: "66412",
    icon: "🧱",
    type: "Theory + Lab",
    credits: 4,
    description: "Bricks, Cement, Sand, Stone, Steel, Timber, Mortar, Concrete",
    banglaDesc: "ইট, সিমেন্ট, বালি, পাথর, ইস্পাত, কাঠ, মর্টার, কংক্রিট"
  },
  {
    id: "social-science",
    name: "Social Science",
    banglaName: "সমাজ বিজ্ঞান",
    code: "65811",
    icon: "🌏",
    type: "Theory",
    credits: 2,
    description: "Bangladesh Studies, Civics, Economics, Sociology, Environment",
    banglaDesc: "বাংলাদেশ studies, পৌরনীতি, অর্থনীতি, সমাজবিদ্যা, পরিবেশ"
  }
];

export function getCivilSubjectById(id) {
  return civilSubjects.find((s) => s.id === id) || null;
}