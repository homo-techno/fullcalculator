import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const netOperatingIncomeCalculator: CalculatorDefinition = {
  slug: "net-operating-income",
  title: "Net Operating Income Calculator",
  description: "Free net operating income calculator. Get accurate results instantly.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["noi calculator"],
  variants: [{
    id: "standard",
    name: "Net Operating Income",
    description: "",
    fields: [
      { name: "grossIncome", label: "Gross Income ($)", type: "number", min: 0 },
      { name: "vacancy", label: "Vacancy Rate %", type: "number", defaultValue: 5 },
      { name: "opex", label: "Operating Expenses ($)", type: "number", min: 0 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "NOI ($)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate net operating income?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
