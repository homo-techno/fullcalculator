import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const helocPaymentCalculator: CalculatorDefinition = {
  slug: "heloc-payment",
  title: "HELOC Payment Calculator",
  description: "Free heloc payment calculator. Get accurate results instantly.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["heloc payment calculator"],
  variants: [{
    id: "standard",
    name: "HELOC Payment",
    description: "",
    fields: [
      { name: "balance", label: "Balance ($)", type: "number", min: 1 },
      { name: "rate", label: "Interest Rate %", type: "number", defaultValue: 8 },
      { name: "term", label: "Term (months)", type: "number", defaultValue: 120 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Monthly Payment ($)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate heloc payment?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
