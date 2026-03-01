import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const memoryCareCostCalculator: CalculatorDefinition = {
  slug: "memory-care-cost-calculator",
  title: "Memory Care Cost Calculator",
  description: "Estimate the cost of memory care facilities for individuals with dementia or Alzheimer disease.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["memory care cost", "dementia care cost", "Alzheimer care calculator"],
  variants: [{
    id: "standard",
    name: "Memory Care Cost",
    description: "Estimate the cost of memory care facilities for individuals with dementia or Alzheimer disease",
    fields: [
      { name: "region", label: "Geographic Region", type: "select", options: [{value:"low",label:"Low Cost Region"},{value:"medium",label:"Medium Cost Region"},{value:"high",label:"High Cost Region"},{value:"vhigh",label:"Major Metro Area"}], defaultValue: "medium" },
      { name: "diseaseStage", label: "Disease Stage", type: "select", options: [{value:"early",label:"Early Stage"},{value:"middle",label:"Middle Stage"},{value:"late",label:"Late Stage"}], defaultValue: "middle" },
      { name: "months", label: "Expected Duration", type: "number", suffix: "months", min: 1, max: 120, defaultValue: 36 },
    ],
    calculate: (inputs) => {
      const region = inputs.region as string;
      const stage = inputs.diseaseStage as string;
      const months = inputs.months as number;
      if (!months || months <= 0) return null;
      const baseMonthly = 6500;
      const regionMod: Record<string, number> = { low: 0.75, medium: 1.0, high: 1.35, vhigh: 1.7 };
      const stageMod: Record<string, number> = { early: 0.9, middle: 1.0, late: 1.3 };
      const monthlyCost = baseMonthly * (regionMod[region] || 1.0) * (stageMod[stage] || 1.0);
      const annualCost = monthlyCost * 12;
      const totalCost = monthlyCost * months;
      const dailyCost = monthlyCost / 30;
      return {
        primary: { label: "Monthly Memory Care Cost", value: "$" + formatNumber(Math.round(monthlyCost)) },
        details: [
          { label: "Daily Cost", value: "$" + formatNumber(Math.round(dailyCost)) },
          { label: "Annual Cost", value: "$" + formatNumber(Math.round(annualCost)) },
          { label: "Total Projected Cost", value: "$" + formatNumber(Math.round(totalCost)) },
        ],
      };
    },
  }],
  relatedSlugs: ["nursing-home-cost-calculator", "assisted-living-cost-calculator"],
  faq: [
    { question: "How much does memory care cost per month?", answer: "Memory care typically costs $5,000 to $10,000 per month nationally, with the average around $6,500. Costs increase as the disease progresses and more intensive care is required." },
    { question: "Does insurance cover memory care?", answer: "Standard health insurance and Medicare do not cover memory care facility costs. Long-term care insurance may cover a portion, and Medicaid may help once personal assets are exhausted." },
  ],
  formula: "Monthly Cost = Base Rate ($6,500) x Region Modifier x Disease Stage Modifier",
};
