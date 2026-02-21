import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

const ATOMIC_MASSES: Record<string, number> = {
  H: 1.008, He: 4.003, Li: 6.941, Be: 9.012, B: 10.81, C: 12.011, N: 14.007,
  O: 15.999, F: 18.998, Ne: 20.180, Na: 22.990, Mg: 24.305, Al: 26.982,
  Si: 28.086, P: 30.974, S: 32.065, Cl: 35.453, Ar: 39.948, K: 39.098,
  Ca: 40.078, Ti: 47.867, V: 50.942, Cr: 51.996, Mn: 54.938, Fe: 55.845,
  Co: 58.933, Ni: 58.693, Cu: 63.546, Zn: 65.38, Ga: 69.723, Ge: 72.63,
  As: 74.922, Se: 78.96, Br: 79.904, Kr: 83.798, Rb: 85.468, Sr: 87.62,
  Zr: 91.224, Mo: 95.96, Ag: 107.868, Cd: 112.411, Sn: 118.710, Sb: 121.760,
  I: 126.904, Xe: 131.293, Cs: 132.905, Ba: 137.327, W: 183.84, Pt: 195.084,
  Au: 196.967, Hg: 200.59, Pb: 207.2, Bi: 208.980, U: 238.029,
};

function parseMolarMass(formula: string): { mass: number; breakdown: string[] } | null {
  const breakdown: string[] = [];
  let totalMass = 0;
  let i = 0;
  const stack: { mass: number; parts: string[] }[] = [];

  while (i < formula.length) {
    if (formula[i] === "(") {
      stack.push({ mass: totalMass, parts: [...breakdown] });
      totalMass = 0;
      breakdown.length = 0;
      i++;
    } else if (formula[i] === ")") {
      i++;
      let numStr = "";
      while (i < formula.length && /\d/.test(formula[i])) { numStr += formula[i]; i++; }
      const mult = numStr ? parseInt(numStr) : 1;
      totalMass *= mult;
      const newBreakdown = breakdown.map(b => {
        const parts = b.split(": ");
        const [el, rest] = [parts[0], parts[1]];
        const val = parseFloat(rest) * mult;
        return `${el}: ${formatNumber(val, 3)}`;
      });
      if (stack.length > 0) {
        const prev = stack.pop()!;
        totalMass += prev.mass;
        breakdown.length = 0;
        breakdown.push(...prev.parts, ...newBreakdown);
      }
    } else if (/[A-Z]/.test(formula[i])) {
      let symbol = formula[i];
      i++;
      while (i < formula.length && /[a-z]/.test(formula[i])) { symbol += formula[i]; i++; }
      let numStr = "";
      while (i < formula.length && /\d/.test(formula[i])) { numStr += formula[i]; i++; }
      const count = numStr ? parseInt(numStr) : 1;
      const atomicMass = ATOMIC_MASSES[symbol];
      if (!atomicMass) return null;
      const contribution = atomicMass * count;
      totalMass += contribution;
      breakdown.push(`${symbol}${count > 1 ? "×" + count : ""}: ${formatNumber(contribution, 3)}`);
    } else {
      i++;
    }
  }

  return { mass: totalMass, breakdown };
}

export const molarMassCalculator: CalculatorDefinition = {
  slug: "molar-mass-calculator",
  title: "Molar Mass Calculator",
  description: "Free molar mass calculator. Calculate the molecular weight of chemical compounds from their formula. Supports common elements and parenthetical groups.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["molar mass", "molecular weight", "formula weight", "atomic mass", "chemistry calculator"],
  variants: [
    {
      id: "fromFormula",
      name: "From Chemical Formula",
      description: "Enter a chemical formula like H2O, NaCl, Ca(OH)2",
      fields: [
        { name: "formula", label: "Chemical Formula", type: "select", options: [
          { label: "H2O (Water)", value: "H2O" },
          { label: "NaCl (Sodium Chloride)", value: "NaCl" },
          { label: "CO2 (Carbon Dioxide)", value: "CO2" },
          { label: "H2SO4 (Sulfuric Acid)", value: "H2SO4" },
          { label: "NaOH (Sodium Hydroxide)", value: "NaOH" },
          { label: "C6H12O6 (Glucose)", value: "C6H12O6" },
          { label: "CaCO3 (Calcium Carbonate)", value: "CaCO3" },
          { label: "NH3 (Ammonia)", value: "NH3" },
          { label: "HCl (Hydrochloric Acid)", value: "HCl" },
          { label: "Ca(OH)2 (Calcium Hydroxide)", value: "Ca(OH)2" },
          { label: "KMnO4 (Potassium Permanganate)", value: "KMnO4" },
          { label: "C2H5OH (Ethanol)", value: "C2H5OH" },
          { label: "Fe2O3 (Iron(III) Oxide)", value: "Fe2O3" },
          { label: "CH4 (Methane)", value: "CH4" },
          { label: "C12H22O11 (Sucrose)", value: "C12H22O11" },
        ] },
      ],
      calculate: (inputs) => {
        const formula = inputs.formula as string;
        if (!formula) return null;
        const result = parseMolarMass(formula);
        if (!result) return null;
        const molesIn1g = 1 / result.mass;
        return {
          primary: { label: "Molar Mass", value: `${formatNumber(result.mass, 3)} g/mol` },
          details: [
            ...result.breakdown.map(b => ({ label: b.split(": ")[0], value: `${b.split(": ")[1]} g/mol` })),
            { label: "Moles in 1 g", value: `${molesIn1g.toExponential(4)} mol` },
            { label: "Molecules in 1 g", value: `${(molesIn1g * 6.022e23).toExponential(4)}` },
          ],
        };
      },
    },
    {
      id: "massToMoles",
      name: "Mass to Moles",
      fields: [
        { name: "mass", label: "Mass (g)", type: "number", placeholder: "e.g. 100" },
        { name: "molarMass", label: "Molar Mass (g/mol)", type: "number", placeholder: "e.g. 18.015" },
      ],
      calculate: (inputs) => {
        const mass = inputs.mass as number, mm = inputs.molarMass as number;
        if (!mass || !mm || mm <= 0) return null;
        const moles = mass / mm;
        const molecules = moles * 6.022e23;
        return {
          primary: { label: "Moles", value: `${formatNumber(moles, 6)} mol` },
          details: [
            { label: "Mass", value: `${formatNumber(mass, 4)} g` },
            { label: "Molar Mass", value: `${formatNumber(mm, 4)} g/mol` },
            { label: "Number of Molecules", value: molecules.toExponential(4) },
          ],
        };
      },
    },
    {
      id: "molesToMass",
      name: "Moles to Mass",
      fields: [
        { name: "moles", label: "Moles (mol)", type: "number", placeholder: "e.g. 2.5" },
        { name: "molarMass", label: "Molar Mass (g/mol)", type: "number", placeholder: "e.g. 18.015" },
      ],
      calculate: (inputs) => {
        const moles = inputs.moles as number, mm = inputs.molarMass as number;
        if (!moles || !mm || mm <= 0) return null;
        const mass = moles * mm;
        const molecules = moles * 6.022e23;
        return {
          primary: { label: "Mass", value: `${formatNumber(mass, 4)} g` },
          details: [
            { label: "Moles", value: `${formatNumber(moles, 6)} mol` },
            { label: "Molar Mass", value: `${formatNumber(mm, 4)} g/mol` },
            { label: "Mass in kg", value: `${formatNumber(mass / 1000, 6)} kg` },
            { label: "Number of Molecules", value: molecules.toExponential(4) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["molarity-calculator", "avogadro-calculator", "percent-composition-calculator"],
  faq: [
    { question: "What is molar mass?", answer: "Molar mass is the mass of one mole (6.022 x 10^23 particles) of a substance, expressed in grams per mole (g/mol). It equals the sum of atomic masses of all atoms in the molecular formula. For example, H2O has a molar mass of 2(1.008) + 15.999 = 18.015 g/mol." },
    { question: "How do I calculate molar mass from a formula?", answer: "Add up the atomic masses of each element multiplied by its subscript. For Ca(OH)2: Ca = 40.078 + 2(O = 15.999 + H = 1.008) = 40.078 + 33.014 + 2.016 = 74.093 g/mol." },
    { question: "What is the difference between molar mass and molecular weight?", answer: "They are numerically the same but have different units. Molar mass is in g/mol while molecular weight (relative molecular mass) is dimensionless, expressed in atomic mass units (amu or Da)." },
  ],
  formula: "Molar Mass = Σ(atomic mass × number of atoms) | moles = mass / molar mass",
};
