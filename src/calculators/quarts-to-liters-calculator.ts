import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const quartsToLitersCalculator: CalculatorDefinition = {
  slug: "quarts-to-liters-calculator",
  title: "Quarts to Liters Calculator",
  description: "Calculate quarts to liters with our free online calculator. Get instant results.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["quarts to liters"],
  variants: [{
    id: "standard",
    name: "Quarts to Liters",
    description: "",
    fields: [
      { name: "quarts", label: "Quarts", type: "number", min: 0.1 },
      { name: "factor", label: "L/Qt", type: "number", defaultValue: 0.946 },
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
    { question: "How to calculate quarts to liters?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good quarts to liters?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
