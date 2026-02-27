import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tTestCalcCalculator: CalculatorDefinition = {
  slug: "t-test-calc",
  title: "T-Test Calculator",
  description: "Free t-test calculator. Get accurate results instantly.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["t test calculator"],
  variants: [{
    id: "standard",
    name: "T-Test",
    description: "",
    fields: [
      { name: "mean1", label: "Mean 1", type: "number" },
      { name: "mean2", label: "Mean 2", type: "number" },
      { name: "se", label: "Standard Error", type: "number", min: 0.001 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "t-Statistic", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate t-test?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
