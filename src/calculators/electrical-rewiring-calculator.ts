import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const electricalRewiringCalculator: CalculatorDefinition = {
  slug: "electrical-rewiring-calculator",
  title: "Electrical Rewiring Calculator",
  description: "Calculate electrical rewiring costs and expenses. Free online electrical rewiring calculator.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["rewiring cost"],
  variants: [{
    id: "standard",
    name: "Electrical Rewiring",
    description: "",
    fields: [
      { name: "sqft", label: "Square Feet", type: "number", min: 200 },
      { name: "costPerSqft", label: "Cost/SqFt ($)", type: "number", defaultValue: 8 },
      { name: "panel", label: "Panel Upgrade ($)", type: "number", defaultValue: 2000 },
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
    { question: "How much does electrical rewiring cost?", answer: "Use our calculator to estimate costs based on your inputs." },
    { question: "What factors affect electrical rewiring cost?", answer: "Multiple factors including quantity, quality, and location affect the total cost." },
  ],
  formula: "Total Cost = Base Cost × Quantity + Additional Fees",
};
