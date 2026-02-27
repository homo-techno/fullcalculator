import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const typeIErrorCalculator: CalculatorDefinition = {
  slug: "type-i-error",
  title: "Type I Error Calculator",
  description: "Free type i error calculator. Get accurate results instantly.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["type i error calculator"],
  variants: [{
    id: "standard",
    name: "Type I Error",
    description: "",
    fields: [
      { name: "alpha", label: "Alpha Level", type: "number", defaultValue: 0.05 },
      { name: "tests", label: "Number of Tests", type: "number", defaultValue: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Probability", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate type i error?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
