import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fishingLineStrengthCalculator: CalculatorDefinition = {
  slug: "fishing-line-strength-calculator",
  title: "Fishing Line Calculator",
  description: "Calculate fishing line with our free online calculator. Get instant results.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["fishing line calculator"],
  variants: [{
    id: "standard",
    name: "Fishing Line",
    description: "",
    fields: [
      { name: "fishWeight", label: "Target Fish (lbs)", type: "number", min: 1 },
      { name: "multiplier", label: "Safety Multiplier", type: "number", defaultValue: 2 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Line Strength (lb)", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate fishing line?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good fishing line?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
