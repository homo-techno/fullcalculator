import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tutoringCostCalculator: CalculatorDefinition = {
  slug: "tutoring-cost-calculator",
  title: "Tutoring Cost Calculator",
  description: "Calculate tutoring cost costs and expenses. Free online tutoring cost calculator.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["tutoring cost calculator"],
  variants: [{
    id: "standard",
    name: "Tutoring Cost",
    description: "",
    fields: [
      { name: "sessions", label: "Sessions/Month", type: "number", min: 1 },
      { name: "rate", label: "Rate/Hour ($)", type: "number", defaultValue: 50 },
      { name: "hours", label: "Hours/Session", type: "number", defaultValue: 1 },
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
    { question: "How much does tutoring cost cost?", answer: "Use our calculator to estimate costs based on your inputs." },
    { question: "What factors affect tutoring cost cost?", answer: "Multiple factors including quantity, quality, and location affect the total cost." },
  ],
  formula: "Total Cost = Base Cost × Quantity + Additional Fees",
};
