import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fireCalculator: CalculatorDefinition = {
  slug: "fire-calculator",
  title: "FIRE Number Calculator",
  description: "Free fire number calculator. Get accurate results instantly.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["fire calculator", "financial independence"],
  variants: [{
    id: "standard",
    name: "FIRE Number",
    description: "",
    fields: [
      { name: "annualExpenses", label: "Annual Expenses ($)", type: "number", min: 1 },
      { name: "withdrawalRate", label: "Withdrawal Rate %", type: "number", defaultValue: 4 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "FIRE Number ($)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate fire number?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "FIRE = Expenses / Rate",
};
