import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pcrCycleNumberCalculator: CalculatorDefinition = {
  slug: "pcr-cycle-number-calculator",
  title: "PCR Cycle Number Calculator",
  description: "Calculate the theoretical DNA amplification yield from PCR based on number of cycles, initial template copies, and amplification efficiency.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["pcr cycle calculator","pcr amplification","dna copies pcr","polymerase chain reaction","pcr yield"],
  variants: [{
    id: "standard",
    name: "PCR Cycle Number",
    description: "Calculate the theoretical DNA amplification yield from PCR based on number of cycles, initial template copies, and amplification efficiency.",
    fields: [
      { name: "initialCopies", label: "Initial Template Copies", type: "number", min: 1, max: 1e12, defaultValue: 1000 },
      { name: "cycles", label: "Number of PCR Cycles", type: "number", min: 1, max: 60, defaultValue: 30 },
      { name: "efficiency", label: "Amplification Efficiency (%)", type: "number", min: 50, max: 100, defaultValue: 95 },
    ],
    calculate: (inputs) => {
    const initialCopies = inputs.initialCopies as number;
    const cycles = inputs.cycles as number;
    const efficiency = inputs.efficiency as number;
    const effFraction = efficiency / 100;
    const finalCopies = initialCopies * Math.pow(1 + effFraction, cycles);
    const foldAmplification = Math.pow(1 + effFraction, cycles);
    const idealCopies = initialCopies * Math.pow(2, cycles);
    const actualVsIdeal = (finalCopies / idealCopies) * 100;
    return {
      primary: { label: "Final DNA Copies", value: formatNumber(Math.round(finalCopies)) },
      details: [
        { label: "Fold Amplification", value: formatNumber(Math.round(foldAmplification)) + "x" },
        { label: "Ideal Copies (100% eff.)", value: formatNumber(Math.round(idealCopies)) },
        { label: "Actual vs Ideal", value: formatNumber(Math.round(actualVsIdeal * 100) / 100) + "%" },
        { label: "Effective Doublings", value: formatNumber(Math.round(Math.log2(foldAmplification) * 100) / 100) }
      ]
    };
  },
  }],
  relatedSlugs: ["dna-concentration-calculator","pcr-primer-calculator","serial-dilution-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Final Copies = N0 x (1 + E)^n
where N0 = initial copies, E = efficiency (decimal)
n = number of cycles
Fold Amplification = (1 + E)^n",
};
