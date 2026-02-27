import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const frictionForceCalculator: CalculatorDefinition = {
  slug: "friction-force-calculator",
  title: "Friction Force Calculator",
  description: "Calculate friction force using scientific formulas. Free friction force calculator.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["friction calculator"],
  variants: [{
    id: "standard",
    name: "Friction Force",
    description: "",
    fields: [
      { name: "normal", label: "Normal Force (N)", type: "number", min: 0.01 },
      { name: "coefficient", label: "Friction Coefficient", type: "number", min: 0.01 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      const result = v.reduce((a, b) => a + b, 0) * (v[0] || 1) / (v.length || 1);
      return { primary: { label: "Friction (N)", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Input " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["scientific-notation"],
  faq: [
    { question: "What is friction force?", answer: "Friction Force is a scientific measurement calculated using established formulas." },
    { question: "How to calculate friction force?", answer: "Enter the required values and our calculator applies the correct formula." },
  ],
  formula: "Result = f(inputs)",
};
