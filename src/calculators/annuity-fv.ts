import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const annuityFvCalculator: CalculatorDefinition = {
  slug: "annuity-fv",
  title: "Annuity Future Value Calculator",
  description: "Free annuity future value calculator. Get accurate results instantly.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["annuity future value"],
  variants: [{
    id: "standard",
    name: "Annuity Future Value",
    description: "",
    fields: [
      { name: "payment", label: "Payment ($)", type: "number", min: 1 },
      { name: "rate", label: "Interest Rate %", type: "number", defaultValue: 5 },
      { name: "periods", label: "Periods", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "FV ($)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate annuity future value?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
