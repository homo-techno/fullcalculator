import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const transfectionEfficiencyCalculator: CalculatorDefinition = {
  slug: "transfection-efficiency-calculator",
  title: "Transfection Efficiency Calculator",
  description: "Calculate mammalian cell transfection efficiency and optimize DNA-to-reagent ratios for lipofection, electroporation, or calcium phosphate transfection methods.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["transfection efficiency","lipofection calculator","dna transfection","cell transfection","gene delivery efficiency"],
  variants: [{
    id: "standard",
    name: "Transfection Efficiency",
    description: "Calculate mammalian cell transfection efficiency and optimize DNA-to-reagent ratios for lipofection, electroporation, or calcium phosphate transfection methods.",
    fields: [
      { name: "totalCells", label: "Total Cells Counted", type: "number", min: 10, max: 10000, defaultValue: 500 },
      { name: "positiveCells", label: "Positive (Transfected) Cells", type: "number", min: 0, max: 10000, defaultValue: 175 },
      { name: "dnaAmount", label: "DNA Amount (ug)", type: "number", min: 0.1, max: 100, defaultValue: 2 },
      { name: "reagentVolume", label: "Transfection Reagent (uL)", type: "number", min: 0.1, max: 200, defaultValue: 6 },
      { name: "wellArea", label: "Well Area (cm2)", type: "select", options: [{ value: "0.32", label: "96-well (0.32 cm2)" }, { value: "1.9", label: "24-well (1.9 cm2)" }, { value: "9.6", label: "6-well (9.6 cm2)" }, { value: "21", label: "35mm dish (21 cm2)" }, { value: "78.5", label: "100mm dish (78.5 cm2)" }], defaultValue: "9.6" },
    ],
    calculate: (inputs) => {
    const totalCells = inputs.totalCells as number;
    const positiveCells = inputs.positiveCells as number;
    const dnaAmount = inputs.dnaAmount as number;
    const reagentVolume = inputs.reagentVolume as number;
    const wellArea = inputs.wellArea as number;
    const efficiency = totalCells > 0 ? (positiveCells / totalCells) * 100 : 0;
    const ratio = reagentVolume / dnaAmount;
    const dnaPerCm2 = dnaAmount / wellArea;
    var rating = "Poor - optimize conditions";
    if (efficiency >= 20) { rating = "Fair"; }
    if (efficiency >= 50) { rating = "Good"; }
    if (efficiency >= 70) { rating = "Excellent"; }
    return {
      primary: { label: "Transfection Efficiency", value: formatNumber(Math.round(efficiency * 10) / 10) + "%" },
      details: [
        { label: "Reagent:DNA Ratio", value: formatNumber(Math.round(ratio * 10) / 10) + ":1 (uL:ug)" },
        { label: "DNA Per cm2", value: formatNumber(Math.round(dnaPerCm2 * 1000) / 1000) + " ug/cm2" },
        { label: "Performance Rating", value: rating },
        { label: "Positive / Total Cells", value: formatNumber(positiveCells) + " / " + formatNumber(totalCells) }
      ]
    };
  },
  }],
  relatedSlugs: ["cell-viability-calculator","ligation-ratio-calculator","dna-concentration-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Transfection Efficiency (%) = (Positive Cells / Total Cells) x 100; Reagent:DNA Ratio = Reagent Volume (uL) / DNA Amount (ug); DNA/cm2 = DNA Amount / Well Area",
};
