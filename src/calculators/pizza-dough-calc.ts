import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pizzaDoughCalcCalculator: CalculatorDefinition = {
  slug: "pizza-dough-calc",
  title: "Pizza Dough Calculator",
  description: "Free pizza dough calculator. Get accurate results instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["pizza dough calculator"],
  variants: [{
    id: "standard",
    name: "Pizza Dough",
    description: "",
    fields: [
      { name: "pizzas", label: "Number of Pizzas", type: "number", min: 1 },
      { name: "size", label: "Size (in)", type: "number", defaultValue: 12 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Flour (g)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate pizza dough?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
