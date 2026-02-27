import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const typeIiErrorCalculator: CalculatorDefinition = {
  slug: "type-ii-error",
  title: "Type II Error Calculator",
  description: "Free type ii error calculator. Get accurate results instantly.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["type ii error calculator", "statistical power"],
  variants: [{
    id: "standard",
    name: "Type II Error",
    description: "",
    fields: [
      { name: "power", label: "Power", type: "number", defaultValue: 0.8 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Beta", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate type ii error?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "β = 1 - Power",
};
