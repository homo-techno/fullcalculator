import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const huntingBallisticsCalculator: CalculatorDefinition = {
  slug: "hunting-ballistics-calculator",
  title: "Hunting Ballistics Calculator",
  description: "Calculate hunting ballistics with our free online calculator. Get instant results.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["ballistics calculator"],
  variants: [{
    id: "standard",
    name: "Hunting Ballistics",
    description: "",
    fields: [
      { name: "velocity", label: "Muzzle Velocity (fps)", type: "number", min: 100 },
      { name: "weight", label: "Bullet Weight (gr)", type: "number", min: 10 },
      { name: "distance", label: "Distance (yds)", type: "number", min: 10 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Energy (ft-lbs)", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate hunting ballistics?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good hunting ballistics?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
