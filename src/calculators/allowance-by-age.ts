import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const allowanceByAgeCalculator: CalculatorDefinition = {
  slug: "allowance-by-age",
  title: "Allowance by Age Calculator",
  description: "Free allowance by age calculator. Get accurate results instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["allowance by age calculator"],
  variants: [{
    id: "standard",
    name: "Allowance by Age",
    description: "",
    fields: [
      { name: "age", label: "Child Age", type: "number", min: 3, max: 18 },
      { name: "region", label: "Cost of Living (1-3)", type: "number", defaultValue: 2 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Weekly Amount ($)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate allowance by age?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
