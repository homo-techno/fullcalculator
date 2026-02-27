import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const vatCalcCalculator: CalculatorDefinition = {
  slug: "vat-calc",
  title: "VAT Calculator Calculator",
  description: "Free vat calculator calculator. Get accurate results instantly.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["vat calculator"],
  variants: [{
    id: "standard",
    name: "VAT Calculator",
    description: "",
    fields: [
      { name: "amount", label: "Amount ($)", type: "number", min: 0.01 },
      { name: "vatRate", label: "VAT Rate %", type: "number", defaultValue: 20 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Inc VAT ($)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate vat calculator?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
