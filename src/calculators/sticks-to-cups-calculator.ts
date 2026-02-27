import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sticksToCupsCalculator: CalculatorDefinition = {
  slug: "sticks-to-cups-calculator",
  title: "Butter Sticks to Cups Calculator",
  description: "Calculate butter sticks to cups with our free online calculator. Get instant results.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["butter sticks to cups"],
  variants: [{
    id: "standard",
    name: "Butter Sticks to Cups",
    description: "",
    fields: [
      { name: "sticks", label: "Sticks of Butter", type: "number", min: 0.25 },
      { name: "factor", label: "Cups/Stick", type: "number", defaultValue: 0.5 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Cups", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate butter sticks to cups?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good butter sticks to cups?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
