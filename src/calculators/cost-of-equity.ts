import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const costOfEquityCalculator: CalculatorDefinition = {
  slug: "cost-of-equity",
  title: "Cost of Equity Calculator",
  description: "Free cost of equity calculator. Get accurate results instantly.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["cost of equity calculator"],
  variants: [{
    id: "standard",
    name: "Cost of Equity",
    description: "",
    fields: [
      { name: "riskFree", label: "Risk-Free Rate %", type: "number", defaultValue: 3 },
      { name: "beta", label: "Beta", type: "number", defaultValue: 1.2 },
      { name: "marketPremium", label: "Market Premium %", type: "number", defaultValue: 6 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Cost of Equity %", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate cost of equity?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Ke = Rf + β(Rm - Rf)",
};
