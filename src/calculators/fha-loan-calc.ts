import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fhaLoanCalcCalculator: CalculatorDefinition = {
  slug: "fha-loan-calc",
  title: "FHA Loan Calculator",
  description: "Free fha loan calculator. Get accurate results instantly.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["fha loan calculator"],
  variants: [{
    id: "standard",
    name: "FHA Loan",
    description: "",
    fields: [
      { name: "homePrice", label: "Home Price ($)", type: "number", min: 10000 },
      { name: "downPayment", label: "Down Payment %", type: "number", defaultValue: 3.5 },
      { name: "rate", label: "Interest Rate %", type: "number", defaultValue: 6.5 },
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
    { question: "How to calculate fha loan?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
