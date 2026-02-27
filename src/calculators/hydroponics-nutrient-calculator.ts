import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hydroponicsNutrientCalculator: CalculatorDefinition = {
  slug: "hydroponics-nutrient-calculator",
  title: "Hydroponics Nutrient Calculator",
  description: "Calculate hydroponics nutrient with our free online calculator. Get instant results.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["hydroponics calculator"],
  variants: [{
    id: "standard",
    name: "Hydroponics Nutrient",
    description: "",
    fields: [
      { name: "reservoir", label: "Reservoir (gal)", type: "number", min: 1 },
      { name: "ppm", label: "Target PPM", type: "number", defaultValue: 1000 },
      { name: "currentPpm", label: "Current PPM", type: "number", defaultValue: 200 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "mL Solution", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate hydroponics nutrient?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good hydroponics nutrient?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
