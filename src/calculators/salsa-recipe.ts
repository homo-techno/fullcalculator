import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const salsaRecipeCalculator: CalculatorDefinition = {
  slug: "salsa-recipe",
  title: "Salsa Recipe Calculator",
  description: "Free salsa recipe calculator. Get accurate results instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["salsa calculator"],
  variants: [{
    id: "standard",
    name: "Salsa Recipe",
    description: "",
    fields: [
      { name: "servings", label: "Servings", type: "number", min: 4 },
      { name: "spice", label: "Spice Level (1-5)", type: "number", defaultValue: 3 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Tomatoes (lbs)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate salsa recipe?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
