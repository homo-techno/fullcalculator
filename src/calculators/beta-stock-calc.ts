import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const betaStockCalcCalculator: CalculatorDefinition = {
  slug: "beta-stock-calc",
  title: "Beta Stock Calculator",
  description: "Free beta stock calculator. Get accurate results instantly.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["beta stock calculator"],
  variants: [{
    id: "standard",
    name: "Beta Stock",
    description: "",
    fields: [
      { name: "stockReturn", label: "Stock Return %", type: "number" },
      { name: "marketReturn", label: "Market Return %", type: "number" },
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
    { question: "How to calculate beta stock?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
