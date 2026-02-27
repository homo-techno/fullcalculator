import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const travelPointsValueCalculator: CalculatorDefinition = {
  slug: "travel-points-value-calculator",
  title: "Travel Points Value Calculator",
  description: "Calculate travel points value with our free online calculator. Get instant results.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["points value calculator"],
  variants: [{
    id: "standard",
    name: "Travel Points Value",
    description: "",
    fields: [
      { name: "points", label: "Points", type: "number", min: 1 },
      { name: "cashValue", label: "Cash Value ($)", type: "number", min: 0.01 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Cents/Point", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate travel points value?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good travel points value?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
