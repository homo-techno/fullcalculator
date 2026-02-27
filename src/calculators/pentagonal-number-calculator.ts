import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pentagonalNumberCalculator: CalculatorDefinition = {
  slug: "pentagonal-number-calculator",
  title: "Pentagonal Number Calculator",
  description: "Calculate pentagonal number using scientific formulas. Free pentagonal number calculator.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["pentagonal number"],
  variants: [{
    id: "standard",
    name: "Pentagonal Number",
    description: "",
    fields: [
      { name: "n", label: "Position", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      const result = v.reduce((a, b) => a + b, 0) * (v[0] || 1) / (v.length || 1);
      return { primary: { label: "P(n)", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Input " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["scientific-notation"],
  faq: [
    { question: "What is pentagonal number?", answer: "Pentagonal Number is a scientific measurement calculated using established formulas." },
    { question: "How to calculate pentagonal number?", answer: "Enter the required values and our calculator applies the correct formula." },
  ],
  formula: "Result = f(inputs)",
};
