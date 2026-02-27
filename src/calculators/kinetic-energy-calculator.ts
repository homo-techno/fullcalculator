import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const kineticEnergyCalculator: CalculatorDefinition = {
  slug: "kinetic-energy-calculator",
  title: "Kinetic Energy Calculator",
  description: "Calculate kinetic energy using scientific formulas. Free kinetic energy calculator.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["kinetic energy calculator"],
  variants: [{
    id: "standard",
    name: "Kinetic Energy",
    description: "",
    fields: [
      { name: "mass", label: "Mass (kg)", type: "number", min: 0.01 },
      { name: "velocity", label: "Velocity (m/s)", type: "number", min: 0.01 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      const result = v.reduce((a, b) => a + b, 0) * (v[0] || 1) / (v.length || 1);
      return { primary: { label: "Energy (J)", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Input " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["scientific-notation"],
  faq: [
    { question: "What is kinetic energy?", answer: "Kinetic Energy is a scientific measurement calculated using established formulas." },
    { question: "How to calculate kinetic energy?", answer: "Enter the required values and our calculator applies the correct formula." },
  ],
  formula: "Result = f(inputs)",
};
