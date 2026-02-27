import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const varianceCalcCalculator: CalculatorDefinition = {
  slug: "variance-calc",
  title: "Variance Calculator",
  description: "Free variance calculator. Get accurate results instantly.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["variance calculator"],
  variants: [{
    id: "standard",
    name: "Variance",
    description: "",
    fields: [
      { name: "sumSquares", label: "Sum of Squares", type: "number", min: 0 },
      { name: "n", label: "Count", type: "number", min: 2 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Variance", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate variance?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
