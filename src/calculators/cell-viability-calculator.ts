import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cellViabilityCalculator: CalculatorDefinition = {
  slug: "cell-viability-calculator",
  title: "Cell Viability Calculator",
  description: "Calculate cell viability percentage and viable cell concentration from trypan blue exclusion assay hemocytometer counts in cell culture experiments.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["cell viability","trypan blue exclusion","hemocytometer count","live dead cell ratio","cell culture viability"],
  variants: [{
    id: "standard",
    name: "Cell Viability",
    description: "Calculate cell viability percentage and viable cell concentration from trypan blue exclusion assay hemocytometer counts in cell culture experiments.",
    fields: [
      { name: "liveCells", label: "Live Cells Counted", type: "number", min: 0, max: 500, defaultValue: 85 },
      { name: "deadCells", label: "Dead Cells Counted (Stained)", type: "number", min: 0, max: 500, defaultValue: 15 },
      { name: "squaresCounted", label: "Large Squares Counted", type: "number", min: 1, max: 25, defaultValue: 4 },
      { name: "dilutionFactor", label: "Dilution Factor", type: "number", min: 1, max: 100, defaultValue: 2 },
    ],
    calculate: (inputs) => {
    const liveCells = inputs.liveCells as number;
    const deadCells = inputs.deadCells as number;
    const squaresCounted = inputs.squaresCounted as number;
    const dilutionFactor = inputs.dilutionFactor as number;
    const totalCells = liveCells + deadCells;
    const viability = totalCells > 0 ? (liveCells / totalCells) * 100 : 0;
    const avgPerSquare = totalCells / squaresCounted;
    const cellsPerMl = avgPerSquare * 10000 * dilutionFactor;
    const viableCellsPerMl = cellsPerMl * (viability / 100);
    return {
      primary: { label: "Cell Viability", value: formatNumber(Math.round(viability * 10) / 10) + "%" },
      details: [
        { label: "Viable Cells/mL", value: formatNumber(Math.round(viableCellsPerMl)) },
        { label: "Total Cells/mL", value: formatNumber(Math.round(cellsPerMl)) },
        { label: "Total Cells Counted", value: formatNumber(totalCells) },
        { label: "Average Per Square", value: formatNumber(Math.round(avgPerSquare * 10) / 10) }
      ]
    };
  },
  }],
  relatedSlugs: ["hemocytometer-calculator","od600-cell-density-calculator","bacterial-growth-rate-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Viability (%) = (Live Cells / Total Cells) x 100; Cells/mL = (Avg Cells/Square) x 10,000 x Dilution Factor; Viable Cells/mL = Cells/mL x (Viability/100)",
};
