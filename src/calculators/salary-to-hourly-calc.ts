import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const salaryToHourlyCalcCalculator: CalculatorDefinition = {
  slug: "salary-to-hourly-calc",
  title: "Salary to Hourly Calculator",
  description: "Free salary to hourly calculator. Get accurate results instantly.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["salary to hourly calculator"],
  variants: [{
    id: "standard",
    name: "Salary to Hourly",
    description: "",
    fields: [
      { name: "salary", label: "Annual Salary ($)", type: "number", min: 1 },
      { name: "hours", label: "Hours/Week", type: "number", defaultValue: 40 },
      { name: "weeks", label: "Weeks/Year", type: "number", defaultValue: 52 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Hourly Rate ($)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate salary to hourly?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
