import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const burnRateCalcCalculator: CalculatorDefinition = {
  slug: "burn-rate-calc",
  title: "Burn Rate Calculator",
  description: "Free burn rate calculator. Get accurate results instantly.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["burn rate calculator", "startup"],
  variants: [{
    id: "standard",
    name: "Burn Rate",
    description: "",
    fields: [
      { name: "cashBalance", label: "Cash Balance ($)", type: "number", min: 1 },
      { name: "monthlySpend", label: "Monthly Spend ($)", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Months of Runway", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate burn rate?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Runway = Cash / Monthly Burn",
};
