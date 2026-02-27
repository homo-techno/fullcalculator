import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const inflationAdjustedCalculator: CalculatorDefinition = {
  slug: "inflation-adjusted",
  title: "Inflation Adjusted Calculator",
  description: "Free inflation adjusted calculator. Get accurate results instantly.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["inflation adjusted calculator"],
  variants: [{
    id: "standard",
    name: "Inflation Adjusted",
    description: "",
    fields: [
      { name: "amount", label: "Amount ($)", type: "number", min: 0.01 },
      { name: "years", label: "Years", type: "number", min: 1 },
      { name: "inflation", label: "Inflation Rate %", type: "number", defaultValue: 3 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Adjusted Value ($)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate inflation adjusted?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
