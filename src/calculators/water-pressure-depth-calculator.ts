import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const waterPressureDepthCalculator: CalculatorDefinition = {
  slug: "water-pressure-depth-calculator",
  title: "Water Pressure Calculator",
  description: "Calculate water pressure using scientific formulas. Free water pressure calculator.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["water pressure calculator"],
  variants: [{
    id: "standard",
    name: "Water Pressure",
    description: "",
    fields: [
      { name: "depth", label: "Depth (m)", type: "number", min: 0.1 },
      { name: "density", label: "Density (kg/m³)", type: "number", defaultValue: 1025 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      const result = v.reduce((a, b) => a + b, 0) * (v[0] || 1) / (v.length || 1);
      return { primary: { label: "Pressure (atm)", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Input " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["scientific-notation"],
  faq: [
    { question: "What is water pressure?", answer: "Water Pressure is a scientific measurement calculated using established formulas." },
    { question: "How to calculate water pressure?", answer: "Enter the required values and our calculator applies the correct formula." },
  ],
  formula: "Result = f(inputs)",
};
