import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const vacationSavingsCalculator: CalculatorDefinition = {
  slug: "vacation-savings",
  title: "Vacation Savings Calculator",
  description: "Free vacation savings calculator. Get accurate results instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["vacation savings calculator"],
  variants: [{
    id: "standard",
    name: "Vacation Savings",
    description: "",
    fields: [
      { name: "totalCost", label: "Trip Cost ($)", type: "number", min: 100 },
      { name: "months", label: "Months to Save", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Monthly Savings ($)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate vacation savings?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
