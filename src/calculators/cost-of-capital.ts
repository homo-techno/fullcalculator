import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const costOfCapitalCalculator: CalculatorDefinition = {
  slug: "cost-of-capital",
  title: "Cost of Capital Calculator",
  description: "Free cost of capital calculator. Get accurate results instantly.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["cost of capital calculator"],
  variants: [{
    id: "standard",
    name: "Cost of Capital",
    description: "",
    fields: [
      { name: "equityWeight", label: "Equity Weight %", type: "number", defaultValue: 60 },
      { name: "debtWeight", label: "Debt Weight %", type: "number", defaultValue: 40 },
      { name: "costEquity", label: "Cost of Equity %", type: "number", defaultValue: 10 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "WACC %", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate cost of capital?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
