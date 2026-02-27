import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hourlyToSalaryCalcCalculator: CalculatorDefinition = {
  slug: "hourly-to-salary-calc",
  title: "Hourly to Salary Calculator",
  description: "Free hourly to salary calculator. Get accurate results instantly.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["hourly to salary calculator"],
  variants: [{
    id: "standard",
    name: "Hourly to Salary",
    description: "",
    fields: [
      { name: "hourly", label: "Hourly Rate ($)", type: "number", min: 1 },
      { name: "hours", label: "Hours/Week", type: "number", defaultValue: 40 },
      { name: "weeks", label: "Weeks/Year", type: "number", defaultValue: 52 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Annual Salary ($)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate hourly to salary?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
