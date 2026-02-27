import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const recipeScalingCalculator: CalculatorDefinition = {
  slug: "recipe-scaling-calculator",
  title: "Recipe Scaling Calculator",
  description: "Calculate recipe scaling with our free online calculator. Get instant results.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["recipe scaler"],
  variants: [{
    id: "standard",
    name: "Recipe Scaling",
    description: "",
    fields: [
      { name: "originalServings", label: "Original Servings", type: "number", min: 1 },
      { name: "desiredServings", label: "Desired Servings", type: "number", min: 1 },
      { name: "amount", label: "Ingredient Amount", type: "number", min: 0.01 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Scaled Amount", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate recipe scaling?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good recipe scaling?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
