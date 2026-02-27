import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cabinBuildCalculator: CalculatorDefinition = {
  slug: "cabin-build-calculator",
  title: "Cabin Build Calculator",
  description: "Calculate cabin build costs and expenses. Free online cabin build calculator.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["cabin cost calculator"],
  variants: [{
    id: "standard",
    name: "Cabin Build",
    description: "",
    fields: [
      { name: "sqft", label: "Square Feet", type: "number", min: 100 },
      { name: "costPerSqft", label: "Cost/SqFt ($)", type: "number", defaultValue: 175 },
      { name: "stories", label: "Stories", type: "number", defaultValue: 1 },
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
    { question: "How much does cabin build cost?", answer: "Use our calculator to estimate costs based on your inputs." },
    { question: "What factors affect cabin build cost?", answer: "Multiple factors including quantity, quality, and location affect the total cost." },
  ],
  formula: "Total Cost = Base Cost × Quantity + Additional Fees",
};
