import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tailorCostCalculator: CalculatorDefinition = {
  slug: "tailor-cost-calculator",
  title: "Tailoring Cost Calculator",
  description: "Calculate tailoring cost costs and expenses. Free online tailoring cost calculator.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["tailoring cost"],
  variants: [{
    id: "standard",
    name: "Tailoring Cost",
    description: "",
    fields: [
      { name: "items", label: "Number of Items", type: "number", min: 1 },
      { name: "avgCost", label: "Avg Cost/Item ($)", type: "number", defaultValue: 25 },
      { name: "rush", label: "Rush Fee ($)", type: "number", defaultValue: 0 },
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
    { question: "How much does tailoring cost cost?", answer: "Use our calculator to estimate costs based on your inputs." },
    { question: "What factors affect tailoring cost cost?", answer: "Multiple factors including quantity, quality, and location affect the total cost." },
  ],
  formula: "Total Cost = Base Cost × Quantity + Additional Fees",
};
