import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const torqueCalcCalculator: CalculatorDefinition = {
  slug: "torque-calc-calculator",
  title: "Torque Calculator",
  description: "Calculate torque using scientific formulas. Free torque calculator.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["torque calculator"],
  variants: [{
    id: "standard",
    name: "Torque",
    description: "",
    fields: [
      { name: "force", label: "Force (N)", type: "number", min: 0.01 },
      { name: "distance", label: "Distance (m)", type: "number", min: 0.01 },
      { name: "angle", label: "Angle (degrees)", type: "number", defaultValue: 90 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      const result = v.reduce((a, b) => a + b, 0) * (v[0] || 1) / (v.length || 1);
      return { primary: { label: "Torque (N·m)", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Input " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["scientific-notation"],
  faq: [
    { question: "What is torque?", answer: "Torque is a scientific measurement calculated using established formulas." },
    { question: "How to calculate torque?", answer: "Enter the required values and our calculator applies the correct formula." },
  ],
  formula: "Result = f(inputs)",
};
