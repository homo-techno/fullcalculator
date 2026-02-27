import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const angularVelocityCalculator: CalculatorDefinition = {
  slug: "angular-velocity-calculator",
  title: "Angular Velocity Calculator",
  description: "Calculate angular velocity using scientific formulas. Free angular velocity calculator.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["angular velocity calculator"],
  variants: [{
    id: "standard",
    name: "Angular Velocity",
    description: "",
    fields: [
      { name: "revolutions", label: "Revolutions", type: "number", min: 0.1 },
      { name: "time", label: "Time (s)", type: "number", min: 0.01 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      const result = v.reduce((a, b) => a + b, 0) * (v[0] || 1) / (v.length || 1);
      return { primary: { label: "Rad/s", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Input " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["scientific-notation"],
  faq: [
    { question: "What is angular velocity?", answer: "Angular Velocity is a scientific measurement calculated using established formulas." },
    { question: "How to calculate angular velocity?", answer: "Enter the required values and our calculator applies the correct formula." },
  ],
  formula: "Result = f(inputs)",
};
