import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const screenedPorchCalculator: CalculatorDefinition = {
  slug: "screened-porch-calculator",
  title: "Screened Porch Calculator",
  description: "Calculate screened porch costs and expenses. Free online screened porch calculator.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["screened porch cost"],
  variants: [{
    id: "standard",
    name: "Screened Porch",
    description: "",
    fields: [
      { name: "sqft", label: "Square Feet", type: "number", min: 50 },
      { name: "costPerSqft", label: "Cost/SqFt ($)", type: "number", defaultValue: 70 },
      { name: "screens", label: "Screen Cost ($)", type: "number", defaultValue: 500 },
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
    { question: "How much does screened porch cost?", answer: "Use our calculator to estimate costs based on your inputs." },
    { question: "What factors affect screened porch cost?", answer: "Multiple factors including quantity, quality, and location affect the total cost." },
  ],
  formula: "Total Cost = Base Cost × Quantity + Additional Fees",
};
