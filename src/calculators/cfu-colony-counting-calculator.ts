import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cfuColonyCountingCalculator: CalculatorDefinition = {
  slug: "cfu-colony-counting-calculator",
  title: "CFU Colony Counting Calculator",
  description: "Calculate colony forming units per milliliter (CFU/mL) from plate counts with dilution factors for accurate microbial enumeration in lab samples.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["cfu calculator","colony forming units","plate count method","microbial enumeration","viable cell count"],
  variants: [{
    id: "standard",
    name: "CFU Colony Counting",
    description: "Calculate colony forming units per milliliter (CFU/mL) from plate counts with dilution factors for accurate microbial enumeration in lab samples.",
    fields: [
      { name: "colonies", label: "Colonies Counted", type: "number", min: 1, max: 1000, defaultValue: 150 },
      { name: "dilutionFactor", label: "Dilution Factor (e.g. 1e-6 enter 6)", type: "number", min: 0, max: 15, defaultValue: 6 },
      { name: "volumePlated", label: "Volume Plated (mL)", type: "number", min: 0.01, max: 1, defaultValue: 0.1 },
      { name: "numPlates", label: "Number of Replicate Plates", type: "number", min: 1, max: 10, defaultValue: 3 },
    ],
    calculate: (inputs) => {
    const colonies = inputs.colonies as number;
    const dilutionFactor = inputs.dilutionFactor as number;
    const volumePlated = inputs.volumePlated as number;
    const numPlates = inputs.numPlates as number;
    const avgColonies = colonies / numPlates;
    const dilution = Math.pow(10, -dilutionFactor);
    const cfuPerMl = avgColonies / (dilution * volumePlated);
    const logCfu = Math.log10(cfuPerMl);
    return {
      primary: { label: "CFU/mL", value: formatNumber(Math.round(cfuPerMl)) },
      details: [
        { label: "Average Colonies Per Plate", value: formatNumber(Math.round(avgColonies * 10) / 10) },
        { label: "Dilution Used", value: "10^-" + formatNumber(dilutionFactor) },
        { label: "Log10 CFU/mL", value: formatNumber(Math.round(logCfu * 100) / 100) },
        { label: "Total Colonies Counted", value: formatNumber(colonies) }
      ]
    };
  },
  }],
  relatedSlugs: ["bacterial-growth-rate-calculator","od600-cell-density-calculator","serial-dilution-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "CFU/mL = (Average Colonies) / (Dilution Factor x Volume Plated)
Dilution Factor = 10^(-n)
where n = number of serial dilution steps",
};
