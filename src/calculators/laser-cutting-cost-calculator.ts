import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const laserCuttingCostCalculator: CalculatorDefinition = {
  slug: "laser-cutting-cost-calculator",
  title: "Laser Cutting Cost Calculator",
  description: "Estimate cost for a laser cutting job by material and time.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["laser cutting cost","laser cut estimate"],
  variants: [{
    id: "standard",
    name: "Laser Cutting Cost",
    description: "Estimate cost for a laser cutting job by material and time.",
    fields: [
      { name: "cutLength", label: "Total Cut Length (in)", type: "number", min: 1, max: 100000, defaultValue: 200 },
      { name: "materialThick", label: "Material Thickness (mm)", type: "number", min: 0.5, max: 25, defaultValue: 3 },
      { name: "ratePerMin", label: "Machine Rate ($/min)", type: "number", min: 0.5, max: 20, defaultValue: 3 },
      { name: "materialCost", label: "Material Cost ($)", type: "number", min: 0, max: 5000, defaultValue: 25 },
    ],
    calculate: (inputs) => {
      const cutLen = inputs.cutLength as number;
      const thick = inputs.materialThick as number;
      const rate = inputs.ratePerMin as number;
      const matCost = inputs.materialCost as number;
      if (!cutLen || !thick || !rate) return null;
      const speedIpm = Math.max(5, 120 / thick);
      const cutTimeMin = Math.round(cutLen / speedIpm * 100) / 100;
      const machineCost = Math.round(cutTimeMin * rate * 100) / 100;
      const totalCost = Math.round((machineCost + matCost) * 100) / 100;
      return {
        primary: { label: "Total Job Cost", value: "$" + formatNumber(totalCost) },
        details: [
          { label: "Cut Time", value: formatNumber(cutTimeMin) + " min" },
          { label: "Machine Cost", value: "$" + formatNumber(machineCost) },
          { label: "Material Cost", value: "$" + formatNumber(matCost) },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What affects laser cutting cost?", answer: "Material thickness, cut length, and machine rate are the main factors." },
    { question: "Is laser cutting expensive?", answer: "Laser cutting is cost effective for detailed cuts and small batches." },
  ],
  formula: "Total Cost = (Cut Length / Speed) x Rate + Material Cost",
};
