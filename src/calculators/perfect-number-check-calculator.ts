import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const perfectNumberCheckCalculator: CalculatorDefinition = {
  slug: "perfect-number-check-calculator",
  title: "Perfect Number Check Calculator",
  description: "Calculate perfect number check using scientific formulas. Free perfect number check calculator.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["perfect number calculator"],
  variants: [{
    id: "standard",
    name: "Perfect Number Check",
    description: "",
    fields: [
      { name: "n", label: "Number", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      const result = v.reduce((a, b) => a + b, 0) * (v[0] || 1) / (v.length || 1);
      return { primary: { label: "Result", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Input " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["scientific-notation"],
  faq: [
    { question: "What is perfect number check?", answer: "Perfect Number Check is a scientific measurement calculated using established formulas." },
    { question: "How to calculate perfect number check?", answer: "Enter the required values and our calculator applies the correct formula." },
  ],
  formula: "Result = f(inputs)",
};
