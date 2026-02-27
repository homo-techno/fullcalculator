import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const profitMarginCalcCalculator: CalculatorDefinition = {
  slug: "profit-margin-calc-calculator",
  title: "Profit Margin Calculator",
  description: "Calculate profit margin with our free online calculator. Get instant results.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["profit margin calculator"],
  variants: [{
    id: "standard",
    name: "Profit Margin",
    description: "",
    fields: [
      { name: "revenue", label: "Revenue ($)", type: "number", min: 1 },
      { name: "costs", label: "Total Costs ($)", type: "number", min: 0 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Profit Margin %", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate profit margin?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good profit margin?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
