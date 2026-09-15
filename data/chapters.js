/**
 * DiplomaStudy - Chapters Data
 * Topic breakdown, question counts, quiz counts, and completion tracking
 */

export const chapters = [
  // Mathematics - 1 Chapters
  {
    id: "math1-ch1",
    subjectId: "math-1",
    chapterNo: 1,
    title: "Algebra of Matrices & Determinants",
    banglaTitle: "ম্যাট্রিক্স ও নির্ণায়ক",
    topics: ["Matrix operations", "Adjoint and Inverse Matrix", "Determinant properties", "Cramer's Rule"],
    importantTopics: ["Cramer's Rule solution", "Inverse matrix calculation"],
    questionsCount: 24,
    quizCount: 15,
    completionPercentage: 80,
    savedQuestions: 4,
    lastStudied: "2 days ago"
  },
  {
    id: "math1-ch2",
    subjectId: "math-1",
    chapterNo: 2,
    title: "Vectors & Scalar Products",
    banglaTitle: "ভেক্টর ও স্কেলার গুণন",
    topics: ["Dot product", "Cross product", "Unit vector", "Work and torque by vectors"],
    importantTopics: ["Angle between two vectors", "Perpendicular and parallel vectors"],
    questionsCount: 20,
    quizCount: 12,
    completionPercentage: 65,
    savedQuestions: 2,
    lastStudied: "3 days ago"
  },
  {
    id: "math1-ch3",
    subjectId: "math-1",
    chapterNo: 3,
    title: "Trigonometric Ratios of Compound Angles",
    banglaTitle: "যৌগিক কোণের ত্রিকোণমিতিক অনুপাত",
    topics: ["sin(A±B) & cos(A±B)", "Transformation of products to sums", "Multiple and submultiple angles"],
    importantTopics: ["Identities proof", "Maximum & minimum values"],
    questionsCount: 28,
    quizCount: 18,
    completionPercentage: 50,
    savedQuestions: 3,
    lastStudied: "5 days ago"
  },

  // Basic Electricity Chapters
  {
    id: "elec-ch1",
    subjectId: "basic-elec",
    chapterNo: 1,
    title: "Electricity & Ohm's Law",
    banglaTitle: "বিদ্যুৎ ও ওহমের সূত্র",
    topics: ["Nature of electricity", "Current, Voltage, Resistance", "Ohm's law limitation and proof", "Specific resistance"],
    importantTopics: ["Ohm's law verification", "Specific resistance numerical problems"],
    questionsCount: 30,
    quizCount: 20,
    completionPercentage: 90,
    savedQuestions: 5,
    lastStudied: "Yesterday"
  },
  {
    id: "elec-ch2",
    subjectId: "basic-elec",
    chapterNo: 2,
    title: "Kirchhoff's Laws & Network Theorems",
    banglaTitle: "কার্শফের সূত্র ও সার্কিট সমাধান",
    topics: ["Kirchhoff's Current Law (KCL)", "Kirchhoff's Voltage Law (KVL)", "Mesh analysis", "Wheatstone Bridge"],
    importantTopics: ["Wheatstone Bridge balance condition", "Loop equation solving"],
    questionsCount: 26,
    quizCount: 14,
    completionPercentage: 75,
    savedQuestions: 3,
    lastStudied: "4 days ago"
  },
  {
    id: "elec-ch3",
    subjectId: "basic-elec",
    chapterNo: 3,
    title: "Electromagnetism & Induction",
    banglaTitle: "তড়িৎ চুম্বকত্ব ও আবেশ",
    topics: ["Magnetic field lines", "Faraday's laws of electromagnetic induction", "Lenz's law", "Self and Mutual inductance"],
    importantTopics: ["Faraday's formula derivation", "Lenz's law directional proof"],
    questionsCount: 22,
    quizCount: 12,
    completionPercentage: 60,
    savedQuestions: 2,
    lastStudied: "1 week ago"
  },

  // Computer Programming (C) Chapters
  {
    id: "c-ch1",
    subjectId: "cst-prog-c",
    chapterNo: 1,
    title: "Basics of C, Tokens & Data Types",
    banglaTitle: "সি প্রোগ্রামিং সূচনা ও ডেটা টাইপ",
    topics: ["Structure of a C program", "Keywords and Identifiers", "Primitive data types", "Standard I/O functions"],
    importantTopics: ["Difference between printf and scanf", "Sizeof operator usage"],
    questionsCount: 25,
    quizCount: 15,
    completionPercentage: 95,
    savedQuestions: 4,
    lastStudied: "Today"
  },
  {
    id: "c-ch2",
    subjectId: "cst-prog-c",
    chapterNo: 2,
    title: "Control Flow: Conditionals & Loops",
    banglaTitle: "কন্ডিশনাল স্টেটমেন্ট ও লুপ",
    topics: ["if-else and nested if", "switch-case", "for, while, do-while loops", "break and continue"],
    importantTopics: ["Prime number check program", "Fibonacci sequence generation"],
    questionsCount: 32,
    quizCount: 18,
    completionPercentage: 85,
    savedQuestions: 6,
    lastStudied: "Yesterday"
  },
  {
    id: "c-ch3",
    subjectId: "cst-prog-c",
    chapterNo: 3,
    title: "Arrays & Functions in C",
    banglaTitle: "অ্যারে ও ফাংশন",
    topics: ["1D & 2D arrays", "Matrix addition in C", "User defined functions", "Recursion concepts"],
    importantTopics: ["Factorial calculation using recursion", "Array sorting logic"],
    questionsCount: 28,
    quizCount: 16,
    completionPercentage: 70,
    savedQuestions: 3,
    lastStudied: "3 days ago"
  },

  // Structural Mechanics (Civil) Chapters
  {
    id: "sm-ch1",
    subjectId: "civil-struct-mech",
    chapterNo: 1,
    title: "Simple Stress and Strain",
    banglaTitle: "সরল পীড়ন ও বিকৃতি",
    topics: ["Tensile, compressive, and shear stress", "Hooke's law & Young's Modulus", "Poisson's ratio", "Thermal stresses"],
    importantTopics: ["Stress-strain curve of mild steel", "Composite bar elongation"],
    questionsCount: 25,
    quizCount: 14,
    completionPercentage: 75,
    savedQuestions: 4,
    lastStudied: "2 days ago"
  },
  {
    id: "sm-ch2",
    subjectId: "civil-struct-mech",
    chapterNo: 2,
    title: "Shear Force & Bending Moment (SFD/BMD)",
    banglaTitle: "শিয়ার ফোর্স ও বেন্ডিং মোমেন্ট ডায়াগ্রাম",
    topics: ["Types of beams and loads", "Point of contraflexure", "SFD & BMD of simply supported beams", "Cantilever beam diagrams"],
    importantTopics: ["Simply supported beam with UDL & point load", "Contraflexure calculation"],
    questionsCount: 35,
    quizCount: 20,
    completionPercentage: 60,
    savedQuestions: 5,
    lastStudied: "4 days ago"
  }
];

export function getChaptersBySubjectId(subjectId) {
  return chapters.filter((c) => c.subjectId === subjectId);
}

export function getChapterById(id) {
  return chapters.find((c) => c.id === id) || chapters[0];
}
