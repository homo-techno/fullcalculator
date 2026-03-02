import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const retirementHomeCostCalculator: CalculatorDefinition = {
  slug: "retirement-home-cost-calculator",
  title: "Retirement Home Cost Calculator",
  description: "Estimate monthly senior living facility costs.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["retirement home cost","senior living cost","assisted living"],
  variants: [{
    id: "standard",
    name: "Retirement Home Cost",
    description: "Estimate monthly senior living facility costs.",
    fields: [
      { name: "careLevel", label: "Care Level", type: "select", options: [{ value: "independent", label: "Independent" }, { value: "assisted", label: "Assisted" }, { value: "memory", label: "Memory Care" }], defaultValue: "assisted" },
      { name: "baseRate", label: "Base Monthly Rate ($)", type: "number", min: 1000, max: 20000, defaultValue: 4500 },
      { name: "extras", label: "Extra Services ($)", type: "number", min: 0, max: 5000, defaultValue: 500 },
    ],
    calculate: (inputs) => {
      const level = inputs.careLevel as string;
      const base = inputs.baseRate as number;
      const extras = inputs.extras as number;
      if (!base) return null;
      const multiplier: Record<string, number> = { independent: 0.8, assisted: 1, memory: 1.5 };
      const mult = multiplier[level] || 1;
      const monthly = base * mult + extras;
      const annual = monthly * 12;
      return {
        primary: { label: "Monthly Cost", value: "$" + formatNumber(Math.round(monthly)) },
        details: [
          { label: "Care Level", value: level },
          { label: "Base Adjusted", value: "$" + formatNumber(Math.round(base * mult)) },
          { label: "Annual Cost", value: "$" + formatNumber(Math.round(annual)) },
        ],
      };
  },
  }],
  relatedSlugs: ["elder-care-cost-calculator","medicare-supplement-calculator"],
  faq: [
    { question: "How much does assisted living cost?", answer: "Assisted living averages $4,000 to $6,000 per month in the US." },
    { question: "Does Medicare cover senior living?", answer: "Medicare generally does not cover assisted living costs." },
  ],
  formula: "Monthly = Base Rate x Care Multiplier + Extras",
};
