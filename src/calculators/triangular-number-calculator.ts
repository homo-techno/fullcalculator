import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const triangularNumberCalculator: CalculatorDefinition = {
  slug: "triangular-number-calculator",
  title: "Triangular Number Calculator",
  description: "Calculate triangular number using scientific formulas. Free triangular number calculator.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["triangular number calculator"],
  variants: [{
    id: "standard",
    name: "Triangular Number",
    description: "",
    fields: [
      { name: "n", label: "Position", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      const result = v.reduce((a, b) => a + b, 0) * (v[0] || 1) / (v.length || 1);
      return { primary: { label: "T(n)", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Input " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["scientific-notation"],
  faq: [
    { question: "What is triangular number?", answer: "Triangular Number is a scientific measurement calculated using established formulas." },
    { question: "How to calculate triangular number?", answer: "Enter the required values and our calculator applies the correct formula." },
  ],
  formula: "Result = f(inputs)",
};
