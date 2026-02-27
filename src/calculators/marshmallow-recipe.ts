import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const marshmallowRecipeCalculator: CalculatorDefinition = {
  slug: "marshmallow-recipe",
  title: "Marshmallow Recipe Calculator",
  description: "Free marshmallow recipe calculator. Get accurate results instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["marshmallow recipe calculator"],
  variants: [{
    id: "standard",
    name: "Marshmallow Recipe",
    description: "",
    fields: [
      { name: "batches", label: "Batches", type: "number", min: 1 },
      { name: "size", label: "Size Multiplier", type: "number", defaultValue: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Gelatin (packets)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate marshmallow recipe?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
