import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const warrantyValueCalculator: CalculatorDefinition = {
  slug: "warranty-value-calculator",
  title: "Warranty Value Calculator",
  description: "Free warranty value calculator. Calculate warranty value quickly and accurately.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["warranty calculator"],
  variants: [{
    id: "standard",
    name: "Warranty Value",
    description: "",
    fields: [
      { name: "itemCost", label: "Item Cost ($)", type: "number", min: 1 },
      { name: "warrantyCost", label: "Warranty Cost ($)", type: "number", min: 1 },
      { name: "repairProb", label: "Repair Probability %", type: "number", defaultValue: 15 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Expected Value", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate warranty value?", answer: "Enter values and get instant results." },
    { question: "Why use this warranty value calculator?", answer: "Quick, accurate, and free online calculation tool." },
  ],
  formula: "Result = f(inputs)",
};
