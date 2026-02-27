import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hummusRecipeCalculator: CalculatorDefinition = {
  slug: "hummus-recipe",
  title: "Hummus Recipe Calculator",
  description: "Free hummus recipe calculator. Get accurate results instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["hummus calculator"],
  variants: [{
    id: "standard",
    name: "Hummus Recipe",
    description: "",
    fields: [
      { name: "servings", label: "Servings", type: "number", min: 2 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Chickpeas (cans)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate hummus recipe?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
