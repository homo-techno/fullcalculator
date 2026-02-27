import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rcCircuitCalculator: CalculatorDefinition = {
  slug: "rc-circuit-calculator",
  title: "RC Time Constant Calculator",
  description: "Calculate rc time constant with our free online calculator. Get instant results.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["rc circuit calculator"],
  variants: [{
    id: "standard",
    name: "RC Time Constant",
    description: "",
    fields: [
      { name: "resistance", label: "Resistance (ohms)", type: "number", min: 1 },
      { name: "capacitance", label: "Capacitance (uF)", type: "number", min: 0.001 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Time Constant", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate rc time constant?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good rc time constant?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
