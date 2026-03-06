import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const od600CellDensityCalculator: CalculatorDefinition = {
  slug: "od600-cell-density-calculator",
  title: "OD600 Cell Density Calculator",
  description: "Convert optical density at 600nm (OD600) readings to estimated cell density in CFU/mL or cells/mL for common bacterial and yeast cultures.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["od600 calculator","optical density cells","bacterial cell density","absorbance to cfu","spectrophotometer cell count"],
  variants: [{
    id: "standard",
    name: "OD600 Cell Density",
    description: "Convert optical density at 600nm (OD600) readings to estimated cell density in CFU/mL or cells/mL for common bacterial and yeast cultures.",
    fields: [
      { name: "od600", label: "OD600 Reading", type: "number", min: 0.01, max: 5, defaultValue: 0.6 },
      { name: "organism", label: "Organism Type", type: "select", options: [{ value: "8", label: "E. coli (8e8 cells/mL/OD)" }, { value: "3", label: "S. cerevisiae (3e7 cells/mL/OD)" }, { value: "5", label: "Generic Bacteria (5e8 cells/mL/OD)" }], defaultValue: "8" },
      { name: "dilutionFactor", label: "Dilution Factor", type: "number", min: 1, max: 10000, defaultValue: 1 },
      { name: "targetOd", label: "Target OD600 for Subculture", type: "number", min: 0.01, max: 2, defaultValue: 0.05 },
    ],
    calculate: (inputs) => {
    const od600 = inputs.od600 as number;
    const organism = inputs.organism as number;
    const dilutionFactor = inputs.dilutionFactor as number;
    const targetOd = inputs.targetOd as number;
    var cellsPerOd = 8e8;
    if (organism === 3) { cellsPerOd = 3e7; }
    if (organism === 5) { cellsPerOd = 5e8; }
    const actualOd = od600 * dilutionFactor;
    const cellDensity = actualOd * cellsPerOd;
    const dilutionNeeded = actualOd / targetOd;
    const volumeToAdd = 1000 / dilutionNeeded;
    return {
      primary: { label: "Cell Density", value: formatNumber(Math.round(cellDensity)) + " cells/mL" },
      details: [
        { label: "Corrected OD600", value: formatNumber(Math.round(actualOd * 1000) / 1000) },
        { label: "Dilution for Target OD", value: "1:" + formatNumber(Math.round(dilutionNeeded * 10) / 10) },
        { label: "Culture Volume for 1 L", value: formatNumber(Math.round(volumeToAdd * 10) / 10) + " mL" },
        { label: "Conversion Factor", value: formatNumber(cellsPerOd) + " cells/mL/OD" }
      ]
    };
  },
  }],
  relatedSlugs: ["bacterial-growth-rate-calculator","serial-dilution-calculator","spectrophotometer-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Cell Density = OD600 x Dilution Factor x Conversion Factor
Dilution for Target = Actual OD / Target OD
E. coli: ~8 x 10^8 cells/mL per OD unit",
};
