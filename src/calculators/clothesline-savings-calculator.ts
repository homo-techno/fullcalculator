import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const clotheslineSavingsCalculator: CalculatorDefinition = {
  slug: "clothesline-savings-calculator",
  title: "Clothesline Savings Calculator",
  description: "Free clothesline savings calculator. Calculate clothesline savings quickly and accurately.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["clothesline vs dryer"],
  variants: [{
    id: "standard",
    name: "Clothesline Savings",
    description: "",
    fields: [
      { name: "loads", label: "Loads/Week", type: "number", min: 1 },
      { name: "dryerCost", label: "Dryer Cost/Load ($)", type: "number", defaultValue: 0.5 },
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
    { question: "How to calculate clothesline savings?", answer: "Enter values and get instant results." },
    { question: "Why use this clothesline savings calculator?", answer: "Quick, accurate, and free online calculation tool." },
  ],
  formula: "Result = f(inputs)",
};
