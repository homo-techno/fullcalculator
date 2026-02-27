import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const financialLeverageCalculator: CalculatorDefinition = {
  slug: "financial-leverage",
  title: "Financial Leverage Calculator",
  description: "Free financial leverage calculator. Get accurate results instantly.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["financial leverage calculator"],
  variants: [{
    id: "standard",
    name: "Financial Leverage",
    description: "",
    fields: [
      { name: "assets", label: "Total Assets ($)", type: "number", min: 1 },
      { name: "equity", label: "Shareholder Equity ($)", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Equity Multiplier", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate financial leverage?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
