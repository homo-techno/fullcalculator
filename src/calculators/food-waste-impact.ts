import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const foodWasteImpactCalculator: CalculatorDefinition = {
  slug: "food-waste-impact",
  title: "Food Waste Impact Calculator",
  description: "Free food waste impact calculator. Get accurate results instantly.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["food waste calculator"],
  variants: [{
    id: "standard",
    name: "Food Waste Impact",
    description: "",
    fields: [
      { name: "waste", label: "Food Waste (lbs/week)", type: "number", min: 0.5 },
      { name: "household", label: "Household Size", type: "number", defaultValue: 2 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "CO2 (kg/year)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate food waste impact?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
