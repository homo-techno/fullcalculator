import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const petMonthlyCostCalculator: CalculatorDefinition = {
  slug: "pet-monthly-cost",
  title: "Pet Monthly Cost Calculator",
  description: "Free pet monthly cost calculator. Get accurate results instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["pet monthly cost"],
  variants: [{
    id: "standard",
    name: "Pet Monthly Cost",
    description: "",
    fields: [
      { name: "food", label: "Food ($)", type: "number", defaultValue: 50 },
      { name: "insurance", label: "Insurance ($)", type: "number", defaultValue: 40 },
      { name: "grooming", label: "Grooming ($)", type: "number", defaultValue: 30 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Monthly Total ($)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate pet monthly cost?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
