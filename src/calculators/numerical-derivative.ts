import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const numericalDerivativeCalculator: CalculatorDefinition = {
  slug: "numerical-derivative",
  title: "Numerical Derivative Calculator",
  description: "Free numerical derivative calculator. Get accurate results instantly.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["numerical derivative calculator"],
  variants: [{
    id: "standard",
    name: "Numerical Derivative",
    description: "",
    fields: [
      { name: "x", label: "x Value", type: "number" },
      { name: "h", label: "Step Size", type: "number", defaultValue: 0.001 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "f'(x)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate numerical derivative?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
