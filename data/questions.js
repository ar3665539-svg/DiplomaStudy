/**
 * DiplomaStudy - Question Bank Data
 * MCQ, Short, Creative/Descriptive, and Board Questions with explanations
 * (Label: Sample / Demo Examination Bank for study preparation)
 */

export const questions = [
  // Basic Electricity Questions
  {
    id: "q-elec-1",
    departmentId: "electrical",
    semesterId: 1,
    subjectId: "basic-elec",
    chapterId: "elec-ch1",
    type: "mcq",
    question: "According to Ohm's Law, what is the relation between voltage (V), current (I), and resistance (R)?",
    questionBangla: "ওহমের সূত্র অনুযায়ী ভোল্টেজ (V), কারেন্ট (I) এবং রেজিস্ট্যান্স (R)-এর মধ্যে সম্পর্ক কোনটি?",
    options: ["V = I × R", "I = V × R", "R = V × I", "V = I / R"],
    answer: "V = I × R",
    explanation: "Ohm's law states that the current through a conductor between two points is directly proportional to the voltage across the two points, provided physical conditions (like temperature) remain constant. Therefore, V = I × R.",
    year: "2023",
    board: "BTEB",
    difficulty: "Easy",
    important: true,
    category: "Board Question"
  },
  {
    id: "q-elec-2",
    departmentId: "electrical",
    semesterId: 1,
    subjectId: "basic-elec",
    chapterId: "elec-ch1",
    type: "short",
    question: "Define Specific Resistance (Resistivity) and state its SI unit.",
    questionBangla: "আপেক্ষিক রোধ (Resistivity) কাকে বলে? এর এস.আই একক কী?",
    options: [],
    answer: "Specific resistance (ρ) is the resistance offered by a conductor of unit length and unit cross-sectional area. Its mathematical formula is ρ = (R × A) / L. The SI unit of specific resistance is Ohm-meter (Ω·m).",
    explanation: "Resistivity is an intrinsic property of a material measuring how strongly it opposes electric current.",
    year: "2022",
    board: "BTEB",
    difficulty: "Medium",
    important: true,
    category: "Important Question"
  },
  {
    id: "q-elec-3",
    departmentId: "electrical",
    semesterId: 1,
    subjectId: "basic-elec",
    chapterId: "elec-ch2",
    type: "mcq",
    question: "Kirchhoff's Current Law (KCL) is based on the law of conservation of which quantity?",
    questionBangla: "কার্শফের কারেন্ট সূত্র (KCL) নিচের কোনটির সংরক্ষণশীলতার নীতির উপর প্রতিষ্ঠিত?",
    options: ["Charge (চার্জ)", "Energy (শক্তি)", "Momentum (ভরবেগ)", "Mass (ভর)"],
    answer: "Charge (চার্জ)",
    explanation: "KCL states that the algebraic sum of currents entering any electrical node is zero (ΣI = 0). This is a direct consequence of the conservation of electric charge.",
    year: "2021",
    board: "BTEB",
    difficulty: "Easy",
    important: true,
    category: "Board Question"
  },
  {
    id: "q-elec-4",
    departmentId: "electrical",
    semesterId: 1,
    subjectId: "basic-elec",
    chapterId: "elec-ch2",
    type: "creative",
    question: "Explain the balanced condition of a Wheatstone Bridge circuit and derive the condition P/Q = R/S.",
    questionBangla: "হুইটস্টোন ব্রিজের সাম্যাবস্থার শর্ত ব্যাখ্যা করুন এবং P/Q = R/S সম্পর্কটি প্রতিপাদন করুন।",
    options: [],
    answer: "A Wheatstone Bridge is considered balanced when no current flows through the galvanometer connected between junctions B and D (Ig = 0). At this state, the potential at B equals the potential at D (VB = VD). By applying Ohm's Law and KCL to the bridge arms, we derive: I1·P = I2·R and I1·Q = I2·S. Dividing the two equations yields P/Q = R/S.",
    explanation: "This principle is widely used in precision resistance measurement and strain gauge sensors.",
    year: "2020",
    board: "BTEB",
    difficulty: "Hard",
    important: true,
    category: "Most Important"
  },

  // Mathematics - 1 Questions
  {
    id: "q-math-1",
    departmentId: "all",
    semesterId: 1,
    subjectId: "math-1",
    chapterId: "math1-ch1",
    type: "mcq",
    question: "If matrix A is singular, what is the value of its determinant |A|?",
    questionBangla: "যদি কোনো ম্যাট্রিক্স A ব্যতিক্রমী (Singular) হয়, তবে তার নির্ণায়কের মান |A| কত?",
    options: ["|A| = 0", "|A| = 1", "|A| = -1", "|A| > 0"],
    answer: "|A| = 0",
    explanation: "A singular matrix is a square matrix whose determinant equals exactly zero. Such a matrix does not have a multiplicative inverse.",
    year: "2023",
    board: "BTEB",
    difficulty: "Easy",
    important: true,
    category: "Board Question"
  },
  {
    id: "q-math-2",
    departmentId: "all",
    semesterId: 1,
    subjectId: "math-1",
    chapterId: "math1-ch2",
    type: "short",
    question: "What is the condition for two non-zero vectors A and B to be mutually perpendicular?",
    questionBangla: "দুটি অশূন্য ভেক্টর A ও B পরস্পর লম্ব হওয়ার শর্ত কী?",
    options: [],
    answer: "Two vectors A and B are perpendicular if and only if their scalar (dot) product is zero, i.e., A · B = 0 (or Ax·Bx + Ay·By + Az·Bz = 0). This is because A · B = |A||B| cos(90°) = 0.",
    explanation: "Orthogonal vectors have zero projection onto one another.",
    year: "2022",
    board: "BTEB",
    difficulty: "Easy",
    important: true,
    category: "Important Question"
  },
  {
    id: "q-math-3",
    departmentId: "all",
    semesterId: 1,
    subjectId: "math-1",
    chapterId: "math1-ch1",
    type: "creative",
    question: "Solve the system of equations using Cramer's Rule: 2x + y = 7 and 3x - 2y = 7.",
    questionBangla: "ক্রেমারের নিয়ম ব্যবহার করে সমাধান করুন: 2x + y = 7 এবং 3x - 2y = 7।",
    options: [],
    answer: "Step 1: Main determinant D = |[2, 1], [3, -2]| = (2)(-2) - (1)(3) = -4 - 3 = -7.\nStep 2: Dx = |[7, 1], [7, -2]| = (7)(-2) - (1)(7) = -14 - 7 = -21.\nStep 3: Dy = |[2, 7], [3, 7]| = (2)(7) - (7)(3) = 14 - 21 = -7.\nTherefore, x = Dx / D = -21 / -7 = 3; and y = Dy / D = -7 / -7 = 1. Solution: (x, y) = (3, 1).",
    explanation: "Cramer's rule provides an explicit solution in terms of determinants of square coefficient matrices.",
    year: "2023",
    board: "BTEB",
    difficulty: "Medium",
    important: true,
    category: "Board Question"
  },

  // Computer Programming (C) Questions
  {
    id: "q-c-1",
    departmentId: "computer",
    semesterId: 2,
    subjectId: "cst-prog-c",
    chapterId: "c-ch1",
    type: "mcq",
    question: "Which of the following is NOT a valid identifier name in C language?",
    questionBangla: "নিচের কোনটি সি ভাষায় একটি বৈধ আইডেন্টিফায়ার (Identifier) নয়?",
    options: ["2nd_number", "total_sum", "_counter", "rollNumber"],
    answer: "2nd_number",
    explanation: "In C, identifier names must begin with an alphabetic letter (a-z, A-Z) or an underscore (_). They cannot begin with a digit (0-9).",
    year: "2023",
    board: "BTEB",
    difficulty: "Easy",
    important: true,
    category: "Board Question"
  },
  {
    id: "q-c-2",
    departmentId: "computer",
    semesterId: 2,
    subjectId: "cst-prog-c",
    chapterId: "c-ch2",
    type: "short",
    question: "What is the key difference between while loop and do-while loop in C?",
    questionBangla: "সি প্রোগ্রামে while loop এবং do-while loop-এর প্রধান পার্থক্য কী?",
    options: [],
    answer: "A while loop is an entry-controlled loop where the condition is evaluated before executing the body; if false initially, it executes 0 times. A do-while loop is an exit-controlled loop where the condition is evaluated after executing the body; therefore it always executes at least once.",
    explanation: "While loop: pre-test loop. Do-while loop: post-test loop.",
    year: "2022",
    board: "BTEB",
    difficulty: "Medium",
    important: true,
    category: "Important Question"
  },
  {
    id: "q-c-3",
    departmentId: "computer",
    semesterId: 2,
    subjectId: "cst-prog-c",
    chapterId: "c-ch2",
    type: "creative",
    question: "Write a C program to check whether a given positive integer is a Prime Number or not.",
    questionBangla: "একটি সংখ্যা মৌলিক (Prime) কি না তা নির্ণয় করার জন্য একটি সি প্রোগ্রাম লিখুন।",
    options: [],
    answer: `#include <stdio.h>
int main() {
    int n, i, isPrime = 1;
    printf("Enter a positive integer: ");
    scanf("%d", &n);
    if (n <= 1) isPrime = 0;
    for (i = 2; i * i <= n; i++) {
        if (n % i == 0) {
            isPrime = 0;
            break;
        }
    }
    if (isPrime) printf("%d is a Prime Number.\\n", n);
    else printf("%d is NOT a Prime Number.\\n", n);
    return 0;
}`,
    explanation: "We test divisors up to the square root of n (i*i <= n) for O(sqrt(n)) computational efficiency.",
    year: "2021",
    board: "BTEB",
    difficulty: "Medium",
    important: true,
    category: "Most Important"
  },

  // Civil Structural Mechanics Questions
  {
    id: "q-sm-1",
    departmentId: "civil",
    semesterId: 3,
    subjectId: "civil-struct-mech",
    chapterId: "sm-ch1",
    type: "mcq",
    question: "According to Hooke's Law, within the elastic limit, stress is directly proportional to what?",
    questionBangla: "হুকের সূত্র অনুযায়ী স্থিতিস্থাপক সীমার মধ্যে পীড়ন কার সমানুপাতিক?",
    options: ["Strain (বিকৃতি)", "Force (বল)", "Area (ক্ষেত্রফল)", "Volume (আয়তন)"],
    answer: "Strain (বিকৃতি)",
    explanation: "Hooke's law states that for small deformations within the proportional/elastic limit, the stress (σ) experienced by an elastic material is directly proportional to its strain (ε). σ = E × ε.",
    year: "2023",
    board: "BTEB",
    difficulty: "Easy",
    important: true,
    category: "Board Question"
  },
  {
    id: "q-sm-2",
    departmentId: "civil",
    semesterId: 3,
    subjectId: "civil-struct-mech",
    chapterId: "sm-ch2",
    type: "short",
    question: "What is a Point of Contraflexure (Inflection Point) in beam bending?",
    questionBangla: "বেন্ডিং বিমে ইনফ্লেকশন পয়েন্ট বা পয়েন্ট অব কন্ট্রাফ্লেক্সার কাকে বলে?",
    options: [],
    answer: "The Point of Contraflexure is the point along the length of a flexural beam where the bending moment changes its algebraic sign (from positive sagging to negative hogging or vice-versa) and therefore the bending moment is exactly zero (M = 0).",
    explanation: "At this point, beam curvature changes direction.",
    year: "2022",
    board: "BTEB",
    difficulty: "Medium",
    important: true,
    category: "Important Question"
  }
];

export function getQuestionsBySubjectId(subjectId) {
  return questions.filter((q) => q.subjectId === subjectId);
}

export function getQuestionsByChapterId(chapterId) {
  return questions.filter((q) => q.chapterId === chapterId);
}

export function getQuestionsBySubjectAndChapter(subjectId, chapterId) {
  if (chapterId) {
    return questions.filter((q) => q.subjectId === subjectId && q.chapterId === chapterId);
  }
  return questions.filter((q) => q.subjectId === subjectId);
}

export function getQuestionById(id) {
  return questions.find((q) => q.id === id) || null;
}
