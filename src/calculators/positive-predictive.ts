import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const positivePredictiveCalculator: CalculatorDefinition = {
  slug: "positive-predictive",
  title: "Positive Predictive Value Calculator",
  description: "Free positive predictive value calculator. Get accurate results instantly.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["ppv calculator"],
  variants: [{
    id: "standard",
    name: "Positive Predictive Value",
    description: "",
    fields: [
      { name: "sensitivity", label: "Sensitivity", type: "number", min: 0, max: 1 },
      { name: "specificity", label: "Specificity", type: "number", min: 0, max: 1 },
      { name: "prevalence", label: "Prevalence", type: "number", min: 0, max: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "PPV", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate positive predictive value?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
