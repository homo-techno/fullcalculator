import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sigmoidFunctionCalculator: CalculatorDefinition = {
  slug: "sigmoid-function-calculator",
  title: "Sigmoid Function Calculator",
  description: "Free sigmoid function calculator. Get instant results.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["sigmoid calculator"],
  variants: [{
    id: "standard",
    name: "Sigmoid Function",
    description: "",
    fields: [
      { name: "x", label: "Input Value", type: "number" },
      { name: "k", label: "Steepness", type: "number", defaultValue: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "σ(x)", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate sigmoid function?", answer: "Enter your values and get instant results with our free calculator." },
    { question: "Why use this calculator?", answer: "Quick, accurate, and completely free online tool." },
  ],
  formula: "Result = f(inputs)",
};
