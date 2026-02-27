import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mississippiIncomeTaxCalculator: CalculatorDefinition = {
  slug: "mississippi-income-tax",
  title: "Mississippi Income Tax Calculator",
  description: "Free mississippi income tax calculator. Get accurate results instantly.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["mississippi income tax calculator", "mississippi state tax"],
  variants: [{
    id: "standard",
    name: "Mississippi Income Tax",
    description: "",
    fields: [
      { name: "income", label: "Taxable Income ($)", type: "number", min: 1 },
      { name: "filingStatus", label: "Filing (1=single,2=married)", type: "number", defaultValue: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Tax Owed ($)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate mississippi income tax?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Tax = Mississippi Rate × Taxable Income",
};
