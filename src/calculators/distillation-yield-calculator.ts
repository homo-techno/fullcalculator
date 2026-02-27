import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const distillationYieldCalculator: CalculatorDefinition = {
  slug: "distillation-yield-calculator",
  title: "Distillation Yield Calculator",
  description: "Calculate distillation yield with our free online calculator. Get instant results.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["distillation calculator"],
  variants: [{
    id: "standard",
    name: "Distillation Yield",
    description: "",
    fields: [
      { name: "volume", label: "Wash Volume (L)", type: "number", min: 1 },
      { name: "abv", label: "Wash ABV %", type: "number", min: 1, max: 100 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Yield (L)", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate distillation yield?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good distillation yield?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
