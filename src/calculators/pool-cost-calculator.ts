import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const poolCostCalculator: CalculatorDefinition = {
  slug: "pool-cost-calculator",
  title: "Swimming Pool Calculator",
  description: "Calculate swimming pool costs and expenses. Free online swimming pool calculator.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["pool cost calculator"],
  variants: [{
    id: "standard",
    name: "Swimming Pool",
    description: "",
    fields: [
      { name: "length", label: "Length (ft)", type: "number", min: 10 },
      { name: "width", label: "Width (ft)", type: "number", min: 8 },
      { name: "depth", label: "Avg Depth (ft)", type: "number", defaultValue: 5 },
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
    { question: "How much does swimming pool cost?", answer: "Use our calculator to estimate costs based on your inputs." },
    { question: "What factors affect swimming pool cost?", answer: "Multiple factors including quantity, quality, and location affect the total cost." },
  ],
  formula: "Total Cost = Base Cost × Quantity + Additional Fees",
};
