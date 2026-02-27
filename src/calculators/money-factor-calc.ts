import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const moneyFactorCalcCalculator: CalculatorDefinition = {
  slug: "money-factor-calc",
  title: "Money Factor Calculator",
  description: "Free money factor calculator. Get accurate results instantly.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["money factor calculator"],
  variants: [{
    id: "standard",
    name: "Money Factor",
    description: "",
    fields: [
      { name: "moneyFactor", label: "Money Factor", type: "number", min: 0.0001, step: 0.0001 },
      { name: "apr", label: "or APR %", type: "number", defaultValue: 0 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "APR % / Money Factor", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate money factor?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
