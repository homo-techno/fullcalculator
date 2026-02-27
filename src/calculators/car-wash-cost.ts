import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const carWashCostCalculator: CalculatorDefinition = {
  slug: "car-wash-cost",
  title: "Car Wash Cost Calculator",
  description: "Free car wash cost calculator. Get accurate results instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["car wash calculator"],
  variants: [{
    id: "standard",
    name: "Car Wash Cost",
    description: "",
    fields: [
      { name: "frequency", label: "Washes/Month", type: "number", min: 1 },
      { name: "cost", label: "Cost/Wash ($)", type: "number", defaultValue: 15 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Annual Cost ($)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate car wash cost?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
