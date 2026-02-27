import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const salesTaxCalcCalculator: CalculatorDefinition = {
  slug: "sales-tax-calc",
  title: "Sales Tax Calculator",
  description: "Free sales tax calculator. Get accurate results instantly.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["sales tax calculator simple"],
  variants: [{
    id: "standard",
    name: "Sales Tax",
    description: "",
    fields: [
      { name: "price", label: "Price ($)", type: "number", min: 0.01 },
      { name: "taxRate", label: "Tax Rate %", type: "number", defaultValue: 8 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Total ($)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate sales tax?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
