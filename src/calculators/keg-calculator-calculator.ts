import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const kegCalculatorCalculator: CalculatorDefinition = {
  slug: "keg-calculator-calculator",
  title: "Keg Size Calculator",
  description: "Calculate keg size with our free online calculator. Get instant results.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["keg calculator", "beer keg"],
  variants: [{
    id: "standard",
    name: "Keg Size",
    description: "",
    fields: [
      { name: "guests", label: "Number of Guests", type: "number", min: 1 },
      { name: "hours", label: "Event Hours", type: "number", min: 1 },
      { name: "drinksPerHour", label: "Drinks/Hour", type: "number", defaultValue: 2 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Kegs Needed", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate keg size?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good keg size?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
