import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gymValueCalculator: CalculatorDefinition = {
  slug: "gym-value",
  title: "Gym Membership Value Calculator",
  description: "Free gym membership value calculator. Get accurate results instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["gym value calculator"],
  variants: [{
    id: "standard",
    name: "Gym Membership Value",
    description: "",
    fields: [
      { name: "monthly", label: "Monthly Cost ($)", type: "number", min: 1 },
      { name: "visits", label: "Visits/Month", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Cost/Visit ($)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate gym membership value?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
