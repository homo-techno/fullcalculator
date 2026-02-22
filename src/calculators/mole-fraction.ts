import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const moleFractionCalculator: CalculatorDefinition = {
  slug: "mole-fraction-calculator",
  title: "Mole Fraction Calculator",
  description: "Free mole fraction calculator. Calculate the mole fraction of solute and solvent in a solution. Used in Raoult's law and colligative property calculations.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["mole fraction", "mole ratio", "solution composition", "Raoult's law", "colligative properties"],
  variants: [
    {
      id: "two-component",
      name: "Two-Component Solution",
      fields: [
        { name: "molesA", label: "Moles of Component A (solute)", type: "number", placeholder: "e.g. 0.5", min: 0, step: 0.001 },
        { name: "molesB", label: "Moles of Component B (solvent)", type: "number", placeholder: "e.g. 5.0", min: 0, step: 0.001 },
      ],
      calculate: (inputs) => {
        const molesA = inputs.molesA as number;
        const molesB = inputs.molesB as number;
        if (!molesA || !molesB || molesA < 0 || molesB < 0) return null;
        const total = molesA + molesB;
        const xA = molesA / total;
        const xB = molesB / total;
        return {
          primary: { label: "Mole Fraction of A (χ_A)", value: formatNumber(xA, 6) },
          details: [
            { label: "Mole Fraction of B (χ_B)", value: formatNumber(xB, 6) },
            { label: "Total Moles", value: formatNumber(total, 4) },
            { label: "χ_A + χ_B", value: formatNumber(xA + xB, 4) },
            { label: "Mole % of A", value: `${formatNumber(xA * 100, 2)}%` },
          ],
          note: "The sum of all mole fractions in a solution always equals 1.",
        };
      },
    },
    {
      id: "three-component",
      name: "Three-Component Solution",
      fields: [
        { name: "molesA", label: "Moles of Component A", type: "number", placeholder: "e.g. 1.0", min: 0, step: 0.001 },
        { name: "molesB", label: "Moles of Component B", type: "number", placeholder: "e.g. 2.0", min: 0, step: 0.001 },
        { name: "molesC", label: "Moles of Component C", type: "number", placeholder: "e.g. 3.0", min: 0, step: 0.001 },
      ],
      calculate: (inputs) => {
        const molesA = inputs.molesA as number;
        const molesB = inputs.molesB as number;
        const molesC = inputs.molesC as number;
        if (!molesA || !molesB || !molesC || molesA < 0 || molesB < 0 || molesC < 0) return null;
        const total = molesA + molesB + molesC;
        const xA = molesA / total;
        const xB = molesB / total;
        const xC = molesC / total;
        return {
          primary: { label: "Mole Fraction of A (χ_A)", value: formatNumber(xA, 6) },
          details: [
            { label: "Mole Fraction of B (χ_B)", value: formatNumber(xB, 6) },
            { label: "Mole Fraction of C (χ_C)", value: formatNumber(xC, 6) },
            { label: "Total Moles", value: formatNumber(total, 4) },
            { label: "Sum of Fractions", value: formatNumber(xA + xB + xC, 4) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["molarity-calculator", "colligative-properties-calculator", "concentration-calculator"],
  faq: [
    { question: "What is mole fraction?", answer: "Mole fraction (χ) is the ratio of moles of one component to the total moles of all components in a mixture. It is dimensionless and always between 0 and 1. All mole fractions in a mixture sum to 1." },
    { question: "Where is mole fraction used?", answer: "Mole fraction is used in Raoult's law for vapor pressure calculations, Dalton's law for partial pressures, and in calculating colligative properties of solutions." },
  ],
  formula: "χ_A = n_A / (n_A + n_B + ...) | where χ = mole fraction, n = moles",
};
