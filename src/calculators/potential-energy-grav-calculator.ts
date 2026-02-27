import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const potentialEnergyGravCalculator: CalculatorDefinition = {
  slug: "potential-energy-grav-calculator",
  title: "Gravitational PE Calculator",
  description: "Calculate gravitational pe using scientific formulas. Free gravitational pe calculator.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["potential energy calculator"],
  variants: [{
    id: "standard",
    name: "Gravitational PE",
    description: "",
    fields: [
      { name: "mass", label: "Mass (kg)", type: "number", min: 0.01 },
      { name: "height", label: "Height (m)", type: "number", min: 0.01 },
      { name: "gravity", label: "Gravity (m/s²)", type: "number", defaultValue: 9.81 },
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
    { question: "What is gravitational pe?", answer: "Gravitational PE is a scientific measurement calculated using established formulas." },
    { question: "How to calculate gravitational pe?", answer: "Enter the required values and our calculator applies the correct formula." },
  ],
  formula: "Result = f(inputs)",
};
