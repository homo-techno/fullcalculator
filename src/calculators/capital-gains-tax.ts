import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const capitalGainsTaxCalculator: CalculatorDefinition = {
  slug: "capital-gains-tax",
  title: "Capital Gains Tax Calculator",
  description: "Free capital gains tax calculator. Get accurate results instantly.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["capital gains tax calculator"],
  variants: [{
    id: "standard",
    name: "Capital Gains Tax",
    description: "",
    fields: [
      { name: "purchasePrice", label: "Purchase Price ($)", type: "number", min: 0 },
      { name: "salePrice", label: "Sale Price ($)", type: "number", min: 0 },
      { name: "taxRate", label: "Tax Rate %", type: "number", defaultValue: 15 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Tax ($)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate capital gains tax?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
