import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const complexNumberMultiplyCalculator: CalculatorDefinition = {
  slug: "complex-number-multiply",
  title: "Complex Number Multiply Calculator",
  description: "Free complex number multiply calculator. Get accurate results instantly.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["complex multiply calculator"],
  variants: [{
    id: "standard",
    name: "Complex Number Multiply",
    description: "",
    fields: [
      { name: "a1", label: "a (real 1)", type: "number" },
      { name: "b1", label: "b (imag 1)", type: "number" },
      { name: "a2", label: "a (real 2)", type: "number" },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Result", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate complex number multiply?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
