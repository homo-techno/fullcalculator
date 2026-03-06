import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const westernBlotDilutionCalculator: CalculatorDefinition = {
  slug: "western-blot-dilution-calculator",
  title: "Western Blot Antibody Dilution Calculator",
  description: "Calculate antibody dilution volumes for western blot experiments based on stock concentration, desired working dilution, and total volume of blocking solution.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["western blot dilution","antibody dilution","primary antibody volume","immunoblot dilution","wb antibody prep"],
  variants: [{
    id: "standard",
    name: "Western Blot Antibody Dilution",
    description: "Calculate antibody dilution volumes for western blot experiments based on stock concentration, desired working dilution, and total volume of blocking solution.",
    fields: [
      { name: "desiredDilution", label: "Desired Dilution (e.g. 1000 for 1:1000)", type: "number", min: 10, max: 100000, defaultValue: 1000 },
      { name: "totalVolume", label: "Total Solution Volume (mL)", type: "number", min: 1, max: 100, defaultValue: 10 },
      { name: "stockConc", label: "Stock Antibody Conc. (mg/mL)", type: "number", min: 0.01, max: 20, defaultValue: 1 },
      { name: "numStrips", label: "Number of Membrane Strips", type: "number", min: 1, max: 20, defaultValue: 1 },
    ],
    calculate: (inputs) => {
    const desiredDilution = inputs.desiredDilution as number;
    const totalVolume = inputs.totalVolume as number;
    const stockConc = inputs.stockConc as number;
    const numStrips = inputs.numStrips as number;
    const totalVolumeNeeded = totalVolume * numStrips;
    const antibodyVolume = totalVolumeNeeded / desiredDilution;
    const antibodyVolUl = antibodyVolume * 1000;
    const workingConc = stockConc / desiredDilution * 1000;
    const blockingVol = totalVolumeNeeded - antibodyVolume;
    return {
      primary: { label: "Antibody Volume Needed", value: formatNumber(Math.round(antibodyVolUl * 100) / 100) + " uL" },
      details: [
        { label: "Working Concentration", value: formatNumber(Math.round(workingConc * 100) / 100) + " ug/mL" },
        { label: "Blocking Solution Volume", value: formatNumber(Math.round(blockingVol * 100) / 100) + " mL" },
        { label: "Total Solution Volume", value: formatNumber(totalVolumeNeeded) + " mL" },
        { label: "Dilution Ratio", value: "1:" + formatNumber(desiredDilution) }
      ]
    };
  },
  }],
  relatedSlugs: ["dilution-calculator","bradford-assay-protein-calculator","solution-preparation-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Antibody Volume (mL) = Total Volume / Dilution Factor; Working Conc. (ug/mL) = Stock Conc. (mg/mL) x 1000 / Dilution; Blocking Solution = Total Volume - Antibody Volume",
};
