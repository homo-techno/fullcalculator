import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const clothingCostPerWearCalculator: CalculatorDefinition = {
  slug: "clothing-cost-per-wear-calculator",
  title: "Cost Per Wear Calculator",
  description: "Calculate cost per wear costs and expenses. Free online cost per wear calculator.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["cost per wear calculator"],
  variants: [{
    id: "standard",
    name: "Cost Per Wear",
    description: "",
    fields: [
      { name: "price", label: "Item Price ($)", type: "number", min: 1 },
      { name: "wears", label: "Expected Wears", type: "number", min: 1 },
      { name: "careCost", label: "Cleaning Cost ($)", type: "number", defaultValue: 0 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => !x || x <= 0)) return null;
      const result = v.reduce((a, b) => a * b, 1) / (v.length > 2 ? v[v.length-1] : 1);
      return { primary: { label: "Estimated Cost", value: "$" + formatNumber(result) }, details: v.map((x,i) => ({ label: "Input " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["budget-calculator"],
  faq: [
    { question: "How much does cost per wear cost?", answer: "Use our calculator to estimate costs based on your inputs." },
    { question: "What factors affect cost per wear cost?", answer: "Multiple factors including quantity, quality, and location affect the total cost." },
  ],
  formula: "Total Cost = Base Cost × Quantity + Additional Fees",
};
