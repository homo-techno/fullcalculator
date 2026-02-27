import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const enterpriseValueCalcCalculator: CalculatorDefinition = {
  slug: "enterprise-value-calc",
  title: "Enterprise Value Calculator",
  description: "Free enterprise value calculator. Get accurate results instantly.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["enterprise value calculator"],
  variants: [{
    id: "standard",
    name: "Enterprise Value",
    description: "",
    fields: [
      { name: "marketCap", label: "Market Cap ($)", type: "number", min: 1 },
      { name: "debt", label: "Total Debt ($)", type: "number", min: 0 },
      { name: "cash", label: "Cash ($)", type: "number", min: 0 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "EV ($)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate enterprise value?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "EV = Market Cap + Debt - Cash",
};
