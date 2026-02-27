import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bakingAltitudeCalculator: CalculatorDefinition = {
  slug: "baking-altitude-calculator",
  title: "Baking Altitude Calculator",
  description: "Calculate baking altitude with our free online calculator. Get instant results.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["high altitude baking"],
  variants: [{
    id: "standard",
    name: "Baking Altitude",
    description: "",
    fields: [
      { name: "altitude", label: "Altitude (ft)", type: "number", min: 1000 },
      { name: "sugar", label: "Sugar (cups)", type: "number", defaultValue: 1 },
      { name: "flour", label: "Flour (cups)", type: "number", defaultValue: 2 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Adjusted Sugar", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate baking altitude?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good baking altitude?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
