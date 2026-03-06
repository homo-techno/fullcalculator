import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bradfordAssayProteinCalculator: CalculatorDefinition = {
  slug: "bradford-assay-protein-calculator",
  title: "Bradford Assay Protein Concentration Calculator",
  description: "Calculate protein concentration from Bradford assay absorbance readings using a standard curve with BSA standards and Beer-Lambert law.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["bradford assay","protein concentration","bsa standard curve","coomassie assay","protein quantification"],
  variants: [{
    id: "standard",
    name: "Bradford Assay Protein Concentration",
    description: "Calculate protein concentration from Bradford assay absorbance readings using a standard curve with BSA standards and Beer-Lambert law.",
    fields: [
      { name: "absorbance", label: "Sample Absorbance (595 nm)", type: "number", min: 0.01, max: 2, defaultValue: 0.45 },
      { name: "slope", label: "Standard Curve Slope (Abs/ug/mL)", type: "number", min: 0.0001, max: 0.1, defaultValue: 0.0012 },
      { name: "intercept", label: "Standard Curve Y-Intercept", type: "number", min: -0.5, max: 0.5, defaultValue: 0.05 },
      { name: "dilutionFactor", label: "Sample Dilution Factor", type: "number", min: 1, max: 1000, defaultValue: 10 },
      { name: "sampleVolume", label: "Total Sample Volume (mL)", type: "number", min: 0.01, max: 100, defaultValue: 1 },
    ],
    calculate: (inputs) => {
    const absorbance = inputs.absorbance as number;
    const slope = inputs.slope as number;
    const intercept = inputs.intercept as number;
    const dilutionFactor = inputs.dilutionFactor as number;
    const sampleVolume = inputs.sampleVolume as number;
    const concDiluted = (absorbance - intercept) / slope;
    const concOriginal = concDiluted * dilutionFactor;
    const totalProtein = concOriginal * sampleVolume / 1000;
    const concMgMl = concOriginal / 1000;
    return {
      primary: { label: "Protein Concentration", value: formatNumber(Math.round(concOriginal * 10) / 10) + " ug/mL" },
      details: [
        { label: "Concentration (mg/mL)", value: formatNumber(Math.round(concMgMl * 1000) / 1000) },
        { label: "Diluted Sample Conc.", value: formatNumber(Math.round(concDiluted * 10) / 10) + " ug/mL" },
        { label: "Total Protein", value: formatNumber(Math.round(totalProtein * 1000) / 1000) + " mg" },
        { label: "Dilution Correction", value: formatNumber(dilutionFactor) + "x" }
      ]
    };
  },
  }],
  relatedSlugs: ["spectrophotometer-calculator","serial-dilution-calculator","solution-preparation-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Concentration (diluted) = (Absorbance - Intercept) / Slope; Original Concentration = Diluted Conc. x Dilution Factor; Total Protein = Concentration x Volume",
};
