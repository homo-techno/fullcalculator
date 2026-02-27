import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const payrollTaxCalcCalculator: CalculatorDefinition = {
  slug: "payroll-tax-calc",
  title: "Payroll Tax Calculator",
  description: "Free payroll tax calculator. Get accurate results instantly.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["payroll tax calculator"],
  variants: [{
    id: "standard",
    name: "Payroll Tax",
    description: "",
    fields: [
      { name: "grossPay", label: "Gross Pay ($)", type: "number", min: 1 },
      { name: "socialSec", label: "Social Security %", type: "number", defaultValue: 6.2 },
      { name: "medicare", label: "Medicare %", type: "number", defaultValue: 1.45 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Total Tax ($)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate payroll tax?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
