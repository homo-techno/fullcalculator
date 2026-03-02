import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const haircutFrequencyCalculator: CalculatorDefinition = {
  slug: "haircut-frequency-calculator",
  title: "Haircut Frequency Calculator",
  description: "Determine your haircut schedule and estimate annual cost.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["haircut frequency","haircut schedule","annual haircut cost"],
  variants: [{
    id: "standard",
    name: "Haircut Frequency",
    description: "Determine your haircut schedule and estimate annual cost.",
    fields: [
      { name: "hairGrowthRate", label: "Growth Rate", type: "select", options: [{ value: "4", label: "Slow (4 weeks)" }, { value: "6", label: "Average (6 weeks)" }, { value: "8", label: "Fast (8 weeks)" }] },
      { name: "haircutCost", label: "Haircut Cost ($)", type: "number", min: 10, max: 200, defaultValue: 40 },
      { name: "tip", label: "Tip Percentage (%)", type: "number", min: 0, max: 40, defaultValue: 20 },
      { name: "products", label: "Product Purchase Per Visit ($)", type: "number", min: 0, max: 100, defaultValue: 0 },
    ],
    calculate: (inputs) => {
    const weeks = parseInt(inputs.hairGrowthRate as string);
    const haircutCost = inputs.haircutCost as number;
    const tip = inputs.tip as number;
    const products = inputs.products as number;
    const visitsPerYear = Math.round(52 / weeks);
    const costPerVisit = haircutCost + haircutCost * (tip / 100) + products;
    const annualCost = visitsPerYear * costPerVisit;
    return {
      primary: { label: "Annual Haircut Cost", value: "$" + formatNumber(annualCost) },
      details: [
        { label: "Visits Per Year", value: formatNumber(visitsPerYear) },
        { label: "Cost Per Visit", value: "$" + formatNumber(costPerVisit) },
        { label: "Weeks Between Cuts", value: formatNumber(weeks) }
      ]
    };
  },
  }],
  relatedSlugs: ["hair-color-cost-calculator","hair-extension-cost-calculator"],
  faq: [
    { question: "How often should you get a haircut?", answer: "Every 4 to 8 weeks depending on hair type and desired style." },
    { question: "How much does the average haircut cost?", answer: "Average men haircuts cost $20 to $40. Women haircuts cost $40 to $80." },
    { question: "Does frequent cutting make hair grow faster?", answer: "No, cutting does not affect growth rate. It does prevent split ends." },
  ],
  formula: "Annual Cost = (52 / Weeks Between Cuts) x Cost Per Visit",
};
