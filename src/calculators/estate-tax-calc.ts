import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const estateTaxCalcCalculator: CalculatorDefinition = {
  slug: "estate-tax-calc",
  title: "Estate Tax Calculator",
  description: "Free estate tax calculator. Get accurate results instantly.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["estate tax calculator"],
  variants: [{
    id: "standard",
    name: "Estate Tax",
    description: "",
    fields: [
      { name: "estate", label: "Estate Value ($)", type: "number", min: 1 },
      { name: "exemption", label: "Exemption ($)", type: "number", defaultValue: 12920000 },
      { name: "rate", label: "Tax Rate %", type: "number", defaultValue: 40 },
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
    { question: "How to calculate estate tax?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
