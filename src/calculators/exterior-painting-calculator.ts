import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const exteriorPaintingCalculator: CalculatorDefinition = {
  slug: "exterior-painting-calculator",
  title: "Exterior Painting Calculator",
  description: "Calculate exterior painting costs and expenses. Free online exterior painting calculator.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["exterior painting cost"],
  variants: [{
    id: "standard",
    name: "Exterior Painting",
    description: "",
    fields: [
      { name: "sqft", label: "Exterior Sq Ft", type: "number", min: 200 },
      { name: "costPerSqft", label: "Cost/SqFt ($)", type: "number", defaultValue: 3 },
      { name: "prep", label: "Prep Cost ($)", type: "number", defaultValue: 500 },
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
    { question: "How much does exterior painting cost?", answer: "Use our calculator to estimate costs based on your inputs." },
    { question: "What factors affect exterior painting cost?", answer: "Multiple factors including quantity, quality, and location affect the total cost." },
  ],
  formula: "Total Cost = Base Cost × Quantity + Additional Fees",
};
