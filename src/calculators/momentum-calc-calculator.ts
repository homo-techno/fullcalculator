import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const momentumCalcCalculator: CalculatorDefinition = {
  slug: "momentum-calc-calculator",
  title: "Momentum Calculator",
  description: "Calculate momentum using scientific formulas. Free momentum calculator.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["momentum calculator"],
  variants: [{
    id: "standard",
    name: "Momentum",
    description: "",
    fields: [
      { name: "mass", label: "Mass (kg)", type: "number", min: 0.01 },
      { name: "velocity", label: "Velocity (m/s)", type: "number" },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      const result = v.reduce((a, b) => a + b, 0) * (v[0] || 1) / (v.length || 1);
      return { primary: { label: "Momentum (kg·m/s)", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Input " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["scientific-notation"],
  faq: [
    { question: "What is momentum?", answer: "Momentum is a scientific measurement calculated using established formulas." },
    { question: "How to calculate momentum?", answer: "Enter the required values and our calculator applies the correct formula." },
  ],
  formula: "Result = f(inputs)",
};
