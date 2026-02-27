import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const shedCostCalculator: CalculatorDefinition = {
  slug: "shed-cost-calculator",
  title: "Shed Cost Calculator",
  description: "Calculate shed cost costs and expenses. Free online shed cost calculator.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["shed cost calculator"],
  variants: [{
    id: "standard",
    name: "Shed Cost",
    description: "",
    fields: [
      { name: "length", label: "Length (ft)", type: "number", min: 4 },
      { name: "width", label: "Width (ft)", type: "number", min: 4 },
      { name: "height", label: "Height (ft)", type: "number", defaultValue: 8 },
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
    { question: "How much does shed cost cost?", answer: "Use our calculator to estimate costs based on your inputs." },
    { question: "What factors affect shed cost cost?", answer: "Multiple factors including quantity, quality, and location affect the total cost." },
  ],
  formula: "Total Cost = Base Cost × Quantity + Additional Fees",
};
