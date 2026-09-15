/**
 * DiplomaStudy - Suggestions Data
 * Super Suggestions categorized by priority and exam readiness
 */

export const suggestions = [
  {
    id: "sug-1",
    title: "Ohm's Law & Verification Conditions",
    banglaTitle: "ওহমের সূত্র ও সীমাবদ্ধতা",
    category: "Most Important",
    categoryBadge: "99% Common",
    subjectId: "basic-elec",
    subjectName: "Basic Electricity",
    chapterId: "elec-ch1",
    chapterName: "Electricity & Ohm's Law",
    departmentId: "electrical",
    summary: "State Ohm's Law and explain the physical parameters (temperature, conductor dimensions) required for verification.",
    examTip: "Frequently asked as a 4-mark short question in Section B of BTEB semester finals.",
    linkedQuestionId: "q-elec-1"
  },
  {
    id: "sug-2",
    title: "Balanced Condition of Wheatstone Bridge (P/Q = R/S)",
    banglaTitle: "হুইটস্টোন ব্রিজের সাম্যাবস্থার প্রমাণ",
    category: "Most Important",
    categoryBadge: "Board Top",
    subjectId: "basic-elec",
    subjectName: "Basic Electricity",
    chapterId: "elec-ch2",
    chapterName: "Kirchhoff's Laws & Network Theorems",
    departmentId: "electrical",
    summary: "Derive the mathematical relationship for galvanometer null deflection using Kirchhoff's rules.",
    examTip: "Draw the neat schematic circuit diagram with clear branch current arrows to secure full 6 marks.",
    linkedQuestionId: "q-elec-4"
  },
  {
    id: "sug-3",
    title: "C Program to Check Prime Number",
    banglaTitle: "মৌলিক সংখ্যা নির্ণয়ের সি কোড",
    category: "Exam Preparation",
    categoryBadge: "Practical & Theory",
    subjectId: "cst-prog-c",
    subjectName: "Computer Programming (C)",
    chapterId: "c-ch2",
    chapterName: "Control Flow: Conditionals & Loops",
    departmentId: "computer",
    summary: "Write and trace the loop logic for prime number determination up to square root of n.",
    examTip: "Remember to handle edge cases where n <= 1.",
    linkedQuestionId: "q-c-3"
  },
  {
    id: "sug-4",
    title: "Solve 3-Variable Linear Equations by Cramer's Rule",
    banglaTitle: "ক্রেমারের নিয়মে সমীকরণ জোট সমাধান",
    category: "Last Minute Revision",
    categoryBadge: "Formula Heavy",
    subjectId: "math-1",
    subjectName: "Mathematics - 1",
    chapterId: "math1-ch1",
    chapterName: "Algebra of Matrices & Determinants",
    departmentId: "all",
    summary: "Standard matrix determinants D, Dx, Dy, Dz evaluation and variable extraction.",
    examTip: "Always double-check arithmetic signs (+/-) when expanding along the first row of determinant.",
    linkedQuestionId: "q-math-3"
  },
  {
    id: "sug-5",
    title: "Point of Contraflexure in Simply Supported Beams",
    banglaTitle: "বিমে পয়েন্ট অব কন্ট্রাফ্লেক্সার নির্ণয়",
    category: "Very Important",
    categoryBadge: "Civil Core",
    subjectId: "civil-struct-mech",
    subjectName: "Structural Mechanics",
    chapterId: "sm-ch2",
    chapterName: "Shear Force & Bending Moment (SFD/BMD)",
    departmentId: "civil",
    summary: "Explanation of inflection curvature and calculating x distance where M(x) = 0 on bending diagrams.",
    examTip: "Accompany your answer with a neat sketch showing positive sagging and negative hogging transitions.",
    linkedQuestionId: "q-sm-2"
  },
  {
    id: "sug-6",
    title: "Stress-Strain Diagram of Mild Steel",
    banglaTitle: "মাইল্ড স্টিলের পীড়ন-বিকৃতি ডায়াগ্রাম",
    category: "Chapter-wise Suggestion",
    categoryBadge: "Concept",
    subjectId: "civil-struct-mech",
    subjectName: "Structural Mechanics",
    chapterId: "sm-ch1",
    chapterName: "Simple Stress and Strain",
    departmentId: "civil",
    summary: "Marking proportional limit, elastic limit, upper/lower yield points, ultimate strength, and breaking point.",
    examTip: "Clear labeling of all 6 characteristic points on the curve is critical.",
    linkedQuestionId: "q-sm-1"
  }
];

export function getSuggestionsByCategory(category) {
  if (!category || category === "All") return suggestions;
  return suggestions.filter((s) => s.category === category);
}
