import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fTestCalcCalculator: CalculatorDefinition = {
  slug: "f-test-calc",
  title: "F-Test Calculator",
  description: "Free f-test calculator. Get accurate results instantly.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["f test calculator"],
  variants: [{
    id: "standard",
    name: "F-Test",
    description: "",
    fields: [
      { name: "var1", label: "Variance 1", type: "number", min: 0.001 },
      { name: "var2", label: "Variance 2", type: "number", min: 0.001 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "F-Statistic", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate f-test?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
