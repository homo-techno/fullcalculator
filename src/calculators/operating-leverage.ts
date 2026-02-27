import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const operatingLeverageCalculator: CalculatorDefinition = {
  slug: "operating-leverage",
  title: "Operating Leverage Calculator",
  description: "Free operating leverage calculator. Get accurate results instantly.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["operating leverage calculator"],
  variants: [{
    id: "standard",
    name: "Operating Leverage",
    description: "",
    fields: [
      { name: "contribution", label: "Contribution Margin ($)", type: "number", min: 1 },
      { name: "ebit", label: "EBIT ($)", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "DOL", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate operating leverage?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "DOL = CM / EBIT",
};
