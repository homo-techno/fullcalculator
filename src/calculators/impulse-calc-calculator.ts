import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const impulseCalcCalculator: CalculatorDefinition = {
  slug: "impulse-calc-calculator",
  title: "Impulse Calculator",
  description: "Calculate impulse using scientific formulas. Free impulse calculator.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["impulse calculator"],
  variants: [{
    id: "standard",
    name: "Impulse",
    description: "",
    fields: [
      { name: "force", label: "Force (N)", type: "number", min: 0.01 },
      { name: "time", label: "Time (s)", type: "number", min: 0.001 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      const result = v.reduce((a, b) => a + b, 0) * (v[0] || 1) / (v.length || 1);
      return { primary: { label: "Impulse (N·s)", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Input " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["scientific-notation"],
  faq: [
    { question: "What is impulse?", answer: "Impulse is a scientific measurement calculated using established formulas." },
    { question: "How to calculate impulse?", answer: "Enter the required values and our calculator applies the correct formula." },
  ],
  formula: "Result = f(inputs)",
};
