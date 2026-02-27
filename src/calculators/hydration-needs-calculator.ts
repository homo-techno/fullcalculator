import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hydrationNeedsCalculator: CalculatorDefinition = {
  slug: "hydration-needs-calculator",
  title: "Hydration Needs Calculator",
  description: "Calculate hydration needs with our free online calculator. Get instant results.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["hydration calculator"],
  variants: [{
    id: "standard",
    name: "Hydration Needs",
    description: "",
    fields: [
      { name: "weight", label: "Weight (lbs)", type: "number", min: 50 },
      { name: "exercise", label: "Exercise Min/Day", type: "number", defaultValue: 30 },
      { name: "climate", label: "Climate (1-3)", type: "number", defaultValue: 2 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Oz Water/Day", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate hydration needs?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good hydration needs?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
