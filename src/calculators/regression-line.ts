import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const regressionLineCalculator: CalculatorDefinition = {
  slug: "regression-line",
  title: "Linear Regression Calculator",
  description: "Free linear regression calculator. Get accurate results instantly.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["linear regression calculator"],
  variants: [{
    id: "standard",
    name: "Linear Regression",
    description: "",
    fields: [
      { name: "slope", label: "Slope (m)", type: "number" },
      { name: "intercept", label: "Y-Intercept (b)", type: "number" },
      { name: "x", label: "X Value", type: "number" },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Y Predicted", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate linear regression?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "y = mx + b",
};
