import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const flooringInstallCalculator: CalculatorDefinition = {
  slug: "flooring-install-calculator",
  title: "Flooring Installation Calculator",
  description: "Calculate flooring installation costs and expenses. Free online flooring installation calculator.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["flooring cost calculator"],
  variants: [{
    id: "standard",
    name: "Flooring Installation",
    description: "",
    fields: [
      { name: "sqft", label: "Square Feet", type: "number", min: 50 },
      { name: "materialCost", label: "Material/SqFt ($)", type: "number", defaultValue: 5 },
      { name: "laborCost", label: "Labor/SqFt ($)", type: "number", defaultValue: 3 },
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
    { question: "How much does flooring installation cost?", answer: "Use our calculator to estimate costs based on your inputs." },
    { question: "What factors affect flooring installation cost?", answer: "Multiple factors including quantity, quality, and location affect the total cost." },
  ],
  formula: "Total Cost = Base Cost × Quantity + Additional Fees",
};
