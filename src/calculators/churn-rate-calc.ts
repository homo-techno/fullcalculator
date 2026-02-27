import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const churnRateCalcCalculator: CalculatorDefinition = {
  slug: "churn-rate-calc",
  title: "Churn Rate Calculator",
  description: "Free churn rate calculator. Get accurate results instantly.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["churn rate calculator detailed"],
  variants: [{
    id: "standard",
    name: "Churn Rate",
    description: "",
    fields: [
      { name: "lost", label: "Lost Customers", type: "number", min: 0 },
      { name: "startOfPeriod", label: "Start of Period Customers", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Churn Rate %", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate churn rate?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
