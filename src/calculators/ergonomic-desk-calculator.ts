import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ergonomicDeskCalculator: CalculatorDefinition = {
  slug: "ergonomic-desk-calculator",
  title: "Ergonomic Desk Setup Calculator",
  description: "Calculate ergonomic desk setup with our free online calculator. Get instant results.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["ergonomic calculator"],
  variants: [{
    id: "standard",
    name: "Ergonomic Desk Setup",
    description: "",
    fields: [
      { name: "height", label: "Height (in)", type: "number", min: 48 },
      { name: "inseam", label: "Sitting Height (in)", type: "number", min: 15 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Desk Height (in)", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate ergonomic desk setup?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good ergonomic desk setup?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
