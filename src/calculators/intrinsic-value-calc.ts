import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const intrinsicValueCalcCalculator: CalculatorDefinition = {
  slug: "intrinsic-value-calc",
  title: "Intrinsic Value Calculator",
  description: "Free intrinsic value calculator. Get accurate results instantly.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["intrinsic value calculator"],
  variants: [{
    id: "standard",
    name: "Intrinsic Value",
    description: "",
    fields: [
      { name: "eps", label: "EPS ($)", type: "number", min: 0.01 },
      { name: "growth", label: "Growth Rate %", type: "number", defaultValue: 7 },
      { name: "aaa", label: "AAA Bond Yield %", type: "number", defaultValue: 4 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Intrinsic Value ($)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate intrinsic value?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
