/**
 * DiplomaStudy - Subjects Data
 * Department & Semester linked curriculum
 * (Sample/Demo Curriculum based on Bangladesh Diploma in Engineering standards)
 */

export const subjects = [
  // Common 1st & 2nd Semester Foundation Subjects
  {
    id: "math-1",
    departmentId: "all",
    semesterId: 1,
    name: "Mathematics - 1",
    code: "65911",
    description: "Algebra, Trigonometry, Determinants, Matrices, and Vectors for engineering applications.",
    credits: 4,
    type: "Theory & Practical",
    icon: "📐",
    progress: 68,
    chaptersCount: 12
  },
  {
    id: "physics-1",
    departmentId: "all",
    semesterId: 1,
    name: "Physics - 1",
    code: "65912",
    description: "Physical measurements, force and motion, friction, work, power, elasticity, surface tension and viscosity.",
    credits: 4,
    type: "Theory & Practical",
    icon: "🔬",
    progress: 45,
    chaptersCount: 10
  },
  {
    id: "basic-elec",
    departmentId: "all",
    semesterId: 1,
    name: "Basic Electricity",
    code: "66711",
    description: "Ohm's law, Kirchhoff's laws, DC circuits, work, power, energy, resistance laws and magnetism.",
    credits: 3,
    type: "Theory & Practical",
    icon: "⚡",
    progress: 80,
    chaptersCount: 8
  },
  {
    id: "eng-drawing",
    departmentId: "all",
    semesterId: 1,
    name: "Engineering Drawing",
    code: "61011",
    description: "Geometric construction, orthographic projection, isometric views, lettering, and engineering scaling.",
    credits: 2,
    type: "Practical Only",
    icon: "✏️",
    progress: 50,
    chaptersCount: 7
  },
  {
    id: "bangla",
    departmentId: "all",
    semesterId: 1,
    name: "Bangla Literature & Language",
    code: "65711",
    description: "Selected prose, poetry, official letters, grammatical analysis, and communicative Bengali.",
    credits: 2,
    type: "Theory",
    icon: "📖",
    progress: 90,
    chaptersCount: 12
  },
  {
    id: "english",
    departmentId: "all",
    semesterId: 2,
    name: "English Communication",
    code: "65712",
    description: "Technical writing, phonetics, reading comprehension, grammar, and communicative dialogue.",
    credits: 2,
    type: "Theory & Practical",
    icon: "🗣️",
    progress: 75,
    chaptersCount: 8
  },
  {
    id: "math-2",
    departmentId: "all",
    semesterId: 2,
    name: "Mathematics - 2",
    code: "65921",
    description: "Differential Calculus, Integral Calculus, functions, limits, and coordinate geometry.",
    credits: 4,
    type: "Theory & Practical",
    icon: "📊",
    progress: 40,
    chaptersCount: 10
  },
  {
    id: "chemistry",
    departmentId: "all",
    semesterId: 2,
    name: "Chemistry",
    code: "65913",
    description: "Atomic structure, chemical bonding, acids, bases, salts, electrochemistry, and corrosion control.",
    credits: 4,
    type: "Theory & Practical",
    icon: "🧪",
    progress: 30,
    chaptersCount: 9
  },

  // Computer Technology
  {
    id: "cst-prog-c",
    departmentId: "computer",
    semesterId: 2,
    name: "Computer Programming (C)",
    code: "66621",
    description: "Algorithms, flowcharts, variables, conditions, loops, arrays, functions, pointers, and structures in C.",
    credits: 3,
    type: "Theory & Practical",
    icon: "💻",
    progress: 85,
    chaptersCount: 9
  },
  {
    id: "cst-data-structure",
    departmentId: "computer",
    semesterId: 3,
    name: "Data Structure & Algorithms",
    code: "66631",
    description: "Arrays, stacks, queues, linked lists, binary trees, graphs, sorting and searching algorithms.",
    credits: 4,
    type: "Theory & Practical",
    icon: "🌳",
    progress: 60,
    chaptersCount: 8
  },
  {
    id: "cst-database",
    departmentId: "computer",
    semesterId: 4,
    name: "Database Management System",
    code: "66642",
    description: "Relational model, SQL queries, ER diagrams, normal forms, transactions, and index management.",
    credits: 4,
    type: "Theory & Practical",
    icon: "🗄️",
    progress: 55,
    chaptersCount: 8
  },
  {
    id: "cst-web-dev",
    departmentId: "computer",
    semesterId: 4,
    name: "Web Development Technologies",
    code: "66644",
    description: "HTML5, modern CSS layouts, JavaScript DOM, responsive design, backend integration and APIs.",
    credits: 3,
    type: "Theory & Practical",
    icon: "🌐",
    progress: 72,
    chaptersCount: 7
  },
  {
    id: "cst-os",
    departmentId: "computer",
    semesterId: 5,
    name: "Operating System",
    code: "66651",
    description: "Process management, CPU scheduling algorithms, synchronization, memory paging, and file systems.",
    credits: 3,
    type: "Theory & Practical",
    icon: "⚙️",
    progress: 35,
    chaptersCount: 7
  },

  // Civil Technology
  {
    id: "civil-struct-mech",
    departmentId: "civil",
    semesterId: 3,
    name: "Structural Mechanics",
    code: "66431",
    description: "Stress, strain, shear force & bending moment diagrams, centroid, moment of inertia, and beam deflection.",
    credits: 4,
    type: "Theory & Practical",
    icon: "🌉",
    progress: 62,
    chaptersCount: 8
  },
  {
    id: "civil-survey-1",
    departmentId: "civil",
    semesterId: 3,
    name: "Surveying - 1",
    code: "66432",
    description: "Chain surveying, compass surveying, plane table survey, levelling instruments, and field contouring.",
    credits: 4,
    type: "Theory & Practical",
    icon: "📍",
    progress: 50,
    chaptersCount: 8
  },
  {
    id: "civil-concrete",
    departmentId: "civil",
    semesterId: 4,
    name: "Concrete Technology",
    code: "66441",
    description: "Cement hydration, aggregate grading, water-cement ratio, workability tests, curing, and mix design.",
    credits: 3,
    type: "Theory & Practical",
    icon: "🧱",
    progress: 40,
    chaptersCount: 7
  },
  {
    id: "civil-soil-mech",
    departmentId: "civil",
    semesterId: 5,
    name: "Soil Mechanics & Foundation",
    code: "66452",
    description: "Soil classification, permeability, compaction, shear strength, bearing capacity, and shallow/deep foundations.",
    credits: 4,
    type: "Theory & Practical",
    icon: "⛰️",
    progress: 25,
    chaptersCount: 8
  },

  // Electrical Technology
  {
    id: "elec-circuits",
    departmentId: "electrical",
    semesterId: 3,
    name: "Electrical Circuits - 1",
    code: "66731",
    description: "AC fundamentals, sinusoidal waveforms, R-L-C series & parallel circuits, resonance, and power factor.",
    credits: 4,
    type: "Theory & Practical",
    icon: "⚡",
    progress: 70,
    chaptersCount: 9
  },
  {
    id: "elec-machines-1",
    departmentId: "electrical",
    semesterId: 4,
    name: "Electrical Machines - 1",
    code: "66741",
    description: "DC generators, DC motors, single-phase transformers, autotransformers, efficiency, and EMF equations.",
    credits: 4,
    type: "Theory & Practical",
    icon: "🔄",
    progress: 50,
    chaptersCount: 8
  },
  {
    id: "elec-power-trans",
    departmentId: "electrical",
    semesterId: 5,
    name: "Power Transmission & Distribution",
    code: "66751",
    description: "Overhead transmission lines, skin effect, insulators, sag calculations, underground cables, and corona effect.",
    credits: 4,
    type: "Theory",
    icon: "🗼",
    progress: 30,
    chaptersCount: 7
  },

  // Mechanical Technology
  {
    id: "mech-thermo",
    departmentId: "mechanical",
    semesterId: 3,
    name: "Applied Thermodynamics",
    code: "67031",
    description: "Laws of thermodynamics, steam generation, air cycles (Carnot, Otto, Diesel), and heat transfer modes.",
    credits: 4,
    type: "Theory & Practical",
    icon: "🔥",
    progress: 45,
    chaptersCount: 8
  },
  {
    id: "mech-fluid",
    departmentId: "mechanical",
    semesterId: 4,
    name: "Fluid Mechanics & Machinery",
    code: "67041",
    description: "Fluid statics, Pascal's law, Bernoulli's theorem, Venturimeter, pumps, Pelton wheel, and turbines.",
    credits: 4,
    type: "Theory & Practical",
    icon: "💧",
    progress: 55,
    chaptersCount: 8
  },
  {
    id: "mech-design",
    departmentId: "mechanical",
    semesterId: 5,
    name: "Machine Design",
    code: "67051",
    description: "Factor of safety, design of shafts, keys, couplings, riveted joints, welded joints, and helical springs.",
    credits: 4,
    type: "Theory & Practical",
    icon: "⚙️",
    progress: 20,
    chaptersCount: 7
  },

  // Electronics Technology
  {
    id: "et-digital",
    departmentId: "electronics",
    semesterId: 3,
    name: "Digital Electronics",
    code: "66831",
    description: "Logic gates, Boolean algebra, Karnaugh maps, encoders, decoders, multiplexers, flip-flops, and counters.",
    credits: 4,
    type: "Theory & Practical",
    icon: "💾",
    progress: 65,
    chaptersCount: 8
  },
  {
    id: "et-microcontroller",
    departmentId: "electronics",
    semesterId: 4,
    name: "Microcontroller & Embedded Systems",
    code: "66841",
    description: "8051 and Arduino architectures, timers, interrupts, I/O interfacing, ADC/DAC, and sensor programming.",
    credits: 4,
    type: "Theory & Practical",
    icon: "🤖",
    progress: 40,
    chaptersCount: 7
  }
];

export function getSubjectsByDeptAndSemester(departmentId, semesterId) {
  const semNum = parseInt(semesterId, 10);
  return subjects.filter((s) => {
    const matchDept = s.departmentId === "all" || s.departmentId === departmentId;
    const matchSem = s.semesterId === semNum;
    return matchDept && matchSem;
  });
}

export function getSubjectById(id) {
  return subjects.find((s) => s.id === id) || subjects[0];
}
