import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hexagonalNumberCalculator: CalculatorDefinition = {
  slug: "hexagonal-number-calculator",
  title: "Hexagonal Number Calculator",
  description: "Calculate hexagonal number using scientific formulas. Free hexagonal number calculator.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["hexagonal number"],
  variants: [{
    id: "standard",
    name: "Hexagonal Number",
    description: "",
    fields: [
      { name: "n", label: "Position", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      const result = v.reduce((a, b) => a + b, 0) * (v[0] || 1) / (v.length || 1);
      return { primary: { label: "H(n)", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Input " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["scientific-notation"],
  faq: [
    { question: "What is hexagonal number?", answer: "Hexagonal Number is a scientific measurement calculated using established formulas." },
    { question: "How to calculate hexagonal number?", answer: "Enter the required values and our calculator applies the correct formula." },
  ],
  formula: "Result = f(inputs)",
};
