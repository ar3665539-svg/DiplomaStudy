/**
 * DiplomaStudy - Quizzes Data
 * Chapter quizzes, Subject quizzes, and Daily Challenge sets
 */

export const quizzes = [
  {
    id: "quiz-elec-daily",
    title: "Daily Engineering Challenge #42",
    subjectId: "basic-elec",
    subjectName: "Basic Electricity",
    chapterId: "elec-ch1",
    departmentId: "electrical",
    durationSeconds: 300, // 5 minutes
    totalQuestions: 5,
    difficulty: "Mixed",
    questions: [
      {
        id: "dq-1",
        question: "What is the SI unit of electrical conductance?",
        bangla: "বৈদ্যুতিক পরিবাহিতার (Conductance) এস.আই একক কী?",
        options: ["Siemens (Mho)", "Ohm", "Henry", "Farad"],
        answer: "Siemens (Mho)",
        explanation: "Conductance (G) is the reciprocal of resistance (G = 1/R). Its SI unit is Siemens (S), historically also called Mho (℧)."
      },
      {
        id: "dq-2",
        question: "Three resistors of 6Ω, 3Ω, and 2Ω are connected in parallel. What is the equivalent resistance?",
        bangla: "৬ ওহম, ৩ ওহম এবং ২ ওহমের তিনটি রোধ সমান্তরালে যুক্ত থাকলে তুল্য রোধ কত হবে?",
        options: ["1 Ω", "2 Ω", "11 Ω", "0.5 Ω"],
        answer: "1 Ω",
        explanation: "1/Req = 1/6 + 1/3 + 1/2 = 1/6 + 2/6 + 3/6 = 6/6 = 1. Therefore Req = 1 Ω."
      },
      {
        id: "dq-3",
        question: "Which of the following materials possesses the lowest electrical resistivity at room temperature?",
        bangla: "ঘরের স্বাভাবিক তাপমাত্রায় নিচের কোনটির আপেক্ষিক রোধ সবচেয়ে কম?",
        options: ["Silver (রুপা)", "Copper (তামা)", "Gold (স্বর্ণ)", "Aluminum (অ্যালুমিনিয়াম)"],
        answer: "Silver (রুপা)",
        explanation: "Silver has the highest electrical conductivity and lowest electrical resistivity (approx 1.59 × 10^-8 Ω·m) of all metals."
      },
      {
        id: "dq-4",
        question: "In an AC sinusoidal circuit, what is the Form Factor value?",
        bangla: "একটি সাইনোসয়ডাল এসি সার্কিটে ফর্ম ফ্যাক্টর (Form Factor)-এর মান কত?",
        options: ["1.11", "1.414", "0.707", "0.637"],
        answer: "1.11",
        explanation: "Form Factor = RMS Value / Average Value = (Vm / √2) / (2Vm / π) = π / (2√2) ≈ 1.11."
      },
      {
        id: "dq-5",
        question: "What does Kirchhoff's Voltage Law (KVL) state regarding any closed loop?",
        bangla: "যেকোনো আবদ্ধ লুপে কার্শফের ভোল্টেজ সূত্র (KVL) অনুযায়ী কী সত্য?",
        options: ["Algebraic sum of EMFs and voltage drops is zero", "Current entering equals current leaving", "Resistance is constant", "Power is doubled"],
        answer: "Algebraic sum of EMFs and voltage drops is zero",
        explanation: "KVL states that around any closed loop in an electrical network, the algebraic sum of all potential differences (EMFs and IR drops) is zero (ΣV = 0)."
      }
    ]
  },
  {
    id: "quiz-c-ch1",
    title: "C Programming - Fundamentals & Data Types",
    subjectId: "cst-prog-c",
    subjectName: "Computer Programming (C)",
    chapterId: "c-ch1",
    departmentId: "computer",
    durationSeconds: 360,
    totalQuestions: 5,
    difficulty: "Easy",
    questions: [
      {
        id: "cq-1",
        question: "What is the format specifier used to print a double precision floating point in C?",
        bangla: "সি ভাষায় double precision floating point প্রিন্ট করতে কোন ফরম্যাট স্পেসিফায়ার ব্যবহৃত হয়?",
        options: ["%lf", "%f", "%d", "%c"],
        answer: "%lf",
        explanation: "%lf is used for double, while %f is standard for 32-bit float, and %d is for signed int."
      },
      {
        id: "cq-2",
        question: "What is the return type of the main function according to standard C99/C11 convention?",
        bangla: "আধুনিক সি স্ট্যান্ডার্ডে main ফাংশনের রিটার্ন টাইপ কোনটি হওয়া উচিত?",
        options: ["int", "void", "float", "char"],
        answer: "int",
        explanation: "Standard C requires main to return an integer (int main()), where return 0 signifies successful execution to the operating system."
      },
      {
        id: "cq-3",
        question: "Which keyword is used to prevent any modification to a variable's value?",
        bangla: "কোনো ভ্যারিয়েবলের মান অপরিবর্তনশীল রাখতে কোন কি-ওয়ার্ড ব্যবহার করা হয়?",
        options: ["const", "static", "volatile", "register"],
        answer: "const",
        explanation: "The const keyword designates an identifier as a read-only variable whose value cannot be altered after initialization."
      },
      {
        id: "cq-4",
        question: "What is the size of an 'int' data type on a typical 64-bit GCC compiler?",
        bangla: "আধুনিক ৬৪-বিট কম্পাইলারে সাধারণত একটি int ডেটা টাইপের মেমরি সাইজ কত?",
        options: ["4 Bytes", "2 Bytes", "8 Bytes", "1 Byte"],
        answer: "4 Bytes",
        explanation: "In modern 32-bit and 64-bit architecture GCC compilers, standard int occupies 4 bytes (32 bits), spanning -2,147,483,648 to +2,147,483,647."
      },
      {
        id: "cq-5",
        question: "Which of the following operator has the highest precedence in C?",
        bangla: "সি ভাষায় নিচের কোন অপারেটরের অগ্রাধিকার (Precedence) সবচেয়ে বেশি?",
        options: ["Parentheses ()", "Multiplication *", "Addition +", "Assignment ="],
        answer: "Parentheses ()",
        explanation: "Parentheses () have the highest precedence (level 1) in C operator precedence hierarchies."
      }
    ]
  },
  {
    id: "quiz-math-matrices",
    title: "Mathematics - Determinants & Cramer's Rule",
    subjectId: "math-1",
    subjectName: "Mathematics - 1",
    chapterId: "math1-ch1",
    departmentId: "all",
    durationSeconds: 420,
    totalQuestions: 5,
    difficulty: "Medium",
    questions: [
      {
        id: "mq-1",
        question: "What is the determinant of a 2x2 identity matrix I2?",
        bangla: "একটি ২x২ অভেদক (Identity) ম্যাট্রিক্সের নির্ণায়কের মান কত?",
        options: ["1", "0", "-1", "2"],
        answer: "1",
        explanation: "For I2 = [[1, 0], [0, 1]], the determinant is (1)(1) - (0)(0) = 1."
      },
      {
        id: "mq-2",
        question: "If all elements of any single row or column of a square matrix are zero, what is the determinant?",
        bangla: "কোনো ম্যাট্রিক্সের যেকোনো একটি সম্পূর্ণ সারি বা কলামের সব উপাদান শূন্য হলে নির্ণায়ক কত?",
        options: ["0", "1", "Undefined", "-1"],
        answer: "0",
        explanation: "By the elementary properties of determinants, if an entire row or column contains only zeros, the determinant is always zero."
      },
      {
        id: "mq-3",
        question: "What is (A^T)^T equal to for any matrix A?",
        bangla: "যেকোনো ম্যাট্রিক্স A-এর ক্ষেত্রে (A^T)^T কার সমান?",
        options: ["A", "A^T", "-A", "I"],
        answer: "A",
        explanation: "Transposing a transposed matrix returns the original matrix A."
      },
      {
        id: "mq-4",
        question: "For what condition can Cramer's Rule NOT be used to solve a system of linear equations?",
        bangla: "কোন শর্তে ক্রেমারের নিয়ম প্রয়োগ করে সমীকরণ জোট সমাধান করা যায় না?",
        options: ["When D = 0", "When D > 0", "When D < 0", "When D = 1"],
        answer: "When D = 0",
        explanation: "Cramer's rule expresses solutions as x = Dx/D. If the coefficient determinant D = 0, division by zero occurs (either no solution or infinitely many solutions)."
      },
      {
        id: "mq-5",
        question: "If matrix A is symmetric, which equation is satisfied?",
        bangla: "ম্যাট্রিক্স A প্রতিসম (Symmetric) হলে কোনটি সঠিক?",
        options: ["A = A^T", "A = -A^T", "A^T = I", "A^2 = I"],
        answer: "A = A^T",
        explanation: "A symmetric matrix equals its own transpose (A = A^T)."
      }
    ]
  }
];

export function getQuizById(id) {
  return quizzes.find((q) => q.id === id) || quizzes[0];
}

export function getDailyQuiz() {
  return quizzes[0];
}
