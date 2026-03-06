import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const elisaStandardCurveCalculator: CalculatorDefinition = {
  slug: "elisa-standard-curve-calculator",
  title: "ELISA Standard Curve Calculator",
  description: "Calculate analyte concentration from ELISA optical density readings using a linear standard curve with known concentration standards.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["elisa calculator","elisa standard curve","elisa concentration","immunoassay analysis","od to concentration"],
  variants: [{
    id: "standard",
    name: "ELISA Standard Curve",
    description: "Calculate analyte concentration from ELISA optical density readings using a linear standard curve with known concentration standards.",
    fields: [
      { name: "sampleOd", label: "Sample OD Reading", type: "number", min: 0.01, max: 4, defaultValue: 0.85 },
      { name: "slope", label: "Standard Curve Slope", type: "number", min: 0.0001, max: 10, defaultValue: 0.005 },
      { name: "intercept", label: "Y-Intercept", type: "number", min: -1, max: 1, defaultValue: 0.05 },
      { name: "dilutionFactor", label: "Sample Dilution Factor", type: "number", min: 1, max: 10000, defaultValue: 100 },
      { name: "unit", label: "Concentration Unit", type: "select", options: [{ value: "1", label: "pg/mL" }, { value: "2", label: "ng/mL" }, { value: "3", label: "ug/mL" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
    const sampleOd = inputs.sampleOd as number;
    const slope = inputs.slope as number;
    const intercept = inputs.intercept as number;
    const dilutionFactor = inputs.dilutionFactor as number;
    const unit = inputs.unit as number;
    var unitLabel = "pg/mL";
    if (unit === 2) { unitLabel = "ng/mL"; }
    if (unit === 3) { unitLabel = "ug/mL"; }
    const concDiluted = (sampleOd - intercept) / slope;
    const concOriginal = concDiluted * dilutionFactor;
    const correctedOd = sampleOd - intercept;
    return {
      primary: { label: "Analyte Concentration", value: formatNumber(Math.round(concOriginal * 100) / 100) + " " + unitLabel },
      details: [
        { label: "Diluted Sample Conc.", value: formatNumber(Math.round(concDiluted * 100) / 100) + " " + unitLabel },
        { label: "Corrected OD", value: formatNumber(Math.round(correctedOd * 1000) / 1000) },
        { label: "Dilution Factor", value: formatNumber(dilutionFactor) + "x" },
        { label: "Blank-Subtracted OD", value: formatNumber(Math.round(sampleOd * 1000) / 1000) }
      ]
    };
  },
  }],
  relatedSlugs: ["bradford-assay-protein-calculator","spectrophotometer-calculator","serial-dilution-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Concentration (diluted) = (Sample OD - Intercept) / Slope; Original Concentration = Diluted Conc. x Dilution Factor",
};
