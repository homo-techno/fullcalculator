import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const incorporationCostCalculator: CalculatorDefinition = {
  slug: "incorporation-cost-calculator",
  title: "Incorporation Cost Calculator",
  description: "Calculate incorporation cost costs and expenses. Free online incorporation cost calculator.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["incorporation cost"],
  variants: [{
    id: "standard",
    name: "Incorporation Cost",
    description: "",
    fields: [
      { name: "stateFee", label: "State Fee ($)", type: "number", defaultValue: 200 },
      { name: "agent", label: "Agent Fee ($)", type: "number", defaultValue: 100 },
      { name: "legal", label: "Legal ($)", type: "number", defaultValue: 1500 },
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
    { question: "How much does incorporation cost cost?", answer: "Use our calculator to estimate costs based on your inputs." },
    { question: "What factors affect incorporation cost cost?", answer: "Multiple factors including quantity, quality, and location affect the total cost." },
  ],
  formula: "Total Cost = Base Cost × Quantity + Additional Fees",
};
