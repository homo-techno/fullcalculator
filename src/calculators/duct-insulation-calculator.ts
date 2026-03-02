import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ductInsulationCalculator: CalculatorDefinition = {
  slug: "duct-insulation-calculator",
  title: "Duct Insulation Calculator",
  description: "Estimate energy savings from insulating ductwork.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["duct insulation","duct r-value"],
  variants: [{
    id: "standard",
    name: "Duct Insulation",
    description: "Estimate energy savings from insulating ductwork.",
    fields: [
      { name: "ductLength", label: "Duct Length (ft)", type: "number", min: 1, max: 500, defaultValue: 50 },
      { name: "ductDiameter", label: "Duct Diameter (in)", type: "number", min: 4, max: 24, defaultValue: 8 },
      { name: "tempDiff", label: "Temperature Difference (F)", type: "number", min: 5, max: 80, defaultValue: 30 },
      { name: "rValue", label: "Insulation R-Value", type: "number", min: 2, max: 12, defaultValue: 6 },
    ],
    calculate: (inputs) => {
      const len = inputs.ductLength as number;
      const dia = inputs.ductDiameter as number;
      const dt = inputs.tempDiff as number;
      const r = inputs.rValue as number;
      const surfaceArea = Math.PI * (dia / 12) * len;
      const heatLossUninsulated = surfaceArea * dt / 1;
      const heatLossInsulated = surfaceArea * dt / r;
      const saved = heatLossUninsulated - heatLossInsulated;
      return {
        primary: { label: "BTU/hr Saved", value: formatNumber(Math.round(saved)) },
        details: [
          { label: "Duct Surface Area", value: formatNumber(Math.round(surfaceArea)) + " sq ft" },
          { label: "Uninsulated Loss", value: formatNumber(Math.round(heatLossUninsulated)) + " BTU/hr" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What R-value is best for ducts?", answer: "R-6 or R-8 insulation is recommended for most duct systems." },
    { question: "Should I insulate all ducts?", answer: "Insulate ducts in unconditioned spaces like attics and crawl spaces." },
  ],
  formula: "Savings = Surface Area x TempDiff x (1 - 1/R)",
};
