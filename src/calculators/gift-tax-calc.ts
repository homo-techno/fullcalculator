import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const giftTaxCalcCalculator: CalculatorDefinition = {
  slug: "gift-tax-calc",
  title: "Gift Tax Calculator",
  description: "Free gift tax calculator. Get accurate results instantly.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["gift tax calculator"],
  variants: [{
    id: "standard",
    name: "Gift Tax",
    description: "",
    fields: [
      { name: "giftAmount", label: "Gift Amount ($)", type: "number", min: 1 },
      { name: "exclusion", label: "Annual Exclusion ($)", type: "number", defaultValue: 18000 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Taxable Gift ($)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate gift tax?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
