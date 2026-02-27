import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const recyclingImpactCalculator: CalculatorDefinition = {
  slug: "recycling-impact",
  title: "Recycling Impact Calculator",
  description: "Free recycling impact calculator. Get accurate results instantly.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["recycling calculator"],
  variants: [{
    id: "standard",
    name: "Recycling Impact",
    description: "",
    fields: [
      { name: "paper", label: "Paper (lbs/week)", type: "number", defaultValue: 5 },
      { name: "plastic", label: "Plastic (lbs/week)", type: "number", defaultValue: 2 },
      { name: "glass", label: "Glass (lbs/week)", type: "number", defaultValue: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "CO2 Saved (kg/year)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate recycling impact?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
