import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ndaCostCalculator: CalculatorDefinition = {
  slug: "nda-cost-calculator",
  title: "NDA Cost Calculator",
  description: "Calculate nda cost costs and expenses. Free online nda cost calculator.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["nda cost"],
  variants: [{
    id: "standard",
    name: "NDA Cost",
    description: "",
    fields: [
      { name: "complexity", label: "Complexity (1-3)", type: "number", defaultValue: 1 },
      { name: "attorney", label: "Attorney Rate ($/hr)", type: "number", defaultValue: 300 },
      { name: "hours", label: "Hours", type: "number", defaultValue: 2 },
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
    { question: "How much does nda cost cost?", answer: "Use our calculator to estimate costs based on your inputs." },
    { question: "What factors affect nda cost cost?", answer: "Multiple factors including quantity, quality, and location affect the total cost." },
  ],
  formula: "Total Cost = Base Cost × Quantity + Additional Fees",
};
