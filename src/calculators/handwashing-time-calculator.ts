import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const handwashingTimeCalculator: CalculatorDefinition = {
  slug: "handwashing-time-calculator",
  title: "Handwashing Time Calculator",
  description: "Calculate handwashing time with our free online calculator. Get instant results.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["handwashing calculator"],
  variants: [{
    id: "standard",
    name: "Handwashing Time",
    description: "",
    fields: [
      { name: "risk", label: "Risk Level (1-3)", type: "number", defaultValue: 1 },
      { name: "soapType", label: "Soap Type (1-3)", type: "number", defaultValue: 2 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Seconds", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate handwashing time?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good handwashing time?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
