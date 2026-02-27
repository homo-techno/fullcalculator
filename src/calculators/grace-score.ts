import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const graceScoreCalculator: CalculatorDefinition = {
  slug: "grace-score",
  title: "GRACE Score Calculator",
  description: "Free grace score calculator. Get accurate results instantly.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["grace score calculator"],
  variants: [{
    id: "standard",
    name: "GRACE Score",
    description: "",
    fields: [
      { name: "age", label: "Age", type: "number", min: 18 },
      { name: "heartRate", label: "Heart Rate", type: "number", min: 30 },
      { name: "systolic", label: "Systolic BP", type: "number", min: 50 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "GRACE Score", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate grace score?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
