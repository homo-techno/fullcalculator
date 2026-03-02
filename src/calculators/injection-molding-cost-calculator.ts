import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const injectionMoldingCostCalculator: CalculatorDefinition = {
  slug: "injection-molding-cost-calculator",
  title: "Injection Molding Cost Calculator",
  description: "Calculate per-part cost for injection molded parts.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["injection molding cost","per part mold cost"],
  variants: [{
    id: "standard",
    name: "Injection Molding Cost",
    description: "Calculate per-part cost for injection molded parts.",
    fields: [
      { name: "moldCost", label: "Mold Cost ($)", type: "number", min: 100, max: 500000, defaultValue: 15000 },
      { name: "partCount", label: "Total Parts", type: "number", min: 1, max: 10000000, defaultValue: 10000 },
      { name: "materialPerPart", label: "Material Per Part ($)", type: "number", min: 0.01, max: 50, defaultValue: 0.25 },
      { name: "cycleTime", label: "Cycle Time (sec)", type: "number", min: 5, max: 300, defaultValue: 30 },
    ],
    calculate: (inputs) => {
      const mold = inputs.moldCost as number;
      const parts = inputs.partCount as number;
      const matPer = inputs.materialPerPart as number;
      const cycle = inputs.cycleTime as number;
      if (!mold || !parts || !matPer || !cycle) return null;
      const machineRate = 40;
      const laborPerPart = Math.round((cycle / 3600) * machineRate * 100) / 100;
      const moldPerPart = Math.round((mold / parts) * 100) / 100;
      const totalPerPart = Math.round((moldPerPart + matPer + laborPerPart) * 100) / 100;
      const totalCost = Math.round(totalPerPart * parts);
      return {
        primary: { label: "Cost Per Part", value: "$" + formatNumber(totalPerPart) },
        details: [
          { label: "Mold Amortization Per Part", value: "$" + formatNumber(moldPerPart) },
          { label: "Material Per Part", value: "$" + formatNumber(matPer) },
          { label: "Total Production Cost", value: "$" + formatNumber(totalCost) },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "How much does an injection mold cost?", answer: "Simple molds start around $3000. Complex molds can exceed $100000." },
    { question: "How many parts before injection molding is worth it?", answer: "Injection molding is cost effective above about 1000 parts typically." },
  ],
  formula: "Per Part = (Mold Cost / Parts) + Material + Labor",
};
