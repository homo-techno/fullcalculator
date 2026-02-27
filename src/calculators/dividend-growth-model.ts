import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dividendGrowthModelCalculator: CalculatorDefinition = {
  slug: "dividend-growth-model",
  title: "Dividend Growth Model Calculator",
  description: "Free dividend growth model calculator. Get accurate results instantly.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["dividend growth model"],
  variants: [{
    id: "standard",
    name: "Dividend Growth Model",
    description: "",
    fields: [
      { name: "dividend", label: "Annual Dividend ($)", type: "number", min: 0.01 },
      { name: "growth", label: "Growth Rate %", type: "number", defaultValue: 3 },
      { name: "required", label: "Required Return %", type: "number", defaultValue: 8 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Stock Value ($)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate dividend growth model?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "P = D / (r - g)",
};
