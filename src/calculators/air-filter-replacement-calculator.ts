import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const airFilterReplacementCalculator: CalculatorDefinition = {
  slug: "air-filter-replacement-calculator",
  title: "Air Filter Replacement Calculator",
  description: "Plan filter replacements and estimate annual cost.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["air filter schedule","filter replacement cost"],
  variants: [{
    id: "standard",
    name: "Air Filter Replacement",
    description: "Plan filter replacements and estimate annual cost.",
    fields: [
      { name: "filterCost", label: "Filter Cost ($)", type: "number", min: 1, max: 100, defaultValue: 15 },
      { name: "changeInterval", label: "Change Interval (days)", type: "number", min: 14, max: 365, defaultValue: 90 },
      { name: "numUnits", label: "Number of Units", type: "number", min: 1, max: 10, defaultValue: 1 },
    ],
    calculate: (inputs) => {
      const cost = inputs.filterCost as number;
      const interval = inputs.changeInterval as number;
      const units = inputs.numUnits as number;
      const changesPerYear = Math.ceil(365 / interval);
      const annualCost = changesPerYear * cost * units;
      return {
        primary: { label: "Annual Cost", value: "$" + formatNumber(Math.round(annualCost)) },
        details: [
          { label: "Changes Per Year", value: formatNumber(changesPerYear * units) },
          { label: "Cost Per Change", value: "$" + formatNumber(Math.round(cost * units)) },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "How often should I change my air filter?", answer: "Standard filters should be changed every 30 to 90 days." },
    { question: "Do expensive filters last longer?", answer: "Higher quality filters can last up to 6 or 12 months." },
  ],
  formula: "Annual Cost = (365 / Interval) x Cost x Units",
};
