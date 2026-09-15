/**
 * DiplomaStudy - Formulas Data
 * Essential Engineering Formulas with variable explanations, units & examples
 */

export const formulas = [
  // Electrical Engineering
  {
    id: "form-ohm",
    name: "Ohm's Law",
    banglaName: "ওহমের সূত্র",
    category: "Electrical Engineering",
    formula: "V = I × R",
    variables: "V = Voltage (volts), I = Current (amperes), R = Resistance (ohms)",
    units: "Volts (V), Amperes (A), Ohms (Ω)",
    explanation: "Current through a linear conductor between two terminals is directly proportional to the applied potential difference and inversely proportional to the resistance.",
    example: "If a circuit with resistance 10 Ω is connected across a 12 V battery, current I = 12 / 10 = 1.2 A."
  },
  {
    id: "form-power",
    name: "Electric Power in DC Circuits",
    banglaName: "বৈদ্যুতিক ক্ষমতা নির্ণয়",
    category: "Electrical Engineering",
    formula: "P = V × I = I² × R = V² / R",
    variables: "P = Power (watts), V = Voltage (volts), I = Current (amperes), R = Resistance (ohms)",
    units: "Watts (W) or Kilowatts (kW)",
    explanation: "Electric power represents the rate at which electrical energy is transferred by an electric circuit per unit time.",
    example: "An appliance draws 5 A on a 220 V line: P = 220 × 5 = 1100 W (1.1 kW)."
  },
  {
    id: "form-resistivity",
    name: "Conductor Resistance Law",
    banglaName: "রোধের সূত্র (আপেক্ষিক রোধ)",
    category: "Electrical Engineering",
    formula: "R = ρ × (L / A)",
    variables: "R = Resistance (Ω), ρ = Specific resistance (Ω·m), L = Length (m), A = Cross-sectional area (m²)",
    units: "Ω, Ω·m, m, m²",
    explanation: "The resistance of a uniform conductor is directly proportional to its length and inversely proportional to its cross-sectional area.",
    example: "Doubling the length of a copper wire doubles its resistance, while doubling its area halves it."
  },

  // Civil Engineering
  {
    id: "form-stress",
    name: "Stress & Strain (Hooke's Law)",
    banglaName: "পীড়ন ও বিকৃতি সম্পর্ক",
    category: "Civil Engineering",
    formula: "σ = E × ε",
    variables: "σ = Normal Stress (N/m² or Pa), E = Young's Modulus (N/m²), ε = Strain (dimensionless ΔL/L)",
    units: "Pascal (Pa) or MPa",
    explanation: "Hooke's law states that within the elastic limit of a material, stress is directly proportional to strain.",
    example: "For structural mild steel, E is approximately 200 GPa (2 × 10¹¹ N/m²)."
  },
  {
    id: "form-concrete-mix",
    name: "Dry Volume Factor for Concrete",
    banglaName: "কংক্রিট তৈরিতে শুষ্ক আয়তন ফ্যাক্টর",
    category: "Civil Engineering",
    formula: "Dry Volume = Wet Volume × 1.54",
    variables: "Wet Volume = Finished compacted concrete volume (m³ or cft), Multiplier = 1.50 to 1.54",
    units: "m³ or Cubic Feet (cft)",
    explanation: "When mixing dry cement, sand, and stone chips, voids are filled when water is added. A 54% allowance is added to convert finished wet volume to required dry batch volume.",
    example: "To cast 100 cft wet RCC slab, dry volume required = 100 × 1.54 = 154 cft."
  },
  {
    id: "form-brickwork",
    name: "Standard Brick Quantity Estimation",
    banglaName: "ইটের গাঁথুনিতে ইটের সংখ্যা হিসাব",
    category: "Civil Engineering",
    formula: "Number of Bricks = Volume (m³) × 500",
    variables: "Standard metric brickwork volume without wastage. (In FPS: approx 11 to 12 bricks per cft).",
    units: "Units (Nos)",
    explanation: "1 cubic meter of brick masonry typically consumes 500 standard modular bricks including 10mm mortar joints and standard 5% transit wastage.",
    example: "A 10 m³ wall needs approximately 10 × 500 = 5,000 bricks."
  },

  // Mechanical Engineering
  {
    id: "form-torque",
    name: "Mechanical Torque & Power Equation",
    banglaName: "টর্ক ও মেকানিক্যাল পাওয়ার সম্পর্ক",
    category: "Mechanical Engineering",
    formula: "P = (2 × π × N × T) / 60",
    variables: "P = Shaft Power (Watts), N = Rotational speed (RPM), T = Torque (Newton-meters)",
    units: "Watts (W), RPM (rev/min), N·m",
    explanation: "Relates shaft torque delivered by an electric motor or internal combustion engine to the output mechanical power.",
    example: "A motor producing 50 N·m torque at 1500 RPM produces P = (2 × 3.1416 × 1500 × 50) / 60 = 7854 W (7.85 kW)."
  },
  {
    id: "form-bernoulli",
    name: "Bernoulli's Energy Equation for Fluids",
    banglaName: "বার্নোলির শক্তি সমীকরণ",
    category: "Mechanical Engineering",
    formula: "(P / ρg) + (v² / 2g) + z = Constant",
    variables: "P/ρg = Pressure head (m), v²/2g = Velocity head (m), z = Datum elevation head (m)",
    units: "Meters of liquid column (m)",
    explanation: "For an inviscid, incompressible fluid under streamline flow, the sum of pressure energy, kinetic energy, and potential energy per unit weight is constant along a streamline.",
    example: "As fluid velocity increases through a constricted pipe section (Venturi), fluid pressure drops proportionally."
  },

  // Mathematics
  {
    id: "form-cramer",
    name: "Cramer's Rule for 2x2 Equations",
    banglaName: "ক্রেমারের সূত্রের সমাধান",
    category: "Mathematics",
    formula: "x = Dx / D, y = Dy / D  (where D ≠ 0)",
    variables: "D = Coefficient matrix determinant, Dx = Determinant with x-column replaced by constants, Dy = with y-column replaced",
    units: "Dimensionless scalar numbers",
    explanation: "Direct method to calculate unique variable solutions using determinants for non-homogeneous linear systems.",
    example: "If D = -7, Dx = -21, Dy = -7, then x = -21 / -7 = 3 and y = -7 / -7 = 1."
  },
  {
    id: "form-quad",
    name: "Quadratic Equation Roots Formula",
    banglaName: "দ্বিঘাত সমীকরণের মূল নির্ণয়ের সূত্র",
    category: "Mathematics",
    formula: "x = (-b ± √(b² - 4ac)) / (2a)",
    variables: "a, b, c = Coefficients of ax² + bx + c = 0, D = b² - 4ac (Discriminant)",
    units: "Real or complex numbers",
    explanation: "Gives both roots of any second-order polynomial equation. If b² - 4ac > 0, roots are real and unequal; if = 0, real and equal.",
    example: "For x² - 5x + 6 = 0: x = (5 ± √(25 - 24)) / 2 = (5 ± 1) / 2 -> x = 3, 2."
  },

  // Physics
  {
    id: "form-kinetic",
    name: "Kinetic Energy & Work-Energy Principle",
    banglaName: "গতিশক্তি ও কাজ-শক্তি উপপাদ্য",
    category: "Physics",
    formula: "Ek = 0.5 × m × v²",
    variables: "Ek = Kinetic Energy (Joules), m = Mass (kg), v = Velocity (m/s)",
    units: "Joules (J)",
    explanation: "The kinetic energy of an object is the work needed to accelerate a body of given mass from rest to its stated velocity.",
    example: "A 1000 kg vehicle moving at 20 m/s (72 km/h) possesses Ek = 0.5 × 1000 × (20)² = 200,000 J (200 kJ)."
  }
];

export function getFormulasByCategory(category) {
  if (!category || category === "All") return formulas;
  return formulas.filter((f) => f.category === category);
}
