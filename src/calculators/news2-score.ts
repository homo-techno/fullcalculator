import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const news2ScoreCalculator: CalculatorDefinition = {
  slug: "news2-score",
  title: "NEWS2 Score Calculator",
  description: "Free news2 score calculator. Get accurate results instantly.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["news2 calculator", "early warning"],
  variants: [{
    id: "standard",
    name: "NEWS2 Score",
    description: "",
    fields: [
      { name: "respRate", label: "Resp Rate", type: "number", min: 1 },
      { name: "spo2", label: "SpO2 %", type: "number", min: 50 },
      { name: "systolic", label: "Systolic BP", type: "number", min: 40 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "NEWS2 Score", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate news2 score?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
