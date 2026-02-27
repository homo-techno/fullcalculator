import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mushroomSubstrateCalculator: CalculatorDefinition = {
  slug: "mushroom-substrate-calculator",
  title: "Mushroom Substrate Calculator",
  description: "Calculate mushroom substrate with our free online calculator. Get instant results.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["mushroom growing"],
  variants: [{
    id: "standard",
    name: "Mushroom Substrate",
    description: "",
    fields: [
      { name: "bags", label: "Number of Bags", type: "number", min: 1 },
      { name: "weightPerBag", label: "Substrate/Bag (lbs)", type: "number", defaultValue: 5 },
      { name: "spawnRate", label: "Spawn Rate %", type: "number", defaultValue: 10 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Spawn Needed (lbs)", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate mushroom substrate?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good mushroom substrate?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
