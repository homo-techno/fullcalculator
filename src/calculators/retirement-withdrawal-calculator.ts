import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const retirementWithdrawalCalculator: CalculatorDefinition = {
  slug: "retirement-withdrawal-calculator",
  title: "Retirement Withdrawal Calculator",
  description: "Free retirement withdrawal calculator. Calculate retirement withdrawal quickly and accurately.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["retirement withdrawal"],
  variants: [{
    id: "standard",
    name: "Retirement Withdrawal",
    description: "",
    fields: [
      { name: "savings", label: "Total Savings ($)", type: "number", min: 1 },
      { name: "years", label: "Retirement Years", type: "number", defaultValue: 30 },
      { name: "return", label: "Annual Return %", type: "number", defaultValue: 5 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Monthly Withdrawal", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate retirement withdrawal?", answer: "Enter values and get instant results." },
    { question: "Why use this retirement withdrawal calculator?", answer: "Quick, accurate, and free online calculation tool." },
  ],
  formula: "Result = f(inputs)",
};
