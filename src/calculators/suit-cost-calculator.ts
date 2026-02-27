import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const suitCostCalculator: CalculatorDefinition = {
  slug: "suit-cost-calculator",
  title: "Suit Cost Calculator",
  description: "Calculate suit cost costs and expenses. Free online suit cost calculator.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["suit cost calculator"],
  variants: [{
    id: "standard",
    name: "Suit Cost",
    description: "",
    fields: [
      { name: "suits", label: "Number of Suits", type: "number", min: 1 },
      { name: "costPerSuit", label: "Cost/Suit ($)", type: "number", defaultValue: 500 },
      { name: "tailoring", label: "Tailoring/Suit ($)", type: "number", defaultValue: 100 },
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
    { question: "How much does suit cost cost?", answer: "Use our calculator to estimate costs based on your inputs." },
    { question: "What factors affect suit cost cost?", answer: "Multiple factors including quantity, quality, and location affect the total cost." },
  ],
  formula: "Total Cost = Base Cost × Quantity + Additional Fees",
};
