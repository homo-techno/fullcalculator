import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pintsToCupsCalculator: CalculatorDefinition = {
  slug: "pints-to-cups-calculator",
  title: "Pints to Cups Calculator",
  description: "Calculate pints to cups with our free online calculator. Get instant results.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["pints to cups"],
  variants: [{
    id: "standard",
    name: "Pints to Cups",
    description: "",
    fields: [
      { name: "pints", label: "Pints", type: "number", min: 0.1 },
      { name: "factor", label: "Cups/Pint", type: "number", defaultValue: 2 },
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
    { question: "How to calculate pints to cups?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good pints to cups?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
