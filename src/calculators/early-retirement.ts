import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const earlyRetirementCalculator: CalculatorDefinition = {
  slug: "early-retirement",
  title: "Early Retirement Calculator",
  description: "Free early retirement calculator. Get accurate results instantly.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["early retirement calculator"],
  variants: [{
    id: "standard",
    name: "Early Retirement",
    description: "",
    fields: [
      { name: "savings", label: "Current Savings ($)", type: "number", min: 0 },
      { name: "monthlyContrib", label: "Monthly Contribution ($)", type: "number", min: 0 },
      { name: "return", label: "Return %", type: "number", defaultValue: 7 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Retire By Age", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate early retirement?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
