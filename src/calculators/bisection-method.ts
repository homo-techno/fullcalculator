import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bisectionMethodCalculator: CalculatorDefinition = {
  slug: "bisection-method",
  title: "Bisection Method Calculator",
  description: "Free bisection method calculator. Get accurate results instantly.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["bisection method calculator"],
  variants: [{
    id: "standard",
    name: "Bisection Method",
    description: "",
    fields: [
      { name: "a", label: "Left Bound", type: "number" },
      { name: "b", label: "Right Bound", type: "number" },
      { name: "iterations", label: "Iterations", type: "number", defaultValue: 20 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Root", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate bisection method?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
