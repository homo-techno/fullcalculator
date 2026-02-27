import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const percScoreCalculator: CalculatorDefinition = {
  slug: "perc-score",
  title: "PERC Rule Calculator",
  description: "Free perc rule calculator. Get accurate results instantly.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["perc calculator", "pe rule out"],
  variants: [{
    id: "standard",
    name: "PERC Rule",
    description: "",
    fields: [
      { name: "age", label: "Age ≥50 (0-1)", type: "number", min: 0, max: 1 },
      { name: "hr", label: "HR ≥100 (0-1)", type: "number", min: 0, max: 1 },
      { name: "sao2", label: "SpO2 <95% (0-1)", type: "number", min: 0, max: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "PERC Score", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate perc rule?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
