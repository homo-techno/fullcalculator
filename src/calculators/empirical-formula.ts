import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

function gcd(a: number, b: number): number {
  a = Math.round(a * 1000);
  b = Math.round(b * 1000);
  while (b) { [a, b] = [b, a % b]; }
  return a / 1000;
}

export const empiricalFormulaCalculator: CalculatorDefinition = {
  slug: "empirical-formula-calculator",
  title: "Empirical Formula Calculator",
  description: "Free empirical formula calculator. Determine the empirical and molecular formula of a compound from percent composition or mass data.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["empirical formula", "molecular formula", "percent composition", "simplest ratio", "elemental analysis"],
  variants: [
    {
      id: "twoElements",
      name: "Two Elements (% or mass)",
      description: "Enter percent or mass data for two elements",
      fields: [
        { name: "el1", label: "Element 1", type: "select", options: [
          { label: "Carbon (C) - 12.011", value: "C:12.011" },
          { label: "Hydrogen (H) - 1.008", value: "H:1.008" },
          { label: "Oxygen (O) - 15.999", value: "O:15.999" },
          { label: "Nitrogen (N) - 14.007", value: "N:14.007" },
          { label: "Sulfur (S) - 32.065", value: "S:32.065" },
          { label: "Phosphorus (P) - 30.974", value: "P:30.974" },
          { label: "Chlorine (Cl) - 35.453", value: "Cl:35.453" },
          { label: "Iron (Fe) - 55.845", value: "Fe:55.845" },
          { label: "Sodium (Na) - 22.990", value: "Na:22.990" },
          { label: "Calcium (Ca) - 40.078", value: "Ca:40.078" },
        ] },
        { name: "pct1", label: "Element 1 Mass/Percent", type: "number", placeholder: "e.g. 40.0" },
        { name: "el2", label: "Element 2", type: "select", options: [
          { label: "Carbon (C) - 12.011", value: "C:12.011" },
          { label: "Hydrogen (H) - 1.008", value: "H:1.008" },
          { label: "Oxygen (O) - 15.999", value: "O:15.999" },
          { label: "Nitrogen (N) - 14.007", value: "N:14.007" },
          { label: "Sulfur (S) - 32.065", value: "S:32.065" },
          { label: "Phosphorus (P) - 30.974", value: "P:30.974" },
          { label: "Chlorine (Cl) - 35.453", value: "Cl:35.453" },
          { label: "Iron (Fe) - 55.845", value: "Fe:55.845" },
          { label: "Sodium (Na) - 22.990", value: "Na:22.990" },
          { label: "Calcium (Ca) - 40.078", value: "Ca:40.078" },
        ] },
        { name: "pct2", label: "Element 2 Mass/Percent", type: "number", placeholder: "e.g. 60.0" },
      ],
      calculate: (inputs) => {
        const el1Str = inputs.el1 as string, el2Str = inputs.el2 as string;
        const pct1 = inputs.pct1 as number, pct2 = inputs.pct2 as number;
        if (!el1Str || !el2Str || !pct1 || !pct2) return null;
        const [sym1, aw1Str] = el1Str.split(":");
        const [sym2, aw2Str] = el2Str.split(":");
        const aw1 = parseFloat(aw1Str), aw2 = parseFloat(aw2Str);
        const mol1 = pct1 / aw1, mol2 = pct2 / aw2;
        const minMol = Math.min(mol1, mol2);
        const r1 = mol1 / minMol, r2 = mol2 / minMol;
        // Try multipliers 1-6 to find integers
        let mult = 1;
        for (let m = 1; m <= 6; m++) {
          const t1 = r1 * m, t2 = r2 * m;
          if (Math.abs(t1 - Math.round(t1)) < 0.1 && Math.abs(t2 - Math.round(t2)) < 0.1) {
            mult = m;
            break;
          }
        }
        const n1 = Math.round(r1 * mult), n2 = Math.round(r2 * mult);
        const empirical = `${sym1}${n1 > 1 ? n1 : ""}${sym2}${n2 > 1 ? n2 : ""}`;
        const empMass = n1 * aw1 + n2 * aw2;
        return {
          primary: { label: "Empirical Formula", value: empirical },
          details: [
            { label: "Mole Ratio", value: `${sym1}: ${formatNumber(r1, 3)} | ${sym2}: ${formatNumber(r2, 3)}` },
            { label: "Subscripts", value: `${sym1}: ${n1} | ${sym2}: ${n2}` },
            { label: "Empirical Molar Mass", value: `${formatNumber(empMass, 3)} g/mol` },
          ],
        };
      },
    },
    {
      id: "threeElements",
      name: "Three Elements (% or mass)",
      fields: [
        { name: "el1", label: "Element 1", type: "select", options: [
          { label: "Carbon (C) - 12.011", value: "C:12.011" },
          { label: "Hydrogen (H) - 1.008", value: "H:1.008" },
          { label: "Oxygen (O) - 15.999", value: "O:15.999" },
          { label: "Nitrogen (N) - 14.007", value: "N:14.007" },
          { label: "Sulfur (S) - 32.065", value: "S:32.065" },
          { label: "Chlorine (Cl) - 35.453", value: "Cl:35.453" },
        ] },
        { name: "pct1", label: "Element 1 %", type: "number", placeholder: "e.g. 40.0" },
        { name: "el2", label: "Element 2", type: "select", options: [
          { label: "Carbon (C) - 12.011", value: "C:12.011" },
          { label: "Hydrogen (H) - 1.008", value: "H:1.008" },
          { label: "Oxygen (O) - 15.999", value: "O:15.999" },
          { label: "Nitrogen (N) - 14.007", value: "N:14.007" },
          { label: "Sulfur (S) - 32.065", value: "S:32.065" },
          { label: "Chlorine (Cl) - 35.453", value: "Cl:35.453" },
        ] },
        { name: "pct2", label: "Element 2 %", type: "number", placeholder: "e.g. 6.7" },
        { name: "el3", label: "Element 3", type: "select", options: [
          { label: "Carbon (C) - 12.011", value: "C:12.011" },
          { label: "Hydrogen (H) - 1.008", value: "H:1.008" },
          { label: "Oxygen (O) - 15.999", value: "O:15.999" },
          { label: "Nitrogen (N) - 14.007", value: "N:14.007" },
          { label: "Sulfur (S) - 32.065", value: "S:32.065" },
          { label: "Chlorine (Cl) - 35.453", value: "Cl:35.453" },
        ] },
        { name: "pct3", label: "Element 3 %", type: "number", placeholder: "e.g. 53.3" },
      ],
      calculate: (inputs) => {
        const els = [inputs.el1 as string, inputs.el2 as string, inputs.el3 as string];
        const pcts = [inputs.pct1 as number, inputs.pct2 as number, inputs.pct3 as number];
        if (els.some(e => !e) || pcts.some(p => !p || p <= 0)) return null;
        const syms = els.map(e => e.split(":")[0]);
        const aws = els.map(e => parseFloat(e.split(":")[1]));
        const mols = pcts.map((p, i) => p / aws[i]);
        const minMol = Math.min(...mols);
        const ratios = mols.map(m => m / minMol);
        let mult = 1;
        for (let m = 1; m <= 6; m++) {
          if (ratios.every(r => Math.abs(r * m - Math.round(r * m)) < 0.1)) { mult = m; break; }
        }
        const subs = ratios.map(r => Math.round(r * mult));
        const formula = syms.map((s, i) => `${s}${subs[i] > 1 ? subs[i] : ""}`).join("");
        const empMass = subs.reduce((acc, n, i) => acc + n * aws[i], 0);
        return {
          primary: { label: "Empirical Formula", value: formula },
          details: [
            { label: "Mole Ratios", value: syms.map((s, i) => `${s}: ${formatNumber(ratios[i], 3)}`).join(" | ") },
            { label: "Subscripts", value: syms.map((s, i) => `${s}: ${subs[i]}`).join(" | ") },
            { label: "Empirical Molar Mass", value: `${formatNumber(empMass, 3)} g/mol` },
          ],
        };
      },
    },
    {
      id: "toMolecular",
      name: "Empirical to Molecular Formula",
      description: "Find molecular formula from empirical formula mass and actual molar mass",
      fields: [
        { name: "empiricalMass", label: "Empirical Formula Mass (g/mol)", type: "number", placeholder: "e.g. 30.026" },
        { name: "molarMass", label: "Actual Molar Mass (g/mol)", type: "number", placeholder: "e.g. 180.156" },
      ],
      calculate: (inputs) => {
        const empMass = inputs.empiricalMass as number, mm = inputs.molarMass as number;
        if (!empMass || !mm || empMass <= 0 || mm <= 0) return null;
        const n = Math.round(mm / empMass);
        if (n < 1) return null;
        return {
          primary: { label: "Multiplier (n)", value: `${n}` },
          details: [
            { label: "Empirical Formula Mass", value: `${formatNumber(empMass, 3)} g/mol` },
            { label: "Actual Molar Mass", value: `${formatNumber(mm, 3)} g/mol` },
            { label: "Ratio (Molar/Empirical)", value: formatNumber(mm / empMass, 4) },
          ],
          note: `Multiply each subscript in the empirical formula by ${n} to get the molecular formula. Molecular formula mass = ${n} × ${formatNumber(empMass, 3)} = ${formatNumber(n * empMass, 3)} g/mol.`,
        };
      },
    },
  ],
  relatedSlugs: ["percent-composition-calculator", "molar-mass-calculator", "molarity-calculator"],
  faq: [
    { question: "What is an empirical formula?", answer: "The empirical formula is the simplest whole-number ratio of atoms in a compound. For example, glucose (C6H12O6) has an empirical formula of CH2O. To find it, convert mass/percentage to moles, divide by the smallest, and round to whole numbers." },
    { question: "How is the molecular formula related to the empirical formula?", answer: "The molecular formula is a whole-number multiple of the empirical formula: molecular formula = n × empirical formula. Find n by dividing the actual molar mass by the empirical formula mass." },
    { question: "What if the ratios are not whole numbers?", answer: "If you get ratios like 1:1.5 or 1:1.33, multiply all ratios by 2, 3, or another small integer to get whole numbers. For example, 1:1.5 → multiply by 2 → 2:3." },
  ],
  formula: "1. Convert mass % to moles: mol = mass / atomic mass | 2. Divide by smallest | 3. Multiply to whole numbers | 4. n = molar mass / empirical mass",
};
