import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const aquaponicsRatioCalculator: CalculatorDefinition = {
  slug: "aquaponics-ratio-calculator",
  title: "Aquaponics Ratio Calculator",
  description: "Calculate aquaponics ratio with our free online calculator. Get instant results.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["aquaponics calculator"],
  variants: [{
    id: "standard",
    name: "Aquaponics Ratio",
    description: "",
    fields: [
      { name: "fishTank", label: "Fish Tank (gal)", type: "number", min: 10 },
      { name: "growBed", label: "Grow Bed (sq ft)", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Fish Count", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate aquaponics ratio?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good aquaponics ratio?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
