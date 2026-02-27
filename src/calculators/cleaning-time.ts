import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cleaningTimeCalculator: CalculatorDefinition = {
  slug: "cleaning-time",
  title: "Cleaning Time Calculator",
  description: "Free cleaning time calculator. Get accurate results instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["cleaning time calculator"],
  variants: [{
    id: "standard",
    name: "Cleaning Time",
    description: "",
    fields: [
      { name: "sqft", label: "Square Feet", type: "number", min: 200 },
      { name: "rooms", label: "Rooms", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Minutes", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate cleaning time?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
