import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const nihssScoreCalculator: CalculatorDefinition = {
  slug: "nihss-score",
  title: "NIHSS Score Calculator",
  description: "Free nihss score calculator. Get accurate results instantly.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["nihss calculator", "stroke scale"],
  variants: [{
    id: "standard",
    name: "NIHSS Score",
    description: "",
    fields: [
      { name: "consciousness", label: "Consciousness (0-3)", type: "number", min: 0, max: 3 },
      { name: "gaze", label: "Best Gaze (0-2)", type: "number", min: 0, max: 2 },
      { name: "visual", label: "Visual (0-3)", type: "number", min: 0, max: 3 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "NIHSS Score", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate nihss score?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
