import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const agilityScoreCalculator: CalculatorDefinition = {
  slug: "agility-score",
  title: "Agility Score Calculator",
  description: "Free agility score calculator. Get accurate results instantly.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["agility test calculator"],
  variants: [{
    id: "standard",
    name: "Agility Score",
    description: "",
    fields: [
      { name: "time", label: "5-10-5 Time (s)", type: "number", min: 3 },
      { name: "weight", label: "Body Weight (lbs)", type: "number", min: 100 },
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
    { question: "How to calculate agility score?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
