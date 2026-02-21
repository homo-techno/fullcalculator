import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const solubilityProductCalculator: CalculatorDefinition = {
  slug: "solubility-product-calculator",
  title: "Solubility Product (Ksp) Calculator",
  description: "Free solubility product calculator. Calculate Ksp from molar solubility, determine if a precipitate forms, and find ion concentrations at equilibrium.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["Ksp", "solubility product", "molar solubility", "precipitation", "ion product"],
  variants: [
    {
      id: "kspFromSolubility",
      name: "Ksp from Molar Solubility",
      description: "For salt AxBy dissolving: Ksp = (xS)^x · (yS)^y",
      fields: [
        { name: "solubility", label: "Molar Solubility S (mol/L)", type: "number", placeholder: "e.g. 0.001" },
        { name: "cationCount", label: "Number of Cations (x)", type: "number", placeholder: "e.g. 1", defaultValue: 1, min: 1, step: 1 },
        { name: "anionCount", label: "Number of Anions (y)", type: "number", placeholder: "e.g. 2", defaultValue: 1, min: 1, step: 1 },
      ],
      calculate: (inputs) => {
        const s = inputs.solubility as number, x = inputs.cationCount as number || 1, y = inputs.anionCount as number || 1;
        if (!s || s <= 0) return null;
        const cation = x * s;
        const anion = y * s;
        const ksp = Math.pow(cation, x) * Math.pow(anion, y);
        return {
          primary: { label: "Ksp", value: ksp.toExponential(4) },
          details: [
            { label: "Molar Solubility", value: `${s.toExponential(4)} M` },
            { label: `[Cation] = ${x}S`, value: `${cation.toExponential(4)} M` },
            { label: `[Anion] = ${y}S`, value: `${anion.toExponential(4)} M` },
            { label: "Formula Type", value: `A${x}B${y} → ${x}A + ${y}B` },
          ],
          note: `Ksp = (${x}S)^${x} × (${y}S)^${y} = ${x ** x * y ** y}S^${x + y}`,
        };
      },
    },
    {
      id: "solubilityFromKsp",
      name: "Molar Solubility from Ksp",
      fields: [
        { name: "kspExp", label: "Ksp (×10⁻ⁿ, enter coefficient)", type: "number", placeholder: "e.g. 1.77" },
        { name: "kspPow", label: "Exponent n (10⁻ⁿ)", type: "number", placeholder: "e.g. 10", step: 1 },
        { name: "cationCount", label: "Number of Cations (x)", type: "number", placeholder: "e.g. 1", defaultValue: 1, min: 1, step: 1 },
        { name: "anionCount", label: "Number of Anions (y)", type: "number", placeholder: "e.g. 2", defaultValue: 1, min: 1, step: 1 },
      ],
      calculate: (inputs) => {
        const coeff = inputs.kspExp as number, pow = inputs.kspPow as number;
        const x = inputs.cationCount as number || 1, y = inputs.anionCount as number || 1;
        if (!coeff || pow === undefined) return null;
        const ksp = coeff * Math.pow(10, -pow);
        const totalIons = x + y;
        const coefficient = Math.pow(x, x) * Math.pow(y, y);
        const s = Math.pow(ksp / coefficient, 1 / totalIons);
        return {
          primary: { label: "Molar Solubility", value: `${s.toExponential(4)} M` },
          details: [
            { label: "Ksp", value: ksp.toExponential(4) },
            { label: "Solubility in g/L (need MM)", value: "Multiply S by molar mass" },
            { label: `[Cation] = ${x}S`, value: (x * s).toExponential(4) },
            { label: `[Anion] = ${y}S`, value: (y * s).toExponential(4) },
          ],
        };
      },
    },
    {
      id: "willPrecipitate",
      name: "Will Precipitate Form? (Q vs Ksp)",
      description: "Compare ion product Q with Ksp to predict precipitation",
      fields: [
        { name: "cationConc", label: "Cation Concentration (M)", type: "number", placeholder: "e.g. 0.01" },
        { name: "cationCount", label: "Cation Coefficient (x)", type: "number", placeholder: "e.g. 1", defaultValue: 1, min: 1, step: 1 },
        { name: "anionConc", label: "Anion Concentration (M)", type: "number", placeholder: "e.g. 0.001" },
        { name: "anionCount", label: "Anion Coefficient (y)", type: "number", placeholder: "e.g. 2", defaultValue: 1, min: 1, step: 1 },
        { name: "kspExp", label: "Ksp (×10⁻ⁿ, coefficient)", type: "number", placeholder: "e.g. 1.77" },
        { name: "kspPow", label: "Ksp Exponent n (10⁻ⁿ)", type: "number", placeholder: "e.g. 10", step: 1 },
      ],
      calculate: (inputs) => {
        const cC = inputs.cationConc as number, x = inputs.cationCount as number || 1;
        const aC = inputs.anionConc as number, y = inputs.anionCount as number || 1;
        const coeff = inputs.kspExp as number, pow = inputs.kspPow as number;
        if (!cC || !aC || !coeff || pow === undefined) return null;
        const Q = Math.pow(cC, x) * Math.pow(aC, y);
        const ksp = coeff * Math.pow(10, -pow);
        const ratio = Q / ksp;
        let result = "No precipitate (Q < Ksp)";
        if (ratio > 1.01) result = "Precipitate WILL form (Q > Ksp)";
        else if (ratio >= 0.99) result = "At saturation (Q ≈ Ksp)";
        return {
          primary: { label: "Result", value: result },
          details: [
            { label: "Ion Product Q", value: Q.toExponential(4) },
            { label: "Ksp", value: ksp.toExponential(4) },
            { label: "Q/Ksp", value: formatNumber(ratio, 4) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["equilibrium-constant-calculator", "molarity-calculator", "ph-calculator"],
  faq: [
    { question: "What is the solubility product (Ksp)?", answer: "Ksp is the equilibrium constant for a sparingly soluble salt dissolving in water. For AxBy(s) ⇌ xA(aq) + yB(aq), Ksp = [A]^x[B]^y. Smaller Ksp = less soluble. It only applies to slightly soluble or insoluble salts." },
    { question: "How do I predict if a precipitate will form?", answer: "Calculate the ion product Q using actual ion concentrations. If Q > Ksp, the solution is supersaturated and a precipitate forms. If Q < Ksp, no precipitate (unsaturated). If Q = Ksp, saturated solution." },
    { question: "What is the common ion effect on solubility?", answer: "Adding a common ion (one already present from the salt) decreases solubility. For example, adding NaCl to a saturated AgCl solution shifts equilibrium left, decreasing AgCl solubility (Le Chatelier's principle)." },
  ],
  formula: "Ksp = [cation]^x × [anion]^y | For AxBy: Ksp = (xS)^x(yS)^y | Precipitate if Q > Ksp",
};
