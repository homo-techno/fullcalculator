import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rvTripCostCalculator: CalculatorDefinition = {
  slug: "rv-trip-cost-calculator",
  title: "RV Trip Cost Calculator",
  description: "Calculate rv trip cost costs and expenses. Free online rv trip cost calculator.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["rv trip calculator"],
  variants: [{
    id: "standard",
    name: "RV Trip Cost",
    description: "",
    fields: [
      { name: "miles", label: "Miles", type: "number", min: 1 },
      { name: "mpg", label: "MPG", type: "number", defaultValue: 10 },
      { name: "gasPrice", label: "Gas Price ($)", type: "number", defaultValue: 3.5 },
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
    { question: "How much does rv trip cost cost?", answer: "Use our calculator to estimate costs based on your inputs." },
    { question: "What factors affect rv trip cost cost?", answer: "Multiple factors including quantity, quality, and location affect the total cost." },
  ],
  formula: "Total Cost = Base Cost × Quantity + Additional Fees",
};
