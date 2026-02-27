import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const curb65ScoreCalculator: CalculatorDefinition = {
  slug: "curb-65-score",
  title: "CURB-65 Score Calculator",
  description: "Free curb-65 score calculator. Get accurate results instantly.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["curb 65 calculator"],
  variants: [{
    id: "standard",
    name: "CURB-65 Score",
    description: "",
    fields: [
      { name: "confusion", label: "Confusion (0-1)", type: "number", min: 0, max: 1 },
      { name: "urea", label: "Urea >7mmol/L (0-1)", type: "number", min: 0, max: 1 },
      { name: "rr", label: "Resp Rate ≥30 (0-1)", type: "number", min: 0, max: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Score", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate curb-65 score?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Score = Confusion + Urea + RR + BP + Age",
};
