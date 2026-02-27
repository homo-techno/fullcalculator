import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const lowFlowToiletCalculator: CalculatorDefinition = {
  slug: "low-flow-toilet-calculator",
  title: "Low Flow Toilet Savings Calculator",
  description: "Free low flow toilet savings calculator. Calculate low flow toilet savings quickly and accurately.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["low flow toilet calculator"],
  variants: [{
    id: "standard",
    name: "Low Flow Toilet Savings",
    description: "",
    fields: [
      { name: "people", label: "People", type: "number", min: 1 },
      { name: "flushesPerDay", label: "Flushes/Day", type: "number", defaultValue: 5 },
      { name: "oldGpf", label: "Old GPF", type: "number", defaultValue: 3.5 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Gallons Saved/Year", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate low flow toilet savings?", answer: "Enter values and get instant results." },
    { question: "Why use this low flow toilet savings calculator?", answer: "Quick, accurate, and free online calculation tool." },
  ],
  formula: "Result = f(inputs)",
};
