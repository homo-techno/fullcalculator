import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gallonsToLitersCalculator: CalculatorDefinition = {
  slug: "gallons-to-liters-calculator",
  title: "Gallons to Liters Calculator",
  description: "Calculate gallons to liters with our free online calculator. Get instant results.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["gallons to liters"],
  variants: [{
    id: "standard",
    name: "Gallons to Liters",
    description: "",
    fields: [
      { name: "gallons", label: "Gallons", type: "number", min: 0.1 },
      { name: "factor", label: "L/Gal", type: "number", defaultValue: 3.785 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Liters", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate gallons to liters?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good gallons to liters?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
