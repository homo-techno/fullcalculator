import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const molarRatioCalculator: CalculatorDefinition = {
  slug: "molar-ratio-calculator",
  title: "Molar Ratio Calculator",
  description: "Free molar ratio calculator. Determine the molar ratio between two substances and calculate amounts needed for stoichiometric reactions.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["molar ratio", "stoichiometry", "balanced equation", "chemical reaction", "mole ratio"],
  variants: [
    {
      id: "from-moles",
      name: "Molar Ratio from Moles",
      fields: [
        { name: "molesA", label: "Moles of Substance A", type: "number", placeholder: "e.g. 2.0", min: 0, step: 0.001 },
        { name: "molesB", label: "Moles of Substance B", type: "number", placeholder: "e.g. 3.0", min: 0, step: 0.001 },
      ],
      calculate: (inputs) => {
        const molesA = inputs.molesA as number;
        const molesB = inputs.molesB as number;
        if (!molesA || !molesB || molesA <= 0 || molesB <= 0) return null;
        const ratioAtoB = molesA / molesB;
        const ratioBtoA = molesB / molesA;
        const minVal = Math.min(molesA, molesB);
        const normA = molesA / minVal;
        const normB = molesB / minVal;
        return {
          primary: { label: "Molar Ratio (A:B)", value: `${formatNumber(normA, 3)} : ${formatNumber(normB, 3)}` },
          details: [
            { label: "A/B", value: formatNumber(ratioAtoB, 6) },
            { label: "B/A", value: formatNumber(ratioBtoA, 6) },
            { label: "Moles of A", value: formatNumber(molesA, 6) },
            { label: "Moles of B", value: formatNumber(molesB, 6) },
          ],
          note: "Molar ratios from a balanced equation determine exact proportions needed for complete reaction.",
        };
      },
    },
    {
      id: "stoichiometric-amount",
      name: "Stoichiometric Amount Needed",
      fields: [
        { name: "molesKnown", label: "Moles of Known Substance", type: "number", placeholder: "e.g. 1.5", min: 0, step: 0.001 },
        { name: "coeffKnown", label: "Coefficient of Known (in equation)", type: "number", placeholder: "e.g. 2", min: 1, step: 1 },
        { name: "coeffUnknown", label: "Coefficient of Unknown (in equation)", type: "number", placeholder: "e.g. 3", min: 1, step: 1 },
      ],
      calculate: (inputs) => {
        const molesK = inputs.molesKnown as number;
        const coeffK = inputs.coeffKnown as number;
        const coeffU = inputs.coeffUnknown as number;
        if (!molesK || !coeffK || !coeffU || molesK < 0 || coeffK < 1 || coeffU < 1) return null;
        const molesUnknown = molesK * (coeffU / coeffK);
        return {
          primary: { label: "Moles of Unknown", value: formatNumber(molesUnknown, 6), suffix: "mol" },
          details: [
            { label: "Moles of Known", value: formatNumber(molesK, 6) },
            { label: "Stoichiometric Ratio", value: `${coeffU}:${coeffK}` },
            { label: "Conversion Factor", value: formatNumber(coeffU / coeffK, 4) },
          ],
        };
      },
    },
    {
      id: "from-mass",
      name: "Molar Ratio from Masses",
      fields: [
        { name: "massA", label: "Mass of Substance A (g)", type: "number", placeholder: "e.g. 10", min: 0, step: 0.01 },
        { name: "mmA", label: "Molar Mass of A (g/mol)", type: "number", placeholder: "e.g. 40", min: 0.001, step: 0.001 },
        { name: "massB", label: "Mass of Substance B (g)", type: "number", placeholder: "e.g. 15", min: 0, step: 0.01 },
        { name: "mmB", label: "Molar Mass of B (g/mol)", type: "number", placeholder: "e.g. 60", min: 0.001, step: 0.001 },
      ],
      calculate: (inputs) => {
        const massA = inputs.massA as number;
        const mmA = inputs.mmA as number;
        const massB = inputs.massB as number;
        const mmB = inputs.mmB as number;
        if (!massA || !mmA || !massB || !mmB || massA <= 0 || mmA <= 0 || massB <= 0 || mmB <= 0) return null;
        const molesA = massA / mmA;
        const molesB = massB / mmB;
        const minVal = Math.min(molesA, molesB);
        const normA = molesA / minVal;
        const normB = molesB / minVal;
        return {
          primary: { label: "Molar Ratio (A:B)", value: `${formatNumber(normA, 3)} : ${formatNumber(normB, 3)}` },
          details: [
            { label: "Moles of A", value: formatNumber(molesA, 6) },
            { label: "Moles of B", value: formatNumber(molesB, 6) },
            { label: "A/B", value: formatNumber(molesA / molesB, 6) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["grams-to-moles-calculator", "theoretical-yield-calculator", "limiting-reagent-calculator"],
  faq: [
    { question: "What is a molar ratio?", answer: "A molar ratio is the ratio of moles of one substance to moles of another in a chemical reaction. It is determined by the coefficients in a balanced chemical equation. For example, in 2H₂ + O₂ → 2H₂O, the molar ratio of H₂ to O₂ is 2:1." },
    { question: "How do I use molar ratios in stoichiometry?", answer: "Use molar ratios as conversion factors. Convert given mass to moles, multiply by the molar ratio to find moles of desired substance, then convert back to mass if needed." },
  ],
  formula: "Molar Ratio = n_A / n_B | n_unknown = n_known × (coeff_unknown / coeff_known)",
};
