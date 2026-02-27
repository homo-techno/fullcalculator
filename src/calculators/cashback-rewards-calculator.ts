import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cashbackRewardsCalculator: CalculatorDefinition = {
  slug: "cashback-rewards-calculator",
  title: "Cashback Rewards Calculator",
  description: "Free cashback rewards calculator. Calculate cashback rewards quickly and accurately.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["cashback calculator"],
  variants: [{
    id: "standard",
    name: "Cashback Rewards",
    description: "",
    fields: [
      { name: "spending", label: "Monthly Spending ($)", type: "number", min: 1 },
      { name: "cashback", label: "Cashback Rate %", type: "number", defaultValue: 2 },
      { name: "months", label: "Months", type: "number", defaultValue: 12 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Total Cashback", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate cashback rewards?", answer: "Enter values and get instant results." },
    { question: "Why use this cashback rewards calculator?", answer: "Quick, accurate, and free online calculation tool." },
  ],
  formula: "Result = f(inputs)",
};
