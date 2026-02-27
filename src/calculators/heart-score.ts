import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const heartScoreCalculator: CalculatorDefinition = {
  slug: "heart-score",
  title: "HEART Score Calculator",
  description: "Free heart score calculator. Get accurate results instantly.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["heart score calculator"],
  variants: [{
    id: "standard",
    name: "HEART Score",
    description: "",
    fields: [
      { name: "history", label: "History (0-2)", type: "number", min: 0, max: 2 },
      { name: "ecg", label: "ECG (0-2)", type: "number", min: 0, max: 2 },
      { name: "age", label: "Age Factor (0-2)", type: "number", min: 0, max: 2 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "HEART Score", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate heart score?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
