import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const compostSavingsCalculator: CalculatorDefinition = {
  slug: "compost-savings-calculator",
  title: "Compost Savings Calculator",
  description: "Free compost savings calculator. Calculate compost savings quickly and accurately.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["composting savings"],
  variants: [{
    id: "standard",
    name: "Compost Savings",
    description: "",
    fields: [
      { name: "waste", label: "Weekly Waste (lbs)", type: "number", min: 0.5 },
      { name: "bagCost", label: "Bag Cost Saved ($)", type: "number", defaultValue: 5 },
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
    { question: "How to calculate compost savings?", answer: "Enter values and get instant results." },
    { question: "Why use this compost savings calculator?", answer: "Quick, accurate, and free online calculation tool." },
  ],
  formula: "Result = f(inputs)",
};
