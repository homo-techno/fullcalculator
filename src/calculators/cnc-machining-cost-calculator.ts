import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cncMachiningCostCalculator: CalculatorDefinition = {
  slug: "cnc-machining-cost-calculator",
  title: "CNC Machining Cost Calculator",
  description: "Estimate CNC machining time and cost for a part.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["CNC machining cost","CNC time estimate"],
  variants: [{
    id: "standard",
    name: "CNC Machining Cost",
    description: "Estimate CNC machining time and cost for a part.",
    fields: [
      { name: "materialVolume", label: "Material Volume (in3)", type: "number", min: 0.1, max: 5000, defaultValue: 20 },
      { name: "removalRate", label: "Removal Rate (in3/min)", type: "number", min: 0.01, max: 10, defaultValue: 0.5 },
      { name: "machineRate", label: "Machine Rate ($/hr)", type: "number", min: 10, max: 500, defaultValue: 75 },
      { name: "setupTime", label: "Setup Time (min)", type: "number", min: 0, max: 480, defaultValue: 30 },
    ],
    calculate: (inputs) => {
      const vol = inputs.materialVolume as number;
      const removal = inputs.removalRate as number;
      const rate = inputs.machineRate as number;
      const setup = inputs.setupTime as number;
      if (!vol || !removal || !rate) return null;
      const cutTimeMin = Math.round(vol / removal * 10) / 10;
      const totalMin = cutTimeMin + setup;
      const totalHrs = Math.round(totalMin / 60 * 100) / 100;
      const cost = Math.round(totalHrs * rate * 100) / 100;
      return {
        primary: { label: "Total Machining Cost", value: "$" + formatNumber(cost) },
        details: [
          { label: "Cut Time", value: formatNumber(cutTimeMin) + " min" },
          { label: "Total Time (with setup)", value: formatNumber(totalMin) + " min" },
          { label: "Total Hours", value: formatNumber(totalHrs) + " hrs" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What affects CNC machining cost?", answer: "Material hardness, part complexity, and machine rate drive cost." },
    { question: "What is a typical CNC machine rate?", answer: "CNC machine rates range from $50 to $150 per hour typically." },
  ],
  formula: "Cost = ((Volume / Removal Rate) + Setup Time) / 60 x Rate",
};
