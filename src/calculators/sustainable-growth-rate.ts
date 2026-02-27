import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sustainableGrowthRateCalculator: CalculatorDefinition = {
  slug: "sustainable-growth-rate",
  title: "Sustainable Growth Rate Calculator",
  description: "Free sustainable growth rate calculator. Get accurate results instantly.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["sustainable growth rate"],
  variants: [{
    id: "standard",
    name: "Sustainable Growth Rate",
    description: "",
    fields: [
      { name: "roe", label: "ROE %", type: "number", min: 0.01 },
      { name: "retention", label: "Retention Ratio", type: "number", min: 0, max: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "SGR %", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate sustainable growth rate?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "SGR = ROE × RR",
};
