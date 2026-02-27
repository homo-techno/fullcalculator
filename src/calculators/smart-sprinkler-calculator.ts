import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const smartSprinklerCalculator: CalculatorDefinition = {
  slug: "smart-sprinkler-calculator",
  title: "Smart Sprinkler Savings Calculator",
  description: "Free smart sprinkler savings calculator. Get instant results.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["sprinkler savings"],
  variants: [{
    id: "standard",
    name: "Smart Sprinkler Savings",
    description: "",
    fields: [
      { name: "monthlyWater", label: "Monthly Water ($)", type: "number", defaultValue: 80 },
      { name: "savings", label: "Savings %", type: "number", defaultValue: 30 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Annual Savings", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate smart sprinkler savings?", answer: "Enter your values and get instant results with our free calculator." },
    { question: "Why use this calculator?", answer: "Quick, accurate, and completely free online tool." },
  ],
  formula: "Result = f(inputs)",
};
