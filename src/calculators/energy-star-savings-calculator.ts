import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const energyStarSavingsCalculator: CalculatorDefinition = {
  slug: "energy-star-savings-calculator",
  title: "Energy Star Savings Calculator",
  description: "Free energy star savings calculator. Calculate energy star savings quickly and accurately.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["energy star calculator"],
  variants: [{
    id: "standard",
    name: "Energy Star Savings",
    description: "",
    fields: [
      { name: "oldUsage", label: "Old Usage (kWh/yr)", type: "number", min: 1 },
      { name: "newUsage", label: "New Usage (kWh/yr)", type: "number", min: 1 },
      { name: "rate", label: "Rate ($/kWh)", type: "number", defaultValue: 0.13 },
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
    { question: "How to calculate energy star savings?", answer: "Enter values and get instant results." },
    { question: "Why use this energy star savings calculator?", answer: "Quick, accurate, and free online calculation tool." },
  ],
  formula: "Result = f(inputs)",
};
