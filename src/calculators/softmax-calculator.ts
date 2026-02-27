import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const softmaxCalculator: CalculatorDefinition = {
  slug: "softmax-calculator",
  title: "Softmax Function Calculator",
  description: "Free softmax function calculator. Get instant results.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["softmax calculator"],
  variants: [{
    id: "standard",
    name: "Softmax Function",
    description: "",
    fields: [
      { name: "x1", label: "Value 1", type: "number", defaultValue: 1 },
      { name: "x2", label: "Value 2", type: "number", defaultValue: 2 },
      { name: "x3", label: "Value 3", type: "number", defaultValue: 3 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Probabilities", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate softmax function?", answer: "Enter your values and get instant results with our free calculator." },
    { question: "Why use this calculator?", answer: "Quick, accurate, and completely free online tool." },
  ],
  formula: "Result = f(inputs)",
};
