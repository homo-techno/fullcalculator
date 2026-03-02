import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pelletStoveCostCalculator: CalculatorDefinition = {
  slug: "pellet-stove-cost-calculator",
  title: "Pellet Stove Cost Calculator",
  description: "Estimate annual pellet stove heating cost.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["pellet stove cost","pellet heating"],
  variants: [{
    id: "standard",
    name: "Pellet Stove Cost",
    description: "Estimate annual pellet stove heating cost.",
    fields: [
      { name: "bagsPerMonth", label: "Bags Per Month", type: "number", min: 1, max: 200, defaultValue: 30 },
      { name: "costPerBag", label: "Cost Per Bag ($)", type: "number", min: 1, max: 20, defaultValue: 5 },
      { name: "months", label: "Heating Months", type: "number", min: 1, max: 12, defaultValue: 5 },
    ],
    calculate: (inputs) => {
      const bags = inputs.bagsPerMonth as number;
      const cost = inputs.costPerBag as number;
      const m = inputs.months as number;
      const annual = bags * cost * m;
      const monthly = bags * cost;
      return {
        primary: { label: "Annual Cost", value: "$" + formatNumber(Math.round(annual)) },
        details: [
          { label: "Monthly Cost", value: "$" + formatNumber(Math.round(monthly)) },
          { label: "Total Bags", value: formatNumber(bags * m) },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "How many bags of pellets do I need per day?", answer: "Most stoves burn one to three bags per day depending on heat setting." },
    { question: "Are pellet stoves cheaper than gas?", answer: "Pellet stoves can be cheaper in areas where pellets are affordable." },
  ],
  formula: "Annual Cost = Bags/Month x Cost/Bag x Months",
};
