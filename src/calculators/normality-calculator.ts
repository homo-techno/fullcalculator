import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const normalityCalculator: CalculatorDefinition = {
  slug: "normality-calculator",
  title: "Normality Calculator",
  description: "Free normality calculator. Calculate the normality (equivalents per liter) of a solution from molarity and equivalence factor. Used in titration and acid-base chemistry.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["normality", "equivalents", "acid base", "titration", "solution concentration", "N factor"],
  variants: [
    {
      id: "from-molarity",
      name: "Normality from Molarity",
      fields: [
        { name: "molarity", label: "Molarity (M)", type: "number", placeholder: "e.g. 0.5", min: 0, step: 0.001 },
        { name: "nFactor", label: "n-Factor (equivalence factor)", type: "number", placeholder: "e.g. 2 for H₂SO₄", min: 1, step: 1 },
      ],
      calculate: (inputs) => {
        const molarity = inputs.molarity as number;
        const nFactor = inputs.nFactor as number;
        if (!molarity || !nFactor || molarity < 0 || nFactor < 1) return null;
        const normality = molarity * nFactor;
        return {
          primary: { label: "Normality", value: formatNumber(normality, 4), suffix: "N" },
          details: [
            { label: "Molarity", value: `${formatNumber(molarity, 4)} M` },
            { label: "n-Factor", value: formatNumber(nFactor, 0) },
            { label: "Equivalents per Liter", value: formatNumber(normality, 4) },
          ],
          note: "N = M × n-factor. n-factor: for acids = number of H⁺ ions donated; for bases = number of OH⁻ ions; for redox = electrons transferred.",
        };
      },
    },
    {
      id: "from-mass",
      name: "Normality from Mass",
      fields: [
        { name: "mass", label: "Solute Mass (grams)", type: "number", placeholder: "e.g. 49", min: 0, step: 0.01 },
        { name: "equivalentWeight", label: "Equivalent Weight (g/eq)", type: "number", placeholder: "e.g. 49 for H₂SO₄", min: 0.001, step: 0.001 },
        { name: "volume", label: "Solution Volume (L)", type: "number", placeholder: "e.g. 1.0", min: 0.001, step: 0.001 },
      ],
      calculate: (inputs) => {
        const mass = inputs.mass as number;
        const eqWeight = inputs.equivalentWeight as number;
        const volume = inputs.volume as number;
        if (!mass || !eqWeight || !volume || mass < 0 || eqWeight <= 0 || volume <= 0) return null;
        const equivalents = mass / eqWeight;
        const normality = equivalents / volume;
        return {
          primary: { label: "Normality", value: formatNumber(normality, 4), suffix: "N" },
          details: [
            { label: "Gram Equivalents", value: formatNumber(equivalents, 4) },
            { label: "Solute Mass", value: `${formatNumber(mass, 4)} g` },
            { label: "Equivalent Weight", value: `${formatNumber(eqWeight, 4)} g/eq` },
            { label: "Volume", value: `${formatNumber(volume, 4)} L` },
          ],
          note: "Equivalent weight = molar mass / n-factor. For H₂SO₄: 98.079 / 2 = 49.04 g/eq.",
        };
      },
    },
    {
      id: "common-acids",
      name: "Common Acids & Bases",
      fields: [
        { name: "molarity", label: "Molarity (M)", type: "number", placeholder: "e.g. 1.0", min: 0, step: 0.001 },
        {
          name: "substance",
          label: "Substance",
          type: "select",
          options: [
            { label: "HCl (n=1)", value: "1" },
            { label: "H₂SO₄ (n=2)", value: "2" },
            { label: "H₃PO₄ (n=3)", value: "3" },
            { label: "NaOH (n=1)", value: "1" },
            { label: "Ca(OH)₂ (n=2)", value: "2" },
            { label: "Al(OH)₃ (n=3)", value: "3" },
          ],
        },
      ],
      calculate: (inputs) => {
        const molarity = inputs.molarity as number;
        const nFactor = parseInt(inputs.substance as string, 10);
        if (!molarity || !nFactor || molarity < 0) return null;
        const normality = molarity * nFactor;
        return {
          primary: { label: "Normality", value: formatNumber(normality, 4), suffix: "N" },
          details: [
            { label: "Molarity", value: `${formatNumber(molarity, 4)} M` },
            { label: "n-Factor", value: `${nFactor}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["molarity-calculator", "titration-calculator", "concentration-calculator"],
  faq: [
    { question: "What is normality?", answer: "Normality (N) is the number of gram equivalents of solute per liter of solution. It equals molarity multiplied by the n-factor (number of H⁺, OH⁻, or electrons exchanged per molecule)." },
    { question: "When should I use normality instead of molarity?", answer: "Normality is preferred in acid-base titrations and redox reactions because it directly accounts for the reactive capacity of each molecule, simplifying stoichiometric calculations." },
  ],
  formula: "N = M × n | N = (mass / equivalent weight) / volume (L)",
};
