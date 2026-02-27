import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hasBledScoreCalculator: CalculatorDefinition = {
  slug: "has-bled-score",
  title: "HAS-BLED Score Calculator",
  description: "Free has-bled score calculator. Get accurate results instantly.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["has-bled calculator"],
  variants: [{
    id: "standard",
    name: "HAS-BLED Score",
    description: "",
    fields: [
      { name: "hypertension", label: "Hypertension (0-1)", type: "number", min: 0, max: 1 },
      { name: "renal", label: "Renal Disease (0-1)", type: "number", min: 0, max: 1 },
      { name: "liver", label: "Liver Disease (0-1)", type: "number", min: 0, max: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "HAS-BLED Score", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate has-bled score?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
