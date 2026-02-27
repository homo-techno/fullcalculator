import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pizzaSizeValueCalculator: CalculatorDefinition = {
  slug: "pizza-size-value-calculator",
  title: "Pizza Size Value Calculator",
  description: "Calculate pizza size value with our free online calculator. Get instant results.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["pizza calculator"],
  variants: [{
    id: "standard",
    name: "Pizza Size Value",
    description: "",
    fields: [
      { name: "diameter", label: "Diameter (in)", type: "number", min: 6 },
      { name: "price", label: "Price ($)", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Price/Sq In", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate pizza size value?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good pizza size value?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
