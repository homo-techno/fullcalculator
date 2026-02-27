import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tinyHouseCostCalculator: CalculatorDefinition = {
  slug: "tiny-house-cost-calculator",
  title: "Tiny House Cost Calculator",
  description: "Calculate tiny house cost costs and expenses. Free online tiny house cost calculator.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["tiny house cost"],
  variants: [{
    id: "standard",
    name: "Tiny House Cost",
    description: "",
    fields: [
      { name: "sqft", label: "Square Feet", type: "number", min: 50 },
      { name: "costPerSqft", label: "Cost/SqFt ($)", type: "number", defaultValue: 200 },
      { name: "labor", label: "Labor %", type: "number", defaultValue: 30 },
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
    { question: "How much does tiny house cost cost?", answer: "Use our calculator to estimate costs based on your inputs." },
    { question: "What factors affect tiny house cost cost?", answer: "Multiple factors including quantity, quality, and location affect the total cost." },
  ],
  formula: "Total Cost = Base Cost × Quantity + Additional Fees",
};
