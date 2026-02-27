import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const reusableBagCalculator: CalculatorDefinition = {
  slug: "reusable-bag-calculator",
  title: "Reusable Bag Savings Calculator",
  description: "Free reusable bag savings calculator. Calculate reusable bag savings quickly and accurately.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["reusable bag calculator"],
  variants: [{
    id: "standard",
    name: "Reusable Bag Savings",
    description: "",
    fields: [
      { name: "trips", label: "Shopping Trips/Year", type: "number", defaultValue: 100 },
      { name: "bagsPerTrip", label: "Bags/Trip", type: "number", defaultValue: 4 },
      { name: "bagCost", label: "Bag Fee ($)", type: "number", defaultValue: 0.1 },
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
    { question: "How to calculate reusable bag savings?", answer: "Enter values and get instant results." },
    { question: "Why use this reusable bag savings calculator?", answer: "Quick, accurate, and free online calculation tool." },
  ],
  formula: "Result = f(inputs)",
};
