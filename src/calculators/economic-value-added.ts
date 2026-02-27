import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const economicValueAddedCalculator: CalculatorDefinition = {
  slug: "economic-value-added",
  title: "Economic Value Added Calculator",
  description: "Free economic value added calculator. Get accurate results instantly.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["eva calculator"],
  variants: [{
    id: "standard",
    name: "Economic Value Added",
    description: "",
    fields: [
      { name: "nopat", label: "NOPAT ($)", type: "number", min: 0 },
      { name: "capital", label: "Invested Capital ($)", type: "number", min: 1 },
      { name: "wacc", label: "WACC %", type: "number", defaultValue: 10 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "EVA ($)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate economic value added?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
