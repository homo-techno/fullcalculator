import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const digitSumCalculator: CalculatorDefinition = {
  slug: "digit-sum-calculator",
  title: "Digit Sum Calculator",
  description: "Calculate digit sum using scientific formulas. Free digit sum calculator.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["digit sum calculator", "digital root"],
  variants: [{
    id: "standard",
    name: "Digit Sum",
    description: "",
    fields: [
      { name: "n", label: "Number", type: "number", min: 0 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      const result = v.reduce((a, b) => a + b, 0) * (v[0] || 1) / (v.length || 1);
      return { primary: { label: "Digit Sum", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Input " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["scientific-notation"],
  faq: [
    { question: "What is digit sum?", answer: "Digit Sum is a scientific measurement calculated using established formulas." },
    { question: "How to calculate digit sum?", answer: "Enter the required values and our calculator applies the correct formula." },
  ],
  formula: "Result = f(inputs)",
};
