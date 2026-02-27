import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const emergencyFundCalcCalculator: CalculatorDefinition = {
  slug: "emergency-fund-calc",
  title: "Emergency Fund Calculator",
  description: "Free emergency fund calculator. Get accurate results instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["emergency fund calculator"],
  variants: [{
    id: "standard",
    name: "Emergency Fund",
    description: "",
    fields: [
      { name: "monthlyExpenses", label: "Monthly Expenses ($)", type: "number", min: 500 },
      { name: "months", label: "Months Coverage", type: "number", defaultValue: 6 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Target Amount ($)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate emergency fund?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
