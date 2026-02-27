import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pendulumPeriodCalculator: CalculatorDefinition = {
  slug: "pendulum-period-calculator",
  title: "Pendulum Period Calculator",
  description: "Calculate pendulum period using scientific formulas. Free pendulum period calculator.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["pendulum calculator"],
  variants: [{
    id: "standard",
    name: "Pendulum Period",
    description: "",
    fields: [
      { name: "length", label: "Length (m)", type: "number", min: 0.01 },
      { name: "gravity", label: "Gravity (m/s²)", type: "number", defaultValue: 9.81 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      const result = v.reduce((a, b) => a + b, 0) * (v[0] || 1) / (v.length || 1);
      return { primary: { label: "Period (s)", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Input " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["scientific-notation"],
  faq: [
    { question: "What is pendulum period?", answer: "Pendulum Period is a scientific measurement calculated using established formulas." },
    { question: "How to calculate pendulum period?", answer: "Enter the required values and our calculator applies the correct formula." },
  ],
  formula: "Result = f(inputs)",
};
