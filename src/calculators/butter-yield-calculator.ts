import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const butterYieldCalculator: CalculatorDefinition = {
  slug: "butter-yield-calculator",
  title: "Butter Yield Calculator",
  description: "Calculate butter yield with our free online calculator. Get instant results.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["butter making calculator"],
  variants: [{
    id: "standard",
    name: "Butter Yield",
    description: "",
    fields: [
      { name: "cream", label: "Heavy Cream (cups)", type: "number", min: 1 },
      { name: "fatContent", label: "Fat Content %", type: "number", defaultValue: 36 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Butter (cups)", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate butter yield?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good butter yield?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
