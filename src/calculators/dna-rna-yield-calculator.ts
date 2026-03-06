import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dnaRnaYieldCalculator: CalculatorDefinition = {
  slug: "dna-rna-yield-calculator",
  title: "DNA/RNA Yield and Purity Calculator",
  description: "Calculate nucleic acid concentration, total yield, and purity ratios from UV spectrophotometer A260/A280 readings for DNA and RNA samples.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["dna yield calculator","rna yield purity","a260 a280 ratio","nucleic acid concentration","nanodrop results"],
  variants: [{
    id: "standard",
    name: "DNA/RNA Yield and Purity",
    description: "Calculate nucleic acid concentration, total yield, and purity ratios from UV spectrophotometer A260/A280 readings for DNA and RNA samples.",
    fields: [
      { name: "a260", label: "Absorbance at 260 nm", type: "number", min: 0.001, max: 10, defaultValue: 0.5 },
      { name: "a280", label: "Absorbance at 280 nm", type: "number", min: 0.001, max: 10, defaultValue: 0.27 },
      { name: "a230", label: "Absorbance at 230 nm", type: "number", min: 0.001, max: 10, defaultValue: 0.2 },
      { name: "nucleicType", label: "Nucleic Acid Type", type: "select", options: [{ value: "50", label: "Double-stranded DNA (50 ug/mL/OD)" }, { value: "40", label: "RNA (40 ug/mL/OD)" }, { value: "33", label: "Single-stranded DNA (33 ug/mL/OD)" }], defaultValue: "50" },
      { name: "dilutionFactor", label: "Dilution Factor", type: "number", min: 1, max: 1000, defaultValue: 1 },
      { name: "totalVolume", label: "Total Sample Volume (uL)", type: "number", min: 1, max: 10000, defaultValue: 50 },
    ],
    calculate: (inputs) => {
    const a260 = inputs.a260 as number;
    const a280 = inputs.a280 as number;
    const a230 = inputs.a230 as number;
    const nucleicType = inputs.nucleicType as number;
    const dilutionFactor = inputs.dilutionFactor as number;
    const totalVolume = inputs.totalVolume as number;
    const concentration = a260 * nucleicType * dilutionFactor;
    const totalYield = concentration * totalVolume / 1000;
    const ratio260280 = a260 / a280;
    const ratio260230 = a260 / a230;
    var purityStatus = "Good purity";
    if (nucleicType === 50 && (ratio260280 < 1.7 || ratio260280 > 2.0)) { purityStatus = "Possible contamination"; }
    if (nucleicType === 40 && (ratio260280 < 1.8 || ratio260280 > 2.2)) { purityStatus = "Possible contamination"; }
    if (ratio260230 < 1.8) { purityStatus = purityStatus + " (organic contamination possible)"; }
    return {
      primary: { label: "Concentration", value: formatNumber(Math.round(concentration * 10) / 10) + " ug/mL" },
      details: [
        { label: "Total Yield", value: formatNumber(Math.round(totalYield * 100) / 100) + " ug" },
        { label: "A260/A280 Ratio", value: formatNumber(Math.round(ratio260280 * 100) / 100) },
        { label: "A260/A230 Ratio", value: formatNumber(Math.round(ratio260230 * 100) / 100) },
        { label: "Purity Assessment", value: purityStatus }
      ]
    };
  },
  }],
  relatedSlugs: ["dna-concentration-calculator","pcr-cycle-number-calculator","spectrophotometer-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Concentration = A260 x Conversion Factor x Dilution
Total Yield = Concentration x Volume / 1000
Conversion: dsDNA = 50, RNA = 40, ssDNA = 33 (ug/mL per OD260)",
};
